import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Globe, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'var(--surface-color)', borderTop: '1px solid var(--glass-border)', paddingTop: 'clamp(30px, 6vw, 60px)', paddingBottom: '40px', marginTop: 'clamp(40px, 7vw, 70px)' }}>
      <div className="container">
        <div className="grid-responsive" style={{ marginBottom: '60px' }}>
          <div style={{ gridColumn: 'span 1', maxWidth: '400px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-gradient)', padding: '6px', borderRadius: '10px' }}>
                <Layers size={20} color="white" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>Shrink-Now.shop</span>
            </Link>
            <p style={{ marginBottom: '25px' }}>
              The world's most advanced browser-based media compression tool. Fast, secure, and professional.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {[Globe, Mail, Heart].map((Icon, idx) => (
                <a key={idx} href="#" className="social-icon" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Product</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/" className="footer-link">Images</Link></li>
                <li><Link to="/" className="footer-link">Videos</Link></li>
                <li><Link to="/" className="footer-link">PDFs</Link></li>
                <li><Link to="/hashtags" className="footer-link">Hashtags</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Company</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/about" className="footer-link">About</Link></li>
                <li><Link to="/services" className="footer-link">Services</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
                <li><Link to="/" className="footer-link">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem' }}>© 2026 Shrink-Now.shop. All rights reserved.</p>
          <p style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> for the web.
          </p>
        </div>
      </div>

      <style>{`
        .footer-link { text-decoration: none; color: var(--text-secondary); font-size: 0.95rem; transition: color 0.3s; }
        .footer-link:hover { color: var(--accent-color); }
        .social-icon:hover { color: var(--text-primary); }
      `}</style>
    </footer>
  );
};

export default Footer;
