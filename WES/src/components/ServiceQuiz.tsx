import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, CheckCircle2, Globe } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

type Language = "en" | "ar" | "fr";

interface Question {
  id: string;
  labels: {
    en: string;
    ar: string;
    fr: string;
  };
  type: "text" | "choice";
  options?: {
    en: string[];
    ar: string[];
    fr: string[];
  };
}

const quizData: Record<string, Question[]> = {
  "Branding": [
    {
      id: "brand-name",
      labels: {
        en: "What is your brand name?",
        ar: "ما هو اسم علامتك التجارية؟",
        fr: "Quel est le nom de votre marque ?"
      },
      type: "text"
    },
    {
      id: "brand-vibe",
      labels: {
        en: "What's the desired 'vibe' for your brand?",
        ar: "ما هي الأجواء (vibe) المطلوبة لعلامتك التجارية؟",
        fr: "Quel est 'l'esprit' (vibe) souhaité pour votre marque ?"
      },
      type: "choice",
      options: {
        en: ["Minimalist & Modern", "Bold & Aggressive", "Elegant & Luxury", "Friendly & Organic"],
        ar: ["بسيط وحديث", "جريء وقوي", "أنيق وفاخر", "ودود وعضوي"],
        fr: ["Minimaliste et Moderne", "Audacieux et Agressif", "Élégant et Luxe", "Amical et Organique"]
      }
    }
  ],
  "Website Creation": [
    {
      id: "web-purpose",
      labels: {
        en: "What is the main purpose of the website?",
        ar: "ما هو الغرض الرئيسي من الموقع؟",
        fr: "Quel est l'objectif principal du site ?"
      },
      type: "choice",
      options: {
        en: ["E-commerce", "Portfolio", "Company Profile", "Blog / Educational"],
        ar: ["تجارة إلكترونية", "معرض أعمال", "ملف الشركة", "مدونة / تعليمية"],
        fr: ["E-commerce", "Portfolio", "Profil d'entreprise", "Blog / Éducatif"]
      }
    },
    {
      id: "web-features",
      labels: {
        en: "Any specific features needed?",
        ar: "أي ميزات محددة مطلوبة؟",
        fr: "Des fonctionnalités spécifiques nécessaires ?"
      },
      type: "text"
    }
  ],
  "AI Automation": [
    {
      id: "ai-bottleneck",
      labels: {
        en: "What is your biggest manual task bottleneck?",
        ar: "ما هي أكبر عقبة تواجهك في المهام اليدوية؟",
        fr: "Quel est votre plus gros goulot d'étranglement manuel ?"
      },
      type: "text"
    },
    {
      id: "ai-goal",
      labels: {
        en: "What do you want the AI to achieve?",
        ar: "ماذا تريد أن يحقق الذكاء الاصطناعي؟",
        fr: "Qu'attendez-vous de l'IA ?"
      },
      type: "choice",
      options: {
        en: ["Auto-response to clients", "Personalized recommendations", "Task management", "Data analysis"],
        ar: ["رد تلقائي على العملاء", "توصيات شخصية", "إدارة المهام", "تحليل البيانات"],
        fr: ["Réponse auto aux clients", "Recommandations personnalisées", "Gestion des tâches", "Analyse de données"]
      }
    }
  ]
};

const translations = {
  selectLang: {
    en: "Select a language to get started",
    ar: "اختر لغة للبدء",
    fr: "Sélectionnez une langue pour commencer"
  },
  next: {
    en: "Next",
    ar: "التالي",
    fr: "Suivant"
  },
  submit: {
    en: "Submit",
    ar: "إرسال",
    fr: "Envoyer"
  },
  done: {
    en: "Choose how you'd like to contact us",
    ar: "اختر كيف ترغب في التواصل معنا",
    fr: "Choisissez comment vous souhaitez nous contacter"
  },
  instaDesc: {
    en: "You will contact us in Instagram",
    ar: "ستتواصل معنا عبر إنستغرام",
    fr: "Vous nous contacterez sur Instagram"
  },
  whatsappDesc: {
    en: "You will contact us in WhatsApp",
    ar: "ستتواصل معنا عبر واتساب",
    fr: "Vous nous contacterez sur WhatsApp"
  },
  close: {
    en: "Close",
    ar: "إغلاق",
    fr: "Fermer"
  }
};

interface ServiceQuizProps {
  serviceName: string | null;
  onClose: () => void;
}

export const ServiceQuiz = memo(function ServiceQuiz({ serviceName, onClose }: ServiceQuizProps) {
  const [step, setStep] = useState<"lang" | "questions" | "done">("lang");
  const [lang, setLang] = useState<Language>("en");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [copied, setCopied] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!serviceName) return null;

  const questions = quizData[serviceName] || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleLangSelect = (l: Language) => {
    setLang(l);
    setStep("questions");
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsSaving(true);
      setError(null);
      // Auto-save to Firebase
      try {
        await addDoc(collection(db, "requests"), {
          service: serviceName,
          language: lang,
          answers: answers,
          createdAt: serverTimestamp(),
          status: "pending"
        });
        setStep("done");
      } catch (err: any) {
        console.error("Error saving request:", err);
        setError("Could not save request. Please try direct contact.");
        setStep("done"); // Still show done so they can use WhatsApp
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getFormattedMessage = () => {
    let msg = `*New Request* 🚀\n\n`;
    msg += `*Service:* ${serviceName}\n`;
    msg += `*Language:* ${lang.toUpperCase()}\n\n`;
    msg += `--- *Details* ---\n\n`;
    questions.forEach((q) => {
      msg += `*${q.labels[lang]}*\n└ ${answers[q.id] || "N/A"}\n\n`;
    });
    return encodeURIComponent(msg);
  };

  const handleWhatsApp = () => {
    const text = getFormattedMessage();
    // This pre-fills the message directly in WhatsApp for the specific number
    window.open(`https://api.whatsapp.com/send?phone=213542465402&text=${text}`, '_blank');
  };

  const handleInstagram = () => {
    let msg = `New Request - ${serviceName}\n\n`;
    questions.forEach((q) => {
      msg += `${q.labels[lang]}: ${answers[q.id]}\n`;
    });
    
    // Copy to clipboard
    navigator.clipboard.writeText(msg).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Open direct message thread
      window.open(`https://ig.me/m/wesker_dev`, '_blank');
    }).catch(() => {
      window.open(`https://ig.me/m/wesker_dev`, '_blank');
    });
  };

  const isRtl = lang === "ar";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-brand-green/20 backdrop-blur-3xl" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-xl bg-black border-2 border-brand-green/30 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden"
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-brand-green/50 hover:text-brand-green transition-colors"
        >
          <X size={24} />
        </button>

        <AnimatePresence mode="wait">
          {step === "lang" && (
            <motion.div 
              key="lang"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mb-6">
                <Globe size={32} />
              </div>
              <h2 className="script-text text-2xl text-brand-green mb-8">{translations.selectLang[lang]}</h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {[
                  { id: "en", label: "English" },
                  { id: "ar", label: "العربية" },
                  { id: "fr", label: "Français" }
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleLangSelect(l.id as Language)}
                    className="flex-1 py-4 px-6 rounded-2xl border-2 border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-black transition-all font-bold tracking-wide"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "questions" && (
            <motion.div 
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-4"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-brand-green/40 text-xs font-mono uppercase tracking-[0.3em]">
                  {serviceName} / {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 w-8 rounded-full transition-colors ${i <= currentQuestionIndex ? 'bg-brand-green' : 'bg-brand-green/10'}`} 
                    />
                  ))}
                </div>
              </div>

              <h2 className="script-text text-3xl md:text-4xl text-brand-green mb-8 min-h-[80px]">
                {currentQuestion.labels[lang]}
              </h2>

              <div className="space-y-4 mb-10">
                {currentQuestion.type === "text" ? (
                  <input 
                    autoFocus
                    type="text"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                    className="w-full bg-brand-green/5 border-2 border-brand-green/20 rounded-2xl p-6 text-brand-green focus:border-brand-green/60 outline-none transition-all placeholder:text-brand-green/20"
                    placeholder="..."
                    onKeyDown={(e) => { if (e.key === 'Enter' && answers[currentQuestion.id]) handleNext(); }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options?.[lang].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt })}
                        className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                          answers[currentQuestion.id] === opt 
                            ? 'bg-brand-green text-black border-brand-green' 
                            : 'bg-brand-green/5 text-brand-green/70 border-brand-green/10 hover:border-brand-green/30'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                disabled={!answers[currentQuestion.id] || isSaving}
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl bg-brand-green text-black font-bold tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-green/80 transition-all group"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>
                    {currentQuestionIndex === questions.length - 1 ? translations.submit[lang] : translations.next[lang]}
                    {!isRtl && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                  </>
                )}
              </button>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div 
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="script-text text-3xl text-brand-green mb-8">{translations.done[lang]}</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col gap-4 w-full">
                {/* WhatsApp Button */}
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all group text-left"
                  style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center text-white shrink-0">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-lg">WhatsApp</span>
                    <span className="text-white/40 text-xs">{translations.whatsappDesc[lang]}</span>
                  </div>
                </button>

                {/* Instagram Button */}
                <button
                  onClick={handleInstagram}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-[#E1306C]/10 border border-[#E1306C]/30 hover:bg-[#E1306C]/20 transition-all group text-left"
                  style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shrink-0">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.012 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.337 1.079 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.079-1.337 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126s-1.337-1.079-2.126-1.384c-.765-.296-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-lg">Instagram</span>
                    <span className="text-white/40 text-xs">
                      {copied ? (lang === "ar" ? "تم النسخ! جاري الفتح..." : lang === "fr" ? "Copié ! Ouverture..." : "Copied! Opening...") : translations.instaDesc[lang]}
                    </span>
                  </div>
                </button>
              </div>

              <button
                onClick={onClose}
                className="mt-8 px-12 py-3 rounded-full border border-white/10 text-white/50 text-sm hover:text-white transition-all"
              >
                {translations.close[lang]}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});
