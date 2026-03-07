import { useState, useEffect } from 'react';
import { FiMenu, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import AdminSidebar from '../../components/AdminSidebar';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const StatusBadge = ({ status }) => (
  <span className={`badge-${status} capitalize`}>{status?.replace('_', ' ')}</span>
);

const AdminApplications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', remarks: '' });

  const fetchApps = () => {
    setLoading(true);
    api.get('/loans/all-applications')
      .then(res => setApplications(res.data.applications || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  const openEdit = (app) => {
    setEditModal(app);
    setEditForm({ status: app.status, remarks: app.remarks || '' });
  };

  const saveStatus = async () => {
    try {
      await api.patch(`/loans/applications/${editModal.id}/status`, editForm);
      toast.success('Status updated!');
      setEditModal(null);
      fetchApps();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500"><FiMenu size={20} /></button>
          <h1 className="text-lg font-bold text-gray-800">All Applications</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Edit modal */}
          {editModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-slideIn">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">Update Application #{editModal.id}</h3>
                  <button onClick={() => setEditModal(null)}><FiX className="text-gray-400" /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                    <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className="input-field">
                      {['pending', 'under_review', 'approved', 'rejected', 'disbursed'].map(s => (
                        <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks</label>
                    <textarea value={editForm.remarks} onChange={e => setEditForm(f => ({ ...f, remarks: e.target.value }))}
                      rows={3} className="input-field resize-none" placeholder="Add remarks..." />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={saveStatus} className="btn-primary flex items-center gap-1.5 flex-1 justify-center"><FiCheck size={15} /> Save</button>
                  <button onClick={() => setEditModal(null)} className="btn-outline flex-1">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b border-gray-100 text-xs uppercase">
                    <th className="pb-3 font-medium">Applicant</th>
                    <th className="pb-3 font-medium hidden sm:table-cell">Product</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="py-3.5">
                          <p className="font-medium text-gray-800">{a.user_name}</p>
                          <p className="text-gray-400 text-xs">{a.user_email}</p>
                        </td>
                        <td className="py-3.5 text-gray-600 hidden sm:table-cell">{a.product_name}</td>
                        <td className="py-3.5 text-gray-600">₹{Number(a.amount).toLocaleString('en-IN')}</td>
                        <td className="py-3.5"><StatusBadge status={a.status} /></td>
                        <td className="py-3.5">
                          <button onClick={() => openEdit(a)} className="p-2 hover:bg-primary-50 rounded-lg text-primary-600 transition-colors">
                            <FiEdit2 size={15} />
                          </button>
                        </td>
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

export default AdminApplications;
