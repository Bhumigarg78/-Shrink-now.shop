import React, { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Download, Loader2, Play } from 'lucide-react';
import { saveCompressionRecord } from '../utils/api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface VideoCompressorProps {
  file: File;
  onReset: () => void;
}

const VideoCompressor: React.FC<VideoCompressorProps> = ({ file, onReset }) => {
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetSize, setTargetSize] = useState(Math.round(file.size / 1024 / 2));
  const [unit, setUnit] = useState<'KB' | 'MB'>(file.size > 1024 * 1024 ? 'MB' : 'KB');

  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const [preset, setPreset] = useState<string>('custom');

  const loadFFmpeg = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    const ffmpeg = ffmpegRef.current;
    
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });

    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  };

  const applyPreset = (p: string) => {
    setPreset(p);
    if (p === 'youtube') {
      setTargetSize(Math.round(file.size / 1024 / 1.2));
      setUnit('MB');
    } else if (p === 'ig-reel') {
      setTargetSize(Math.min(15, Math.round(file.size / 1024 / 4)));
      setUnit('MB');
    } else if (p === 'whatsapp') {
      setTargetSize(16);
      setUnit('MB');
    }
  };

  const handleCompress = async () => {
    setLoading(true);
    try {
      if (!ffmpegRef.current.loaded) {
        await loadFFmpeg();
      }

      setCompressing(true);
      const ffmpeg = ffmpegRef.current;
      const inputFileName = 'input_video';
      const outputFileName = 'output_video.mp4';
      const pass1Log = 'ffmpeg2pass-0.log';

      await ffmpeg.writeFile(inputFileName, await fetchFile(file));

      // Get duration for precise bitrate calculation
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      const duration = await new Promise<number>((resolve) => {
        video.onloadedmetadata = () => { URL.revokeObjectURL(video.src); resolve(video.duration); };
      });

      // ─── Precise Bitrate Formula ────────────────────────────────────────
      // Total target bits = targetBytes * 8
      // Audio overhead = 128kbps * duration (seconds)
      // Video bitrate = (targetBytes * 8 - audioKbps * 1000 * duration) / duration
      const targetBytes = unit === 'MB' ? targetSize * 1024 * 1024 : targetSize * 1024;
      const audioBitrateKbps = 128;
      const audioBits = audioBitrateKbps * 1000 * duration;
      const containerOverheadBytes = 50 * 1024; // ~50KB for MP4 container
      const videoBits = (targetBytes - containerOverheadBytes) * 8 - audioBits;
      const targetBitrateKbps = Math.max(50, Math.round(videoBits / duration / 1000));

      setProgress(10);

      // ─── TWO-PASS ENCODING for exact file size ──────────────────────────
      // Pass 1: Analyze video, write stats (no audio, output to null)
      setProgress(20);
      await ffmpeg.exec([
        '-y',
        '-i', inputFileName,
        '-c:v', 'libx264',
        '-b:v', `${targetBitrateKbps}k`,
        '-pass', '1',
        '-an',               // no audio in pass 1
        '-f', 'mp4',
        'pass1_output.mp4'   // dummy output (we'll ignore it)
      ]);

      setProgress(60);

      // Pass 2: Encode with stats for precise bitrate control
      await ffmpeg.exec([
        '-y',
        '-i', inputFileName,
        '-c:v', 'libx264',
        '-b:v', `${targetBitrateKbps}k`,
        '-pass', '2',
        '-c:a', 'aac',
        '-b:a', `${audioBitrateKbps}k`,
        '-movflags', '+faststart',
        outputFileName
      ]);

      setProgress(95);

      const data = await ffmpeg.readFile(outputFileName);
      const blob = new Blob([data as any], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);

      // Clean up pass files
      try { await ffmpeg.deleteFile('pass1_output.mp4'); } catch (_) {}
      try { await ffmpeg.deleteFile(pass1Log); } catch (_) {}

      setProgress(100);
      setResult({
        url,
        size: blob.size,
        name: `target_${targetSize}${unit.toLowerCase()}_${file.name.split('.')[0]}.mp4`
      });

      await saveCompressionRecord({
        fileName: file.name,
        fileType: 'video',
        originalSize: file.size,
        compressedSize: blob.size,
        compressionRatio: Math.round((1 - blob.size / file.size) * 100)
      });
      toast.success(`✅ Video processed to ${formatSize(blob.size)}`);
    } catch (error) {
      console.error('Video compression failed:', error);
      toast.error("Video compression failed. Try a different target size.");
    } finally {
      setCompressing(false);
      setLoading(false);
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
        <h3 style={{ margin: 0 }}>Video Optimizer</h3>
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
            placeholder="e.g. 10"
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
          Original: <b>{formatSize(file.size)}</b>. We will use Smart Bitrate to match your target.
        </p>
      </div>

      <details style={{ marginBottom: '25px' }}>
        <summary style={{ cursor: 'pointer', color: 'var(--accent-color)', fontSize: '0.9rem', marginBottom: '15px' }}>Social Media Presets</summary>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          {[
            { id: 'youtube', label: 'YouTube' },
            { id: 'ig-reel', label: 'Instagram Reel' },
            { id: 'whatsapp', label: 'WhatsApp' }
          ].map(p => (
            <button 
              key={p.id}
              onClick={() => applyPreset(p.id)} 
              className={preset === p.id ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 15px', fontSize: '0.8rem' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </details>

      <button 
        onClick={handleCompress} 
        className="btn-primary" 
        style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 'bold' }}
        disabled={loading || compressing}
      >
        {compressing ? (
          <>{<Loader2 className="animate-spin" />}
            {progress < 60 ? `🔍 Pass 1: Analyzing... ${progress}%` : `🎬 Pass 2: Encoding... ${progress}%`}
          </>
        ) : loading ? (
          <><Loader2 className="animate-spin" /> Starting Engine...</>
        ) : (
          <><Play size={18} /> Process & Download</>
        )}
      </button>

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginTop: '30px', padding: '25px', border: '1px solid var(--accent-color)', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.05)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h4 style={{ margin: 0 }}>Compression Successful!</h4>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>Final Size: <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{formatSize(result.size)}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>{Math.round((1 - result.size / file.size) * 100)}%</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>SAVED</span>
            </div>
          </div>
          <a href={result.url} download={result.name} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px', marginBottom: '20px' }}>
            <Download size={20} /> Download Optimized Video
          </a>
          <video src={result.url} controls style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--glass-border)' }} />
        </motion.div>
      )}
    </div>
  );
};

export default VideoCompressor;
