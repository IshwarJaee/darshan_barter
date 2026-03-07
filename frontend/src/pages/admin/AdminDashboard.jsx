import { useState, useEffect } from 'react';
import { FiMenu, FiUsers, FiFileText, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

const StatusBadge = ({ status }) => (
  <span className={`badge-${status} capitalize`}>{status?.replace('_', ' ')}</span>
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin')
      .then(res => { setStats(res.data.stats); setRecent(res.data.recentApplications); })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Candidates', value: stats.total_users, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Total Applications', value: stats.total_applications, icon: FiFileText, color: 'bg-purple-500' },
    { label: 'Pending Review', value: stats.pending, icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Approved Loans', value: stats.approved, icon: FiCheckCircle, color: 'bg-green-500' },
    { label: 'Total Approved Amt', value: stats.total_amount ? `₹${Number(stats.total_amount).toLocaleString('en-IN')}` : '₹0', icon: FiDollarSign, color: 'bg-emerald-600' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500"><FiMenu size={20} /></button>
          <h1 className="text-lg font-bold text-gray-800">Admin Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
            <p className="text-gray-500 mt-1">All system metrics at a glance.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {statCards.map(s => (
              <div key={s.label} className="card">
                <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon className="text-white" size={18} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{loading ? '—' : s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">Recent Loan Applications</h3>
            {loading ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent" /></div>
            ) : recent.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No applications yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b border-gray-100 text-xs uppercase">
                    <th className="pb-3 font-medium">Applicant</th>
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Date</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {recent.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="py-3.5 font-medium text-gray-800">{a.user_name}</td>
                        <td className="py-3.5 text-gray-600">{a.product_name}</td>
                        <td className="py-3.5 text-gray-600">₹{Number(a.amount).toLocaleString('en-IN')}</td>
                        <td className="py-3.5"><StatusBadge status={a.status} /></td>
                        <td className="py-3.5 text-gray-400 hidden md:table-cell">{new Date(a.applied_at).toLocaleDateString()}</td>
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

export default AdminDashboard;
