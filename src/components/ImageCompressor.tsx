import React, { useState } from 'react';

import { Download, Loader2 } from 'lucide-react';
import { saveCompressionRecord } from '../utils/api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface ImageCompressorProps {
  file: File;
  onReset: () => void;
}

const ImageCompressor: React.FC<ImageCompressorProps> = ({ file, onReset }) => {
  const initialIsMB = file.size > 1024 * 1024;
  const initialUnit = initialIsMB ? 'MB' : 'KB';
  const initialTargetSize = initialIsMB 
    ? parseFloat((file.size / (1024 * 1024) / 2).toFixed(2))
    : Math.round(file.size / 1024 / 2);

  const [targetSize, setTargetSize] = useState(initialTargetSize);
  const [unit, setUnit] = useState<'KB' | 'MB'>(initialUnit);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [quality, setQuality] = useState(0.8);
  const [compressing, setCompressing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);




  const handleCompress = async () => {
    setCompressing(true);
    setProgressMsg('');
    try {
      const targetBytes = unit === 'MB' ? targetSize * 1024 * 1024 : targetSize * 1024;

      setProgressMsg('Loading image...');
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = objectUrl;
      });
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      const baseWidth = img.naturalWidth;
      const baseHeight = img.naturalHeight;

      let bestBlob: Blob | null = null;

      if (file.size > targetBytes) {
        // ─── CASE: DECREASE SIZE ───────────────────────────────────────────
        // Scale down if wider than maxWidth, then binary search on quality
        let w = baseWidth, h = baseHeight;
        if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);

        let lo = 0.01, hi = 1.0;
        for (let i = 0; i < 20; i++) {
          const mid = (lo + hi) / 2;
          setProgressMsg(`Compressing... step ${i + 1}/20 (quality ${Math.round(mid * 100)}%)`);
          const blob: Blob = await new Promise(r => canvas.toBlob(b => r(b!), 'image/jpeg', mid));
          if (blob.size <= targetBytes) { bestBlob = blob; lo = mid; }
          else { hi = mid; }
          if (bestBlob && Math.abs(bestBlob.size - targetBytes) / targetBytes < 0.02) break;
        }
        // Absolute fallback
        if (!bestBlob) {
          setProgressMsg('Applying maximum compression...');
          bestBlob = await new Promise(r => canvas.toBlob(b => r(b!), 'image/jpeg', 0.01));
        }

      } else {
        // ─── CASE: INCREASE SIZE ───────────────────────────────────────────
        // Strategy: upscale canvas dimensions via binary search until blob.size >= targetBytes
        // First check if quality=1.0 at original size can reach target
        canvas.width = baseWidth; canvas.height = baseHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0, baseWidth, baseHeight);
        const fullQBlob: Blob = await new Promise(r => canvas.toBlob(b => r(b!), 'image/jpeg', 1.0));

        if (fullQBlob.size >= targetBytes) {
          // Target reachable by quality alone — binary search quality (inverted: find lowest q that hits target)
          let lo = 0.0, hi = 1.0;
          for (let i = 0; i < 20; i++) {
            const mid = (lo + hi) / 2;
            setProgressMsg(`Upscaling quality... step ${i + 1}/20 (quality ${Math.round(mid * 100)}%)`);
            const blob: Blob = await new Promise(r => canvas.toBlob(b => r(b!), 'image/jpeg', mid));
            if (blob.size >= targetBytes) { bestBlob = blob; hi = mid; }  // works, try lower q to stay close
            else { lo = mid; }
            if (bestBlob && Math.abs(bestBlob.size - targetBytes) / targetBytes < 0.02) break;
          }
        } else {
          // Need to upscale dimensions — binary search on scale factor
          let loScale = 1.0, hiScale = 8.0;
          for (let i = 0; i < 20; i++) {
            const scale = (loScale + hiScale) / 2;
            const nw = Math.round(baseWidth * scale);
            const nh = Math.round(baseHeight * scale);
            setProgressMsg(`Upscaling dimensions... step ${i + 1}/20 (${nw}×${nh}px)`);
            canvas.width = nw; canvas.height = nh;
            canvas.getContext('2d')!.drawImage(img, 0, 0, nw, nh);
            const blob: Blob = await new Promise(r => canvas.toBlob(b => r(b!), 'image/jpeg', 1.0));
            if (blob.size >= targetBytes) { bestBlob = blob; hiScale = scale; }
            else { loScale = scale; }
            if (bestBlob && Math.abs(bestBlob.size - targetBytes) / targetBytes < 0.02) break;
          }
          // Fallback: use max scale
          if (!bestBlob) {
            const nw = Math.round(baseWidth * hiScale), nh = Math.round(baseHeight * hiScale);
            setProgressMsg('Finalizing upscale...');
            canvas.width = nw; canvas.height = nh;
            canvas.getContext('2d')!.drawImage(img, 0, 0, nw, nh);
            bestBlob = await new Promise(r => canvas.toBlob(b => r(b!), 'image/jpeg', 1.0));
          }
        }
      }

      const url = URL.createObjectURL(bestBlob!);
      const action = file.size > targetBytes ? 'compressed' : 'upscaled';
      setResult({
        url,
        size: bestBlob!.size,
        name: `${action}_${targetSize}${unit.toLowerCase()}_${file.name.split('.')[0]}.jpg`
      });

      await saveCompressionRecord({
        fileName: file.name,
        fileType: 'image',
        originalSize: file.size,
        compressedSize: bestBlob!.size,
        compressionRatio: Math.round((1 - bestBlob!.size / file.size) * 100)
      });
      toast.success(`✅ Image ${action} to ${formatSize(bestBlob!.size)}`);
    } catch (error) {
      console.error('Processing failed:', error);
      toast.error('Processing failed. Try a different target size.');
    } finally {
      setCompressing(false);
      setProgressMsg('');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="glass" style={{ padding: 'clamp(20px, 5vw, 30px)', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <h3 style={{ margin: 0 }}>Image Optimizer</h3>
        <button onClick={onReset} className="btn-secondary" style={{ padding: '8px 16px' }}>Change File</button>
      </div>

      <div style={{ marginBottom: '30px', padding: 'clamp(15px, 4vw, 20px)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <label style={{ display: 'block', marginBottom: '15px', fontSize: '1rem', fontWeight: '600' }}>Enter Your Target Size</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="number" 
            value={targetSize} 
            onChange={(e) => setTargetSize(parseFloat(e.target.value))}
            className="glass"
            style={{ flex: '1 1 200px', padding: '15px', fontSize: '1.1rem', background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
            placeholder="e.g. 500"
          />
          <select 
            value={unit} 
            onChange={(e) => {
              const newUnit = e.target.value as 'KB' | 'MB';
              if (newUnit !== unit) {
                if (newUnit === 'MB') {
                  setTargetSize(parseFloat((targetSize / 1024).toFixed(2)));
                } else {
                  setTargetSize(Math.round(targetSize * 1024));
                }
                setUnit(newUnit);
              }
            }}
            className="glass"
            style={{ width: '100px', padding: '15px', fontSize: '1rem', background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
          >
            <option value="KB">KB</option>
            <option value="MB">MB</option>
          </select>
        </div>
        <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Current: <b>{formatSize(file.size)}</b>. Set any target — we'll compress <b>or</b> upscale to match it.
        </p>
      </div>

      <details style={{ marginBottom: '25px' }}>
        <summary style={{ cursor: 'pointer', color: 'var(--accent-color)', fontSize: '0.9rem', marginBottom: '15px' }}>Advanced Settings (Optional)</summary>
        <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Max Width (px)</label>
            <input 
              type="number" 
              value={maxWidth} 
              onChange={(e) => setMaxWidth(parseInt(e.target.value))}
              className="glass"
              style={{ width: '100%', padding: '10px', background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem' }}>Initial Quality</label>
            <input 
              type="range" min="0.1" max="1.0" step="0.1"
              value={quality} 
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-color)' }}
            />
          </div>
        </div>
      </details>

      <button 
        onClick={handleCompress} 
        className="btn-primary" 
        style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 'bold' }}
        disabled={compressing}
      >
        {compressing ? <><Loader2 className="animate-spin" /> {progressMsg || 'Processing...'}</> : 'Process & Download'}
      </button>

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginTop: '30px', padding: '20px', border: '1px solid var(--accent-color)', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.05)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h4 style={{ margin: 0 }}>
                {result.size < file.size ? '✅ Compression Done!' : result.size > file.size ? '📈 Upscale Done!' : '✅ Already Perfect!'}
              </h4>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem' }}>
                Final Size: <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{formatSize(result.size)}</span>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              {result.size < file.size ? (
                <>
                  <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                    -{Math.round((1 - result.size / file.size) * 100)}%
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>SAVED</span>
                </>
              ) : result.size > file.size ? (
                <>
                  <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    +{Math.round((result.size / file.size - 1) * 100)}%
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>INCREASED</span>
                </>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No change</span>
              )}
            </div>
          </div>
          <a href={result.url} download={result.name} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px' }}>
            <Download size={20} /> Download Optimized Image
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default ImageCompressor;
