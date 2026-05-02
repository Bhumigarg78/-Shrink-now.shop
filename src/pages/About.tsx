import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Shield, Award, BarChart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container section-padding">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(60px, 10vw, 100px)' }}
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
        <div className="grid-responsive" style={{ marginBottom: 'clamp(60px, 10vw, 100px)' }}>
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
        <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', marginBottom: 'clamp(60px, 10vw, 100px)' }}>
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
          <h2 style={{ marginBottom: '60px' }}>Our Core Values</h2>
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
