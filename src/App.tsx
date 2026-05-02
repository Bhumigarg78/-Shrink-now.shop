import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Layers, Image as ImageIcon, Video as VideoIcon, FileText, Sparkles, Zap, Shield, UploadCloud, Cpu, Download } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FileUploader from './components/FileUploader';
import ImageCompressor from './components/ImageCompressor';
import VideoCompressor from './components/VideoCompressor';
import PdfCompressor from './components/PdfCompressor';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import HashtagGenerator from './pages/HashtagGenerator';

type Mode = 'image' | 'video' | 'pdf' | null;

const Home = () => {
  const [mode, setMode] = useState<Mode>(null);
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const reset = () => setFile(null);
  const selectMode = (m: Mode) => { 
    if (m && !localStorage.getItem('token')) {
      toast.error('Please login to use our services');
      navigate('/login');
      return;
    }
    setMode(m); 
    setFile(null); 
  };

  const getAccept = () => {
    if (mode === 'image') return { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] };
    if (mode === 'video') return { 'video/*': ['.mp4', '.mov', '.avi', '.mkv'] };
    if (mode === 'pdf') return { 'application/pdf': ['.pdf'] };
    return {};
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <header id="top" className="section-padding" style={{ textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '30px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '20px', fontSize: '0.9rem' }}>
            <Sparkles size={16} />
            <span>AI-Powered Compression</span>
          </div>
          <h1>Shrink-Now.shop</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>The ultimate professional tool to compress your media without losing quality.</p>
        </motion.div>
      </header>

      {!mode ? (
        <>
          <div className="grid-responsive" style={{ marginTop: '40px', marginBottom: '80px' }}>
            {[
              { id: 'image', title: 'Image Compressor', icon: <ImageIcon size={32} />, desc: 'Compress PNG, JPG, WebP with customizable quality.' },
              { id: 'video', title: 'Video Compressor', icon: <VideoIcon size={32} />, desc: 'Reduce video size using FFmpeg.wasm technology.' },
              { id: 'pdf', title: 'PDF Optimizer', icon: <FileText size={32} />, desc: 'Shrink PDF files by optimizing internal structures.' }
            ].map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, translateY: -10 }}
                onClick={() => selectMode(card.id as Mode)}
                className="glass"
                style={{ padding: '40px', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ color: 'var(--accent-color)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                  {card.icon}
                </div>
                <h2 style={{ marginBottom: '10px' }}>{card.title}</h2>
                <p>{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Hashtag Generator Section ── */}
          <div id="hashtags" className="section-padding" style={{ scrollMarginTop: '100px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: '50px' }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '30px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', fontWeight: 'bold', marginBottom: '20px', fontSize: '0.9rem' }}>
                <Sparkles size={16} />
                <span>AI Hashtag Generator</span>
              </div>
              <h2 style={{ marginBottom: '15px' }}>Boost Your Social Reach</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Generate platform-specific viral hashtags for Instagram, TikTok, YouTube &amp; LinkedIn in seconds.
              </p>
            </motion.div>
            <HashtagGenerator />
          </div>

          {/* How it Works Section */}
          <section className="section-padding" style={{ position: 'relative' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: '60px' }}
            >
              <h2>How It Works</h2>
              <div style={{ width: '80px', height: '4px', background: 'var(--primary-gradient)', margin: '0 auto', borderRadius: '2px' }}></div>
            </motion.div>

            <div className="grid-responsive" style={{ position: 'relative' }}>
              {/* Connecting Line (Desktop Only via CSS) */}
              <div style={{ 
                position: 'absolute', 
                top: '50px', 
                left: '10%', 
                right: '10%', 
                height: '2px', 
                borderTop: '2px dashed rgba(255,255,255,0.1)',
                zIndex: 0,
                display: 'none'
              }} className="desktop-connector"></div>

              {[
                { 
                  step: '01', 
                  title: 'Upload Media', 
                  desc: 'Simply drag and drop your images, videos, or PDFs into our secure uploader.',
                  icon: <UploadCloud size={40} />,
                  delay: 0.1
                },
                { 
                  step: '02', 
                  title: 'AI Compression', 
                  desc: 'Our engine optimizes every pixel and frame to ensure maximum size reduction.',
                  icon: <Cpu size={40} />,
                  delay: 0.2
                },
                { 
                  step: '03', 
                  title: 'Get Results', 
                  desc: 'Download your optimized files instantly. Fast, secure, and ready to share.',
                  icon: <Download size={40} />,
                  delay: 0.3
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay, duration: 0.6 }}
                  className="glass"
                  style={{ 
                    position: 'relative', 
                    padding: '50px 30px', 
                    textAlign: 'center',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px'
                  }}
                >
                  {/* Step Badge */}
                  <div style={{ 
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    color: 'var(--accent-color)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '20px'
                  }}>
                    STEP {item.step}
                  </div>

                  <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '20px', 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    color: 'var(--accent-color)',
                    marginBottom: '10px'
                  }}>
                    {item.icon}
                  </div>
                  
                  <div>
                    <h3 style={{ marginBottom: '15px' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="glass section-padding" style={{ margin: '60px 0' }}>
            <div className="grid-responsive">
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-color)', marginBottom: '15px' }}><Zap size={32} /></div>
                <h3>Super Fast</h3>
                <p>Process files in seconds directly in your browser.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-color)', marginBottom: '15px' }}><Shield size={32} /></div>
                <h3>100% Secure</h3>
                <p>Your files never leave your computer. Privacy guaranteed.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-color)', marginBottom: '15px' }}><Layers size={32} /></div>
                <h3>High Quality</h3>
                <p>Maintain pixel-perfect quality even with high compression.</p>
              </div>
            </div>
          </section>

          {/* Combined Sections for Single Page Experience */}
          <div id="about">
            <About />
          </div>
          <div id="services">
            <Services onSelectService={selectMode} />
          </div>
          <div id="contact">
            <Contact />
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="section-padding">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <button onClick={() => selectMode(null)} className="btn-secondary" style={{ padding: '8px 12px' }}>
              &larr; Back
            </button>
            <h2 style={{ textTransform: 'capitalize', margin: 0 }}>{mode} Compression</h2>
          </div>

          {!file ? (
            <FileUploader 
              onFileSelect={setFile} 
              accept={getAccept()} 
              label={`Select ${mode.toUpperCase()} to compress`} 
            />
          ) : (
            <>
              {mode === 'image' && <ImageCompressor file={file} onReset={reset} />}
              {mode === 'video' && <VideoCompressor file={file} onReset={reset} />}
              {mode === 'pdf' && <PdfCompressor file={file} onReset={reset} />}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Toaster position="top-right" />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hashtags" element={<HashtagGenerator />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
