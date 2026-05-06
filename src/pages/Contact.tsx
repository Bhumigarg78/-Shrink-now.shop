import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="container section-padding">
      <SEO 
        title="Contact Us" 
        description="Have questions or feedback? Get in touch with the Shrink-Now.shop team for support and inquiries."
      />
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
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h1>Get in Touch</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto' }}>
          Have questions or feedback? We'd love to hear from you. Our team is here to help you optimize your workflow.
        </p>
      </motion.div>

      <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', alignItems: 'start' }}>
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
        >
          <div className="glass" style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '30px' }}>Contact Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--accent-color)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Email Us</p>
                  <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>support@shrink-now.shop</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--accent-color)' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Call Us</p>
                  <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>+1 (555) 000-0000</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--accent-color)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', marginBottom: '2px' }}>Visit Us</p>
                  <p style={{ fontSize: '1.5rem', marginBottom: '5px', padding: '5px 10px', background: 'var(--surface-color)', border: '1px solid var(--accent-color)', color: 'var(--text-primary)', borderRadius: '8px', width: '100%' }}>San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Follow Us</h2>
            <div style={{ display: 'flex', gap: '15px' }}>
              {[
                { icon: <Globe size={20} />, link: "#" },
                { icon: <Mail size={20} />, link: "#" },
                { icon: <MessageSquare size={20} />, link: "#" }
              ].map((social, i) => (
                <a key={i} href={social.link} style={{ 
                  width: '45px', 
                  height: '45px', 
                  borderRadius: '50%', 
                  background: 'var(--surface-hover)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--text-secondary)',
                  transition: '0.3s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-color)'; e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--surface-hover)'; }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass" 
          style={{ padding: '40px' }}
        >
          <h2 style={{ marginBottom: '30px' }}>Send us a message</h2>
          <form action="https://formspree.io/f/xvzlqpde" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <input type="text" name="name" placeholder="John Doe" required style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '12px', 
                  padding: '12px 16px', 
                  color: 'var(--text-primary)',
                  outline: 'none'
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input type="email" name="email" placeholder="john@example.com" required style={{ 
                  background: 'var(--surface-color)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '12px', 
                  padding: '12px 16px', 
                  color: 'var(--text-primary)',
                  outline: 'none'
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Subject</label>
              <input type="text" name="subject" placeholder="How can we help?" style={{ 
                background: 'var(--surface-color)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px', 
                padding: '12px 16px', 
                color: 'var(--text-primary)',
                outline: 'none'
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message</label>
              <textarea name="message" rows={5} placeholder="Write your message here..." required style={{ 
                background: 'var(--surface-color)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px', 
                padding: '12px 16px', 
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'none'
              }}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '10px', justifyContent: 'center' }}>
              <Send size={18} /> Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
