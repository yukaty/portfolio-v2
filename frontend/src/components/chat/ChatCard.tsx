import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, Briefcase, Smile, BookOpen, HelpCircle, User, AlertCircle, HatGlasses } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useChat } from "../../hooks/useChat";

interface ChatCardProps {
  initialText: string;
}

export const ChatCard: React.FC<ChatCardProps> = ({ initialText }) => {
  const { messages, isLoading, error, sendMessage, lastConfidence } = useChat();
  const [inputValue, setInputValue] = useState("");
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue("");
    await sendMessage(message);

    // Return focus to input after sending
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSuggestionClick = (text: string) => {
    if (isLoading) return;
    sendMessage(text);

    // Return focus to input after sending
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Low confidence threshold
  const showConfidenceWarning = lastConfidence !== null && lastConfidence < 0.4;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.8,
        delay: shouldReduceMotion ? 0 : 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative"
    >
      {/* Main Card */}
      <div
        className="bg-bg-card rounded-3xl shadow-md-4 border border-border-primary p-4 sm:p-6 md:p-8 max-w-md mx-auto w-full relative z-10 flex flex-col h-125 sm:h-138 md:h-150 transition-colors duration-300"
        role="region"
        aria-label="AI Chat Interface"
      >
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 border-b border-border-primary pb-3 sm:pb-4 shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-coral-400 to-coral-600 flex items-center justify-center text-white shadow-md-2">
            <Bot size={24} className="sm:w-7 sm:h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-text-primary text-base sm:text-lg truncate">
              Yuka's AI Assistant
            </h3>
            <p className="text-xs text-text-secondary font-medium">
              Powered by Gemini + RAG
            </p>
          </div>
          <Sparkles className="text-coral w-4 h-4 sm:w-5 sm:h-5 animate-pulse-slow shrink-0" />
        </div>

        {/* Chat Area */}
        <div
          ref={chatAreaRef}
          className="flex-1 overflow-y-auto mb-4 sm:mb-6 pr-1 sm:pr-2"
          role="log"
          aria-live="polite"
          aria-atomic="false"
          aria-label="Chat conversation"
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Initial Greeting */}
            <div className="flex gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-bg-app shrink-0 flex items-center justify-center text-coral-600 shadow-sm border border-border-primary">
                <Bot size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="bg-bg-input/50 text-text-primary border border-border-primary rounded-2xl rounded-tl-none p-3 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm">
                {initialText}
              </div>
            </div>

            {/* Message History */}
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 sm:gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0 flex items-center justify-center text-white shadow-sm ${msg.role === "user"
                      ? "bg-coral-500 shadow-md-1"
                      : "bg-bg-app text-coral-600 border border-border-primary"
                      }`}
                  >
                    {msg.role === "user" ? (
                      <User size={16} className="sm:w-5 sm:h-5" />
                    ) : (
                      <Bot size={20} className="sm:w-6 sm:h-6" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] sm:max-w-[80%] p-3 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm rounded-2xl ${msg.role === "user"
                      ? "bg-coral-600 text-white border border-coral-500/30 rounded-tr-none"
                      : "bg-bg-input/50 text-text-primary border border-border-primary rounded-tl-none"
                      }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>


            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 sm:gap-4"
                aria-label="AI is typing"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-bg-app border border-border-primary shrink-0 flex items-center justify-center text-coral-600 shadow-sm">
                  <Bot size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="bg-bg-app/50 border border-border-primary rounded-2xl rounded-tl-none p-3 sm:p-4 text-text-primary text-xs sm:text-sm shadow-sm flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-coral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-coral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "200ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-coral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "400ms" }}
                  />
                </div>
              </motion.div>
            )}

            {/* Confidence Warning */}
            {showConfidenceWarning && !isLoading && messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-800">
                  The AI might not have enough information about this topic. For
                  detailed questions, please{" "}
                  <a
                    href="https://linkedin.com/in/yukaty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-amber-900 font-semibold"
                  >
                    reach out on LinkedIn
                  </a>
                  .
                </p>
              </motion.div>
            )}

            {error && (
              <p className="text-red-500 text-xs text-center" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSend}
          className="relative mb-4 sm:mb-6 shrink-0"
        >
          <label htmlFor="chat-input" className="sr-only">
            Type your question
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
            aria-label="Chat message input"
            className="w-full bg-bg-input border-2 border-border-primary rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-200 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            className={`absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-coral-400 ${!inputValue.trim() || isLoading
              ? "bg-bg-app text-text-muted cursor-not-allowed"
              : "bg-coral-600 text-white hover:bg-coral-700"
              }`}
          >
            <Send size={14} className="sm:w-4 sm:h-4" />
          </button>
        </form>

        {/* Suggestions Chips */}
        <div className="shrink-0">
          <p className="text-xs sm:text-sm text-text-secondary font-medium mb-2 sm:mb-3">
            Try asking:
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {[
              { icon: Smile, text: "The Pitch" },
              { icon: Briefcase, text: "Work Style" },
              { icon: BookOpen, text: "Tech Insights" },
              { icon: HelpCircle, text: "How This Works?" },
            ].map((chip) => (
              <button
                key={chip.text}
                onClick={() => handleSuggestionClick(chip.text)}
                disabled={isLoading}
                aria-label={`Ask: ${chip.text}`}
                className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 bg-bg-card border border-border-accent/30 text-coral-600 text-xs sm:text-sm font-semibold rounded-xl hover:bg-coral-50 focus:outline-none focus:ring-2 focus:ring-coral-300 transition-all duration-md-short disabled:opacity-50 disabled:cursor-not-allowed text-left shadow-sm hover:shadow-md"
              >
                <chip.icon
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap truncate">{chip.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-center">
          <HatGlasses className="w-4 h-4 text-text-secondary" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-text-secondary font-medium">
            Conversations are not stored
          </p>
        </div>
      </div>

      {/* Decorative Card Behind */}
      <div className="absolute top-4 -right-4 w-full h-full bg-linear-to-br from-border-primary to-coral-100/20 rounded-3xl -z-10 rotate-2 transform blur-sm" />

    </motion.div>
  );
};
