import { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import {
  FiUpload,
  FiCrop,
  FiCheck,
  FiX,
  FiRotateCw,
  FiZoomIn,
  FiLink,
  FiImage,
} from 'react-icons/fi';
import './ImageCropper.css';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * getCroppedImg - Cắt ảnh từ canvas theo crop area + hỗ trợ xoay ảnh
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, outputType = 'image/webp', quality = 0.9) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob(
      (blob) => {
        const file = new File([blob], `cropped_${Date.now()}.webp`, { type: outputType });
        const url = URL.createObjectURL(blob);
        resolve({ file, url });
      },
      outputType,
      quality
    );
  });
}

/**
 * ASPECT RATIO PRESETS
 */
export const CROP_PRESETS = {
  SQUARE: {
    aspect: 1,
    label: '1:1 (Vuông)',
    hint: 'Khuyên dùng 600×600px',
    cropShape: 'rect',
  },
  CIRCLE: {
    aspect: 1,
    label: '1:1 (Tròn)',
    hint: 'Khuyên dùng 400×400px',
    cropShape: 'round',
  },
  BANNER_WIDE: {
    aspect: 16 / 9,
    label: '16:9 (Banner ngang)',
    hint: 'Khuyên dùng 1920×1080px',
    cropShape: 'rect',
  },
  BANNER_ULTRA: {
    aspect: 21 / 9,
    label: '21:9 (Banner rộng)',
    hint: 'Khuyên dùng 1920×600px',
    cropShape: 'rect',
  },
  HERO_BG: {
    aspect: 16 / 9,
    label: '16:9 (Hero)',
    hint: 'Khuyên dùng 1920×1080px',
    cropShape: 'rect',
  },
  INTRO_BANNER: {
    aspect: 3 / 4,
    label: '3:4 (Dọc)',
    hint: 'Khuyên dùng 600×800px',
    cropShape: 'rect',
  },
  FREE: {
    aspect: 4 / 3,
    label: 'Tự chọn tỷ lệ',
    hint: 'Tùy chỉnh linh hoạt',
    cropShape: 'rect',
  },
};

export const BUILTIN_GALLERY = [
  { label: 'Logo mặc định', url: '/assets/logo.jpg' },
  { label: 'Banner Hero', url: '/assets/hero-bg.jpg' },
  { label: 'Banner Giới thiệu', url: '/assets/intro-bg.jpg' },
  { label: 'Banner Câu chuyện TH', url: '/assets/brand-story-bg.jpg' },
  { label: 'Sản phẩm 1', url: '/assets/product-1.jpg' },
  { label: 'Sản phẩm 2', url: '/assets/product-2.jpg' },
  { label: 'Sản phẩm 3', url: '/assets/product-3.jpg' },
  { label: 'Quy trình Bước 1', url: '/assets/process-step-1.jpg' },
  { label: 'Quy trình Bước 2', url: '/assets/process-step-2.jpg' },
  { label: 'Quy trình Bước 3', url: '/assets/process-step-3.jpg' },
  { label: 'Quy trình Bước 4', url: '/assets/process-step-4.jpg' },
  { label: 'Avatar KH 1', url: '/assets/avatar-1.jpg' },
  { label: 'Avatar KH 2', url: '/assets/avatar-2.jpg' },
  { label: 'Avatar KH 3', url: '/assets/avatar-3.jpg' },
  { label: 'Icon Thiên nhiên', url: '/assets/icons/usp-nature.svg' },
  { label: 'Icon Thủ công', url: '/assets/icons/usp-craft.svg' },
  { label: 'Icon An toàn', url: '/assets/icons/usp-safety.svg' },
  { label: 'Icon Hương vị', url: '/assets/icons/usp-flavor.svg' },
  { label: 'Icon Quà tặng', url: '/assets/icons/usp-gift.svg' },
];

export default function ImageCropperField({
  label,
  preset = 'SQUARE',
  currentUrl = '',
  onCropped,
  disabled = false,
}) {
  const defaultConfig = CROP_PRESETS[preset] || CROP_PRESETS.SQUARE;
  const fileInputRef = useRef();

  const [rawSrc, setRawSrc] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [showGallery, setShowGallery] = useState(false);

  // react-easy-crop states
  const [activePresetKey, setActivePresetKey] = useState(preset);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Đồng bộ preview khi dữ liệu từ API tải xong hoặc thay đổi
  useEffect(() => {
    setPreviewUrl(currentUrl || '');
  }, [currentUrl]);

  const activeConfig = CROP_PRESETS[activePresetKey] || defaultConfig;

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // Khi chọn file từ máy tính
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setRawFile(file);

    // Nếu là ảnh SVG hoặc GIF động, dùng trực tiếp không bắt buộc qua canvas
    if (file.type === 'image/svg+xml') {
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
      onCropped?.(file, objUrl);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setRawSrc(e.target.result);
      setActivePresetKey(preset);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => handleFileSelect(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  // Thực hiện crop
  const handleCropConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const { file, url } = await getCroppedImg(rawSrc, croppedAreaPixels, rotation);
      setPreviewUrl(url);
      onCropped?.(file, url);
      setCropperOpen(false);
      setRawSrc(null);
    } catch (err) {
      console.error('Crop error:', err);
    } finally {
      setProcessing(false);
    }
  };

  // Dùng nguyên ảnh gốc không cắt
  const handleUseOriginal = () => {
    if (!rawFile) return;
    const url = URL.createObjectURL(rawFile);
    setPreviewUrl(url);
    onCropped?.(rawFile, url);
    setCropperOpen(false);
    setRawSrc(null);
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setRawSrc(null);
    setRawFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl('');
    onCropped?.(null, '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyUrl = () => {
    const trimmed = urlInputValue.trim();
    if (!trimmed) return;
    setPreviewUrl(trimmed);
    onCropped?.(null, trimmed);
    setShowUrlInput(false);
    setUrlInputValue('');
  };

  const handlePickGallery = (url) => {
    setPreviewUrl(url);
    onCropped?.(null, url);
    setShowGallery(false);
  };

  const isCircle = defaultConfig.cropShape === 'round';

  return (
    <>
      <div className="img-crop-field">
        <div className="img-crop-field-header">
          <label className="admin-form-label">{label}</label>
          <span className="img-crop-hint-badge">
            <FiCrop size={11} />
            {defaultConfig.label} · {defaultConfig.hint}
          </span>
        </div>

        {/* Upload Area */}
        <div
          className={`img-crop-drop-area ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className={`img-crop-preview-wrap ${isCircle ? 'circle' : ''}`}>
              <img
                src={previewUrl}
                alt={label}
                className={`img-crop-preview-img ${isCircle ? 'circle' : ''}`}
              />
              {!disabled && (
                <div className="img-crop-preview-actions">
                  <button
                    type="button"
                    className="img-crop-preview-btn change"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    title="Tải ảnh mới từ máy"
                  >
                    <FiUpload size={13} /> Thay ảnh
                  </button>
                  <button
                    type="button"
                    className="img-crop-preview-btn remove"
                    onClick={handleRemove}
                    title="Xóa ảnh"
                  >
                    <FiX size={13} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="img-crop-empty">
              <div className="img-crop-empty-icon">
                <FiUpload size={26} />
              </div>
              <div className="img-crop-empty-text">
                <span>
                  Kéo thả ảnh vào đây hoặc <strong>bấm để tải ảnh lên</strong>
                </span>
              </div>
              <div className="img-crop-empty-formats">JPG, PNG, WebP, SVG · Tối đa 10MB</div>
              <div className="img-crop-empty-recommended">📐 {defaultConfig.hint}</div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleInputChange}
            style={{ display: 'none' }}
            disabled={disabled}
          />
        </div>

        {/* Quick Tools: Dán URL hoặc Chọn từ thư viện có sẵn */}
        {!disabled && (
          <div className="img-crop-quick-tools">
            <button
              type="button"
              className={`img-crop-tool-btn ${showUrlInput ? 'active' : ''}`}
              onClick={() => {
                setShowUrlInput(!showUrlInput);
                setShowGallery(false);
                setUrlInputValue(previewUrl.startsWith('blob:') ? '' : previewUrl);
              }}
            >
              <FiLink size={12} /> Nhập link ảnh
            </button>
            <button
              type="button"
              className={`img-crop-tool-btn ${showGallery ? 'active' : ''}`}
              onClick={() => {
                setShowGallery(!showGallery);
                setShowUrlInput(false);
              }}
            >
              <FiImage size={12} /> Kho ảnh mẫu
            </button>
          </div>
        )}

        {showUrlInput && (
          <div className="img-crop-url-box">
            <input
              type="text"
              className="admin-form-input"
              placeholder="Dán đường dẫn ảnh (https://... hoặc /assets/...)"
              value={urlInputValue}
              onChange={(e) => setUrlInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyUrl();
                }
              }}
            />
            <button type="button" className="admin-action-btn edit" onClick={handleApplyUrl}>
              Áp dụng
            </button>
          </div>
        )}

        {showGallery && (
          <div className="img-crop-gallery-box">
            {BUILTIN_GALLERY.map((item) => (
              <button
                key={item.url}
                type="button"
                className={`img-crop-gallery-item ${previewUrl === item.url ? 'selected' : ''}`}
                onClick={() => handlePickGallery(item.url)}
                title={item.label}
              >
                <img src={item.url} alt={item.label} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ============================
          CROPPER MODAL
          ============================ */}
      {cropperOpen && rawSrc && (
        <div className="img-crop-modal-overlay">
          <div className="img-crop-modal">
            <div className="img-crop-modal-header">
              <div className="img-crop-modal-title">
                <FiCrop size={18} />
                Căn chỉnh &amp; Cắt ảnh — {activeConfig.label}
              </div>
              <button type="button" className="img-crop-modal-close" onClick={handleCropCancel}>
                <FiX />
              </button>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="img-crop-ratio-bar">
              <span className="img-crop-ratio-label">Tỷ lệ khung:</span>
              {Object.entries(CROP_PRESETS).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  className={`img-crop-ratio-btn ${activePresetKey === key ? 'active' : ''}`}
                  onClick={() => setActivePresetKey(key)}
                >
                  {cfg.label}
                </button>
              ))}
            </div>

            <div className="img-crop-canvas-wrap">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={activeConfig.aspect || 4 / 3}
                cropShape={activeConfig.cropShape}
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: { borderRadius: '0' },
                  cropAreaStyle: { borderColor: '#C59B5F', borderWidth: 2 },
                }}
              />
            </div>

            <div className="img-crop-controls">
              <div className="img-crop-control-group">
                <label className="img-crop-control-label">
                  <FiZoomIn size={14} /> Phóng to
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(+e.target.value)}
                  className="img-crop-slider"
                />
                <span className="img-crop-control-value">{zoom.toFixed(1)}×</span>
              </div>

              <div className="img-crop-control-group">
                <label className="img-crop-control-label">
                  <FiRotateCw size={14} /> Xoay
                </label>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(+e.target.value)}
                  className="img-crop-slider"
                />
                <span className="img-crop-control-value">{rotation}°</span>
              </div>
            </div>

            <div className="img-crop-info">
              <span>
                💡 Bạn có thể kéo ảnh để chọn góc đẹp nhất hoặc bấm <strong>Giữ nguyên ảnh gốc</strong> nếu ảnh đã đúng kích thước / tách nền.
              </span>
            </div>

            <div className="img-crop-modal-footer">
              <button type="button" className="img-crop-btn cancel" onClick={handleCropCancel}>
                <FiX size={14} /> Hủy
              </button>
              <button
                type="button"
                className="img-crop-btn original"
                onClick={handleUseOriginal}
                disabled={processing}
              >
                Giữ nguyên ảnh gốc
              </button>
              <button
                type="button"
                className="img-crop-btn confirm"
                onClick={handleCropConfirm}
                disabled={processing}
              >
                {processing ? <span className="img-crop-spinner" /> : <FiCheck size={14} />}
                {processing ? 'Đang xử lý...' : 'Xác nhận cắt ảnh'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
