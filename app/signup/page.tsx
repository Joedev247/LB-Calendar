"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from "lucide-react";
import { useApp } from "../../lib/context";

export default function SignupPage() {
  const { register } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Validate on submit as well
    const ok = validateAll();
    if (!ok) {
      setLoading(false);
      return;
    }
    try {
      await register(email, password, name);
      // On successful registration the context stores the token/user,
      // so navigate to the dashboard where the app will load user data.
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateAll = () => {
    const errs: { name?: string; email?: string; password?: string; confirm?: string } = {};

    if (!name || name.trim().length < 2) {
      errs.name = 'Please enter your full name (2+ characters)';
    }

    if (!email || !emailRegex.test(email)) {
      errs.email = 'Please enter a valid email';
    }

    // Password: min 8 chars, at least one uppercase and one number
    if (!password || password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
      errs.password = 'Password must include an uppercase letter and a number';
    }

    if (password !== confirmPassword) {
      errs.confirm = 'Passwords do not match';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Run lightweight validation on field change
  React.useEffect(() => {
    // Only validate when user has typed something to avoid noisy errors
    if (name || email || password || confirmPassword) {
      validateAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, password, confirmPassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.08)_0%,transparent_70%)]">
      <div className="flex w-full max-w-4xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Left Side - Hero */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-[#5D4C8E] via-[#8B7FB1] to-[#4a3a6e] text-white p-10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />
          <div className="mb-8">
            <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" className="mx-auto text-white drop-shadow-lg">
              <path d="M10 2L3 6v5c0 5 7 8 7 8s7-3 7-8V6l-7-4z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-xl">LB Calendar</h1>
          <p className="text-lg font-medium mb-8 text-white/80 max-w-xs text-center">Join the legend. Organize your life, your team, and your dreams.</p>
          <div className="flex flex-col gap-2 mt-8 animate-slide-up">
            <span className="text-sm font-semibold text-white/70">"Greatness starts with a single step."</span>
            <span className="text-xs text-white/50">— LB Calendar Team</span>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 bg-white bg-opacity-80 backdrop-blur-xl rounded-tl-4xl rounded-bl-4xl flex flex-col justify-center items-center p-10 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-[#F3F0F9]/60 to-white/80 pointer-events-none" />
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md z-10 flex flex-col gap-6 animate-slide-up"
          >
            <h2 className="text-3xl font-extrabold text-[#5D4C8E] text-center mb-2 drop-shadow">Sign Up</h2>
            <p className="text-center text-gray-500 mb-4">Create your account and join the legend.</p>
            {error && <div className="text-red-500 text-center text-sm mb-2 animate-shake">{error}</div>}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] bg-white/80 shadow-sm transition-all duration-200"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] bg-white/80 shadow-sm transition-all duration-200"
                required
              />
              {fieldErrors.email && <div className="text-red-500 text-sm mt-1">{fieldErrors.email}</div>}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] bg-white/80 shadow-sm transition-all duration-200 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {fieldErrors.password && <div className="text-red-500 text-sm mt-1">{fieldErrors.password}</div>}
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] bg-white/80 shadow-sm transition-all duration-200 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {fieldErrors.confirm && <div className="text-red-500 text-sm mt-1">{fieldErrors.confirm}</div>}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#5D4C8E] to-[#8B7FB1] text-white font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-200 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
            <div className="text-center text-sm text-gray-500 mt-2">
              Already have an account? <a href="/login" className="text-[#5D4C8E] font-semibold hover:underline">Sign In</a>
            </div>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(.4,0,.2,1);
        }
        .animate-slide-up {
          animation: slideUp .8s cubic-bezier(.4,0,.2,1);
        }
        .animate-shake {
          animation: shake .4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
