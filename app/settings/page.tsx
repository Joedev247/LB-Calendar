'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Save, LogOut, Lock, Shield, 
  Building2, Check, X, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useApp } from '../../lib/context';
import { usersAPI, authAPI } from '../../lib/api';
import toast from 'react-hot-toast';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  department?: string;
  role?: string;
}

const departments = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Mobile Developer',
  'DevOps Developer',
  'Cloud Engineer',
  'Figma Designer',
  'Tester',
  'Penetration Tester',
  'AI Engineer',
  'Data Analyst',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Support',
  'Other'
];

export default function SettingsPage() {
  const { user, logout } = useApp();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('account');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load user profile
  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        department: user.department || 'Other',
        role: user.role || 'user'
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!profile || !user) return;

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Validate inputs
      if (!profile.name.trim()) {
        setErrorMessage('Name is required');
        setIsSaving(false);
        return;
      }

      if (!profile.email.trim()) {
        setErrorMessage('Email is required');
        setIsSaving(false);
        return;
      }

      // Update profile via API
      const response = await usersAPI.update(user.id, {
        name: profile.name.trim(),
        email: profile.email.trim(),
        department: profile.department || 'Other'
      });

      // Refresh user data from API
      try {
        const meResponse = await authAPI.getMe();
        const updatedUser = meResponse.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfile(updatedUser);
        
        // Trigger a page reload to update context
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (refreshError) {
        // If refresh fails, update from response
        const updatedUser = {
          ...user,
          name: response.data.name,
          email: response.data.email,
          department: response.data.department || user.department
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfile(updatedUser);
      }

      setSuccessMessage('Profile updated successfully!');
      toast.success('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to update profile';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lb-calendar-backend.onrender.com/api';
      const response = await fetch(`${API_BASE_URL}/settings/security/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
      console.error('Error changing password:', error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Navigation sections
  const sections = [
    {
      id: 'account',
      label: 'Account Settings',
      icon: User,
      description: 'Manage your profile information'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Change password and security settings'
    }
  ];

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#00bf63] to-[#008c47]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#00bf63] to-[#008c47] overflow-hidden animate-page-fade-in">
      {/* Main Container */}
      <div className="flex w-full max-h-screen">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col rounded-tl-4xl rounded-bl-4xl bg-white overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
          {/* Header Component */}
          <Header />

          {/* Settings Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Settings Navigation */}
            <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-6 sticky top-0 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Settings</h2>
                <p className="text-sm text-gray-500 mb-6">Manage your account and preferences</p>
                
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-[#00bf63] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{section.label}</div>
                            <div className={`text-xs ${
                              activeSection === section.id ? 'text-white/80' : 'text-gray-500'
                            }`}>
                              {section.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto py-8 px-12 min-h-full">
                {/* Success Message */}
                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    {successMessage}
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    {errorMessage}
                  </div>
                )}

                {/* Account Settings */}
                {activeSection === 'account' && profile && (
                  <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-[#00bf63] rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {profile.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                            <p className="text-sm text-gray-500">Update your account details</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <User className="inline w-4 h-4 mr-1" />
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profile.name}
                              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent transition-all"
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Mail className="inline w-4 h-4 mr-1" />
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent transition-all"
                              placeholder="Enter your email"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Building2 className="inline w-4 h-4 mr-1" />
                              Department
                            </label>
                            <select
                              value={profile.department || 'Other'}
                              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent transition-all"
                            >
                              {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                  {dept}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Role
                            </label>
                            <input
                              type="text"
                              value={profile.role || 'user'}
                              disabled
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-2.5 bg-[#00bf63] text-white rounded-lg hover:bg-[#008c47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-4 h-4" />
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setActiveSection('security')}
                          className="p-4 rounded-lg border border-gray-200 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
                            <Lock className="w-4 h-4 text-blue-500" />
                          </div>
                          <span className="font-medium text-gray-700">Change Password</span>
                        </button>
                        <button
                          onClick={logout}
                          className="p-4 rounded-lg border border-gray-200 flex items-center gap-3 hover:bg-red-50 hover:border-red-200 transition-colors"
                        >
                          <div className="w-8 h-8 bg-red-500 bg-opacity-10 rounded-full flex items-center justify-center">
                            <LogOut className="w-4 h-4 text-red-500" />
                          </div>
                          <span className="font-medium text-red-600">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeSection === 'security' && (
                  <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-[#00bf63] bg-opacity-10 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-[#00bf63]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                          <p className="text-sm text-gray-500">Manage your account security</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">Change Password</h4>
                            <p className="text-sm text-gray-500">Update your account password</p>
                          </div>
                          <Lock className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowPasswordModal(false)}
          />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-modal-slide-in">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00bf63] bg-opacity-10 rounded-full flex items-center justify-center">
                      <Lock className="w-5 h-5 text-[#00bf63]" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent pr-10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#00bf63] rounded-lg hover:bg-[#008c47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
