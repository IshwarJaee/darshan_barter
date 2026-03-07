import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiPhone, FiMail, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/axios';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/misc/contact', form);
      if (res.data.success) { setSent(true); setForm({ name: '', email: '', phone: '', message: '' }); }
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div
  className="relative text-white py-16 px-4"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-blue-200 text-lg">We're here to help. Reach out anytime.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
          <div className="space-y-5">
            {[
              { icon: FiPhone, color: 'bg-green-100 text-green-600', label: 'Phone', val: '+91 91122 23630', href: 'tel:+919112223630' },
              { icon: FiMail, color: 'bg-blue-100 text-blue-600', label: 'Email', val: 'loans@darshanbarter.com', href: 'mailto:loans@darshanbarter.com' },
              { icon: FiMapPin, color: 'bg-red-100 text-red-600', label: 'Address', val: '123 Finance Street, Pune, Maharashtra – 411001', href: null },
            ].map(({ icon: Icon, color, label, val, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{label}</p>
                  {href ? <a href={href} className="text-primary-600 hover:underline text-sm">{val}</a> : <p className="text-gray-500 text-sm">{val}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-800 mb-2">Office Hours</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
              <p>Saturday: 10:00 AM – 3:00 PM</p>
              <p className="text-gray-400">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
              <p className="text-gray-600 text-sm mb-4">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="btn-outline text-sm">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Send a Message</h3>
              {[
                { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
                { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
                { name: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+91 XXXXX XXXXX', required: false },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    required={f.required} placeholder={f.placeholder} className="input-field" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required rows={4} placeholder="How can we help you?"
                  className="input-field resize-none" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</> : <><FiSend size={16} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
