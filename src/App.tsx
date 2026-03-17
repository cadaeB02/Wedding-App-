import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { GoogleGenAI } from '@google/genai';
import { Heart, Sparkles, Quote, PartyPopper, Loader2 } from 'lucide-react';
import { COUPLE_CONTEXT } from './coupleContext';

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }
  return new GoogleGenAI({ apiKey });
};

export default function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMarried, setIsMarried] = useState(false);
  const [vows, setVows] = useState('');
  const [isGeneratingVows, setIsGeneratingVows] = useState(false);
  const [advice, setAdvice] = useState('');
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  const weddingDate = new Date('2026-04-10T00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const totalSeconds = differenceInSeconds(weddingDate, now);
      
      if (totalSeconds <= 0) {
        setIsMarried(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: differenceInDays(weddingDate, now),
          hours: differenceInHours(weddingDate, now) % 24,
          minutes: differenceInMinutes(weddingDate, now) % 60,
          seconds: differenceInSeconds(weddingDate, now) % 60,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#ff69b4', '#ff1493']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#ff69b4', '#ff1493']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const generateVows = async () => {
    setIsGeneratingVows(true);
    try {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a short, extremely silly, and slightly absurd wedding vow for a couple named Torin Gregory and Molly Anne. Make it funny but ultimately sweet. Keep it under 4 sentences. \n\nHere is some background info on them. IMPORTANT: Use these details very subtly. Do not list their hobbies or traits. Just weave one or two small references in naturally so it feels organic and not forced:\n${COUPLE_CONTEXT}`,
      });
      setVows(response.text || 'Oops, the vow generator got cold feet!');
    } catch (error) {
      console.error(error);
      setVows('Failed to generate vows. The internet must be crying tears of joy.');
    } finally {
      setIsGeneratingVows(false);
    }
  };

  const generateAdvice = async () => {
    setIsGeneratingAdvice(true);
    try {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Give one piece of highly unconventional, funny, but surprisingly practical marriage advice for a couple named Torin Gregory and Molly Anne. Keep it to one or two sentences. \n\nHere is some background info on them. IMPORTANT: Use these details very subtly. Do not list their hobbies or traits. Just weave one or two small references in naturally so it feels organic and not forced:\n${COUPLE_CONTEXT}`,
      });
      setAdvice(response.text || 'The oracle is currently on a honeymoon.');
    } catch (error) {
      console.error(error);
      setAdvice('Failed to consult the oracle. Try again later!');
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 font-sans selection:bg-rose-200">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white/50 backdrop-blur-sm border-b border-rose-100 py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
            Torin Gregory & Molly Anne
          </h1>
          <p className="text-xl md:text-2xl text-rose-600 font-medium mb-8">
            Are tying the knot!
          </p>
          
          {isMarried ? (
            <div className="bg-white/80 p-8 rounded-3xl border border-rose-200 shadow-sm max-w-lg mx-auto">
              <p className="text-xl md:text-2xl font-medium text-slate-800 italic leading-relaxed">
                "what did you expect? a cool suprise?<br/>
                The timer was hard enough. enjoy your marriage dawgs."
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-center">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((unit) => (
                <div key={unit.label} className="bg-white shadow-sm rounded-2xl p-4 min-w-[100px] border border-rose-100">
                  <div className="text-3xl md:text-4xl font-bold text-slate-800 font-mono">
                    {Math.max(0, unit.value).toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mt-1 font-semibold">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isMarried && (
            <p className="mt-6 text-sm text-slate-500 uppercase tracking-widest font-semibold">
              April 10, 2026
            </p>
          )}
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        
        {/* Celebrate Button */}
        <section className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerConfetti}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-rose-200 hover:shadow-xl transition-all"
          >
            <PartyPopper className="w-6 h-6" />
            Click for Instant Joy
          </motion.button>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Vow Generator */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-800">Silly Vow Generator</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Need some inspiration for the big day? Let AI write some completely absurd vows for you.
            </p>
            <div className="bg-rose-50/50 p-4 rounded-xl mb-6 text-xs text-slate-500 italic border border-rose-100/50">
              <strong>Note from Cade:</strong> I didn't specifically write these vows! They are generated by AI. This site was just built to be a funny and nice way to congratulate you both—there is absolutely no intention of being mean!
            </div>
            <button
              onClick={generateVows}
              disabled={isGeneratingVows}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isGeneratingVows ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Vows'}
            </button>
            
            {vows && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-rose-50 rounded-2xl relative"
              >
                <Quote className="w-8 h-8 text-rose-200 absolute top-4 left-4 -z-10" />
                <p className="text-slate-700 italic relative z-10 leading-relaxed">
                  "{vows}"
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Advice Generator */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                <Quote className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-800">The Oracle of Marriage</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Receive highly unconventional (but surprisingly practical) marriage advice.
            </p>
            <div className="bg-indigo-50/50 p-4 rounded-xl mb-6 text-xs text-slate-500 italic border border-indigo-100/50">
              <strong>Note from Cade:</strong> I didn't specifically write this advice! It is generated by AI. This site was just built to be a funny and nice way to congratulate you both—there is absolutely no intention of being mean!
            </div>
            <button
              onClick={generateAdvice}
              disabled={isGeneratingAdvice}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isGeneratingAdvice ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Consult the Oracle'}
            </button>
            
            {advice && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-indigo-50 rounded-2xl relative"
              >
                <p className="text-slate-700 font-medium leading-relaxed">
                  {advice}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-12 text-slate-500 text-sm">
        <p>Made with ❤️ for Torin Gregory & Molly Anne</p>
        <p className="mt-2">See you on April 10, 2026!</p>
      </footer>
    </div>
  );
}
