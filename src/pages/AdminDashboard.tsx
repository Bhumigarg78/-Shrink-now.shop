import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, FileText, Activity, Shield, ArrowLeft, Loader2, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../utils/api';

interface Stats {
  totalUsers: number;
  totalCompressions: number;
  recentUsers: any[];
  recentCompressions: any[];
  settings?: {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
  };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch admin stats');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const toggleSetting = async (setting: 'maintenanceMode' | 'registrationEnabled') => {
    const currentValue = stats?.settings?.[setting] || false;
    const newValue = !currentValue;
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/admin/settings`,
        { [setting]: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setStats({
        ...stats,
        settings: res.data.settings
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update setting');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
      </div>
    );
  }

  return (
    <div className="admin-panel-container container section-padding" style={{ minHeight: '100vh' }}>
      <style>{`
        /* Cyan/Indigo shade for Admin Panel in Light Mode */
        html[data-theme="light"] .admin-panel-container {
          --surface-color: rgba(236, 254, 255, 0.8);
          --glass-border: rgba(6, 182, 212, 0.25);
          --accent-color: #0891b2;
          --text-primary: #164e63;
          --text-secondary: #0891b2;
          background: linear-gradient(135deg, #ecfeff 0%, #e0e7ff 100%);
          border-radius: 24px;
        }
        
        html[data-theme="light"] .admin-panel-container .glass {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(236, 72, 153, 0.3);
          box-shadow: 0 8px 32px 0 rgba(236, 72, 153, 0.1);
        }

        .admin-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .admin-badge {
          margin-left: auto;
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent-color);
          padding: 6px 15px;
          borderRadius: 20px;
          fontSize: 0.8rem;
          fontWeight: bold;
          display: flex;
          alignItems: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          .admin-badge {
            margin-left: 0;
          }
          .admin-panel-container {
            border-radius: 0 !important;
          }
          .stats-card {
            padding: 20px !important;
            gap: 15px !important;
          }
          .stats-icon {
            width: 50px !important;
            height: 50px !important;
          }
        }
      `}</style>
      <div className="admin-header">
        <Link to="/" className="btn-secondary" style={{ padding: '10px', borderRadius: '12px' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ margin: 0 }}>Admin <span style={{ color: 'var(--accent-color)' }}>Panel</span></h1>
        <div className="admin-badge">
          <Shield size={14} />
          Super Admin Access
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-responsive" style={{ gap: '25px', marginBottom: '40px' }}>
        {[
          { title: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: '#3b82f6' },
          { title: 'Total Compressions', value: stats?.totalCompressions || 0, icon: <FileText size={24} />, color: '#10b981' },
          { title: 'Server Status', value: 'Active', icon: <Activity size={24} />, color: '#8b5cf6' }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass stats-card"
            style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '25px' }}
          >
            <div className="stats-icon" style={{ background: `${item.color}15`, width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
              {item.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{item.title}</p>
              <h2 style={{ margin: 0 }}>{item.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid-responsive" style={{ gap: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))' }}>
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass"
          style={{ padding: '30px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ margin: 0 }}>Recent Users</h3>
            <Users size={18} color="var(--text-secondary)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {stats?.recentUsers.map((user, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                  {user.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                  <Calendar size={12} />
                  <span className="hide-mobile">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass"
          style={{ padding: '30px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ margin: 0 }}>Recent Compressions</h3>
            <Activity size={18} color="var(--text-secondary)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {stats?.recentCompressions?.length ? stats.recentCompressions.map((comp, i) => (
              <div key={i} style={{ padding: '15px', borderRadius: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comp.fileName}</span>
                  <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0 }}>-{comp.compressionRatio}%</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                  <span>{comp.fileType.toUpperCase()}</span>
                  <span>{(comp.originalSize / 1024 / 1024).toFixed(2)} MB &rarr; {(comp.compressedSize / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No recent activity found.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Admin Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ marginTop: '40px', padding: '30px' }}
      >
        <h3>Platform Settings</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage core platform functionality and access.</p>
        <div className="grid-responsive" style={{ gap: '20px', marginTop: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => toggleSetting('maintenanceMode')}
              className="btn-secondary" 
              style={{ width: '100%', padding: '15px', justifyContent: 'space-between', borderColor: stats?.settings?.maintenanceMode ? '#ef4444' : 'var(--glass-border)', color: stats?.settings?.maintenanceMode ? '#ef4444' : 'inherit' }}
            >
              <span>Maintenance Mode</span>
              <span style={{ fontWeight: 'bold' }}>{stats?.settings?.maintenanceMode ? 'ON' : 'OFF'}</span>
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>If ON, users cannot access the app.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => toggleSetting('registrationEnabled')}
              className="btn-secondary" 
              style={{ width: '100%', padding: '15px', justifyContent: 'space-between', borderColor: stats?.settings?.registrationEnabled ? '#10b981' : '#ef4444', color: stats?.settings?.registrationEnabled ? '#10b981' : '#ef4444' }}
            >
              <span>User Registration</span>
              <span style={{ fontWeight: 'bold' }}>{stats?.settings?.registrationEnabled ? 'ON' : 'OFF'}</span>
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Allow new users to sign up.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="glass" style={{ width: '100%', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7 }}>
              <span>API Status</span>
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>Healthy</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current connection status.</span>
          </div>

        </div>
      </motion.div>
    </div>

  );
};

export default AdminDashboard;
