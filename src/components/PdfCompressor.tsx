import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, Loader2 } from 'lucide-react';
import { saveCompressionRecord } from '../utils/api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface PdfCompressorProps {
  file: File;
  onReset: () => void;
}

const PdfCompressor: React.FC<PdfCompressorProps> = ({ file, onReset }) => {
  const [compressing, setCompressing] = useState(false);
  const [level, setLevel] = useState<'standard' | 'aggressive'>('standard');
  const [targetSize, setTargetSize] = useState(Math.round(file.size / 1024 / 1.5));
  const [unit, setUnit] = useState<'KB' | 'MB'>(file.size > 1024 * 1024 ? 'MB' : 'KB');
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);

  const handleCompress = async () => {
    setCompressing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const newPdfDoc = await PDFDocument.create();
      const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      
      const targetBytes = unit === 'MB' ? targetSize * 1024 * 1024 : targetSize * 1024;
      const ratio = targetBytes / file.size;

      pages.forEach((page) => {
        if (level === 'aggressive') {
          // DECREASE: scale down proportionally
          if (ratio < 0.2) page.scale(0.5, 0.5);
          else if (ratio < 0.5) page.scale(0.7, 0.7);
          else if (ratio < 0.8) page.scale(0.85, 0.85);
        } else if (ratio > 1.2) {
          // INCREASE: scale up proportionally (standard mode)
          if (ratio > 4) page.scale(2.0, 2.0);
          else if (ratio > 2) page.scale(1.5, 1.5);
          else page.scale(1.2, 1.2);
        }
        newPdfDoc.addPage(page);
      });

      // metadata stripping
      newPdfDoc.setTitle('');
      newPdfDoc.setAuthor('');

      const compressedPdfBytes = await newPdfDoc.save({ 
        useObjectStreams: true,
        addDefaultPage: false
      });
      
      const blob = new Blob([compressedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setResult({
        url,
        size: blob.size,
        name: `target_${targetSize}${unit.toLowerCase()}_${file.name}`
      });

      await saveCompressionRecord({
        fileName: file.name,
        fileType: 'pdf',
        originalSize: file.size,
        compressedSize: blob.size,
        compressionRatio: Math.round((1 - blob.size / file.size) * 100)
      });
      toast.success(`PDF optimized to ${formatSize(blob.size)}`);
    } catch (error) {
      console.error("PDF Optimization failed:", error);
      toast.error("Optimization failed. Try a different target.");
    } finally {
      setCompressing(false);
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
        <h3 style={{ margin: 0 }}>PDF Optimizer</h3>
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
            style={{ flex: '1 1 200px', padding: '15px', fontSize: '1.1rem', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
            placeholder="e.g. 2"
          />
          <select 
            value={unit} 
            onChange={(e) => setUnit(e.target.value as 'KB' | 'MB')}
            className="glass"
            style={{ width: '100px', padding: '15px', fontSize: '1rem', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
          >
            <option value="KB">KB</option>
            <option value="MB">MB</option>
          </select>
        </div>
        <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Original: <b>{formatSize(file.size)}</b>. We will optimize internal data to reach your target.
        </p>
      </div>

      <details style={{ marginBottom: '25px' }}>
        <summary style={{ cursor: 'pointer', color: 'var(--accent-color)', fontSize: '0.9rem', marginBottom: '15px' }}>Optimization Level (Optional)</summary>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={() => setLevel('standard')} 
            className={level === 'standard' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '10px', fontSize: '0.8rem' }}
          >
            Standard
          </button>
          <button 
            onClick={() => setLevel('aggressive')} 
            className={level === 'aggressive' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '10px', fontSize: '0.8rem' }}
          >
            Aggressive
          </button>
        </div>
      </details>

      <button 
        onClick={handleCompress} 
        className="btn-primary" 
        style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 'bold' }}
        disabled={compressing}
      >
        {compressing ? <><Loader2 className="animate-spin" /> Optimizing PDF...</> : 'Process & Download'}
      </button>

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginTop: '30px', padding: '25px', border: '1px solid var(--accent-color)', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.05)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h4 style={{ margin: 0 }}>Optimization Finished!</h4>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>Final Size: <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{formatSize(result.size)}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>{Math.round((1 - result.size / file.size) * 100)}%</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>SAVED</span>
            </div>
          </div>
          <a href={result.url} download={result.name} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px' }}>
            <Download size={20} /> Download Optimized PDF
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default PdfCompressor;
