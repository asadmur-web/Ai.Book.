import React from 'react';

// Simple footer component
// مكون تذييل بسيط
const Footer: React.FC = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-sm mt-8 py-6">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} AI Book. جميع الحقوق محفوظة.</p>
        <p className="text-xs mt-2">منصة تعليمية مدعومة بالذكاء الاصطناعي.</p>
      </div>
    </footer>
  );
};

export default Footer;