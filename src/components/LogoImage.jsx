import { useEffect, useRef } from 'react';

export default function LogoImage({ src, alt, height = 64 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      // Use full original image resolution for crisp rendering
      const aspectRatio = img.width / img.height;
      const displayHeight = height;
      const displayWidth = displayHeight * aspectRatio;

      // Draw at full native resolution (no downscaling = no blur)
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Remove white and near-white pixels
        if (r > 210 && g > 210 && b > 210) {
          data[i + 3] = 0;
        }
        // Softly fade near-white greys
        else if (r > 185 && g > 185 && b > 185 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
          data[i + 3] = Math.round(((255 - r) / 70) * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };
  }, [src, height]);

  return (
    <canvas
      ref={canvasRef}
      title={alt}
      style={{
        filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.6)) brightness(1.3) saturate(1.6)',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    />
  );
}
