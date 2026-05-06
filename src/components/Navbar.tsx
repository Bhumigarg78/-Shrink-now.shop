import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, User, LogIn, UserPlus, LogOut, Menu, X, Sun, Moon, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const navigate = useNavigate();
  
  // Real auth state
  const [user, setUser] = React.useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  const isLoggedIn = !!localStorage.getItem('token');

  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Initialize theme
    document.documentElement.setAttribute('data-theme', theme);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: 'top', type: 'scroll' },
    { name: 'About', path: 'about', type: 'scroll' },
    { name: 'Services', path: 'services', type: 'scroll' },
    { name: 'Hashtags', path: 'hashtags', type: 'scroll' },
    { name: 'Contact', path: 'contact', type: 'scroll' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string, type: string) => {
    if (type === 'scroll') {
      e.preventDefault();
      const element = document.getElementById(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(`/#${path}`);
      }
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 navbar-glass" style={{ padding: isScrolled ? '12px 0' : '20px 0', boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '8px', borderRadius: '12px' }}>
            <Layers size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Shrink-Now<span style={{ color: 'var(--accent-color)' }}>.shop</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ display: 'flex', gap: '25px' }}>
            {navLinks.map((link) => (
              link.type === 'link' ? (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="nav-link" 
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '1.05rem', transition: 'color 0.3s', cursor: 'pointer' }}
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={`#${link.path}`}
                  onClick={(e) => handleNavClick(e, link.path, link.type)} 
                  className="nav-link" 
                  style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '1.05rem', transition: 'color 0.3s', cursor: 'pointer' }}
                >
                  {link.name}
                </a>
              )
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '20px', paddingLeft: '20px', borderLeft: '1px solid var(--glass-border)' }}>
            <button 
              onClick={toggleTheme} 
              className="theme-toggle" 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: '0.3s' }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isLoggedIn ? (
              <>
                {(user?.role === 'admin' || user?.email?.toLowerCase().trim() === 'bhumigarg704@gmail.com') && (
                  <Link to="/admin" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>
                    <Shield size={18} /> Admin
                  </Link>
                )}
                <Link to="/profile" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} /> Profile
                </Link>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', border: '1px solid #ef4444', color: '#ef4444' }}>
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" style={{ padding: '8px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LogIn size={18} /> Login
                </Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '8px 28px', fontSize: '1rem' }}>
                  <UserPlus size={18} /> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ 
              background: 'var(--surface-color)', 
              borderTop: '1px solid var(--glass-border)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px'
            }}
          >
            {navLinks.map((link) => (
              link.type === 'link' ? (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    padding: '15px 0', 
                    textDecoration: 'none', 
                    color: 'var(--text-secondary)',
                    borderBottom: '1px solid var(--glass-border)',
                    fontSize: '1.1rem',
                    cursor: 'pointer'
                  }}
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={`#${link.path}`}
                  onClick={(e) => handleNavClick(e, link.path, link.type)}
                  style={{ 
                    padding: '15px 0', 
                    textDecoration: 'none', 
                    color: 'var(--text-secondary)',
                    borderBottom: '1px solid var(--glass-border)',
                    fontSize: '1.1rem',
                    cursor: 'pointer'
                  }}
                >
                  {link.name}
                </a>
              )
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <button 
                onClick={toggleTheme} 
                className="btn-secondary" 
                style={{ justifyContent: 'center', gap: '10px' }}
              >
                {theme === 'dark' ? <><Sun size={20} /> Light Mode</> : <><Moon size={20} /> Dark Mode</>}
              </button>
              {isLoggedIn ? (
                <>
                  {(user?.role === 'admin' || user?.email?.toLowerCase().trim() === 'bhumigarg704@gmail.com') && <Link to="/admin" onClick={() => setIsOpen(false)} className="btn-secondary" style={{ textAlign: 'center', color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>Admin Panel</Link>}
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="btn-secondary" style={{ textAlign: 'center' }}>Profile</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn-secondary" style={{ color: '#ef4444', borderColor: '#ef4444' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary" style={{ textAlign: 'center' }}>Login</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary" style={{ textAlign: 'center' }}>Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-link:hover { color: var(--text-primary) !important; }
        .theme-toggle:hover { color: var(--text-primary) !important; transform: rotate(15deg); }
        @media (max-width: 968px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
