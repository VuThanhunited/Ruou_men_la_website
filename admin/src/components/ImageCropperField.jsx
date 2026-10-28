import { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { FiUpload, FiCrop, FiCheck, FiX, FiRotateCw, FiZoomIn } from 'react-icons/fi';
import './ImageCropper.css';

/**
 * getCroppedImg - Cắt ảnh từ canvas theo crop area
 */
async function getCroppedImg(imageSrc, pixelCrop, outputType = 'image/webp', quality = 0.88) {
  const image = await createImageBitmap(await fetch(imageSrc).then((r) => r.blob()));
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
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
    canvas.toBlob(
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
 * Dùng để chuẩn hóa tỷ lệ ảnh theo từng loại content
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
    label: '21:9 (Banner cực rộng)',
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
    aspect: null,
    label: 'Tự do',
    hint: 'Bất kỳ kích thước nào',
    cropShape: 'rect',
  },
};

/**
 * ImageCropperField
 * 
 * Component upload + crop tích hợp cho Admin panel
 * 
 * Props:
 * - label: string — nhãn field
 * - preset: keyof CROP_PRESETS — tỷ lệ crop
 * - currentUrl: string — URL ảnh hiện tại
 * - onCropped: (file, previewUrl) => void — callback khi crop xong
 * - disabled: bool
 */
export default function ImageCropperField({
  label,
  preset = 'SQUARE',
  currentUrl = '',
  onCropped,
  disabled = false,
}) {
  const config = CROP_PRESETS[preset] || CROP_PRESETS.SQUARE;
  const fileInputRef = useRef();

  // States
  const [rawSrc, setRawSrc] = useState(null);         // URL ảnh gốc chưa crop
  const [cropperOpen, setCropperOpen] = useState(false); // Modal cropper
  const [previewUrl, setPreviewUrl] = useState(currentUrl); // URL ảnh sau crop
  const [isDragOver, setIsDragOver] = useState(false);

  // react-easy-crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // Khi chọn file
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setRawSrc(e.target.result);
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
      const { file, url } = await getCroppedImg(rawSrc, croppedAreaPixels);
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

  const handleCropCancel = () => {
    setCropperOpen(false);
    setRawSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl('');
    onCropped?.(null, '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isCircle = config.cropShape === 'round';

  return (
    <>
      <div className="img-crop-field">
        <div className="img-crop-field-header">
          <label className="admin-form-label">{label}</label>
          <span className="img-crop-hint-badge">
            <FiCrop size={11} />
            {config.label} · {config.hint}
          </span>
        </div>

        {/* Upload Area */}
        <div
          className={`img-crop-drop-area ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            /* Preview */
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
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    title="Thay ảnh"
                  >
                    <FiUpload size={14} /> Thay ảnh
                  </button>
                  <button
                    type="button"
                    className="img-crop-preview-btn remove"
                    onClick={handleRemove}
                    title="Xóa ảnh"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="img-crop-empty">
              <div className="img-crop-empty-icon">
                <FiUpload size={28} />
              </div>
              <div className="img-crop-empty-text">
                <span>Kéo thả ảnh vào đây hoặc <strong>click để chọn</strong></span>
              </div>
              <div className="img-crop-empty-formats">
                JPG, PNG, WebP · Tối đa 10MB
              </div>
              <div className="img-crop-empty-recommended">
                📐 {config.hint}
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleInputChange}
            style={{ display: 'none' }}
            disabled={disabled}
          />
        </div>
      </div>

      {/* ============================
          CROPPER MODAL
          ============================ */}
      {cropperOpen && rawSrc && (
        <div className="img-crop-modal-overlay">
          <div className="img-crop-modal">
            {/* Header */}
            <div className="img-crop-modal-header">
              <div className="img-crop-modal-title">
                <FiCrop size={18} />
                Cắt ảnh — {config.label}
              </div>
              <button
                type="button"
                className="img-crop-modal-close"
                onClick={handleCropCancel}
              >
                <FiX />
              </button>
            </div>

            {/* Crop Canvas */}
            <div className="img-crop-canvas-wrap">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={config.aspect}
                cropShape={config.cropShape}
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

            {/* Controls */}
            <div className="img-crop-controls">
              {/* Zoom */}
              <div className="img-crop-control-group">
                <label className="img-crop-control-label">
                  <FiZoomIn size={14} /> Zoom
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

              {/* Rotation */}
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

            {/* Info */}
            <div className="img-crop-info">
              <span>💡 Ảnh sau khi cắt sẽ được tự động chuyển sang <strong>.webp</strong> để tối ưu tốc độ tải trang</span>
            </div>

            {/* Actions */}
            <div className="img-crop-modal-footer">
              <button
                type="button"
                className="img-crop-btn cancel"
                onClick={handleCropCancel}
              >
                <FiX size={14} /> Hủy
              </button>
              <button
                type="button"
                className="img-crop-btn confirm"
                onClick={handleCropConfirm}
                disabled={processing}
              >
                {processing ? (
                  <span className="img-crop-spinner" />
                ) : (
                  <FiCheck size={14} />
                )}
                {processing ? 'Đang xử lý...' : 'Xác nhận cắt ảnh'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

