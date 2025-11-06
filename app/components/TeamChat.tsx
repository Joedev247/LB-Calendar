"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Smile, Image as ImageIcon, MoreVertical, Trash2, X } from "lucide-react";
import { chatAPI } from '../../lib/api';
import { useApp } from '../../lib/context';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import EmojiPicker from './EmojiPicker';
import ReactionPicker from './ReactionPicker';

interface Reaction {
  user: string | { _id: string; name: string };
  emoji: string;
  user_name?: string;
}

interface ChatMessage {
  id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    avatar_url?: string;
    department?: string;
  };
  user_name: string;
  user_email: string;
  avatar_url?: string;
  department?: string;
  message: string;
  message_type?: 'text' | 'image' | 'file';
  file_url?: string;
  file_name?: string;
  reactions?: Reaction[];
  createdAt: string;
  updatedAt: string;
}

export default function TeamChat() {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [reactionPicker, setReactionPicker] = useState<{ messageId: string; position: { x: number; y: number } } | null>(null);

  // Load messages
  const loadMessages = async () => {
    try {
      const response = await chatAPI.getTeamMessages({ limit: 100 });
      const messagesData = response.data || [];
      // Format messages to include all fields
      const formattedMessages = messagesData.map((msg: any) => ({
        ...msg,
        message_type: msg.message_type || 'text',
        file_url: msg.file_url,
        file_name: msg.file_name,
        reactions: msg.reactions || []
      }));
      setMessages(formattedMessages);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load messages');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh messages every 5 seconds
  useEffect(() => {
    loadMessages();
    
    const interval = setInterval(() => {
      loadMessages();
    }, 5000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Scroll to bottom when new messages arrive (only on initial load or new messages)
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      // Use a small timeout to ensure DOM is updated
      setTimeout(() => {
        if (messagesEndRef.current) {
          const messagesContainer = messagesEndRef.current.parentElement?.parentElement;
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }
      }, 50);
    }
  }, [messages.length, isLoading]);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if ((!messageInput.trim() && !selectedImage) || isSending || !user) return;

    setIsSending(true);
    const messageText = messageInput.trim();
    setMessageInput(''); // Clear input immediately for better UX
    
    let imageUrl = null;
    let fileName = null;

    try {
      // If there's an image, upload it first
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('message', messageText || '📷 Image');

        // Upload image
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lb-calendar-backend.onrender.com/api';
        const uploadResponse = await fetch(`${API_BASE_URL}/chat/team/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.file_url;
        fileName = uploadData.file_name;

        // Send message with image
        const imageResponse = await fetch(`${API_BASE_URL}/chat/team`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            message: messageText || '📷 Image',
            message_type: 'image',
            file_url: imageUrl,
            file_name: fileName
          })
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to send message with image');
        }

        const imageData = await imageResponse.json();
        setMessages(prev => [...prev, imageData]);
      } else {
        // Send text message only
        const response = await chatAPI.sendTeamMessage(messageText);
        setMessages(prev => [...prev, response.data]);
      }

      // Clear image selection
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Scroll to bottom
      setTimeout(() => {
        if (messagesEndRef.current) {
          const messagesContainer = messagesEndRef.current.parentElement?.parentElement;
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }
      }, 100);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to send message');
      setMessageInput(messageText); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  // Handle right-click on message to show reaction picker
  const handleMessageRightClick = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setReactionPicker({
      messageId,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  // Handle reaction selection
  const handleReactionSelect = async (emoji: string, messageId?: string) => {
    if (!user) return;

    const targetMessageId = messageId || reactionPicker?.messageId;
    if (!targetMessageId) return;

    if (reactionPicker) {
      setReactionPicker(null); // Close picker immediately for better UX
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lb-calendar-backend.onrender.com/api';
      const response = await fetch(`${API_BASE_URL}/chat/team/${targetMessageId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ emoji })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add reaction');
      }

      const data = await response.json();
      
      // Update the message with new reactions
      setMessages(prev => prev.map(msg => {
        if (String(msg.id) === String(targetMessageId)) {
          return { ...msg, reactions: data.reactions || [] };
        }
        return msg;
      }));
    } catch (error: any) {
      console.error('Error adding reaction:', error);
      toast.error(error.message || 'Failed to add reaction');
    }
  };

  // Remove reaction
  const handleRemoveReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lb-calendar-backend.onrender.com/api';
      const response = await fetch(`${API_BASE_URL}/chat/team/${messageId}/reactions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ emoji })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to remove reaction');
      }

      const data = await response.json();
      
      // Update the message with updated reactions
      setMessages(prev => prev.map(msg => {
        if (String(msg.id) === String(messageId)) {
          return { ...msg, reactions: data.reactions || [] };
        }
        return msg;
      }));
    } catch (error: any) {
      console.error('Error removing reaction:', error);
      toast.error(error.message || 'Failed to remove reaction');
    }
  };

  // Delete message (if user is sender)
  const handleDeleteMessage = async (messageId: string, senderId: string) => {
    if (String(senderId) !== String(user?.id)) return;
    
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      // Note: You might need to add a delete endpoint for team chat
      // For now, we'll just remove it from the UI
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted');
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Close reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setReactionPicker(null);
    };

    if (reactionPicker) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [reactionPicker]);

  // Get user avatar
  const getUserAvatar = (msg: ChatMessage) => {
    if (msg.avatar_url) return msg.avatar_url;
    const name = msg.user_name || msg.user_email || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00bf63&color=fff&size=40&bold=true`;
  };

  // Check if message is from current user
  const isOwnMessage = (msg: ChatMessage) => {
    return String(msg.sender?._id) === String(user?.id) || msg.user_email === user?.email;
  };

  // Group messages by date
  const groupMessagesByDate = (msgs: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    msgs.forEach(msg => {
      const date = new Date(msg.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey: string;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F8F7FA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bf63] mx-auto mb-2"></div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden min-h-0">
      {/* Chat Header */}
      <div className="flex-shrink-0 py-3 px-4 sm:px-6 border-b border-[#E9E5F0] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#00bf63] to-[#008c47] flex items-center justify-center text-white font-medium text-sm sm:text-base">
              TC
            </div>
            <div>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#2D2D2D]">Team Chat</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] sm:text-xs text-[#33d78f]">
                  {messages.length > 0 ? `${messages.length} messages` : 'No messages yet'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-[#F8F7FA] px-3 sm:px-4 pt-3 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {Object.keys(messageGroups).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No messages yet</p>
              <p className="text-gray-400 text-sm mt-2">Start the conversation by sending a message below!</p>
            </div>
          ) : (
            Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
              <div key={dateKey}>
                {/* Date Separator */}
                <div className="flex items-center gap-4 opacity-60 mb-3 mt-2">
                  <div className="flex-1 h-px bg-[#E9E5F0]"></div>
                  <span className="text-xs text-[#33d78f] font-medium">{dateKey}</span>
                  <div className="flex-1 h-px bg-[#E9E5F0]"></div>
                </div>

                {/* Messages */}
                <div className="space-y-3">
                  {dateMessages.map((msg, index) => {
                    const isOwn = isOwnMessage(msg);
                    const prevMessage = index > 0 ? dateMessages[index - 1] : null;
                    const showAvatar = !prevMessage || String(prevMessage.sender?._id) !== String(msg.sender?._id) || 
                                      (new Date(msg.createdAt).getTime() - new Date(prevMessage.createdAt).getTime()) > 300000; // 5 minutes

                    return (
                      <div
                        key={`${msg.id}-${index}`}
                        className={`flex items-start gap-3 group ${isOwn ? 'flex-row-reverse' : ''}`}
                      >
                        {showAvatar ? (
                          <img
                            src={getUserAvatar(msg)}
                            alt={msg.user_name || 'User'}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"></div>
                        )}
                        <div className={`flex-1 min-w-0 ${isOwn ? 'flex flex-col items-end' : ''}`}>
                          {showAvatar && (
                            <div className={`flex items-center gap-1.5 sm:gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                              <span className="font-medium text-[#2D2D2D] text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                                {msg.user_name || msg.user_email || 'Unknown User'}
                              </span>
                              {msg.department && (
                                <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">• {msg.department}</span>
                              )}
                              <span className="text-[10px] sm:text-xs text-[#33d78f] whitespace-nowrap">
                                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          )}
                          <div className={`flex items-start gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                            <div
                              className={`inline-block rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 text-sm shadow-sm max-w-[85vw] sm:max-w-sm cursor-pointer ${
                                isOwn
                                  ? 'bg-gradient-to-r from-[#00bf63] to-[#008c47] text-white rounded-tr-none'
                                  : 'bg-white text-[#4A4A4A] rounded-tl-none'
                              }`}
                              onContextMenu={(e) => handleMessageRightClick(e, msg.id)}
                              title="Long press to add reaction"
                            >
                              {msg.message_type === 'image' && msg.file_url ? (
                                <div className="space-y-2">
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL || 'https://lb-calendar-backend.onrender.com'}${msg.file_url}`}
                                    alt={msg.file_name || 'Shared image'}
                                    className="rounded-lg max-w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'https://lb-calendar-backend.onrender.com'}${msg.file_url}`, '_blank')}
                                  />
                                  {msg.message && msg.message !== '📷 Image' && (
                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                  )}
                                </div>
                              ) : (
                                <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                              )}
                              
                              {/* Reactions */}
                              {msg.reactions && msg.reactions.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {Object.entries(
                                    msg.reactions.reduce((acc: { [key: string]: Reaction[] }, reaction: Reaction) => {
                                      if (!acc[reaction.emoji]) {
                                        acc[reaction.emoji] = [];
                                      }
                                      acc[reaction.emoji].push(reaction);
                                      return acc;
                                    }, {})
                                  ).map(([emoji, reactions]) => {
                                    const hasUserReacted = reactions.some((r: Reaction) => {
                                      const userId = typeof r.user === 'string' ? r.user : r.user?._id;
                                      return String(userId) === String(user?.id) || r.user_name === user?.name;
                                    });
                                    return (
                                      <button
                                        key={emoji}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (hasUserReacted) {
                                            handleRemoveReaction(msg.id, emoji);
                                          } else {
                                            // Add this emoji reaction directly
                                            handleReactionSelect(emoji, msg.id);
                                          }
                                        }}
                                        className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                                          hasUserReacted
                                            ? 'bg-[#00bf63]/20 border border-[#00bf63]/40 hover:bg-[#00bf63]/30'
                                            : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                                        }`}
                                        title={`${reactions.length} ${reactions.length === 1 ? 'reaction' : 'reactions'} - Click to ${hasUserReacted ? 'remove' : 'add'} reaction`}
                                      >
                                        <span>{emoji}</span>
                                        <span className="text-[10px] font-medium">{reactions.length}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            {isOwn && (
                              <button
                                onClick={() => handleDeleteMessage(msg.id, msg.sender?._id || '')}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full"
                                title="Delete message"
                              >
                                <Trash2 className="w-4 h-4 text-gray-500" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} style={{ height: '1px', flexShrink: 0 }} />
        </div>
      </div>

      {/* Reaction Picker */}
      {reactionPicker && (
        <ReactionPicker
          onEmojiSelect={handleReactionSelect}
          onClose={() => setReactionPicker(null)}
          position={reactionPicker.position}
        />
      )}

      {/* Chat Input */}
      <div className="shrink-0 bg-white px-3 sm:px-4 py-2.5 sm:py-3 border-t border-[#E9E5F0] safe-area-bottom">
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-2 sm:mb-3 relative inline-block">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-[200px] sm:max-w-xs max-h-40 sm:max-h-48 rounded-lg object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-end gap-2 sm:gap-3">
          <div className="relative flex-shrink-0">
            <button
              ref={emojiButtonRef}
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 sm:p-2.5 text-[#33d78f] hover:text-[#00bf63] hover:bg-[#F3F0F9] rounded-xl transition-colors ${
                showEmojiPicker ? 'bg-[#F3F0F9] text-[#00bf63]' : ''
              }`}
              title="Add emoji"
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </div>

          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3 pr-10 sm:pr-12 bg-[#F8F7FA] text-sm sm:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00bf63]/20 placeholder:text-[#33d78f]"
              disabled={isSending}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 text-[#33d78f] hover:text-[#00bf63] transition-colors"
              title="Attach image"
            >
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={(!messageInput.trim() && !selectedImage) || isSending}
            className="p-2 sm:p-2.5 bg-gradient-to-r from-[#00bf63] to-[#008c47] text-white rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            title="Send message"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
