import { useState, useEffect } from 'react';
import { FiMenu, FiUser, FiSave } from 'react-icons/fi';
import CandidateSidebar from '../../components/CandidateSidebar';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const StatusBadge = ({ status }) => (
  <span className={`badge-${status} capitalize`}>{status?.replace('_', ' ')}</span>
);

export const MyApplications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/loans/my-applications')
      .then(res => setApplications(res.data.applications || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CandidateSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500"><FiMenu size={20} /></button>
          <h1 className="text-lg font-bold text-gray-800">My Applications</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="card">
            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent" /></div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-500">No loan applications yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b border-gray-100 text-xs uppercase">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Tenure</th>
                    <th className="pb-3 font-medium">Rate</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Applied On</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="py-3.5 text-gray-400 font-mono">#{app.id}</td>
                        <td className="py-3.5 font-medium text-gray-800">{app.product_name}</td>
                        <td className="py-3.5 text-gray-600">₹{Number(app.amount).toLocaleString('en-IN')}</td>
                        <td className="py-3.5 text-gray-600">{app.tenure_months} mo.</td>
                        <td className="py-3.5 text-gray-600">{app.interest_rate}%</td>
                        <td className="py-3.5"><StatusBadge status={app.status} /></td>
                        <td className="py-3.5 text-gray-400 hidden md:table-cell">{new Date(app.applied_at).toLocaleDateString()}</td>
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

export const CandidateProfile = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', state: '', pincode: '',
    dob: '', gender: '', employment_type: '', monthly_income: '', pan_number: '', aadhar_number: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/candidates/profile')
      .then(res => {
        const p = res.data.profile;
        setForm({
          name: p.name || '', phone: p.phone || '', address: p.address || '',
          city: p.city || '', state: p.state || '', pincode: p.pincode || '',
          dob: p.dob?.split('T')[0] || '', gender: p.gender || '',
          employment_type: p.employment_type || '', monthly_income: p.monthly_income || '',
          pan_number: p.pan_number || '', aadhar_number: p.aadhar_number || '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/candidates/profile', form);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CandidateSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500"><FiMenu size={20} /></button>
          <h1 className="text-lg font-bold text-gray-800">My Profile</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent" /></div> : (
            <form onSubmit={handleSubmit} className="max-w-2xl">
              <div className="card mb-5">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{user?.name}</p>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'name', label: 'Full Name', type: 'text' },
                    { name: 'phone', label: 'Phone Number', type: 'tel' },
                    { name: 'dob', label: 'Date of Birth', type: 'date' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">{f.label}</label>
                      <input type={f.type} value={form[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                        className="input-field" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Gender</label>
                    <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} className="input-field">
                      <option value="">Select gender</option>
                      {['male', 'female', 'other'].map(g => <option key={g} value={g} className="capitalize">{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="card mb-5">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Street Address</label>
                    <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="input-field" />
                  </div>
                  {['city', 'state', 'pincode'].map(f => (
                    <div key={f}>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 capitalize">{f}</label>
                      <input value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} className="input-field" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card mb-5">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Financial Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Employment Type</label>
                    <select value={form.employment_type} onChange={e => setForm(p => ({ ...p, employment_type: e.target.value }))} className="input-field">
                      <option value="">Select type</option>
                      {['salaried', 'self-employed', 'business', 'student', 'other'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Monthly Income (₹)</label>
                    <input type="number" value={form.monthly_income} onChange={e => setForm(p => ({ ...p, monthly_income: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">PAN Number</label>
                    <input value={form.pan_number} onChange={e => setForm(p => ({ ...p, pan_number: e.target.value.toUpperCase() }))} placeholder="ABCDE1234F" className="input-field font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Aadhar Number</label>
                    <input value={form.aadhar_number} onChange={e => setForm(p => ({ ...p, aadhar_number: e.target.value }))} placeholder="XXXX XXXX XXXX" className="input-field font-mono" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : <><FiSave size={16} />Save Profile</>}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};
