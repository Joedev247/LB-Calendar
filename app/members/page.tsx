'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Building2, Search } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { usersAPI } from '../../lib/api';

interface Member {
  id: number;
  name: string;
  email: string;
  department?: string;
  role?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group members by department
  const groupedMembers = members.reduce((acc, member) => {
    const dept = member.department || 'Other';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, Member[]>);

  // Get unique departments
  const departments = Object.keys(groupedMembers).sort();

  // Filter members based on search and department
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Group filtered members
  const filteredGroupedMembers = filteredMembers.reduce((acc, member) => {
    const dept = member.department || 'Other';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, Member[]>);

  const filteredDepartments = Object.keys(filteredGroupedMembers).sort();

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      // Technical Roles
      'Frontend Developer': '#61DAFB',
      'Backend Developer': '#00bf63',
      'Fullstack Developer': '#3776AB',
      'Mobile Developer': '#F7DF1E',
      'DevOps Developer': '#007396',
      'Cloud Engineer': '#FF9900',
      'Figma Designer': '#F24E1E',
      'Tester': '#FF6B6B',
      'Penetration Tester': '#FF0000',
      'AI Engineer': '#FF69B4',
      'Data Analyst': '#4ECDC4',
      // Non-Technical Roles
      'Design': '#FF6B6B',
      'Product': '#4ECDC4',
      'Marketing': '#FFE66D',
      'Sales': '#A8E6CF',
      'HR': '#FF8B94',
      'Finance': '#95E1D3',
      'Operations': '#F38181',
      'Support': '#AA96DA',
      'Other': '#95A5A6'
    };
    return colors[department] || '#95A5A6';
  };

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

          {/* Content Container */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">Company Members</h1>
              <p className="text-gray-600 text-sm">View and manage all team members organized by department</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept} ({groupedMembers[dept]?.length || 0})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bf63]"></div>
                <span className="ml-3 text-gray-500">Loading members...</span>
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No members found</p>
                <p className="text-sm">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredDepartments.map((department, index) => (
                  <div key={department} className="animate-card-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Department Header */}
                    <div 
                      className="flex items-center gap-3 mb-4 p-4 rounded-lg"
                      style={{ backgroundColor: `${getDepartmentColor(department)}15` }}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: getDepartmentColor(department) }}
                      >
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900">{department}</h2>
                        <p className="text-sm text-gray-600">
                          {filteredGroupedMembers[department].length} member{filteredGroupedMembers[department].length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Members Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredGroupedMembers[department].map((member, memberIndex) => (
                        <div
                          key={member.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow animate-card-fade-in"
                          style={{ animationDelay: `${(index * 0.1) + (memberIndex * 0.05)}s` }}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                              style={{ 
                                background: `linear-gradient(135deg, ${getDepartmentColor(member.department || 'Other')} 0%, ${getDepartmentColor(member.department || 'Other')}dd 100%)`
                              }}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1 truncate">{member.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Mail className="w-4 h-4 text-[#00bf63] flex-shrink-0" />
                                <span className="truncate">{member.email}</span>
                              </div>
                              {member.role && (
                                <span 
                                  className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: member.role === 'admin' ? '#EF4444' : '#6B7280' }}
                                >
                                  {member.role === 'admin' ? 'Admin' : 'Member'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Members Count */}
            {!loading && members.length > 0 && (
              <div className="mt-8 p-4 bg-gradient-to-r from-[#00bf63] to-[#00a655] rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    <div>
                      <p className="text-lg font-bold">Total Members</p>
                      <p className="text-sm text-white/80">{members.length} team members across {departments.length} departments</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

