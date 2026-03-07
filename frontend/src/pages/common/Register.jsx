import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'candidate' });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setServerError('');
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const passwordStrength = (p) => {
    if (!p) return { label: '', color: '', width: '0%' };
    if (p.length < 6)                      return { label: 'Weak',   color: 'bg-red-400',    width: '25%' };
    if (p.length < 8 || !/[A-Z]/.test(p)) return { label: 'Fair',   color: 'bg-yellow-400', width: '50%' };
    if (!/[0-9]/.test(p))                  return { label: 'Good',   color: 'bg-blue-400',   width: '75%' };
    return                                        { label: 'Strong', color: 'bg-green-500',  width: '100%' };
  };
  const strength = passwordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!form.name.trim())                        { toast.error('Please enter your full name.');          return; }
    if (!form.email.trim())                       { toast.error('Please enter your email address.');      return; }
    if (form.password.length < 6)                 { toast.error('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword)   { toast.error('Passwords do not match!');               return; }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: form.name.trim(), email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password, role: form.role,
      });
      if (res.data.success) { setSuccess(true); toast.success('Account created successfully!'); }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed. Please try again.';
      setServerError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiCheckCircle className="text-green-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful! 🎉</h2>
          <p className="text-gray-600 mb-1">Welcome, <strong>{form.name}</strong>!</p>
          <p className="text-gray-500 text-sm mb-6">
            A welcome email has been sent to <span className="font-medium text-blue-600">{form.email}</span>.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left mb-6">
            <p className="text-blue-700 text-sm font-semibold mb-2">📧 Check your inbox for:</p>
            <ul className="text-blue-600 text-xs space-y-1 list-disc list-inside">
              <li>Account confirmation details</li>
              <li>Quick login link</li>
              <li>Getting started guide</li>
            </ul>
          </div>
          <button onClick={() => navigate('/login')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors">
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-t-2xl p-6 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FiUser className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-blue-200 text-sm mt-1">Join DarshanBarter today — it's free</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {serverError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
              <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-red-700 text-sm">{serverError}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Enter your full name"
                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com"
                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"
                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required placeholder="Min. 6 characters"
                className="w-full pl-9 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                </div>
                <p className="text-xs mt-1 text-gray-500">Strength: <span className="font-semibold">{strength.label}</span></p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Re-enter your password"
                className={`w-full pl-9 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${form.confirmPassword && form.confirmPassword !== form.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {form.confirmPassword && form.confirmPassword !== form.password && <p className="text-xs text-red-500 mt-1">⚠ Passwords do not match</p>}
            {form.confirmPassword && form.confirmPassword === form.password && form.password && <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>}
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Register As</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="candidate">Candidate / Loan Applicant</option>
              <option value="admin">Administrator</option>
            </select>
          </div> */}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mt-2">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating Account...</> : 'Create Account →'}
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;