import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ExamMaker from './components/ExamMaker';
import LessonExplainer from './components/LessonExplainer';
import ProjectBuilder from './components/ProjectBuilder';
import AssistantChat from './components/AssistantChat';
import { Tool } from './types';

// The main App component, serves as the root of our UI
// التطبيق الرئيسي، يعمل كجذر لواجهة المستخدم
const App: React.FC = () => {
  // State to keep track of the currently selected tool
  // حالة لتتبع الأداة المحددة حاليًا
  const [activeTool, setActiveTool] = useState<Tool>(Tool.ExamMaker);

  // Function to render the component based on the active tool
  // دالة لعرض المكون بناءً على الأداة النشطة
  const renderActiveTool = () => {
    switch (activeTool) {
      case Tool.ExamMaker:
        return <ExamMaker />;
      case Tool.LessonExplainer:
        return <LessonExplainer />;
      case Tool.ProjectBuilder:
        return <ProjectBuilder />;
      default:
        return <ExamMaker />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header activeTool={activeTool} setActiveTool={setActiveTool} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderActiveTool()}
      </main>
      <Footer />
      <AssistantChat />
    </div>
  );
};

export default App;