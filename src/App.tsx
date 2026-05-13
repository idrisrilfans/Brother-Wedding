import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  MessageSquare,
  Send,
  User,
  Music,
  ChevronRight,
  Gift
} from 'lucide-react';

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // Ganti dengan API Key yang valid jika diperlukan

const SYSTEM_PROMPTS = {
  WISH_FORMATTER: `Anda adalah penyair dan ahli bahasa Indonesia yang elegan. Tugas Anda adalah merapikan ucapan selamat pernikahan dari tamu agar terdengar lebih hangat, puitis, dan tulus. Gunakan diksi yang indah namun tetap terasa personal. Berikan hanya hasil akhirnya saja.`,
  STORY_CRAFTER: `Anda adalah penulis narasi romantis. Ubah poin-poin memori pasangan menjadi 2 paragraf cerita cinta yang menyentuh hati dan elegan untuk undangan pernikahan.`,
  TOAST_ASSISTANT: `Bantu tamu membuat pidato singkat (toast) maksimal 30 detik untuk resepsi pernikahan berdasarkan poin-poin yang mereka berikan. Gaya bahasa hangat, sopan, dan berkesan.`
};

const WEDDING_DATE = new Date('2024-12-31T09:00:00');

const SectionHeading = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <motion.span 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="text-rose-400 font-serif italic text-lg block mb-2"
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-serif text-stone-800"
    >
      {title}
    </motion.h2>
    <div className="w-24 h-1 bg-rose-200 mx-auto mt-6 rounded-full" />
  </div>
);

const CountdownItem = ({ value, label }) => (
  <div className="flex flex-col items-center p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm w-20 md:w-24">
    <span className="text-2xl md:text-3xl font-serif font-bold text-stone-800">{value}</span>
    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-1">{label}</span>
  </div>
);

export default function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [guestWish, setGuestWish] = useState('');
  const [formattedWish, setFormattedWish] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);
  const [wishes, setWishes] = useState([
    { name: "Sari & Budi", text: "Selamat menempuh hidup baru untuk kedua mempelai yang berbahagia! Semoga cinta kalian abadi selamanya." },
    { name: "Andi Wijaya", text: "Semoga perjalanan baru ini dipenuhi dengan tawa dan kebahagiaan yang tak terhingga." }
  ]);
  
  const [storyInput, setStoryInput] = useState({ met: '', date: '', memory: '' });
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  const [toastInput, setToastInput] = useState('');
  const [generatedToast, setGeneratedToast] = useState('');
  const [isGeneratingToast, setIsGeneratingToast] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = WEDDING_DATE - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const callGemini = async (prompt, systemInstruction) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
      console.error("AI Error:", error);
      return "Maaf, terjadi kesalahan saat memproses teks.";
    }
  };

  const handleFormatWish = async () => {
    if (!guestWish) return;
    setIsFormatting(true);
    const result = await callGemini(guestWish, SYSTEM_PROMPTS.WISH_FORMATTER);
    setFormattedWish(result);
    setIsFormatting(false);
  };

  const handleGenerateStory = async () => {
    if (!storyInput.met) return;
    setIsGeneratingStory(true);
    const prompt = `Bertemu di: ${storyInput.met}. Kencan pertama: ${storyInput.date}. Memori: ${storyInput.memory}`;
    const result = await callGemini(prompt, SYSTEM_PROMPTS.STORY_CRAFTER);
    setGeneratedStory(result);
    setIsGeneratingStory(false);
  };

  const handleGenerateToast = async () => {
    if (!toastInput) return;
    setIsGeneratingToast(true);
    const result = await callGemini(toastInput, SYSTEM_PROMPTS.TOAST_ASSISTANT);
    setGeneratedToast(result);
    setIsGeneratingToast(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans selection:bg-rose-100 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-stone-900/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover"
            alt="Wedding Background"
          />
        </motion.div>

        <div className="relative z-20 text-white space-y-6">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.4em] font-light"
          >
            The Wedding Of
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-serif"
          >
            Aditya & Clarissa
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-4 mt-12"
          >
            <CountdownItem value={timeLeft.days} label="Days" />
            <CountdownItem value={timeLeft.hours} label="Hours" />
            <CountdownItem value={timeLeft.minutes} label="Mins" />
            <CountdownItem value={timeLeft.seconds} label="Secs" />
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-[1px] h-16 bg-white/50 mx-auto" />
        </motion.div>
      </section>

      {/* Love Story Section (AI Powered) */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <SectionHeading title="Our Journey" subtitle="Kisah Cinta Kami" />
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-rose-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Ceritakan Kisah Anda
            </h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Di mana kalian bertemu?"
                className="w-full p-4 bg-stone-50 rounded-xl outline-none border border-transparent focus:border-rose-200 transition-all"
                value={storyInput.met}
                onChange={e => setStoryInput({...storyInput, met: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Kapan kencan pertama?"
                className="w-full p-4 bg-stone-50 rounded-xl outline-none border border-transparent focus:border-rose-200 transition-all"
                value={storyInput.date}
                onChange={e => setStoryInput({...storyInput, date: e.target.value})}
              />
              <textarea 
                placeholder="Tuliskan satu memori yang paling berkesan..."
                className="w-full p-4 bg-stone-50 rounded-xl outline-none border border-transparent focus:border-rose-200 transition-all min-h-[100px]"
                value={storyInput.memory}
                onChange={e => setStoryInput({...storyInput, memory: e.target.value})}
              />
              <button 
                onClick={handleGenerateStory}
                disabled={isGeneratingStory || !storyInput.met}
                className="w-full py-4 bg-rose-400 text-white rounded-xl font-bold tracking-widest uppercase hover:bg-rose-500 transition-all flex items-center justify-center gap-3 disabled:bg-stone-200"
              >
                {isGeneratingStory ? "Merangkai Kata..." : "Rangkai Kisah Cinta"}
              </button>
            </div>
          </div>

          <div className="min-h-[300px] flex items-center justify-center border-2 border-dashed border-stone-200 rounded-3xl p-8 bg-stone-50/50">
            <AnimatePresence mode="wait">
              {generatedStory ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="prose prose-stone italic text-lg leading-relaxed text-stone-600 font-serif text-center"
                >
                  {generatedStory}
                </motion.div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Heart className="w-8 h-8 text-rose-200" />
                  </div>
                  <p className="text-stone-400 text-sm">Hasil narasi AI akan muncul di sini untuk mempercantik halaman undangan Anda.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Location Details */}
      <section className="py-24 bg-stone-100/50 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="The Event" subtitle="Waktu & Lokasi" />
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-100 text-center space-y-4"
            >
              <Calendar className="w-10 h-10 text-rose-300 mx-auto" />
              <h3 className="text-2xl font-serif">Akad Nikah</h3>
              <p className="text-stone-500 text-sm uppercase tracking-widest">Sabtu, 31 Desember 2024</p>
              <div className="flex items-center justify-center gap-2 text-rose-400">
                <Clock className="w-4 h-4" />
                <span className="font-medium">09:00 - 11:00 WIB</span>
              </div>
              <p className="text-stone-600">Hotel Mulia Senayan, Jakarta Selatan</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-stone-800 p-10 rounded-[3rem] shadow-xl text-center space-y-4 text-white"
            >
              <Calendar className="w-10 h-10 text-rose-300 mx-auto" />
              <h3 className="text-2xl font-serif">Resepsi</h3>
              <p className="text-stone-400 text-sm uppercase tracking-widest">Sabtu, 31 Desember 2024</p>
              <div className="flex items-center justify-center gap-2 text-rose-300">
                <Clock className="w-4 h-4" />
                <span className="font-medium">19:00 - 21:00 WIB</span>
              </div>
              <p className="text-stone-300">Grand Ballroom, Hotel Mulia Jakarta</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* RSVP & Wish Formatter (AI Integration) */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <SectionHeading title="RSVP & Wishes" subtitle="Konfirmasi Kehadiran" />
        
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-rose-100 border border-rose-50">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 block font-bold">Nama Lengkap</label>
                <input type="text" className="w-full p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 ring-rose-100 transition-all" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 block font-bold">Jumlah Tamu</label>
                <select className="w-full p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 ring-rose-100 appearance-none">
                  <option>1 Orang</option>
                  <option>2 Orang</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Ucapan & Doa Restu</label>
                <button 
                  onClick={handleFormatWish}
                  disabled={isFormatting || !guestWish}
                  className="text-[10px] flex items-center gap-1 text-rose-500 font-bold uppercase tracking-widest hover:text-rose-600 transition-colors disabled:opacity-50"
                >
                  {isFormatting ? <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Perindah Ucapan (AI)
                </button>
              </div>
              <textarea 
                value={guestWish}
                onChange={(e) => setGuestWish(e.target.value)}
                className="w-full p-6 bg-stone-50 rounded-2xl outline-none focus:ring-2 ring-rose-100 transition-all min-h-[120px] text-stone-700"
                placeholder="Tulis ucapan selamat Anda di sini..."
              />
            </div>

            <AnimatePresence>
              {formattedWish && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-rose-50 rounded-2xl border border-rose-100"
                >
                  <p className="text-[10px] uppercase tracking-widest text-rose-400 font-bold mb-2 italic">Rekomendasi AI:</p>
                  <p className="text-stone-700 italic font-serif leading-relaxed text-sm">"{formattedWish}"</p>
                  <div className="flex gap-4 mt-4">
                    <button 
                      onClick={() => { setGuestWish(formattedWish); setFormattedWish(''); }}
                      className="text-[10px] font-bold text-rose-600 underline"
                    >Gunakan Teks Ini</button>
                    <button 
                      onClick={() => setFormattedWish('')}
                      className="text-[10px] font-bold text-stone-400"
                    >Abaikan</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button className="w-full py-5 bg-stone-800 text-white rounded-2xl font-bold tracking-widest uppercase hover:bg-stone-900 transition-all flex items-center justify-center gap-3 shadow-lg shadow-stone-200">
              <Send className="w-4 h-4" /> Kirim Konfirmasi
            </button>
          </div>
        </div>
      </section>

      {/* AI Toast Assistant */}
      <section className="py-24 px-6 bg-stone-800 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-400/10 blur-[100px] rounded-full" />
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHeading title="Guest Speech" subtitle="AI Toast Assistant" />
          <p className="text-center text-stone-400 -mt-8 mb-12 max-w-xl mx-auto text-sm">
            Ingin memberikan ucapan di panggung tapi bingung menyusun kata? AI kami siap membantu Anda menyusun pidato singkat yang elegan.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <textarea 
                value={toastInput}
                onChange={e => setToastInput(e.target.value)}
                placeholder="Contoh: Sahabat SMP Aditya, hobi main bola bareng, doa agar bahagia selalu..."
                className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl outline-none focus:border-rose-400 transition-all min-h-[150px] text-white placeholder:text-stone-500"
              />
              <button 
                onClick={handleGenerateToast}
                disabled={isGeneratingToast || !toastInput}
                className="px-8 py-4 bg-rose-400 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingToast ? "Mempersiapkan Pidato..." : "Buat Teks Pidato"}
              </button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 min-h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {generatedToast ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="text-stone-300 font-serif italic text-lg text-center"
                  >
                    "{generatedToast}"
                  </motion.div>
                ) : (
                  <div className="text-stone-500 text-sm text-center italic">
                    Teks pidato akan muncul di sini...
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Section */}
      <section className="py-24 px-6 text-center">
        <SectionHeading title="Wedding Gift" subtitle="Tanda Kasih" />
        <div className="max-w-sm mx-auto bg-white p-10 rounded-[3rem] shadow-sm border border-stone-100">
          <Gift className="w-12 h-12 text-rose-300 mx-auto mb-6" />
          <p className="text-stone-600 mb-8 text-sm">Bagi bapak/ibu yang ingin mengirimkan tanda kasih, dapat melalui rekening berikut:</p>
          <div className="space-y-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <p className="text-[10px] uppercase font-bold text-stone-400 mb-1 tracking-tighter">BCA</p>
              <p className="text-xl font-serif text-stone-800">123 456 7890</p>
              <p className="text-xs text-stone-500 mt-1">Rifky Mohammad Taufik</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center bg-[#faf9f6] border-t border-stone-100">
        <Heart className="w-6 h-6 text-rose-300 mx-auto mb-6 fill-rose-300" />
        <h2 className="text-3xl font-serif text-stone-800 mb-4">Aditya & Clarissa</h2>
        <p className="text-xs text-stone-400 uppercase tracking-[0.5em] mb-12">31 . 12 . 2024</p>
        <div className="flex justify-center gap-6">
          <Music className="w-5 h-5 text-stone-400 cursor-pointer hover:text-rose-400 transition-colors" />
        </div>
        <p className="text-[10px] text-stone-300 mt-12 uppercase tracking-widest">Digital Invitation &bull; Powered by Gemini AI</p>
      </footer>
    </div>
  );
}