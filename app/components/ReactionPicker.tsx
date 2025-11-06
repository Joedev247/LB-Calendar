'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ReactionPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🎉', '👏', '💯', '✨'];

export default function ReactionPicker({ onEmojiSelect, onClose, position }: ReactionPickerProps) {
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAdjustedPosition({
        x: Math.min(position.x, window.innerWidth - 200),
        y: Math.max(position.y - 120, 10)
      });
    }
  }, [position]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    onClose();
  };

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-3 animate-modal-slide-in"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        transform: 'translateX(-50%)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-700">Add Reaction</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {commonReactions.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className="w-10 h-10 text-xl hover:bg-[#00bf63]/10 rounded-lg transition-colors flex items-center justify-center hover:scale-110"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

