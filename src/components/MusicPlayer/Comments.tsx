"use client";
import React, { useRef } from "react";
import { motion } from 'framer-motion';
import { Comment } from '../../app/types';

interface CommentsSectionProps {
  comments: Comment[];
  newCommentText: string;
  onCommentSubmit: (e: React.FormEvent) => void;
  onCommentTextChange: (text: string) => void;
}

const Comments: React.FC<CommentsSectionProps> = ({
  comments,
  newCommentText,
  onCommentSubmit,
  onCommentTextChange
}) => {
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full md:w-96 md:border-l md:border-white/10 md:pl-8 pt-8 md:pt-0 flex flex-col h-full">
      <h3 className="text-xl font-bold mb-4 text-gray-100">
        Comments ({comments.length || 0})
      </h3>
      
      <div 
        ref={commentsContainerRef}
        className="flex-1 overflow-y-auto pr-3 mb-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {comments.map((comment) => (
          <motion.div 
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-wine-800 p-4 rounded-xl shadow-sm hover:bg-wine-700/50 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm text-gray-100">{comment.author}</span>
              <span className="text-gray-400 text-xs">
                {new Date(comment.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
          </motion.div>
        ))}
        <div ref={commentsEndRef} />
      </div>

      <form onSubmit={onCommentSubmit} className="flex gap-2 mt-auto pr-3">
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 p-3 rounded-lg bg-wine-800 text-white border border-wine-700 
            focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 
            transition-all placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="bg-green-400 text-white px-5 py-3 rounded-lg hover:bg-green-300 
            transition-all active:scale-95 flex items-center gap-2"
        >
          <span>Post</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Comments;