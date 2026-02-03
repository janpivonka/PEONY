"use client";
import { useState } from "react";
import { Terminal, Send, Sparkles, Loader2 } from "lucide-react";

export default function AgentTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    // Přidáme zprávu uživatele do historie
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      // Přidáme odpověď agenta
      setChatHistory(prev => [...prev, { role: 'agent', content: data.text }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'agent', content: "Chyba spojení s jádrem. Je API route připravena?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${isOpen ? 'h-80' : 'h-12'} w-[95%] max-w-4xl`}>
      <div className="w-full h-full bg-black/40 backdrop-blur-xl border-t border-x border-peony-base/30 rounded-t-2xl flex flex-col overflow-hidden shadow-[0_-10px_40px_rgba(255,106,193,0.15)]">

        {/* Header / Click to Open */}
        <div
          className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-peony-base" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-peony-glow">PS3B Core Agent</span>
          </div>
          <Sparkles size={14} className={isOpen ? "text-peony-base animate-pulse" : "text-white/20"} />
        </div>

        {/* Chat Area */}
        {isOpen && (
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto text-[13px] font-mono space-y-2 pr-2">
              <p className="text-white/40 italic">{">"} System initialized. Ready to expand PS3B...</p>

              {chatHistory.map((msg, i) => (
                <div key={i} className={`${msg.role === 'user' ? 'text-sakura-base' : 'text-peony-base'} mb-2`}>
                  <span className="opacity-50">{msg.role === 'user' ? '[You]: ' : '[Agent]: '}</span>
                  {msg.content}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-peony-base/50">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Processing...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="relative flex items-center gap-2 border border-white/10 rounded-lg bg-black/20 p-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your agent to build something..."
                className="flex-1 bg-transparent outline-none text-sm text-white px-2"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 hover:bg-peony-base/20 rounded-md transition-colors text-peony-base disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}