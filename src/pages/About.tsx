import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Target, Users, Zap, Shield, Award, BarChart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container section-padding">
      <SEO 
        title="About Us" 
        description="Learn more about Shrink-Now.shop, the fastest AI-powered file compression platform for all your media needs."
      />
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Hero Section */}
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

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 60px)' }}
        >
          <div style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '40px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '25px', fontSize: '0.9rem' }}>
            Our Story
          </div>
          <h1>We're redefining media optimization.</h1>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>
            Shrink-Now.shop started with a simple goal: to make the web faster and more accessible by providing high-performance compression tools that anyone can use, right in their browser.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid-responsive" style={{ marginBottom: 'clamp(40px, 6vw, 60px)' }}>
          {[
            { label: 'Files Compressed', value: '10M+' },
            { label: 'Storage Saved', value: '500TB' },
            { label: 'Happy Users', value: '1M+' },
            { label: 'Countries', value: '150+' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass" 
              style={{ padding: '30px', textAlign: 'center' }}
            >
              <h2 style={{ marginBottom: '5px', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</h2>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', marginBottom: 'clamp(40px, 6vw, 60px)' }}>
          <motion.div 
            whileHover={{ translateY: -5 }}
            className="glass" 
            style={{ padding: 'clamp(30px, 5vw, 50px)' }}
          >
            <div style={{ color: 'var(--accent-color)', marginBottom: '25px' }}><Target size={48} /></div>
            <h2>The Vision</h2>
            <p>
              To become the global standard for digital asset optimization, ensuring that every piece of media shared online is as efficient as it is beautiful.
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ translateY: -5 }}
            className="glass" 
            style={{ padding: 'clamp(30px, 5vw, 50px)' }}
          >
            <div style={{ color: 'var(--accent-color)', marginBottom: '25px' }}><Users size={48} /></div>
            <h2>The Team</h2>
            <p>
              We are a remote-first team of engineers, designers, and media experts dedicated to pushing the boundaries of what's possible with WebAssembly.
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '40px' }}>Our Core Values</h2>
          <div className="grid-responsive" style={{ textAlign: 'left' }}>
            {[
              { icon: <Zap />, title: 'Performance', desc: 'We obsess over speed and efficiency in everything we build.' },
              { icon: <Shield />, title: 'Security', desc: 'Your data belongs to you. We never store your files.' },
              { icon: <Award />, title: 'Quality', desc: 'We ensure professional results with every compression.' },
              { icon: <BarChart />, title: 'Simplicity', desc: 'Complex technology, delivered through a simple interface.' }
            ].map((value, i) => (
              <div key={i}>
                <div style={{ color: 'var(--accent-color)', marginBottom: '15px' }}>{value.icon}</div>
                <h3 style={{ marginBottom: '10px' }}>{value.title}</h3>
                <p style={{ fontSize: '0.95rem' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
