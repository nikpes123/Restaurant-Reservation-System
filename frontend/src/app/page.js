'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleUserTypeSelect = (type) => {
    setSelectedRole(type === 'customer' ? 'Customer' : 'Restaurant');
    setStep(2);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: selectedRole })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || (data.errors && data.errors[0]?.msg) || 'Signup failed');
        setLoading(false);
        return;
      }
      setStep(3);
      setLoginForm({ email: form.email, password: '' });
      setForm({ name: '', email: '', password: '' });
      setSelectedRole(null);
      setError('');
      setLoading(false);
    } catch (err) {
      setError('Signup failed. Please try again.');
      setLoading(false);
    }
  };

  const handleLoginInputChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.msg || (data.errors && data.errors[0]?.msg) || 'Login failed');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', data.token);
      setIsModalOpen(false);
      setStep(1);
      setLoginForm({ email: '', password: '' });
      setLoginError('');
      setLoading(false);
      router.push('/dashboard');
    } catch (err) {
      setLoginError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setStep(1);
    setForm({ name: '', email: '', password: '' });
    setSelectedRole(null);
    setError('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75"
          style={{ backgroundImage: "url('/homepage.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Reserve Your Perfect Dining Experience
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Discover and book tables at the finest restaurants in your city. Browse menus, select your preferred table, and make special requests - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 text-lg text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="text-blue-600 text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">Easy Reservations</h3>
              <p className="text-gray-600">Book your table in seconds with our intuitive reservation system.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="text-blue-600 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Menu Preview</h3>
              <p className="text-gray-600">Browse restaurant menus and plan your meal before you arrive.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="text-blue-600 text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Real Reviews</h3>
              <p className="text-gray-600">Read authentic reviews from fellow diners to make informed choices.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Reserve?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied diners who have discovered their perfect dining experience.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 text-lg bg-white text-blue-600 rounded-lg shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* User Type Selection & Signup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join as</h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleUserTypeSelect('customer')}
                    className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => handleUserTypeSelect('restaurant')}
                    className="px-6 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all transform hover:scale-105"
                  >
                    Restaurant Owner
                  </button>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-gray-600 text-sm">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Login
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <form onSubmit={handleSignup} className="flex flex-col gap-4 mt-2">
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Sign Up as {selectedRole}</h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 placeholder-gray-800"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 placeholder-gray-800"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 placeholder-gray-800"
                  required
                  minLength={6}
                />
                {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:underline text-sm mt-2"
                >
                  &larr; Back
                </button>
              </form>
            )}
            {step === 3 && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Login</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={handleLoginInputChange}
                  className="border-2 border-gray-700 text-gray-900 rounded px-4 py-2 placeholder-gray-800 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={handleLoginInputChange}
                    className="border-2 border-gray-700 text-gray-900 rounded px-4 py-2 placeholder-gray-800 w-full focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                  >
                    {/* Eye SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  </button>
                </div>
                {loginError && <div className="text-red-600 text-sm text-center">{loginError}</div>}
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Logging In...' : 'Login'}
                </button>
                <div className="text-center mt-2">
                  <span className="text-gray-600 text-sm">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Sign up
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:underline text-sm mt-2"
                >
                  &larr; Back
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
