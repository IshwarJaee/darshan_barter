import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiX, FiPhone, FiMail, FiCheckCircle, FiClock, FiTrendingUp, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const BG_IMAGE = `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS35oAd6WACU_3sAVpKyq57iQ3r1yvk9sJaVg&s')`;

const CARD_BG_IMAGES = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg/1280px-Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
];

const CARD_OVERLAYS = [
  'rgba(59, 130, 246, 0.75)',
  'rgba(147, 51, 234, 0.75)',
  'rgba(34, 197, 94, 0.75)',
  'rgba(249, 115, 22, 0.75)',
  'rgba(236, 72, 153, 0.75)',
];

const LoanApplyModal = ({ product, contact, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    amount: '',
    tenure_months: product?.tenure_months || 12,
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to apply.'); onClose(); return; }
    setLoading(true);
    try {
      const res = await api.post('/loans/apply', {
        product_id: product.id,
        amount: form.amount,
        tenure_months: form.tenure_months,
        purpose: form.purpose,
      });
      if (res.data.success) {
        setApplied(true);
        onSuccess?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappNumber = (contact?.whatsapp || '919112223630').replace(/[^0-9]/g, '');

// In your JSX
<a
  href={`https://wa.me/${919112223630}?text=${encodeURIComponent('Hello, I am interested in Loan')}`}
  target="_blank"
  rel="noopener noreferrer"
  className="service-btn whatsapp bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
>
  WhatsApp
</a>
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 p-5 rounded-t-2xl flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">{product?.name}</h2>
            <p className="text-blue-200 text-sm mt-0.5">Apply for this loan</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <FiX size={22} />
          </button>
        </div>

        <div className="p-6">
          {applied ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-500" size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 text-sm mb-5">
                Your <strong>{product?.name}</strong> application has been received. A confirmation email has been sent to your registered email.
              </p>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 text-left mb-5">
                <p className="font-semibold text-blue-900 mb-3 text-center">📞 Our Loan Team Will Contact You</p>
                <div className="space-y-3">

                  {/* Call Us */}
                  <a href={`tel:${(contact?.phone || '+919112223630').replace(/\s/g, '')}`}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow border border-blue-100">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiPhone className="text-green-600" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Call Us</p>
                      <p className="font-semibold text-gray-800">{contact?.phone || '+91 91122 23630'}</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow border border-green-200">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">WhatsApp Us</p>
                      <p className="font-semibold text-gray-800">{contact?.whatsapp || '+91 91122 23630'}</p>
                    </div>
                  </a>

                  {/* Email Us */}
                  <a href={`mailto:${contact?.email || 'loans@darshanbarter.com'}`}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow border border-blue-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiMail className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Email Us</p>
                      <p className="font-semibold text-gray-800">{contact?.email || 'loans@darshanbarter.com'}</p>
                    </div>
                  </a>

                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Our team will reach out within 24–48 business hours.
                </p>
              </div>

              <button onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-3 gap-3 text-center text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Interest Rate</p>
                  <p className="font-bold text-blue-600 text-lg">{product?.interest_rate}%</p>
                  <p className="text-gray-400 text-xs">per annum</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Max Amount</p>
                  <p className="font-bold text-gray-800">₹{Number(product?.max_amount).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Max Tenure</p>
                  <p className="font-bold text-gray-800">{product?.tenure_months} mo.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Loan Amount (₹) *</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  required
                  min={product?.min_amount}
                  max={product?.max_amount}
                  placeholder={`₹${Number(product?.min_amount).toLocaleString('en-IN')} – ₹${Number(product?.max_amount).toLocaleString('en-IN')}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tenure (months) *</label>
                <input
                  type="number"
                  value={form.tenure_months}
                  onChange={e => setForm(f => ({ ...f, tenure_months: e.target.value }))}
                  required
                  min={1}
                  max={product?.tenure_months}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Purpose of Loan</label>
                <textarea
                  value={form.purpose}
                  onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                  rows={3}
                  placeholder="Briefly describe the purpose of your loan..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
                  : 'Apply Now →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [contact, setContact] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/loans/products'),
      api.get('/loans/contact-info'),
    ]).then(([pRes, cRes]) => {
      setProducts(pRes.data.products || []);
      setContact(cRes.data.contact);
    }).catch(() => {
      toast.error('Failed to load products. Please refresh.');
    }).finally(() => setLoading(false));
  }, []);

  const handleApply = (product) => {
    if (!user) {
      toast.error('Please login to apply for a loan.');
      navigate('/login');
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <>
      {selectedProduct && (
        <LoanApplyModal
          product={selectedProduct}
          contact={contact}
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => {}}
        />
      )}

      <div className="min-h-screen bg-white">

        {/* Hero with BG image */}
        <div
          className="text-white py-20 px-4 relative overflow-hidden"
          style={{
            backgroundImage: BG_IMAGE,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '260px',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(0, 0, 0, 0.62)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
          />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Our Loan Services</h1>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Flexible loan products designed to meet every financial need — from home purchases to personal expenses.
            </p>
          </div>
        </div>

        {/* Features strip */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            {[
              [FiClock, 'Quick Approval', 'Within 48 hrs'],
              [FiTrendingUp, 'Low Interest', 'From 8.5% p.a.'],
              [FiShield, 'Secure & Safe', '100% encrypted'],
              [FiCheckCircle, 'No Hidden Fees', 'Transparent terms'],
            ].map(([Icon, title, sub]) => (
              <div key={title} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Icon className="text-blue-600" size={20} />
                </div>
                <p className="font-semibold text-gray-800">{title}</p>
                <p className="text-gray-500 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Available Loan Products</h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                  {/* Colored image top section ONLY */}
                  <div
                    className="p-6 text-white relative overflow-hidden"
                    style={{
                      backgroundImage: `url('${CARD_BG_IMAGES[i % CARD_BG_IMAGES.length]}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      minHeight: '140px',
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: CARD_OVERLAYS[i % CARD_OVERLAYS.length] }}
                    />
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold">{p.name}</h3>
                      <p className="text-white/80 text-sm mt-1">{p.description}</p>
                    </div>
                  </div>

                  {/* White bottom section */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-500 text-xs">Interest Rate</p>
                        <p className="font-bold text-blue-600">{p.interest_rate}% p.a.</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-500 text-xs">Max Tenure</p>
                        <p className="font-bold text-gray-800">{p.tenure_months} months</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                        <p className="text-gray-500 text-xs">Loan Amount Range</p>
                        <p className="font-bold text-gray-800">
                          ₹{Number(p.min_amount).toLocaleString('en-IN')} – ₹{Number(p.max_amount).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleApply(p)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors text-sm">
                      Apply Now →
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA with BG image */}
        <div
          className="text-white py-12 px-4 relative overflow-hidden"
          style={{
            backgroundImage: BG_IMAGE,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
          />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-2xl font-bold mb-3">Need Help Choosing a Loan?</h2>
            <p className="text-blue-200 mb-6">Our financial experts are here to guide you every step of the way.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">

              {/* Call */}
              <a href={`tel:${(contact?.phone || '+919112223630').replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                <FiPhone /> {contact?.phone || '+91 91122 23630'}
              </a>

              {/* WhatsApp */}
              <a href={`https://wa.me/${(contact?.whatsapp || '919112223630').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>

              {/* Email */}
              <a href={`mailto:${contact?.email || 'loans@darshanbarter.com'}`}
                className="flex items-center justify-center gap-2 bg-white/20 text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all">
                <FiMail /> {contact?.email || 'loans@darshanbarter.com'}
              </a>

            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Services;