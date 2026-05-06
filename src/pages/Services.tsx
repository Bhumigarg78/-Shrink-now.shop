import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Video as VideoIcon, FileText, Settings, Shield, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface ServicesProps {
  onSelectService?: (type: 'image' | 'video' | 'pdf') => void;
}

const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleServiceClick = (type: string) => {
    if (!isLoggedIn) {
      toast.error('Please login to use our services');
      navigate('/login');
      return;
    }

    if (type === 'hashtags') {
      navigate('/hashtags');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (onSelectService && (type === 'image' || type === 'video' || type === 'pdf')) {
      onSelectService(type);
      const topElement = document.getElementById('top');
      if (topElement) {
        topElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const services = [
    {
      id: 'image',
      title: "Image Compression",
      description: "Lossless and lossy compression for PNG, JPG, and WebP files. Reduce size up to 90% without visible quality loss.",
      icon: <ImageIcon size={32} />,
      color: "#3b82f6"
    },
    {
      id: 'video',
      title: "Video Optimization",
      description: "Compress large MP4, MOV, and MKV files using advanced FFmpeg technology. Perfect for sharing on social media.",
      icon: <VideoIcon size={32} />,
      color: "#8b5cf6"
    },
    {
      id: 'pdf',
      title: "PDF Shrinking",
      description: "Optimize PDF structure and compress embedded images to make your documents lightweight for emailing.",
      icon: <FileText size={32} />,
      color: "#ec4899"
    },
    {
      id: 'hashtags',
      title: "Hashtag Generator",
      description: "AI-powered trending hashtag generator for Instagram, YouTube, and TikTok to boost your social reach.",
      icon: <Hash size={32} />,
      color: "#f59e0b"
    },
    {
      id: 'batch',
      title: "Batch Processing",
      description: "Upload multiple files and process them all at once. Save time with our high-speed processing engine.",
      icon: <Settings size={32} />,
      color: "#10b981"
    },
    {
      id: 'privacy',
      title: "Privacy First",
      description: "All processing happens in your browser. Your files never leave your device, ensuring maximum security.",
      icon: <Shield size={32} />,
      color: "#f59e0b"
    },

  ];

  return (
    <div className="container section-padding">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'left', marginBottom: '40px' }}
      >
        <a href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.9rem', padding: '8px 16px', borderRadius: '12px', background: 'var(--surface-color)', border: '1px solid var(--glass-border)' }}>
          &larr; Back to Home
        </a>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(30px, 5vw, 50px)' }}
      >
        <h1>Our Services</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto' }}>
          Explore our suite of professional tools designed to optimize your digital life. 
          Fast, secure, and incredibly easy to use.
        </p>
      </motion.div>

      <div className="grid-responsive">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ translateY: -10 }}
            className="glass"
            style={{ padding: 'clamp(24px, 5vw, 40px)', display: 'flex', flexDirection: 'column', gap: '20px', cursor: 'pointer' }}
            onClick={() => handleServiceClick(service.id)}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '16px', 
              background: `rgba(59, 130, 246, 0.1)`, 
              color: service.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {service.icon}
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0' }}>{service.title}</h2>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>{service.description}</p>
            {(service.id === 'image' || service.id === 'video' || service.id === 'pdf') && (
              <button 
                className="btn-primary" 
                style={{ width: 'fit-content', padding: '10px 25px' }}
              >
                Try Now
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services;
