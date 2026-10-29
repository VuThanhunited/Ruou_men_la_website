const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'local-db.json');

let memoryStore = null;

function loadStore() {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      memoryStore = JSON.parse(raw);
      return memoryStore;
    }
  } catch (err) {
    console.warn('Không đọc được local-db.json, khởi tạo mới:', err.message);
  }
  memoryStore = {};
  return memoryStore;
}

function saveStore() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore || {}, null, 2), 'utf-8');
  } catch (err) {
    console.error('Lỗi lưu local-db.json:', err.message);
  }
}

function getCollection(name) {
  const store = loadStore();
  if (!Array.isArray(store[name])) {
    store[name] = [];
  }
  return store[name];
}

function extractSchemaDefaults(schema) {
  const defaults = {};
  if (!schema?.paths) return defaults;

  Object.entries(schema.paths).forEach(([key, schemaType]) => {
    if (key === '_id' || key === '__v') return;
    const defVal =
      typeof schemaType.defaultValue === 'function'
        ? schemaType.defaultValue()
        : schemaType.defaultValue;

    if (defVal !== undefined) {
      if (key.includes('.')) {
        const parts = key.split('.');
        let cur = defaults;
        for (let i = 0; i < parts.length - 1; i++) {
          cur[parts[i]] = cur[parts[i]] || {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = defVal;
      } else {
        defaults[key] = defVal;
      }
    }
  });

  return defaults;
}

function coerceBySchema(schema, data) {
  if (!schema?.paths || !data || typeof data !== 'object') return data;
  const result = { ...data };

  Object.entries(result).forEach(([k, v]) => {
    const p = schema.paths[k];
    if (!p || v === undefined || v === null) return;
    if (p.instance === 'Boolean') {
      if (v === 'true' || v === '1') result[k] = true;
      else if (v === 'false' || v === '0') result[k] = false;
    } else if (p.instance === 'Number') {
      if (typeof v === 'string' && v.trim() !== '') {
        const num = Number(v);
        if (!Number.isNaN(num)) result[k] = num;
      }
    }
  });

  return result;
}

function matchesFilter(item, filter = {}) {
  if (!filter || Object.keys(filter).length === 0) return true;
  return Object.entries(filter).every(([k, expected]) => {
    const actual = item[k];
    if (typeof expected === 'string' && typeof actual === 'string' && k === 'email') {
      return actual.toLowerCase().trim() === expected.toLowerCase().trim();
    }
    return actual === expected;
  });
}

function sortItems(items, sortSpec) {
  if (!sortSpec) return items;
  const fields = String(sortSpec)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return [...items].sort((a, b) => {
    for (const f of fields) {
      const desc = f.startsWith('-');
      const key = desc ? f.slice(1) : f;
      const va = a[key];
      const vb = b[key];
      if (va === vb) continue;
      if (va === undefined) return 1;
      if (vb === undefined) return -1;
      const cmp = va > vb ? 1 : -1;
      return desc ? -cmp : cmp;
    }
    return 0;
  });
}

function wrapDoc(rawObj, collectionName, schema) {
  if (!rawObj) return null;

  const doc = { ...rawObj };

  Object.defineProperty(doc, 'toObject', {
    enumerable: false,
    value: () => JSON.parse(JSON.stringify(doc)),
  });

  if (collectionName === 'Admin') {
    Object.defineProperty(doc, 'matchPassword', {
      enumerable: false,
      value: async function (enteredPassword) {
        if (!this.password) return false;
        if (this.password.startsWith('$2')) {
          return bcrypt.compare(enteredPassword, this.password);
        }
        return enteredPassword === this.password;
      },
    });
  }

  Object.defineProperty(doc, 'save', {
    enumerable: false,
    value: async function () {
      const col = getCollection(collectionName);
      if (collectionName === 'Admin' && this.password && !this.password.startsWith('$2')) {
        this.password = await bcrypt.hash(this.password, 12);
      }
      this.updatedAt = new Date().toISOString();
      const idx = col.findIndex((item) => String(item._id) === String(this._id));
      const plain = JSON.parse(JSON.stringify(this));
      if (idx >= 0) {
        col[idx] = plain;
      } else {
        col.push(plain);
      }
      saveStore();
      return this;
    },
  });

  // Đảm bảo doc.theme.toObject() hoạt động nếu controller gọi doc.theme.toObject()
  if (doc.theme && typeof doc.theme === 'object') {
    Object.defineProperty(doc.theme, 'toObject', {
      enumerable: false,
      configurable: true,
      value: () => JSON.parse(JSON.stringify(doc.theme)),
    });
  }

  return doc;
}

function createQueryChain(executor) {
  let sortSpec = null;
  let selectSpec = null;

  const run = async () => executor({ sortSpec, selectSpec });

  const chain = {
    sort(spec) {
      sortSpec = spec;
      return chain;
    },
    select(spec) {
      selectSpec = spec;
      return chain;
    },
    lean() {
      return chain;
    },
    then(onFulfilled, onRejected) {
      return run().then(onFulfilled, onRejected);
    },
    catch(onRejected) {
      return run().catch(onRejected);
    },
    finally(onFinally) {
      return run().finally(onFinally);
    },
  };

  return chain;
}

function wrapModel(mongooseModel) {
  const collectionName = mongooseModel.modelName;
  const schema = mongooseModel.schema;

  const isMongoConnected = () => mongoose.connection.readyState === 1;

  const createSingleItem = async (data = {}) => {
    const col = getCollection(collectionName);
    const defaults = extractSchemaDefaults(schema);
    const coerced = coerceBySchema(schema, data);
    const now = new Date().toISOString();

    const item = {
      ...defaults,
      ...coerced,
      _id: coerced._id || crypto.randomBytes(12).toString('hex'),
      createdAt: coerced.createdAt || now,
      updatedAt: now,
    };

    if (defaults.theme && coerced.theme) {
      item.theme = { ...defaults.theme, ...coerced.theme };
    }

    if (collectionName === 'Admin') {
      if (item.email) item.email = item.email.toLowerCase().trim();
      if (item.password && !item.password.startsWith('$2')) {
        item.password = await bcrypt.hash(item.password, 12);
      }
    }

    col.push(item);
    saveStore();
    return wrapDoc(item, collectionName, schema);
  };

  const localMethods = {
    find(filter = {}) {
      return createQueryChain(async ({ sortSpec }) => {
        const col = getCollection(collectionName);
        const matched = col.filter((item) => matchesFilter(item, filter));
        const sorted = sortItems(matched, sortSpec);
        return sorted.map((item) => wrapDoc(item, collectionName, schema));
      });
    },

    findOne(filter = {}) {
      return createQueryChain(async () => {
        const col = getCollection(collectionName);
        const found = col.find((item) => matchesFilter(item, filter));
        return found ? wrapDoc(found, collectionName, schema) : null;
      });
    },

    findById(id) {
      return createQueryChain(async () => {
        const col = getCollection(collectionName);
        const found = col.find((item) => String(item._id) === String(id));
        return found ? wrapDoc(found, collectionName, schema) : null;
      });
    },

    async create(docOrArray = {}) {
      if (Array.isArray(docOrArray)) {
        const results = [];
        for (const d of docOrArray) {
          results.push(await createSingleItem(d));
        }
        return results;
      }
      return createSingleItem(docOrArray);
    },

    async insertMany(arr = []) {
      const results = [];
      for (const d of arr) {
        results.push(await createSingleItem(d));
      }
      return results;
    },

    async findByIdAndUpdate(id, updateData = {}, _opts = {}) {
      const col = getCollection(collectionName);
      const idx = col.findIndex((item) => String(item._id) === String(id));
      if (idx === -1) return null;

      const coerced = coerceBySchema(schema, updateData);
      const updated = {
        ...col[idx],
        ...coerced,
        _id: col[idx]._id,
        updatedAt: new Date().toISOString(),
      };

      if (col[idx].theme && coerced.theme) {
        updated.theme = { ...col[idx].theme, ...coerced.theme };
      }

      col[idx] = updated;
      saveStore();
      return wrapDoc(updated, collectionName, schema);
    },

    async findByIdAndDelete(id) {
      const col = getCollection(collectionName);
      const idx = col.findIndex((item) => String(item._id) === String(id));
      if (idx === -1) return null;
      const [removed] = col.splice(idx, 1);
      saveStore();
      return wrapDoc(removed, collectionName, schema);
    },

    async countDocuments(filter = {}) {
      const col = getCollection(collectionName);
      return col.filter((item) => matchesFilter(item, filter)).length;
    },
  };

  return new Proxy(mongooseModel, {
    get(target, prop, receiver) {
      if (!isMongoConnected() && prop in localMethods) {
        return localMethods[prop];
      }
      const val = Reflect.get(target, prop, receiver);
      return typeof val === 'function' ? val.bind(target) : val;
    },
  });
}

module.exports = { wrapModel };

