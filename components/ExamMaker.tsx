import React, { useState, useCallback } from 'react';
import { FileText, Bot } from 'lucide-react';
import { Type } from "@google/genai";
import { ExamDifficulty, ExamType, ExamData } from '../types';
import { generateContent } from '../services/geminiService';
import ToolContainer from './shared/ToolContainer';
import ActionButton from './shared/ActionButton';
import FileUpload from './shared/FileUpload';
import InteractiveExam from './InteractiveExam';

const ExamMaker: React.FC = () => {
  const [difficulty, setDifficulty] = useState<ExamDifficulty>(ExamDifficulty.Medium);
  const [examType, setExamType] = useState<ExamType>(ExamType.MultipleChoice);
  const [sourceText, setSourceText] = useState('');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [generatedExam, setGeneratedExam] = useState<ExamData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const examSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "عنوان جذاب للامتحان" },
      questions: {
        type: Type.ARRAY,
        description: "قائمة بأسئلة الامتحان",
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING, description: "نص السؤال" },
            type: { type: Type.STRING, enum: ['MultipleChoice', 'FillInTheBlank', 'TrueFalse'], description: "نوع السؤال" },
            options: {
              type: Type.ARRAY,
              description: "قائمة بالخيارات لأسئلة الاختيار من متعدد",
              nullable: true,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING, description: "الإجابة الصحيحة. لاملأ الفراغ، تكون الكلمة المفقودة. لصح/خطأ، تكون 'صح' أو 'خطأ'." }
          },
          required: ['questionText', 'type', 'correctAnswer']
        }
      }
    },
    required: ['title', 'questions']
  };

  const handleSubmit = useCallback(async () => {
    if (!sourceText && !sourceFile) {
      setError('يرجى تقديم بعض النص أو تحميل ملف لإنشاء الامتحان.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedExam(null);

    const prompt = `
      أنت مساعد ذكاء اصطناعي متخصص في إنشاء اختبارات تعليمية بصيغة JSON.
      قم بإنشاء اختبار كامل بناءً على المحتوى المقدم.
      
      المعلمات:
      - مستوى الصعوبة: ${difficulty}
      - نوع الاختبار: ${examType}
      - يجب أن تكون الإجابات دائمًا بصيغة نصية (string).
      
      المحتوى:
      ${sourceText}
      
      التعليمات:
      - قم بإنشاء JSON يطابق المخطط المقدم بدقة.
      - بالنسبة لأسئلة الاختيار من متعدد، قدم 4 خيارات.
      - بالنسبة لأسئلة املأ الفراغ، يجب أن تكون الإجابة الصحيحة هي الكلمة المفقودة.
      - بالنسبة لأسئلة صح/خطأ، يجب أن تكون الإجابة الصحيحة 'صح' أو 'خطأ'.
      - تأكد من أن جميع النصوص باللغة العربية.
    `;
    
    try {
      const result = await generateContent(prompt, sourceFile || undefined, {
        responseMimeType: 'application/json',
        responseSchema: examSchema,
      });
      
      const parsedExam: ExamData = JSON.parse(result);
      setGeneratedExam(parsedExam);

    } catch (err) {
      console.error(err);
      setError('فشل في إنشاء الامتحان. قد تكون استجابة الذكاء الاصطناعي غير متوافقة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, examType, sourceText, sourceFile]);

  const acceptedFileTypes = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

  return (
    <ToolContainer 
      title="صانع الامتحانات" 
      description="ارفع مستندًا أو الصق نصًا لإنشاء اختبار تفاعلي مخصص على الفور."
      icon={<FileText className="w-6 h-6 text-white"/>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-purple-300">الإعدادات</h3>
            <div className="glow-on-focus rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-1">مستوى الصعوبة</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as ExamDifficulty)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500">
                {Object.values(ExamDifficulty).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="glow-on-focus rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-1">نوع الامتحان</label>
              <select value={examType} onChange={(e) => setExamType(e.target.value as ExamType)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500">
                {Object.values(ExamType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="glow-on-focus rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-1">النص المصدر</label>
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
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء الامتحان'}
            </ActionButton>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        {/* Output Panel */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">الامتحان التفاعلي</h3>
          <div className="bg-black/30 rounded-lg p-4 min-h-[400px] border border-gray-700">
            {isLoading && <div className="flex justify-center items-center h-full"><Bot className="w-10 h-10 animate-spin text-purple-400" /></div>}
            {generatedExam && <InteractiveExam examData={generatedExam} />}
            {!isLoading && !generatedExam && <p className="text-gray-500 text-center pt-16">سيظهر امتحانك التفاعلي الذي تم إنشاؤه هنا.</p>}
          </div>
        </div>
      </div>
    </ToolContainer>
  );
};

export default ExamMaker;