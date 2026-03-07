import { useState, useEffect } from 'react';
import { FiMenu, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import AdminSidebar from '../../components/AdminSidebar';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const defaultForm = { name: '', description: '', min_amount: '', max_amount: '', interest_rate: '', tenure_months: '', is_active: true };

const AdminProducts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | product obj
  const [form, setForm] = useState(defaultForm);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/loans/products').then(res => setProducts(res.data.products || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setForm(defaultForm); setModal('add'); };
  const openEdit = (p) => { setForm({ ...p }); setModal(p); };

  const handleSave = async () => {
    try {
      if (modal === 'add') {
        await api.post('/loans/products', form);
        toast.success('Product added!');
      } else {
        await api.put(`/loans/products/${modal.id}`, form);
        toast.success('Product updated!');
      }
      setModal(null);
      fetchProducts();
    } catch {
      toast.error('Save failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this product?')) return;
    try {
      await api.delete(`/loans/products/${id}`);
      toast.success('Product deactivated.');
      fetchProducts();
    } catch {
      toast.error('Failed.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500"><FiMenu size={20} /></button>
            <h1 className="text-lg font-bold text-gray-800">Loan Products</h1>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2">
            <FiPlus /> Add Product
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {modal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-slideIn max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">{modal === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
                  <button onClick={() => setModal(null)}><FiX className="text-gray-400" /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Product Name', col: 2 },
                    { key: 'description', label: 'Description', col: 2, textarea: true },
                    { key: 'min_amount', label: 'Min Amount (₹)', type: 'number' },
                    { key: 'max_amount', label: 'Max Amount (₹)', type: 'number' },
                    { key: 'interest_rate', label: 'Interest Rate (%)', type: 'number' },
                    { key: 'tenure_months', label: 'Max Tenure (months)', type: 'number' },
                  ].map(f => (
                    <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                      {f.textarea
                        ? <textarea value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} rows={2} className="input-field resize-none" />
                        : <input type={f.type || 'text'} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="input-field" />}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={handleSave} className="btn-primary flex-1">Save</button>
                  <button onClick={() => setModal(null)} className="btn-outline flex-1">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(p => (
              <div key={p.id} className="card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-800">{p.name}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg"><FiEdit2 size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4">{p.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Rate</p><p className="font-bold text-primary-600">{p.interest_rate}% p.a.</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400">Tenure</p><p className="font-bold">{p.tenure_months} mo.</p></div>
                  <div className="bg-gray-50 rounded-lg p-2 col-span-2"><p className="text-gray-400">Amount Range</p>
                    <p className="font-bold">₹{Number(p.min_amount).toLocaleString('en-IN')} – ₹{Number(p.max_amount).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProducts;
