import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUsers, FiFileText, FiPackage, FiSettings, FiLogOut, FiX } from 'react-icons/fi';
import logo from '../assets/logo.png';

const links = [
  { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/admin/candidates', icon: FiUsers, label: 'Candidates' },
  { to: '/admin/applications', icon: FiFileText, label: 'Applications' },
  { to: '/admin/products', icon: FiPackage, label: 'Loan Products' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

const AdminSidebar = ({ open, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-navy-900 text-white z-30 flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
  {/* <img 
    src="/src/assets/logo.png" 
    alt="DarshanBarter Logo" 
    className="h-14 w-auto object-contain brightness-0 invert"
  /> */}
</div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white"><FiX size={20} /></button>
        </div>

        {/* User */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-lg font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
