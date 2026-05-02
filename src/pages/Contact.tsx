import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="container section-padding">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
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
                  <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>San Francisco, CA</p>
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
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <input type="text" placeholder="John Doe" style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '12px', 
                  padding: '12px 16px', 
                  color: 'white',
                  outline: 'none'
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input type="email" placeholder="john@example.com" style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '12px', 
                  padding: '12px 16px', 
                  color: 'white',
                  outline: 'none'
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Subject</label>
              <input type="text" placeholder="How can we help?" style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px', 
                padding: '12px 16px', 
                color: 'white',
                outline: 'none'
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message</label>
              <textarea rows={5} placeholder="Write your message here..." style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px', 
                padding: '12px 16px', 
                color: 'white',
                outline: 'none',
                resize: 'none'
              }}></textarea>
            </div>
            <button className="btn-primary" style={{ marginTop: '10px', justifyContent: 'center' }}>
              <Send size={18} /> Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
