
"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from "lucide-react";
import { useApp } from "../../lib/context";

export default function LoginPage() {
  const { login, loginWithOAuth } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      // navigate to the dashboard after successful login
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async () => {
    setOAuthLoading(true);
    setError("");
    try {
      await loginWithOAuth();
      // User will be redirected to OAuth provider, so no need to navigate
    } catch (err: any) {
      setError(err.response?.data?.error || "OAuth login failed");
      setOAuthLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-[#00bf63] via-[#00a655] to-[#008c47] animate-page-fade-in">
      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden bg-gradient-to-r from-[#00bf63] to-[#00a655] text-white p-6 flex items-center gap-3 animate-slide-down">
        <span className="text-xl font-bold">LB Calendar</span>
      </div>

      {/* Left Side - Hero (Full Height) */}
      <div className="hidden lg:flex flex-col justify-center items-start w-1/2 bg-gradient-to-br from-[#00bf63] via-[#00a655] to-[#008c47] text-white p-16 relative overflow-hidden animate-slide-in-left">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-12">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm  flex items-center justify-center mb-8 shadow-lg">
              <svg width="36" height="36" viewBox="0 0 20 20" fill="currentColor" className="text-white">
                <path d="M10 2L3 6v5c0 5 7 8 7 8s7-3 7-8V6l-7-4z" />
              </svg>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">LB Calendar</h1>
            <p className="text-xl lg:text-2xl font-medium mb-12 text-white/90 leading-relaxed max-w-md">
              Organize your life, your team, and your dreams. Built for legends, by legends.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Team Collaboration</h3>
                <p className="text-white/70 text-sm">Work seamlessly with your team</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Smart Scheduling</h3>
                <p className="text-white/70 text-sm">Never miss an important event</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Boost Productivity</h3>
                <p className="text-white/70 text-sm">Get more done in less time</p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/20">
            <p className="text-base font-medium text-white/80 italic">"Productivity is the key to greatness."</p>
            <p className="text-sm text-white/60 mt-2">— LB Calendar Team</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (Full Height) */}
      <div className="w-full lg:w-1/1 rounded-tl-4xl rounded-bl-4xl bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4 lg:p-8 relative h-screen overflow-hidden animate-slide-in-right">
        <div className="w-full max-w-sm flex flex-col justify-center h-full py-35">
          <div className="mb-3 lg:mb-4 animate-fade-in-up">
            <h2 className="text-xl flex items-center justify-center lg:text-3xl font-extrabold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-gray-600 text-xs flex items-center justify-center lg:text-sm">Sign in to continue to your account</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-2.5 flex-1 flex flex-col justify-center animate-fade-in-up-delay"
          >
            {error && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-600 text-xs animate-shake mb-2">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent bg-white shadow-sm transition-all duration-200 text-sm"
                  required
                />
              </div>
              
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent bg-white shadow-sm transition-all duration-200 pr-10 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-1.5 text-gray-600">
                <input type="checkbox" className="w-3.5 h-3.5 text-[#00bf63] border-gray-300 rounded focus:ring-[#00bf63]" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-[#00bf63] font-medium hover:underline">Forgot password?</a>
            </div>
            
            <button
              type="submit"
              disabled={loading || oauthLoading}
              className="w-full py-2 bg-gradient-to-r from-[#00bf63] to-[#00a655] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            
            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* OAuth Button */}
            <button
              type="button"
              onClick={handleOAuthLogin}
              disabled={loading || oauthLoading}
              className="w-full py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm shadow-sm hover:bg-gray-50 hover:border-[#00bf63] hover:text-[#00bf63] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {oauthLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>Sign in with Looping Binary</span>
                </>
              )}
            </button>

            <div className="text-center text-xs text-gray-500 pt-1">
              Don't have an account?{' '}
              <a href="/signup" className="text-[#00bf63] font-semibold hover:underline transition-colors">
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-page-fade-in {
          animation: pageFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-slide-down {
          animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }
        .animate-fade-in-up-delay {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
        }
        .animate-shake {
          animation: shake .4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
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
