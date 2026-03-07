import { useState, useEffect } from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

const AdminCandidates = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/candidates')
      .then(res => { setCandidates(res.data.candidates || []); setFiltered(res.data.candidates || []); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(candidates.filter(c =>
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.city || '').toLowerCase().includes(q)
    ));
  }, [search, candidates]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500"><FiMenu size={20} /></button>
          <h1 className="text-lg font-bold text-gray-800">Candidates</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-4 relative max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, city..."
              className="input-field pl-9" />
          </div>
          <div className="card">
            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b border-gray-100 text-xs uppercase">
                    <th className="pb-3 font-medium">Candidate</th>
                    <th className="pb-3 font-medium hidden md:table-cell">City</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Employment</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Monthly Inc.</th>
                    <th className="pb-3 font-medium">Applications</th>
                    <th className="pb-3 font-medium hidden sm:table-cell">Joined</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {c.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{c.name}</p>
                              <p className="text-gray-400 text-xs">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-gray-600 hidden md:table-cell">{c.city || '—'}</td>
                        <td className="py-3.5 text-gray-600 hidden lg:table-cell capitalize">{c.employment_type || '—'}</td>
                        <td className="py-3.5 text-gray-600 hidden lg:table-cell">{c.monthly_income ? `₹${Number(c.monthly_income).toLocaleString('en-IN')}` : '—'}</td>
                        <td className="py-3.5 text-center font-semibold text-primary-600">{c.total_applications}</td>
                        <td className="py-3.5 text-gray-400 hidden sm:table-cell">{new Date(c.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && <p className="text-center text-gray-500 py-8">No candidates found.</p>}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCandidates;
