import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Settings, LogOut, Loader2, ShieldCheck, FileText, Image as ImageIcon, Video as VideoIcon, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCompressionHistory } from '../utils/api';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        // Fetch User Profile
        const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        setUser(profileData);

        // Fetch History
        const historyData = await getCompressionHistory();
        setHistory(historyData);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndHistory();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSaved = history.reduce((acc, curr) => acc + (curr.originalSize - curr.compressedSize), 0);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
    </div>
  );

  return (
    <div className="container section-padding">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass" 
          style={{ padding: '40px', position: 'relative', overflow: 'hidden', marginBottom: '30px' }}
        >
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--primary-gradient)', filter: 'blur(100px)', opacity: 0.3 }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px', position: 'relative', flexWrap: 'wrap' }}>
            <div style={{ width: 'clamp(80px, 15vw, 100px)', height: 'clamp(80px, 15vw, 100px)', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>
              {user?.name?.[0].toUpperCase()}
            </div>
            <div style={{ minWidth: '200px' }}>
              <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '5px' }}>{user?.name}</h1>
              <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                <ShieldCheck size={16} color="#10b981" /> Verified Professional
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div className="glass" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> Email Address
              </p>
              <h3 style={{ fontSize: '1.1rem' }}>{user?.email}</h3>
            </div>
            <div className="glass" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} /> Member Since
              </p>
              <h3 style={{ fontSize: '1.1rem' }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</h3>
            </div>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ flex: '1 1 auto' }}><Settings size={18} /> Edit Profile</button>
            <button onClick={handleLogout} className="btn-secondary" style={{ color: '#ef4444', borderColor: '#ef4444', flex: '1 1 auto' }}><LogOut size={18} /> Logout</button>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Total Compressions', value: history.length },
            { label: 'Total Storage Saved', value: formatSize(totalSaved) },
            { label: 'Account Type', value: 'Free' }
          ].map((stat, idx) => (
            <div key={idx} className="glass" style={{ padding: '25px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>{stat.label}</p>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>{stat.value}</h2>
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={24} color="var(--accent-color)" /> Recent Activity
        </h2>
        
        <div className="glass" style={{ overflow: 'hidden' }}>
          {history.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '15px 20px' }}>File</th>
                    <th style={{ padding: '15px 20px' }}>Type</th>
                    <th style={{ padding: '15px 20px' }}>Savings</th>
                    <th style={{ padding: '15px 20px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '15px 20px' }}>
                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.fileName}
                        </div>
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
                          {item.fileType === 'image' && <ImageIcon size={16} />}
                          {item.fileType === 'video' && <VideoIcon size={16} />}
                          {item.fileType === 'pdf' && <FileText size={16} />}
                          <span style={{ textTransform: 'capitalize' }}>{item.fileType}</span>
                        </div>
                      </td>
                      <td style={{ padding: '15px 20px' }}>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>{item.compressionRatio}%</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {formatSize(item.originalSize - item.compressedSize)} saved
                        </div>
                      </td>
                      <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No history found. Start compressing files to see your activity here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
