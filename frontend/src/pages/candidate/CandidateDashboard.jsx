import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiFileText, FiClock, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import CandidateSidebar from '../../components/CandidateSidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const StatusBadge = ({ status }) => (
  <span className={`badge-${status} capitalize`}>{status?.replace('_', ' ')}</span>
);

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/candidate')
      .then(res => { setStats(res.data.stats); setRecent(res.data.recentApplications); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CandidateSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <FiMenu size={20} />
            </button>
            <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="text-gray-500 mt-1">Here's an overview of your loan applications.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Applications', value: stats.total, icon: FiFileText, color: 'bg-blue-500' },
              { label: 'Pending Review', value: stats.pending, icon: FiClock, color: 'bg-yellow-500' },
              { label: 'Approved', value: stats.approved, icon: FiCheckCircle, color: 'bg-green-500' },
            ].map(s => (
              <div key={s.label} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{s.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{loading ? '—' : s.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center`}>
                    <s.icon className="text-white" size={22} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to="/services" className="flex items-center gap-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center"><FiTrendingUp className="text-white" /></div>
                <div><p className="font-semibold text-gray-800 text-sm">Apply for a Loan</p><p className="text-gray-500 text-xs">Browse all loan products</p></div>
              </Link>
              <Link to="/my-applications" className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><FiFileText className="text-white" /></div>
                <div><p className="font-semibold text-gray-800 text-sm">My Applications</p><p className="text-gray-500 text-xs">Track application status</p></div>
              </Link>
            </div>
          </div>

          {/* Recent */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">Recent Applications</h3>
            {loading ? (
              <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent" /></div>
            ) : recent.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-500 mb-3">No applications yet.</p>
                <Link to="/services" className="btn-primary text-sm">Apply for your first loan</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium hidden sm:table-cell">Date</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {recent.map(app => (
                      <tr key={app.id}>
                        <td className="py-3 font-medium text-gray-800">{app.product_name}</td>
                        <td className="py-3 text-gray-600">₹{Number(app.amount).toLocaleString('en-IN')}</td>
                        <td className="py-3"><StatusBadge status={app.status} /></td>
                        <td className="py-3 text-gray-400 hidden sm:table-cell">{new Date(app.applied_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;
