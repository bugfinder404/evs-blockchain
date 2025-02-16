'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
const FloatingChatButton = () => {
  // State to toggle chat visibility
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Toggle the chat open/close state
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <div>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={toggleChat}
      >
        <div className="w-12 h-12 rounded-full bg-[#26db83] flex items-center justify-center text-white text-2xl shadow-lg">
        
        </div>
      </motion.div>

      {/* Chat iframe container */}
      {isChatOpen && (
        <motion.div
          className="fixed bottom-24 right-6 z-40 w-[400px] h-[550px] bg-white shadow-xl rounded-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <iframe
            style={{ width: '100%', height: '100%' }}
            src="https://www.chatbase.co/chatbot-iframe/c-8Wt0wS97dnCaC-qQvW6"
            title="Chat Interface"
            frameBorder="0"
          />
        </motion.div>
      )}
    </div>
  );
};

export default FloatingChatButton;