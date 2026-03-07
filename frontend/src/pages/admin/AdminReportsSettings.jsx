import { useState } from 'react';
import { FiMenu, FiLock, FiSave } from 'react-icons/fi';
import AdminSidebar from '../../components/AdminSidebar';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const AdminReportsSettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleChangePass = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    setSaving(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500"><FiMenu size={20} /></button>
          <h1 className="text-lg font-bold text-gray-800">Settings</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-lg">
            <div className="card">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <FiLock className="text-primary-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
              </div>
              <form onSubmit={handleChangePass} className="space-y-4">
                {[
                  { name: 'currentPassword', label: 'Current Password' },
                  { name: 'newPassword', label: 'New Password' },
                  { name: 'confirmPassword', label: 'Confirm New Password' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                    <input type="password" value={passForm[f.name]} onChange={e => setPassForm(p => ({ ...p, [f.name]: e.target.value }))}
                      required className="input-field" />
                  </div>
                ))}
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : <><FiSave size={16} />Update Password</>}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReportsSettings;
