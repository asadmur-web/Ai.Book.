import React, { useState, useCallback } from 'react';
import { Clipboard, Download, Rocket, Bot, CheckCircle, Image as ImageIcon, Loader } from 'lucide-react';
import { generateContent, generateImageContent } from '../services/geminiService';
import ToolContainer from './shared/ToolContainer';
import ActionButton from './shared/ActionButton';

const ProjectBuilder: React.FC = () => {
  const [projectIdea, setProjectIdea] = useState('');
  const [projectPlan, setProjectPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState('');

  const handleGeneratePlan = useCallback(async () => {
    if (!projectIdea) {
      setError('يرجى إدخال فكرة مشروع للبدء.');
      return;
    }
    setError('');
    setIsLoading(true);
    setProjectPlan('');

    const prompt = `
      أنت مساعد ذكاء اصطناعي تساعد الطلاب والمحترفين في تخطيط المشاريع.
      بناءً على فكرة المشروع المقدمة، قم بإنشاء خطة مشروع شاملة باللغة العربية.
      
      فكرة المشروع:
      ${projectIdea}
      
      التعليمات:
      - قم بإنشاء خطة مشروع مفصلة بناءً على الفكرة.
      - يجب أن تكون المخرجات بصيغة ماركداون منظمة جيدًا باللغة العربية.
      - قم بتضمين الأقسام التالية بعناوين واضحة:
        1. **الفكرة العامة:** نظرة عامة موجزة.
        2. **الأهداف:** أهداف واضحة وقابلة للقياس (أهداف SMART إن أمكن).
        3. **خطة العمل والتنفيذ:** خطة خطوة بخطوة مع مراحل مقدرة أو جدول زمني.
        4. **الأدوات والتقنيات المقترحة:** البرامج أو اللغات أو الموارد الأخرى الموصى بها.
        5. **ملخص العرض التقديمي:** نقاط رئيسية لعرض تقديمي أو لعرض المشروع.
    `;
    
    try {
      const result = await generateContent(prompt);
      setProjectPlan(result);
    } catch (err) {
      setError('فشل في بناء خطة المشروع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, [projectIdea]);

  const handleGenerateImage = useCallback(async () => {
    if (!imagePrompt) {
      setImageError('يرجى إدخال وصف للصورة.');
      return;
    }
    setImageError('');
    setIsGeneratingImage(true);
    setGeneratedImage(null);
    try {
      const imageData = await generateImageContent(imagePrompt);
      setGeneratedImage(`data:image/png;base64,${imageData}`);
    } catch (err) {
      setImageError((err as Error).message);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [imagePrompt]);

  const handleCopy = () => {
    navigator.clipboard.writeText(projectPlan);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <ToolContainer 
      title="باني المشاريع"
      description="حوّل أفكارك إلى خطط وصور قابلة للتنفيذ في دقائق."
      icon={<Rocket className="w-6 h-6 text-white"/>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="md:col-span-1 space-y-6">
          {/* Project Plan Section */}
          <div className="space-y-4 bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-300">1. تخطيط المشروع</h3>
            <div className="glow-on-focus rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-1">فكرة المشروع</label>
              <textarea 
                value={projectIdea} 
                onChange={(e) => setProjectIdea(e.target.value)} 
                rows={8} 
                placeholder="صف فكرة مشروعك المدرسي، الجامعي، أو العملي..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <ActionButton onClick={handleGeneratePlan} disabled={isLoading}>
              {isLoading ? 'جاري بناء الخطة...' : 'بناء خطة المشروع'}
            </ActionButton>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          {/* Image Generation Section */}
          <div className="space-y-4 bg-gray-800/50 p-4 rounded-lg">
             <h3 className="text-lg font-semibold text-purple-300">2. تصميم الصور</h3>
             <div className="glow-on-focus rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-1">وصف الصورة</label>
                <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    rows={3}
                    placeholder="مثال: شعار مستقبلي لمشروع عن الفضاء..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                />
             </div>
             <ActionButton onClick={handleGenerateImage} disabled={isGeneratingImage}>
                {isGeneratingImage ? 'جاري التصميم...' : 'صمم صورة'}
             </ActionButton>
             {imageError && <p className="text-red-400 text-sm mt-2">{imageError}</p>}
             {isGeneratingImage && (
                <div className="w-full aspect-square bg-gray-900 rounded-lg flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-purple-400" />
                </div>
             )}
             {generatedImage && (
                <div className="mt-4">
                    <img src={generatedImage} alt="Generated by AI" className="rounded-lg w-full" />
                     <a href={generatedImage} download="ai-book-image.png" className="w-full mt-2">
                        <ActionButton onClick={() => {}} className="w-full">
                            <Download size={16}/> تحميل الصورة
                        </ActionButton>
                    </a>
                </div>
             )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">خطة المشروع التي تم إنشاؤها</h3>
          <div className="bg-black/30 rounded-lg p-4 min-h-[400px] border border-gray-700 prose prose-invert max-w-none prose-p:my-2 prose-headings:my-3">
            {isLoading && <div className="flex justify-center items-center h-full"><Bot className="w-10 h-10 animate-spin text-purple-400" /></div>}
            {projectPlan && (
               <>
                <div className="flex justify-end space-x-2 mb-4 -mt-2 -mr-2">
                  <button onClick={handleCopy} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm flex items-center">
                    {isCopied ? <CheckCircle size={16} className="ml-1 text-green-400"/> : <Clipboard size={16} className="ml-1"/>}
                    {isCopied ? 'تم النسخ!' : 'نسخ'}
                  </button>
                  <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm flex items-center"><Download size={16} className="ml-1"/>PDF</button>
                </div>
                <div className="whitespace-pre-wrap font-sans text-right">{projectPlan}</div>
              </>
            )}
            {!isLoading && !projectPlan && <p className="text-gray-500">ستظهر خطة مشروعك التي تم إنشاؤها هنا.</p>}
          </div>
        </div>
      </div>
    </ToolContainer>
  );
};

export default ProjectBuilder;