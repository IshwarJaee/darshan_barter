import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiPhone, FiMail, FiShield, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';

const stats = [
  { label: 'Happy Customers', value: '10,000+', icon: FiUsers },
  { label: 'Loans Disbursed', value: '₹500 Cr+', icon: FiTrendingUp },
  { label: 'Success Rate', value: '98%', icon: FiAward },
  { label: 'Years of Trust', value: '15+', icon: FiShield },
];

const features = [
  { icon: '⚡', title: 'Quick Approval', desc: 'Get loan approval within 24-48 hours with minimal documentation.' },
  { icon: '💰', title: 'Competitive Rates', desc: 'Interest rates starting from 8.5% per annum – best in the market.' },
  { icon: '🔒', title: 'Safe & Secure', desc: 'Bank-grade security to keep your personal & financial data safe.' },
  { icon: '📱', title: 'Digital Process', desc: 'Complete your loan application entirely online from your device.' },
  { icon: '🎯', title: 'Tailored Solutions', desc: 'Customized loan packages to match your specific requirements.' },
  { icon: '🤝', title: 'Expert Guidance', desc: 'Dedicated loan advisors to help you through every step.' },
];

const loanTypes = ['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Vehicle Loan'];

const Home = () => (
  <div>
    {/* Hero */}
    <section
  className="text-white py-20 px-4 relative overflow-hidden "
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://www.shutterstock.com/image-illustration/blue-money-business-graph-finance-600nw-2166540277.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backdropFilter: 'blur(4px)',
    }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full mb-5">
            🏆 Trusted Finance Partner
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
            Your Dream, <br />
            <span className="text-primary-300">Our Financing.</span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed mb-8">
            Get instant access to personal, home, business, and education loans at the most competitive rates. 
            Fast approval, zero hidden charges.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3">
              Get Started Free <FiArrowRight />
            </Link>
            <Link to="/services" className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              Explore Loans
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            {['No Hidden Charges', 'Quick Disbursal', 'Flexible EMI'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-sm text-blue-200">
                <FiCheckCircle className="text-green-400" size={14} /> {t}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Available Loan Types</h3>
            <div className="space-y-3">
              {loanTypes.map((t, i) => (
                <div key={t} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                  <span className="text-white text-sm font-medium">{t}</span>
                  <span className="text-primary-300 text-xs font-semibold">
                    {['12.5%', '8.5%', '14%', '10.5%', '9.5%'][i]} p.a.
                  </span>
                </div>
              ))}
            </div>
            <Link to="/services" className="block mt-4 text-center text-primary-300 text-sm hover:text-white transition-colors">
              View all loan Services →
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="text-center">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon className="text-primary-600" size={22} />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-navy-700">{value}</p>
            <p className="text-gray-500 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Choose DarshanBarter?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">We combine technology and expertise to deliver fast, fair, and flexible financial solutions.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="card hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1.5">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="bg-gradient-to-r from-navy-700 to-primary-600 py-14 px-4 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Apply for a Loan?</h2>
        <p className="text-blue-200 mb-8">Join thousands of happy customers who trusted DarshanBarter for their financial needs.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register" className="bg-white text-navy-700 px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all">
            Start Your Application
          </Link>
          <a href="tel:+91 91122 23630"
            className="flex items-center justify-center gap-2 border border-white/40 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all">
            <FiPhone /> Call Us Now
          </a>
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Register', desc: 'Create your free account in just 2 minutes.' },
            { step: '02', title: 'Apply', desc: 'Choose a loan product and fill your application.' },
            { step: '03', title: 'Get Funded', desc: 'Receive approval and disbursement within 48 hrs.' },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-navy-700 to-primary-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Home;
