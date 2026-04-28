"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { cn } from "../../lib/utils";
import {
  ArrowUpIcon,
  Bot,
  User,
  Loader2
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import AnimatedGradientBackground from "./animated-gradient-background";

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`; // reset first
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function RuixenMoonChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "System online. I am Wesker AI. How can I assist with your development or automation needs today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 150,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage = message.trim();
    setMessage("");
    adjustHeight(true);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ],
        config: {
          systemInstruction: "You are Wesker AI, an elite AI automation agency representative. Your primary goal is to close client deals. Keep your answers very short, punchy, conversational, and persuasive. Avoid long paragraphs. Drive the conversation towards booking a call or starting a project."
        }
      });

      const botResponse = response.text || "Diagnostic failed. Please retry connection.";
      setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
    } catch (error) {
      console.error("Wesker Error:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Neural path blocked. Check your connection or API key." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className="relative w-full h-[100dvh] md:h-[800px] flex flex-col items-center overflow-hidden border-b border-white/5"
    >
      {/* Background Pattern */}
      <AnimatedGradientBackground 
        Breathing={true}
        startingGap={125}
        breathingRange={10}
        animationSpeed={0.03}
        gradientColors={["#000000", "#000000", "#000000", "#000000", "rgba(50,60,0,1)", "rgba(100,120,0,1)", "rgba(210,255,0,0.15)"]}
        gradientStops={[0, 10, 20, 30, 60, 80, 100]}
      />

      {/* Messages Area */}
      <div className="flex-1 w-full max-w-4xl relative z-10 flex flex-col pt-16 md:pt-20 px-4 md:px-6 min-h-0">
        <div className="text-center mb-6 md:mb-10 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-center"
          >
            <div className="script-text glass-logo text-6xl md:text-7xl font-bold lowercase pb-4 select-none">
              wesker
            </div>
          </motion.div>
          <p className="text-brand-green/60 font-mono text-xs uppercase tracking-[0.4em]">
            Autonomous Agency Interface
          </p>
        </div>

        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto space-y-6 pr-4 pb-4 scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    msg.role === 'user' ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' : 'bg-white/5 border-white/10 text-white/40'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <span className="script-text font-bold lowercase leading-none text-brand-green text-lg select-none">w</span>}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm ${
                    msg.role === 'user' ? 'bg-brand-green/5 text-white' : 'bg-black/60 backdrop-blur-md text-white/80'
                  } border border-white/5`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                 <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                      <span className="script-text font-bold lowercase leading-none text-brand-green text-lg animate-pulse select-none">w</span>
                    </div>
                    <div className="flex gap-1 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/5">
                      <div className="w-1 h-1 rounded-full bg-brand-green animate-bounce" />
                      <div className="w-1 h-1 rounded-full bg-brand-green animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 rounded-full bg-brand-green animate-bounce [animation-delay:0.4s]" />
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Box Section */}
      <div className="w-full max-w-3xl z-20 px-4 md:px-6 pb-4 md:pb-10 flex-shrink-0">
        <style>{`
          @property --ai-gradient-angle {
            syntax: "<angle>";
            initial-value: 0deg;
            inherits: false;
          }

          @keyframes ai-border-rotate {
            to {
              --ai-gradient-angle: 360deg;
            }
          }

          .ai-input-glow {
            --shiny-cta-highlight: #D2FF00;
            background: linear-gradient(#0a0a0a, #0a0a0a) padding-box,
              conic-gradient(
                from var(--ai-gradient-angle),
                transparent,
                var(--shiny-cta-highlight) 5%,
                white 10%,
                var(--shiny-cta-highlight) 15%,
                transparent 20%
              ) border-box;
            border: 1px solid transparent;
            animation: ai-border-rotate 4s linear infinite;
          }
        `}</style>
        <div className="relative ai-input-glow backdrop-blur-2xl rounded-2xl shadow-[0_0_50px_rgba(210,255,0,0.1)] ring-1 ring-white/5">
          <Textarea
            ref={textareaRef}
            value={message}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustHeight();
            }}
            placeholder="Talk to Wesker AI..."
            className={cn(
              "w-full px-6 py-5 resize-none border-none",
              "bg-transparent text-white text-base font-medium font-sans",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-white/40 min-h-[48px]"
            )}
            style={{ overflow: "hidden" }}
          />

          {/* Footer Buttons */}
          <div className="flex items-center justify-end p-4 border-t border-white/5">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest hidden md:block">Press Enter to Link</span>
              <Button
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                className={cn(
                  "flex items-center gap-2 pr-5 rounded-xl transition-all",
                  message.trim() ? "bg-brand-green text-black hover:bg-white" : "bg-white/5 text-white/20"
                )}
              >
                <ArrowUpIcon className="w-4 h-4" />
                <span className="font-bold">Execute</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
