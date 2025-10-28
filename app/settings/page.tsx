'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Save, LogOut, Bell, Lock, Palette, 
  Moon, Sun, Globe, Shield, Clock, ChevronRight,
  Calendar, Users, BellRing, Check, X
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useApp } from '../../lib/context';
import {
  getSettings,
  updateAccountSettings,
  updateNotificationSettings,
  updateAppearanceSettings,
  updateCalendarSettings,
  updatePrivacySettings,
  updateTeamSettings,
  changePassword,
  toggle2FA
} from '../../lib/settingsApi';
import type { Settings } from '../../lib/types/settings';

export default function SettingsPage() {
  const { user, logout } = useApp();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('account');
  const [successMessage, setSuccessMessage] = useState('');

  // Load initial settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getSettings();
        setSettings(settings);
      } catch (error) {
        console.error('Error loading settings:', error);
        if (!user) {
          // Redirect to login if not authenticated
          window.location.href = '/login';
        }
      }
    };
    loadSettings();
  }, [user]);

  const handleSave = async (section: string, data: any) => {
    setIsSaving(true);
    try {
      let updatedSettings;
      switch (section) {
        case 'account':
          updatedSettings = await updateAccountSettings(data);
          break;
        case 'notifications':
          updatedSettings = await updateNotificationSettings(data);
          break;
        case 'appearance':
          updatedSettings = await updateAppearanceSettings(data);
          break;
        case 'calendar':
          updatedSettings = await updateCalendarSettings(data);
          break;
        case 'privacy':
          updatedSettings = await updatePrivacySettings(data);
          break;
        case 'team':
          updatedSettings = await updateTeamSettings(data);
          break;
        default:
          throw new Error('Invalid section');
      }
      
      setSettings(prev => ({ ...prev, ...updatedSettings } as Settings));
      setSuccessMessage('Settings updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSaving(false);
    }
  };

  // Navigation sections
  const sections = [
    {
      id: 'account',
      label: 'Account Settings',
      icon: User,
      description: 'Manage your account details and preferences'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Configure how you want to receive notifications'
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel of your calendar'
    },
    {
      id: 'calendar',
      label: 'Calendar Settings',
      icon: Calendar,
      description: 'Set your calendar preferences and defaults'
    },
    {
      id: 'team',
      label: 'Team Management',
      icon: Users,
      description: 'Manage team members and permissions'
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: Shield,
      description: 'Control your privacy and security settings'
    }
  ];

  const renderAccountSettings = () => (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={settings?.name || ''}
                onChange={(e) => setSettings(prev => ({ ...prev!, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={settings?.email || ''}
                onChange={(e) => setSettings(prev => ({ ...prev!, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => handleSave('account', {
              name: settings?.name,
              email: settings?.email
            })}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-[#5D4C8E] text-white rounded-lg hover:bg-[#4a3a6e] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Notification Preferences Quick Access */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            <p className="text-sm text-gray-500">Control how you receive notifications</p>
          </div>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {['Email Notifications', 'Push Notifications', 'Event Reminders'].map((pref) => (
            <div key={pref} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{pref}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={pref === 'Email Notifications' ? settings?.notifications?.email?.systemNotifications :
                          pref === 'Push Notifications' ? settings?.notifications?.push?.enabled :
                          pref === 'Event Reminders' ? settings?.notifications?.email?.eventReminders : false}
                  onChange={(e) => {
                    const value = e.target.checked;
                    const updatedSettings = {
                      ...settings!,
                      notifications: {
                        ...settings!.notifications,
                        email: {
                          ...settings!.notifications.email,
                          ...(pref === 'Email Notifications' ? { systemNotifications: value } :
                             pref === 'Event Reminders' ? { eventReminders: value } : {})
                        },
                        push: {
                          ...settings!.notifications.push,
                          ...(pref === 'Push Notifications' ? { enabled: value } : {})
                        }
                      }
                    };
                    setSettings(updatedSettings as Settings);
                    handleSave('notifications', { notifications: updatedSettings.notifications });
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D4C8E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D4C8E]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Export Calendar', icon: Calendar, color: 'bg-blue-500' },
            { label: 'Manage Team', icon: Users, color: 'bg-green-500' },
            { label: 'Privacy Settings', icon: Shield, color: 'bg-purple-500' },
            { label: 'Sign Out', icon: LogOut, color: 'bg-red-500', danger: true }
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => action.danger && logout()}
              className={`p-4 rounded-lg border border-gray-200 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                action.danger ? 'hover:bg-red-50 hover:border-red-200' : ''
              }`}
            >
              <div className={`w-8 h-8 ${action.color} bg-opacity-10 rounded-full flex items-center justify-center`}>
                <action.icon className={`w-4 h-4 ${action.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`font-medium ${action.danger ? 'text-red-600' : 'text-gray-700'}`}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
          <p className="text-sm text-gray-500">Customize when and how you want to be notified</p>
        </div>
        <BellRing className="w-5 h-5 text-[#5D4C8E]" />
      </div>
      <div className="space-y-6">
        {[
          { title: 'Event Reminders', description: 'Get notified before your events' },
          { title: 'Task Deadlines', description: 'Receive notifications for upcoming deadlines' },
          { title: 'Team Updates', description: 'Stay informed about team activities' },
          { title: 'System Notifications', description: 'Important updates about your account' }
        ].map((setting) => (
          <div key={setting.title} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{setting.title}</h4>
              <p className="text-sm text-gray-500">{setting.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D4C8E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D4C8E]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Theme Settings</h3>
            <p className="text-sm text-gray-500">Customize your calendar's appearance</p>
          </div>
          <Palette className="w-5 h-5 text-[#5D4C8E]" />
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {true ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Theme Mode</h4>
                <p className="text-sm text-gray-500">Switch between light and dark mode</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings?.appearance?.theme === 'dark'}
                onChange={(e) => {
                  const theme = e.target.checked ? 'dark' : 'light';
                  const updatedSettings = {
                    ...settings!,
                    appearance: {
                      ...settings!.appearance,
                      theme
                    }
                  };
                  setSettings(updatedSettings as Settings);
                  handleSave('appearance', { appearance: updatedSettings.appearance });
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D4C8E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D4C8E]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendarSettings = () => (
    <div className="space-y-6">
      {/* Calendar Display */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Calendar Display</h3>
            <p className="text-sm text-gray-500">Customize how your calendar is displayed</p>
          </div>
          <Calendar className="w-5 h-5 text-[#5D4C8E]" />
        </div>
        <div className="space-y-6">
          {[
            { title: 'Week Starts On', options: ['Sunday', 'Monday'] },
            { title: 'Default View', options: ['Month', 'Week', 'Day', 'Agenda'] },
            { title: 'Time Format', options: ['12-hour', '24-hour'] },
          ].map((setting) => (
            <div key={setting.title} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{setting.title}</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
                value={
                  setting.title === 'Week Starts On'
                    ? settings?.calendar?.weekStartsOn === 0 ? 'sunday' : 'monday'
                    : setting.title === 'Default View'
                    ? settings?.calendar?.defaultView
                    : setting.title === 'Time Format'
                    ? settings?.calendar?.timeFormat
                    : ''
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const updatedSettings = {
                    ...settings!,
                    calendar: {
                      ...settings!.calendar,
                      ...(setting.title === 'Week Starts On'
                        ? { weekStartsOn: value === 'sunday' ? 0 : 1 }
                        : setting.title === 'Default View'
                        ? { defaultView: value }
                        : setting.title === 'Time Format'
                        ? { timeFormat: value }
                        : {})
                    }
                  };
                  setSettings(updatedSettings as Settings);
                  handleSave('calendar', { calendar: updatedSettings.calendar });
                }}
              >
                {setting.options.map(option => (
                  <option key={option} value={option.toLowerCase()}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
            <p className="text-sm text-gray-500">Set your working hours for better scheduling</p>
          </div>
          <Clock className="w-5 h-5 text-[#5D4C8E]" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={settings?.calendar?.workingHours?.start}
              onChange={(e) => {
                const updatedSettings = {
                  ...settings!,
                  calendar: {
                    ...settings!.calendar,
                    workingHours: {
                      ...settings!.calendar.workingHours,
                      start: e.target.value
                    }
                  }
                };
                setSettings(updatedSettings);
                handleSave('calendar', { calendar: updatedSettings.calendar });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={settings?.calendar?.workingHours?.end}
              onChange={(e) => {
                const updatedSettings = {
                  ...settings!,
                  calendar: {
                    ...settings!.calendar,
                    workingHours: {
                      ...settings!.calendar.workingHours,
                      end: e.target.value
                    }
                  }
                };
                setSettings(updatedSettings);
                handleSave('calendar', { calendar: updatedSettings.calendar });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamSettings = () => (
    <div className="space-y-6">
      {/* Team Members */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <p className="text-sm text-gray-500">Manage your team and their permissions</p>
          </div>
          <Users className="w-5 h-5 text-[#5D4C8E]" />
        </div>
        <div className="space-y-4">
          {[
            { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
            { name: 'Jane Smith', email: 'jane@example.com', role: 'Member' },
          ].map((member) => (
            <div key={member.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#5D4C8E] rounded-full flex items-center justify-center text-white font-medium">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent">
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button className="text-red-600 hover:text-red-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#5D4C8E] text-white rounded-lg hover:bg-[#4a3a6e] transition-colors">
          <Users className="w-4 h-4" />
          Invite Team Member
        </button>
      </div>

      {/* Team Settings */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Settings</h3>
        <div className="space-y-4">
          {[
            'Allow members to create events',
            'Allow members to edit team settings',
            'Allow members to invite others',
          ].map((setting) => (
            <div key={setting} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{setting}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={setting === 'Allow members to create events'
                    ? settings?.teamSettings?.allowMembersCreateEvents
                    : setting === 'Allow members to edit team settings'
                    ? settings?.teamSettings?.allowMembersEditSettings
                    : settings?.teamSettings?.allowMembersInvite}
                  onChange={(e) => {
                    const value = e.target.checked;
                    const updatedSettings = {
                      ...settings!,
                      teamSettings: {
                        ...settings!.teamSettings,
                        ...(setting === 'Allow members to create events'
                          ? { allowMembersCreateEvents: value }
                          : setting === 'Allow members to edit team settings'
                          ? { allowMembersEditSettings: value }
                          : { allowMembersInvite: value })
                      }
                    };
                    setSettings(updatedSettings as Settings);
                    handleSave('team', { teamSettings: updatedSettings.teamSettings });
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D4C8E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D4C8E]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
            <p className="text-sm text-gray-500">Control your calendar privacy</p>
          </div>
          <Shield className="w-5 h-5 text-[#5D4C8E]" />
        </div>
        <div className="space-y-6">
          {[
            { title: 'Calendar Visibility', description: 'Who can see your calendar' },
            { title: 'Event Details', description: 'Who can see event details' },
            { title: 'Profile Information', description: 'What information is visible to others' },
          ].map((setting) => (
            <div key={setting.title} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{setting.title}</label>
              <p className="text-sm text-gray-500">{setting.description}</p>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
                value={setting.title === 'Calendar Visibility'
                  ? settings?.privacy?.calendarVisibility
                  : setting.title === 'Event Details'
                  ? settings?.privacy?.eventDetailsVisibility
                  : settings?.privacy?.profileVisibility}
                onChange={(e) => {
                  const value = e.target.value as 'public' | 'team' | 'private';
                  const updatedSettings = {
                    ...settings!,
                    privacy: {
                      ...settings!.privacy,
                      ...(setting.title === 'Calendar Visibility'
                        ? { calendarVisibility: value }
                        : setting.title === 'Event Details'
                        ? { eventDetailsVisibility: value }
                        : { profileVisibility: value })
                    }
                  };
                  setSettings(updatedSettings as Settings);
                  handleSave('privacy', { privacy: updatedSettings.privacy });
                }}
              >
                <option value="public">Public</option>
                <option value="team">Team Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            <p className="text-sm text-gray-500">Manage your account security</p>
          </div>
          <Lock className="w-5 h-5 text-[#5D4C8E]" />
        </div>
        <div className="space-y-6">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg text-left">
            <div>
              <h4 className="font-medium text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg text-left">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#5f4b8b] to-[#4a3a6e] overflow-hidden">
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
                            ? 'bg-[#5D4C8E] text-white'
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
                        <ChevronRight className={`w-4 h-4 ${
                          activeSection === section.id ? 'text-white' : 'text-gray-400'
                        }`} />
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
                  <div className="sticky top-0 z-10 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    {successMessage}
                  </div>
                )}

                {activeSection === 'account' && renderAccountSettings()}
                {activeSection === 'notifications' && renderNotificationSettings()}
                {activeSection === 'appearance' && renderAppearanceSettings()}
                {activeSection === 'calendar' && renderCalendarSettings()}
                {activeSection === 'team' && renderTeamSettings()}
                {activeSection === 'privacy' && renderPrivacySettings()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


