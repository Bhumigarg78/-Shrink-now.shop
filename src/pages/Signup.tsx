import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../utils/api';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Account created successfully!');
      navigate('/');
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '40px 20px', overflow: 'hidden' }}>
      {/* Background Decorative Elements */}
      <div style={{ position: 'absolute', top: '15%', right: '5%', width: '350px', height: '350px', background: 'var(--secondary-gradient)', filter: 'blur(130px)', opacity: 0.15, borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: '300px', height: '300px', background: 'var(--primary-gradient)', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%', zIndex: 0 }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass" 
        style={{ 
          width: '100%', 
          maxWidth: '500px', 
          padding: '50px 40px', 
          position: 'relative', 
          zIndex: 1,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Back Button */}
        <Link 
          to="/" 
          style={{ 
            position: 'absolute', 
            left: '30px', 
            top: '30px', 
            color: 'var(--text-secondary)', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            fontSize: '0.85rem',
            fontWeight: '500',
            transition: 'color 0.3s'
          }}
          className="hover-text-primary"
        >
          <ChevronLeft size={16} /> Back
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            style={{ 
              display: 'inline-flex', 
              background: 'var(--primary-gradient)', 
              padding: '16px', 
              borderRadius: '20px', 
              marginBottom: '20px',
              boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
            }}
          >
            <UserPlus size={28} color="white" />
          </motion.div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Create Account</h2>
          <p style={{ fontSize: '1rem' }}>Join Shrink-Now.shop today and start optimizing</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--glass-border)', borderRadius: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'all 0.3s' }}
                className="input-focus-glow"
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--glass-border)', borderRadius: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'all 0.3s' }}
                className="input-focus-glow"
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--glass-border)', borderRadius: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'all 0.3s' }}
                className="input-focus-glow"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem', borderRadius: '14px', marginTop: '10px' }}>
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: '700', textDecoration: 'none' }}>Log In <ArrowRight size={16} style={{ verticalAlign: 'middle', marginLeft: '4px' }} /></Link>
          </p>
        </div>
      </motion.div>

      <style>{`
        .input-focus-glow:focus {
          border-color: var(--accent-color) !important;
          background: rgba(59, 130, 246, 0.05) !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
        }
        .hover-text-primary:hover {
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default Signup;
