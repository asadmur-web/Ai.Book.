import React, { useState, useCallback } from 'react';
import { Clipboard, Download, Book, Bot, CheckCircle } from 'lucide-react';
import { LessonStyle } from '../types';
import { generateContent } from '../services/geminiService';
import ToolContainer from './shared/ToolContainer';
import ActionButton from './shared/ActionButton';
import FileUpload from './shared/FileUpload';

const LessonExplainer: React.FC = () => {
  const [style, setStyle] = useState<LessonStyle>(LessonStyle.Simple);
  const [sourceText, setSourceText] = useState('');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Handle form submission to generate the explanation
  const handleSubmit = useCallback(async () => {
    if (!sourceText && !sourceFile) {
      setError('يرجى تقديم نص أو تحميل ملف للحصول على شرح.');
      return;
    }
    setError('');
    setIsLoading(true);
    setExplanation('');

    const prompt = `
      أنت مساعد ذكاء اصطناعي متخصص في شرح المواضيع المعقدة بأساليب مختلفة.
      هدفك هو تقديم شرح واضح وسهل الفهم ومصمم خصيصًا للأسلوب المختار باللغة العربية.
      
      الأسلوب: ${style}
      
      المحتوى المراد شرحه:
      ${sourceText}
      
      التعليمات:
      - اشرح المحتوى بأسلوب تفكير "${style}".
      - استخدم أمثلة بسيطة وتشبيهات وبنية واضحة.
      - إذا أمكن، اقترح أفكارًا مرئية بسيطة أو رسومًا بيانية يمكن أن توضح النقاط.
      - قم بتنسيق المخرجات بصيغة ماركداون منظمة جيدًا باللغة العربية.
    `;
    
    try {
      const result = await generateContent(prompt, sourceFile || undefined);
      setExplanation(result);
    } catch (err) {
      setError('فشل في إنشاء الشرح. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, [style, sourceText, sourceFile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const acceptedFileTypes = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

  return (
    <ToolContainer 
      title="شرح الدروس"
      description="بسّط المواضيع المعقدة إلى شروحات سهلة بأنماط تفكير مختلفة."
      icon={<Book className="w-6 h-6 text-white"/>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-purple-300">الإعدادات</h3>
            <div className="glow-on-focus rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-1">أسلوب الشرح</label>
              <select value={style} onChange={(e) => setStyle(e.target.value as LessonStyle)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500">
                {Object.values(LessonStyle).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="glow-on-focus rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-1">محتوى الدرس</label>
              <textarea 
                value={sourceText} 
                onChange={(e) => setSourceText(e.target.value)} 
                rows={8} 
                placeholder="الصق محتوى الدرس هنا..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
               <FileUpload
                file={sourceFile}
                onFileChange={setSourceFile}
                acceptedTypes={acceptedFileTypes}
              />
            </div>
            <ActionButton onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'جاري الشرح...' : 'اشرح الدرس'}
            </ActionButton>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        {/* Output Panel */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">شرح الذكاء الاصطناعي</h3>
          <div className="bg-black/30 rounded-lg p-4 min-h-[400px] border border-gray-700 prose prose-invert max-w-none prose-p:my-2 prose-headings:my-3">
            {isLoading && <div className="flex justify-center items-center h-full"><Bot className="w-10 h-10 animate-spin text-purple-400" /></div>}
            {explanation && (
              <>
                <div className="flex justify-end space-x-2 mb-4 -mt-2 -mr-2">
                  <button onClick={handleCopy} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm flex items-center">
                    {isCopied ? <CheckCircle size={16} className="ml-1 text-green-400"/> : <Clipboard size={16} className="ml-1"/>}
                    {isCopied ? 'تم النسخ!' : 'نسخ'}
                  </button>
                  <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm flex items-center"><Download size={16} className="ml-1"/>PDF</button>
                </div>
                <div className="whitespace-pre-wrap font-sans text-right">{explanation}</div>
              </>
            )}
            {!isLoading && !explanation && <p className="text-gray-500">سيظهر شرحك المفصل هنا.</p>}
          </div>
        </div>
      </div>
    </ToolContainer>
  );
};

export default LessonExplainer;