'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemType?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemType = 'item'
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-out ${
            isOpen 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-full opacity-0'
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Delete {itemType}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}