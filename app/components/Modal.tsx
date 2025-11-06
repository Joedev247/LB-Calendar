'use client';

import React from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className 
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 animate-modal-backdrop ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className={clsx(
          'relative w-full h-screen transform overflow-hidden bg-white rounded-tl-4xl rounded-bl-4xl shadow-xl transition-all duration-300 ease-out animate-modal-slide-in flex flex-col',
          sizeClasses[size],
          className,
          isOpen 
            ? 'translate-x-0' 
            : 'translate-x-full'
        )}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 animate-fade-in-up flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 flex flex-col min-h-0 px-6 py-4 animate-fade-in-up-delay overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}