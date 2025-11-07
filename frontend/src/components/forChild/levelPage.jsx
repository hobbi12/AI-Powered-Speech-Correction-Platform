// LevelPage.jsx
import React, { useEffect, useRef, useState, useMemo } from "react"; // Ensure useMemo is imported
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../navbar";
import VoicePopup from "../forChild/voicePopup"; // Import the updated VoicePopup
import goodSound from "../../assets/sound/goodresult-82807.mp3";
import failSound from "../../assets/sound/failed-295059.mp3";
import {
  Mic,
  ArrowRight,
  Target,
  Trophy,
  Star,
  Play,
  Pause,
} from "lucide-react";

export default function LevelPage() {
  const [currentLevel, setCurrentLevel] = useState({});
  const [nextLevel, setNextLevel] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState(null); // Keeps the final result for display
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const { lan, letter, level } = useParams();
  const token = localStorage.getItem("token");
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Memoized function for highlighting (as provided previously)
  const highlightedWord = useMemo(() => {
    if (!currentLevel.test || !currentLevel.letter || result === null) {
      return currentLevel.test || "";
    }

    const word = currentLevel.test;
    const targetLetter = currentLevel.letter;

    if (result?.test_passed === false) {
      const escapedTargetLetter = targetLetter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = word.split(new RegExp(`(${escapedTargetLetter})`, 'g'));

      return parts.map((part, index) =>
        part === targetLetter ? (
          <span key={index} style={{ color: 'red', fontWeight: 'bold' }}>{part}</span>
        ) : (
          part
        )
      );
    } else {
      return word;
    }
  }, [currentLevel.test, currentLevel.letter, result]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  };
  useEffect(() => {
    fetch(`http://localhost:9999/api/${lan}/levels/`)
      .then((res) => res.json())
      .then((data) => {
        const allLevels = data.levels.filter((elem) => elem.letter === letter);
        // Fix potential spread operator misuse if filter returns single object
        const current = allLevels.find((elem) => elem.level === level); // Safer way
        const next = allLevels.find((elem) => Number(elem.level) === Number(level) + 1);
        setCurrentLevel(current || {});
        setNextLevel(next || null);
        // console.log(data)
      });
  }, [lan, letter, level]);

  useEffect(() => {
    if (audioRef.current && currentLevel.media_url) { // Check if media_url exists
      audioRef.current.src = `http://localhost:9999${currentLevel.media_url}`;
       // Optional: Auto-play on load or level change
      // audioRef.current.play().catch(err => console.log("Autoplay prevented:", err));
      // audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [currentLevel]); // Depend on currentLevel to update src

  useEffect(() => {
    if (result) {
      const audio = new Audio(result.test_passed ? goodSound : failSound);
      audio.play().catch((err) => console.warn("فشل تشغيل الصوت:", err));
    }
  }, [result]);

  const handleNextLevel = () => {
    setResult(null);
    const passed = JSON.parse(localStorage.getItem("passedLevels")) || [];
    const newPassed = {
      letter: currentLevel.letter,
      level: currentLevel.level,
    };
    const alreadyPassed = passed.some(
      (item) => item.letter === newPassed.letter && item.level === newPassed.level
    );
    if (!alreadyPassed) {
      passed.push(newPassed);
      localStorage.setItem("passedLevels", JSON.stringify(passed));
    }
    if (!nextLevel) {
      navigate(`/ChildPage/${lan}`);
      return;
    }
    navigate(`/levelPage/${lan}/${nextLevel.letter}/${nextLevel.level}`);
  };

  const handlePopupResult = (popupResult) => {
    if (popupResult?.test_passed) {
       setResult(popupResult); // تحديث حالة النتيجة في LevelPage فقط إذا نجحت
    }
    // إذا فشلت، VoicePopup يتعامل معها داخلياً ولا يرسلها هنا
 };

  return (
    <div className="relative min-h-screen bg-gradient-dark text-white overflow-hidden">
      <Navbar isUser={!!token} />
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <Target className="w-4 h-4 animate-pulse" />
              AI Learning Level {level}
            </div>
            <h1 className="text-responsive-xl font-bold text-white mb-4">
              Master the <span className="gradient-text" data-text="Letter">Letter</span>
            </h1>
            <p className="text-cyber-300 text-lg">
              Practice pronunciation and recognition with AI-powered feedback
            </p>
          </div>
          <div className="card-gradient p-10 rounded-3xl shadow-glass border border-neon-blue/20 backdrop-blur-md animate-fade-in-up">
            <div className="flex flex-col lg:flex-row justify-between items-center w-full lg:space-x-10">
              <div className="flex flex-col items-center mb-8 lg:mb-0">
                <div className="relative">
                  <div className="bg-gradient-neon w-72 h-72 rounded-full flex justify-center items-center shadow-neon-blue neon-glow animate-pulse">
                    <h1 className="text-cyber-950 text-9xl font-extrabold">{currentLevel.letter}</h1>
                  </div>
                  <div className="absolute inset-0 bg-gradient-neon rounded-full opacity-30 animate-pulse"></div>
                </div>
                <div className="mt-6 text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-neon-yellow" />
                    <span className="text-white font-semibold">Level {level}</span>
                  </div>
                  <div className="w-32 h-2 bg-cyber-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-neon rounded-full animate-pulse" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                {/* Use the highlightedWord */}
                <h2 className="text-5xl font-bold text-white mb-6">{highlightedWord}</h2>
                <div className="relative mb-8">
                  <img src={currentLevel.wordImage} alt="Word Visual" className="w-80 h-64 object-contain rounded-2xl shadow-neon-blue hover-scale border border-neon-blue/30" />
                  <div className="absolute inset-0 bg-gradient-neon rounded-2xl opacity-10 animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-6">
                  <audio className="hidden" ref={audioRef} src={`http://localhost:9999${currentLevel.media_url}`} controls />
                  <button onClick={handlePlay} className="w-16 h-16 bg-gradient-neon hover:bg-neon-blue rounded-full shadow-neon-blue hover:shadow-neon-blue/50 transition-all duration-300 flex items-center justify-center group neon-glow">
                    {isPlaying ? <Pause className="w-8 h-8 text-cyber-950" /> : <Play className="w-8 h-8 text-cyber-950" />}
                  </button>
                  {/* Simplified button onClick */}
                  <button onClick={() => setShowPopup(true)} className="w-16 h-16 bg-gradient-neon rounded-full shadow-neon-green hover:shadow-neon-green/50 transition-all duration-300 flex items-center justify-center group animate-pulse">
                     <Mic className="w-8 h-8 text-cyber-950 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                  <button onClick={handleNextLevel} className="w-16 h-16 bg-gradient-neon hover:bg-neon-purple rounded-full shadow-neon-blue hover:shadow-neon-purple/50 transition-all duration-300 flex items-center justify-center group neon-glow">
                    <ArrowRight className="w-8 h-8 text-cyber-950 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
                {/* Result display logic remains the same */}
                {result && (
                  <div className="mt-6 text-center">
                    <p className={`text-lg font-semibold ${result?.test_passed ? "text-green-400" : "text-red-300"}`}>
                    {result?.test_passed
                      ? `✅تهانينا ! لقد لفظت الحرف المستهدف بشكل صحيح`
                      : (
                      <>حاول مرة أخرى ❌، لم تقم بلفظ الحرف المستهدف <span className="font-bold text-2xl shadow-2xl" style={{ color: 'blue' }}>( {letter} )</span> بشكل صحيح</>
                        )
                    }
                    </p>
                    <p className="text-lg mt-2 text-cyber-200">
                      نسبة التطابق: {result.similarity_percentage}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pass necessary props to VoicePopup */}
      // LevelPage.jsx (داخل return, جزء عرض VoicePopup)

{showPopup && (
  <VoicePopup
    targetWord={currentLevel.test} // تمرير الكلمة المستهدفة
    targetLetter={currentLevel.letter} // تمرير الحرف المستهدف
    onClose={() => {
      // هذه الدالة تُستدعى فقط عند الضغط على زر X أو عند الإغلاق التلقائي الناجح
      setShowPopup(false);
      // لا حاجة لإعادة تعيين result هنا، لأن VoicePopup يتعامل مع النتيجة داخلياً
      // وتُعاد تعيين result في LevelPage فقط عند النجاح عبر onResult
    }}
    onResult={(data) => {
      // هذه الدالة تُستدعى فقط من VoicePopup عندما تكون النتيجة صحيحة
      setResult(data); // تحديث حالة النتيجة في LevelPage
      setShowPopup(false); // التأكد من إغلاق البوب آب (رغم الإغلاق التلقائي)
    }}
  />
)}
    </div>
  );
}