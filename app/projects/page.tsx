'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Calendar, CheckSquare, Eye } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProjectModal from '../components/ProjectModal';
import ProjectDetails from '../components/ProjectDetails';
import DeleteModal from '../components/DeleteModal';
import { useApp } from '../../lib/context';
import { Project } from '../../lib/types/project';

export default function ProjectsPage() {
  const { projects, loadProjects, deleteProject } = useApp();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');

  useEffect(() => {
    loadProjects();
  }, []); // Remove loadProjects from dependencies to prevent infinite loop

  const filteredProjects = projects.filter(project => {
    switch (filter) {
      case 'active':
        return project.status === 'active';
      case 'completed':
        return project.status === 'completed';
      case 'archived':
        return project.status === 'archived';
      default:
        return true;
    }
  });

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = async (project: any) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProject = async () => {
    try {
      if (projectToDelete) {
        await deleteProject(projectToDelete.id);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return 'Unknown';
    // replace underscores with spaces and capitalize words
    return status.replace(/_/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  const safeFormatDate = (dateRaw?: string | null) => {
    if (!dateRaw) return 'Unknown date';
    try {
      const d = new Date(dateRaw);
      if (!isNaN(d.getTime())) return format(d, 'MMM d, yyyy');
    } catch (e) {
      // fallthrough
    }
    return 'Unknown date';
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#2D2D2D]">Projects</h1>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsProjectModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#00bf63] text-white rounded-lg hover:bg-[#008c47] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-6">
              {[
                { key: 'all', label: 'All Projects' },
                { key: 'active', label: 'Active' },
                { key: 'completed', label: 'Completed' },
                { key: 'archived', label: 'Archived' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === tab.key
                      ? 'bg-[#00bf63] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00bf63' }}>
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-medium">No projects found</p>
                  <p className="text-sm">Create your first project to get started</p>
                </div>
              ) : (
                filteredProjects.map((project, index) => (
                  <div key={project.id} className="bg-white border border-[#E9E5F0] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow animate-card-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setIsProjectDetailsOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-[#00bf63] hover:bg-gray-100 rounded transition-colors"
                          title="View Project Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-1 text-gray-400 hover:text-[#00bf63] hover:bg-gray-100 rounded transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {project.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    )}

                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {formatStatus(project.status)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Created {safeFormatDate((project as any).created_at)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.member_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.event_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckSquare className="w-4 h-4" />
                          <span>{project.task_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
      />

      {/* Project Details Modal */}
      <ProjectDetails
        isOpen={isProjectDetailsOpen}
        onClose={() => {
          setIsProjectDetailsOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? This will also delete all associated events and tasks. This action cannot be undone.`}
        itemType="project"
      />
    </div>
  );
}