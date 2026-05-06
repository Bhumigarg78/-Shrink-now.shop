import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Image as ImageIcon, Video as VideoIcon, FileText, Sparkles, Zap, Shield, UploadCloud, Cpu, Download, Check } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FileUploader from './components/FileUploader';
import ImageCompressor from './components/ImageCompressor';
import VideoCompressor from './components/VideoCompressor';
import PdfCompressor from './components/PdfCompressor';
import CustomCursor from './components/CustomCursor';
import AdSense from './components/AdSense';
import SEO from './components/SEO';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import HashtagGenerator from './pages/HashtagGenerator';
import AdminDashboard from './pages/AdminDashboard';

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

  const getAccept = (): Record<string, string[]> => {
    if (mode === 'image') return { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] };
    if (mode === 'video') return { 'video/*': ['.mp4', '.mov', '.avi', '.mkv'] };
    if (mode === 'pdf') return { 'application/pdf': ['.pdf'] };
    return {};
  };

  return (
    <div className="container" style={{ paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
      <SEO 
        title="High Performance File Compression" 
        description="The ultimate online tool for compressing images, videos, and PDFs. Shrink files fast with zero quality loss."
      />
      {/* 3D Background Orbs */}
      <div style={{ position: 'absolute', top: '5%', left: '10%', width: '150px', height: '150px', background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.1))', filter: 'blur(20px)', borderRadius: '50%', zIndex: -1, boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.2), 20px 20px 60px rgba(0,0,0,0.1)' }} className="float-3d"></div>
      <div style={{ position: 'absolute', top: '25%', right: '15%', width: '200px', height: '200px', background: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.1))', filter: 'blur(30px)', borderRadius: '50%', zIndex: -1, boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.2), 20px 20px 60px rgba(0,0,0,0.1)' }} className="float-3d"></div>
      <div style={{ position: 'absolute', bottom: '15%', left: '20%', width: '120px', height: '120px', background: 'radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.3), rgba(236, 72, 153, 0.1))', filter: 'blur(15px)', borderRadius: '50%', zIndex: -1, boxShadow: 'inset -10px -10px 30px rgba(0,0,0,0.2), 10px 10px 40px rgba(0,0,0,0.1)' }} className="float-3d"></div>

      {/* Floating Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50]
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            repeat: Infinity,
            delay: i * 0.5
          }}
          style={{ 
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: '4px',
            height: '4px',
            background: 'var(--accent-color)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            boxShadow: '0 0 10px var(--accent-color)',
            zIndex: -1
          }}
        />
      ))}

      <header id="top" className="section-padding" style={{ textAlign: 'center', paddingBottom: '40px', paddingTop: '40px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '40px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', color: 'var(--accent-color)', fontWeight: '700', marginBottom: '30px', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            <Sparkles size={14} />
            <span>AI-Driven Optimization</span>
          </div>
          <motion.div
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            whileHover={{ rotateX: 2, rotateY: -2 }}
          >
            <h1 className="moving-gradient" style={{ 
              fontSize: 'clamp(2.2rem, 10vw, 5rem)', 
              lineHeight: '1.1', 
              marginBottom: '20px',
              fontWeight: '900',
              letterSpacing: '-1px',
              transform: 'translateZ(50px)'
            }}>
              Shrink Fast.<br /><span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stay Sharp.</span>
            </h1>
            <p style={{ maxWidth: '700px', margin: '0 auto 40px', fontSize: 'clamp(1rem, 4vw, 1.15rem)', color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: '500', opacity: 0.9, transform: 'translateZ(30px)', padding: '0 10px' }}>
              The most advanced browser-side compression engine.<br />
              <span style={{ color: 'var(--text-primary)' }}>Images, Videos, and PDFs</span> optimized in seconds with zero quality loss.
            </p>
          </motion.div>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}>
            <a href="#services" className="btn-primary" style={{ padding: '20px 48px', fontSize: '1.2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}>Start Compressing &rarr;</a>
            <a href="#about" className="btn-secondary" style={{ padding: '20px 48px', fontSize: '1.2rem', borderRadius: '20px' }}>How it Works</a>
          </div>

        </motion.div>
      </header>

      {/* Top Ad Unit */}
      <AdSense adSlot={import.meta.env.VITE_AD_SLOT_TOP || "1234567890"} />

      {!mode ? (
        <>
          <div className="grid-responsive" id="services" style={{ marginTop: '20px', marginBottom: '60px', gap: '30px' }}>
            {[
              { id: 'image', title: 'Image Compressor', icon: <ImageIcon size={40} />, desc: 'Optimize PNG, JPG, & WebP for the web while maintaining pixel perfection.', color: '#3b82f6' },
              { id: 'video', title: 'Video Compressor', icon: <VideoIcon size={40} />, desc: 'Drastically reduce video file sizes for easier sharing and faster uploads.', color: '#8b5cf6' },
              { id: 'pdf', title: 'PDF Optimizer', icon: <FileText size={40} />, desc: 'Shrink your documents for email and storage without losing text clarity.', color: '#ec4899' }
            ].map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ translateY: -12, boxShadow: `0 20px 40px rgba(0,0,0,0.2)` }}
                onClick={() => {
                  selectMode(card.id as Mode);
                  const topElement = document.getElementById('top');
                  if (topElement) {
                    topElement.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="glass hover-3d"
                style={{ padding: '50px 30px', cursor: 'pointer', textAlign: 'center', position: 'relative', overflow: 'hidden', transformStyle: 'preserve-3d' }}
              >
                <div style={{ transform: 'translateZ(30px)' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '20px', 
                    background: `linear-gradient(135deg, ${card.color}20 0%, ${card.color}40 100%)`,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: card.color, 
                    margin: '0 auto 25px',
                    boxShadow: `0 10px 25px ${card.color}20`,
                    border: `1px solid ${card.color}30`
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>{card.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{card.desc}</p>
                </div>
                <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  right: '-20px', 
                  width: '100px', 
                  height: '100px', 
                  background: `radial-gradient(circle, ${card.color}15 0%, transparent 70%)`,
                  zIndex: -1
                }} />
                <div style={{ marginTop: '25px', color: card.color, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.9rem', transform: 'translateZ(20px)' }}>
                  <span>Get Started</span>
                  <Zap size={14} />
                </div>
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

          {/* Middle Ad Unit */}
          <AdSense adSlot={import.meta.env.VITE_AD_SLOT_MIDDLE || "0987654321"} />

          {/* How it Works Section */}
          <section className="section-padding" style={{ position: 'relative', paddingTop: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: '40px' }}
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
                  color: '59, 130, 246'
                },
                { 
                  step: '02', 
                  title: 'AI Compression', 
                  desc: 'Our engine optimizes every pixel and frame to ensure maximum size reduction.',
                  icon: <Cpu size={40} />,
                  color: '139, 92, 246'
                },
                { 
                  step: '03', 
                  title: 'Get Results', 
                  desc: 'Download your optimized files instantly. Fast, secure, and ready to share.',
                  icon: <Download size={40} />,
                  color: '236, 72, 153'
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.6, type: 'spring' }}
                  className="glass hover-3d"
                  style={{ 
                    position: 'relative', 
                    padding: '50px 30px', 
                    textAlign: 'center',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div style={{ transform: 'translateZ(20px)' }}>
                    {/* Step Badge */}
                    <div style={{ 
                      position: 'absolute',
                      top: '-30px',
                      right: '-10px',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      color: `rgb(${item.color})`,
                      background: `rgba(${item.color}, 0.1)`,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: `1px solid rgba(${item.color}, 0.2)`
                    }}>
                      STEP {item.step}
                    </div>

                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '24px', 
                      background: `rgba(${item.color}, 0.1)`, 
                      border: `1px solid rgba(${item.color}, 0.2)`,
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      color: `rgb(${item.color})`,
                      marginBottom: '10px',
                      boxShadow: `0 10px 30px rgba(${item.color}, 0.1)`
                    }}>
                      {item.icon}
                    </div>
                    
                    <div>
                      <h3 style={{ marginBottom: '15px' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="glass section-padding" style={{ margin: '40px 0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(59, 130, 246, 0.05)', filter: 'blur(60px)', borderRadius: '50%' }}></div>
            <div className="grid-responsive">
              {[
                { icon: <Zap size={32} />, title: 'Super Fast', desc: 'Process files in seconds directly in your browser without any server latency.', color: '#3b82f6' },
                { icon: <Shield size={32} />, title: '100% Secure', desc: 'Your data stays on your machine. We never see or store your private files.', color: '#10b981' },
                { icon: <Layers size={32} />, title: 'High Quality', desc: 'Advanced algorithms ensure that your media stays sharp while the file size drops.', color: '#8b5cf6' }
              ].map((feat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                  style={{ textAlign: 'center', padding: '20px' }}
                >
                  <div style={{ background: `${feat.color}15`, width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: feat.color, margin: '0 auto 20px', boxShadow: `0 8px 20px ${feat.color}20` }}>{feat.icon}</div>
                  <h3>{feat.title}</h3>
                  <p style={{ fontSize: '0.95rem' }}>{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Pricing Mock Section */}
          <section className="section-padding" style={{ textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 style={{ marginBottom: '15px' }}>Simple, Transparent Pricing</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Start for free, upgrade as you grow.</p>
              
              <div className="grid-responsive" style={{ maxWidth: '900px', margin: '0 auto', gap: '30px' }}>
                <div className="glass" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Starter</h3>
                  <div style={{ fontSize: '3rem', fontWeight: '900', margin: '20px 0' }}>$0<span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-secondary)' }}>/mo</span></div>
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="#10b981" /> Unlimited Images</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="#10b981" /> 10 Videos / month</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="#10b981" /> Privacy Protection</li>
                  </ul>
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Current Plan</button>
                </div>
                
                <div className="glass" style={{ padding: '40px', textAlign: 'center', border: '2px solid var(--accent-color)', position: 'relative', scale: '1.05' }}>
                  <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-color)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>MOST POPULAR</div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>Pro</h3>
                  <div style={{ fontSize: '3rem', fontWeight: '900', margin: '20px 0' }}>$9<span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-secondary)' }}>/mo</span></div>
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="#10b981" /> Everything in Starter</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="#10b981" /> Unlimited Videos</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="#10b981" /> Priority Support</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={16} color="#10b981" /> Cloud Sync (Coming Soon)</li>
                  </ul>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Upgrade Now</button>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Combined Sections for Single Page Experience */}
          <div id="about" style={{ marginTop: '-40px' }}>
            <About />
          </div>
          <div id="services" style={{ marginTop: '-40px' }}>
            <Services onSelectService={selectMode} />
          </div>
          <div id="contact" style={{ marginTop: '-40px' }}>
            <Contact />
          </div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, x: 20, rotateY: 10 }} 
          animate={{ opacity: 1, x: 0, rotateY: 0 }} 
          className="section-padding perspective-1000"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <button onClick={() => selectMode(null)} className="btn-secondary" style={{ padding: '12px 20px', borderRadius: '16px', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
              &larr; Back to Selection
            </button>
            <h2 style={{ textTransform: 'capitalize', margin: 0, fontSize: '2rem' }}>{mode} <span style={{ color: 'var(--accent-color)' }}>Optimization</span></h2>
          </div>

          <motion.div 
            className="glass" 
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ rotateX: 1, rotateY: -1 }}
          >
            {!file ? (
              <FileUploader 
                onFileSelect={setFile} 
                accept={getAccept()} 
                label={`Select ${mode.toUpperCase()} to compress`} 
              />
            ) : (
              <div style={{ transform: 'translateZ(20px)' }}>
                {mode === 'image' && <ImageCompressor file={file} onReset={reset} />}
                {mode === 'video' && <VideoCompressor file={file} onReset={reset} />}
                {mode === 'pdf' && <PdfCompressor file={file} onReset={reset} />}
                <AdSense adSlot={import.meta.env.VITE_AD_SLOT_RESULTS || "2233445566"} />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for 2.5 seconds
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="app-wrapper" style={{ cursor: 'none' }}>
        <CustomCursor />
        <Toaster position="top-right" />
        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 20000,
                background: '#050505',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '30px',
                overflow: 'hidden'
              }}
            >
              {/* 3D Background Grid */}
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                transform: 'perspective(500px) rotateX(60deg) translateY(-100px)',
                opacity: 0.5,
                zIndex: -1
              }} />

              <div style={{ position: 'relative' }}>
                {/* Pulsing Halo */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '-40px',
                    right: '-40px',
                    bottom: '-40px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                    zIndex: -1
                  }}
                />

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.05)',
                    borderTop: '2px solid var(--accent-color)',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
                  }}
                />
                
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, type: 'spring' }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'var(--primary-gradient)',
                    padding: '15px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Layers size={40} color="white" />
                </motion.div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '900', 
                    letterSpacing: '8px', 
                    textTransform: 'uppercase', 
                    margin: '0 0 10px',
                    background: 'var(--primary-gradient)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 10px 20px rgba(0,0,0,0.5)'
                  }}
                >
                  Shrink-Now
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 1 }}
                  style={{ fontSize: '0.8rem', letterSpacing: '2px', color: 'white', textTransform: 'uppercase' }}
                >
                  Initializing AI Engine...
                </motion.p>
              </div>

              <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                <motion.div
                  initial={{ left: '-100%' }}
                  animate={{ left: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ 
                    position: 'absolute',
                    width: '100px', 
                    height: '100%', 
                    background: 'var(--primary-gradient)', 
                    boxShadow: '0 0 15px var(--accent-color)',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Navbar />
              <main style={{ paddingTop: '100px' }}>
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
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              {/* Bottom Ad Unit */}
              <div className="container">
                <AdSense adSlot={import.meta.env.VITE_AD_SLOT_BOTTOM || "1122334455"} />
              </div>
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
