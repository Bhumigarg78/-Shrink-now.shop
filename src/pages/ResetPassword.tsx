import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock, Loader2, ArrowRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../utils/api';

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      toast.success(res.data.message);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ maxWidth: '450px', width: '100%', textAlign: 'center', padding: '40px' }}>
          <CheckCircle size={60} color="#10b981" style={{ marginBottom: '20px' }} />
          <h2>Password Reset!</h2>
          <p>Your password has been successfully updated. Redirecting to login...</p>
          <Link to="/login" className="btn-primary" style={{ marginTop: '20px', width: '100%' }}>Go to Login</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '40px 20px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'var(--primary-gradient)', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%', zIndex: 0 }}></div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ width: '100%', maxWidth: '480px', padding: '50px 40px', position: 'relative', zIndex: 1 }}>
        <Link to="/login" style={{ position: 'absolute', left: '30px', top: '30px', color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
          <ChevronLeft size={16} /> Back to Login
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', background: 'var(--primary-gradient)', padding: '16px', borderRadius: '20px', marginBottom: '20px' }}>
            <Lock size={28} color="white" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Set New Password</h2>
          <p>Please enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--glass-border)', borderRadius: '14px', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--glass-border)', borderRadius: '14px', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem', borderRadius: '14px' }}>
            {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
