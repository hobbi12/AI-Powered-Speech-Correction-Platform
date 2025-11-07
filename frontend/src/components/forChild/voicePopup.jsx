// VoicePopup.jsx
import React, { useEffect, useRef, useState, useMemo } from "react"; // تأكد من استيراد useMemo
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
import { X } from "lucide-react";
import goodSound from "../../assets/sound/goodresult-82807.mp3";
import failSound from "../../assets/sound/failed-295059.mp3";

export default function VoicePopup({ targetWord, targetLetter, onClose, onResult }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localResult, setLocalResult] = useState(null); // حالة جديدة للنتيجة داخل البوب آب

  // Memoized function to highlight the target letter in the word if the test failed
  const highlightedTargetWord = useMemo(() => {
    // تحقق من توفر البيانات
    if (!targetWord || !targetLetter || !localResult) {
      return targetWord || ""; // عرض الكلمة العادية إذا لم تتوفر البيانات
    }

    // نفذ البروسيس فقط إذا كانت النتيجة خاطئة
    if (localResult?.test_passed === false) {
      const word = targetWord;
      const letter = targetLetter;

      // تجهيز الحرف للبحث (تجاهل الأحرف الخاصة في الـ Regex)
      const escapedLetter = letter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // تقسيم الكلمة إلى أجزاء بناءً على الحرف المستهدف
      // الاقواس () في الـ Regex تضمن إبقاء الحرف نفسه في المصفوفة
      const parts = word.split(new RegExp(`(${escapedLetter})`, 'g'));

      // تعيين أجزاء الكلمة مع تلوين الحرف المستهدف
      return parts.map((part, index) =>
        part === letter ? (
          // إذا كان الجزء هو الحرف المستهدف، نلونه بالأحمر
          <span key={index} style={{ color: 'red', fontWeight: 'bold' }}>{part}</span>
        ) : (
          // إذا لم يكن، نعرضه بشكل طبيعي
          part
        )
      );
    } else {
      // إذا كانت النتيجة صحيحة أو لم تُحسب بعد، نعرض الكلمة العادية
      return targetWord;
    }
  }, [targetWord, targetLetter, localResult]); // أعد الحساب فقط إذا تغيرت هذه القيم


  useEffect(() => {
    if (isListening && waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#0ff",
        interact: false,
        cursorWidth: 0,
        height: 100,
        plugins: [MicrophonePlugin.create()],
      });

      wavesurfer.current.on("error", (e) => {
        console.error("WaveSurfer error:", e);
      });

      wavesurfer.current.microphone.on("deviceReady", () => {
        console.log("🎙️ Microphone ready");
      });

      wavesurfer.current.microphone.on("deviceError", (err) => {
        console.error("🎤 Microphone error:", err);
      });

      wavesurfer.current.microphone.start();
    }

    return () => {
      // تأكد من إيقاف وإزالة WaveSurfer بشكل نظيف
      if (wavesurfer.current) {
        // إيقاف المايكروفون أولاً إذا كان قيد التشغيل
        if (wavesurfer.current.microphone && isListening) {
          try {
            wavesurfer.current.microphone.stop();
          } catch (e) {
            console.log("خطأ طفيف أثناء إيقاف المايكروفون في Cleanup:", e);
          }
        }
        try {
          wavesurfer.current.destroy();
        } catch (e) {
          console.log("خطأ طفيف أثناء تدمير WaveSurfer:", e);
        }
        wavesurfer.current = null;
      }
    };
  }, [isListening]); // أضف isListening كـ dependency

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setAudioChunks([]);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((prev) => [...prev, e.data]);
        }
      };
      recorder.start();
      setIsListening(true);
      setMediaRecorder(recorder);
      setLocalResult(null); // إعادة تعيين النتيجة السابقة عند بدء تسجيل جديد
    } catch (err) {
      console.error("فشل الوصول للمايكروفون:", err);
      // يمكنك هنا عرض رسالة خطأ للمستخدم داخل البوب آب إذا أردت
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.onstop = async () => {
        setIsListening(false);
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recorded_audio.webm");
        formData.append("target_word", targetWord); // استخدام الـ prop
        formData.append("target_char", targetLetter); // استخدام الـ prop

        try {
          setIsProcessing(true);
          const response = await fetch("http://localhost:9999/api/transcribe/", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();

          setLocalResult(data); // عرض النتيجة داخل البوب آب فوراً

          // تشغيل الصوت بناءً على النتيجة
          const audio = new Audio(data.test_passed ? goodSound : failSound);
          audio.play().catch((err) => console.warn("فشل تشغيل الصوت في البوب اب:", err));

          // إذا كانت النتيجة صحيحة، أبلغ LevelPage وأغلق البوب آب تلقائياً بعد فترة قصيرة
          if (data.test_passed && onResult) {
             setTimeout(() => {
                onResult(data); // إرسال النتيجة لـ LevelPage
                if (onClose) onClose(); // إغلاق البوب آب
             }, 2000); // إغلاق تلقائي بعد ثانيتين مثلاً
          }


        } catch (err) {
          console.error("❌ فشل إرسال الصوت:", err);
          setLocalResult({ error: "فشل في معالجة الصوت" }); // عرض خطأ في البوب آب
        } finally {
          setIsProcessing(false);
        }
      };
      mediaRecorder.stop();
    } else {
      setIsListening(false);
      console.log("⚠️ ما في تسجيل نشط ليتوقف.");
    }
  };

  // دالة لإعادة المحاولة (إعادة تعيين النتيجة وبدء التسجيل)
  const handleRetry = () => {
    setLocalResult(null);
    startRecording(); // بدء التسجيل الجديد مباشرة
  };

  // Toggle recording state
  const toggleRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-cyber-900 p-6 rounded-2xl shadow-xl border border-neon-green/40 min-w-[400px] max-w-lg relative">
        {/* زر الإغلاق المحدث */}
        <button
          onClick={() => {
            // تأكد من إيقاف التسجيل إن كان قيد التشغيل
            if (mediaRecorder && mediaRecorder.state === "recording") {
              try {
                mediaRecorder.stop();
              } catch (e) {
                console.log("خطأ طفيف أثناء إيقاف التسجيل من زر X:", e);
              }
            }
            // أوقف WaveSurfer إن كان يعمل
            if (wavesurfer.current) {
              try {
                if (wavesurfer.current.microphone && isListening) {
                  wavesurfer.current.microphone.stop();
                }
                wavesurfer.current.stop();
              } catch (e) {
                console.log("خطأ طفيف أثناء إيقاف WaveSurfer من زر X:", e);
              }
            }
            // أعد تعيين الحالات
            setIsListening(false);
            setMediaRecorder(null);
            setAudioChunks([]);
            setIsProcessing(false);
            setLocalResult(null);
            // أغلق البوب آب
            if (onClose) {
              onClose();
            }
          }}
          className="absolute top-4 right-4 text-neon-green hover:text-white transition"
          aria-label="إغلاق" // إضافة ARIA label للإتاحة
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          🎤 تسجيل صوتك
        </h2>

        <div
          ref={waveformRef}
          className="w-full h-[100px] bg-cyber-800 rounded-xl overflow-hidden mb-4"
        />

        {/* عرض مؤشر المعالجة أو النتيجة داخل البوب آب */}
        {isProcessing && !localResult && (
           <div className="text-center mt-4 text-neon-blue animate-pulse">
             🔎 جارٍ التحليل...
           </div>
        )}

        {localResult && (
          <div className="text-center mt-4">
            <h3 className="text-xl font-semibold text-neon-green mb-2">
              النتيجة:
            </h3>
            {localResult.error ? (
               <p className="text-red-400 text-lg">{localResult.error}</p>
            ) : (
              <>
                <p className={`text-lg ${localResult.test_passed ? 'text-green-400' : 'text-red-300'}`}>
                  {localResult.test_passed
                    ? "✅ تهانينا! لقد لفظت الحرف المستهدف بشكل صحيح"
                    : `❌ حاول مرة أخرى، لم تلفظ الحرف "${targetLetter}" بشكل صحيح.`}
                  <br />
                  <span className="text-cyber-200 text-base">
                    نسبة التطابق: {localResult.similarity_percentage}%
                  </span>
                </p>
                
                {/* عرض الكلمة المستهدفة مع الحرف المُحاط بالأحمر إذا كانت النتيجة خاطئة */}
                {!localResult.test_passed && targetWord && targetLetter && (
                  <div className="mt-4 p-3 bg-cyber-800 rounded-lg">
                    <p className="text-lg font-medium text-cyber-200">
                      الكلمة: <span className="font-arabic text-2xl">{highlightedTargetWord}</span> {/* استخدام الكلمة المُبرَزة */}
                    </p>
                    <p className="text-sm text-cyber-400 mt-1">
                      حاول التركيز على الحرف الملون بالأحمر.
                    </p>
                  </div>
                )}

                {/* زر إعادة المحاولة يظهر فقط إذا فشلت المحاولة */}
                {!localResult.test_passed && (
                  <button
                    onClick={handleRetry}
                    className="mt-4 px-4 py-2 bg-neon-green text-cyber-950 rounded-full font-bold hover:bg-neon-blue transition-colors"
                  >
                    إعادة المحاولة
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* زر التحكم في التسجيل داخل البوب آب */}
        <div className="flex justify-center mt-4">
           <button
             onClick={toggleRecording}
             disabled={isProcessing} // تعطيل الزر أثناء المعالجة
             className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
               isProcessing
                 ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                 : isListening
                 ? 'bg-neon-pink text-white shadow-neon-pink animate-pulse'
                 : 'bg-gradient-neon text-cyber-950 shadow-neon-green hover:shadow-neon-green/50'
             }`}
           >
             {isListening ? '⏹️ إيقاف التسجيل' : '⏺️ بدء التسجيل'}
           </button>
        </div>
      </div>
    </div>
  );
}