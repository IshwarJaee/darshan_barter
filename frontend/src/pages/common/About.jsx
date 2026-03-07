import { FiTarget, FiEye, FiHeart } from 'react-icons/fi';

const About = () => (
  <div className="min-h-screen">
    <div
  className="relative text-white py-16 px-4"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://t3.ftcdn.net/jpg/03/74/17/10/240_F_374171040_3ConfJdUnehpuIgP429tS1d8F1q1kQVe.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">About Darshan Barter</h1>
        <p className="text-blue-200 text-lg">Empowering financial dreams since 2009</p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Founded in 2009, DarshanBarter has grown from a small lending startup into one of India's most trusted digital finance platforms. 
            We believe that every individual deserves access to fair and transparent financial services.
          </p>
          <p className="text-gray-600 leading-relaxed">
            With over ₹500 crore in disbursed loans and 10,000+ satisfied customers, 
            we continue to innovate in the financial services space, making loans accessible to all.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['10,000+', 'Happy Customers'], ['₹500Cr+', 'Loans Disbursed'], ['98%', 'Approval Rate'], ['15+', 'Years of Trust']].map(([val, lab]) => (
            <div key={lab} className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-5 text-center">
              <p className="text-3xl font-extrabold text-navy-700">{val}</p>
              <p className="text-gray-500 text-sm mt-1">{lab}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          { icon: FiTarget, color: 'text-red-500 bg-red-50', title: 'Our Mission', desc: 'To democratize access to financial products by offering transparent, fair, and fast lending solutions to every Indian.' },
          { icon: FiEye, color: 'text-blue-500 bg-blue-50', title: 'Our Vision', desc: 'To be India\'s most trusted digital lending platform, known for integrity, innovation and customer-first service.' },
          { icon: FiHeart, color: 'text-pink-500 bg-pink-50', title: 'Our Values', desc: 'Transparency, respect, integrity and customer delight guide every decision we make at DarshanBarter.' },
        ].map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className="card text-center">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Icon size={26} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-navy-700 to-primary-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Our Team</h2>
        <p className="text-blue-200 mb-6 max-w-xl mx-auto">
          A diverse team of financial experts, technologists and customer advocates working together to build the future of finance.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {['Finance Experts', 'Tech Innovators', 'Customer Champions', 'Risk Analysts'].map(t => (
            <span key={t} className="bg-white/15 border border-white/20 text-white text-sm px-4 py-2 rounded-full">{t}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default About;
