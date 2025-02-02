"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button"
import { SendHorizontal, Bot } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { useToast } from "./ui/use-toast"
// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

import { motion, AnimatePresence } from "framer-motion"

import { Sparkles, Wand2 } from "lucide-react"

import { Menu } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIChatView() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [emailContext, setEmailContext] = useState<any[]>([])
  // Fix: Correct the typo in sidebarOpen state declaration
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Fetch emails when component mounts
  React.useEffect(() => {
    fetch('http://localhost:8080/auth/emails', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(setEmailContext)
      .catch(error => {
        console.error('Failed to fetch emails:', error)
        toast({
          title: "Error",
          description: "Failed to load email context",
          variant: "destructive",
        })
      })
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Create a context-aware prompt
      const contextPrompt = `You are an AI email assistant. You have access to the user's emails.
      
Current email context:
${JSON.stringify(emailContext, null, 2)}

User request: ${input}

If the user is asking about drafting a response or finding emails, use the email context provided.
If they're asking about a specific sender, search through the emails and provide relevant information.
Provide concise and professional responses.`

      const result = await model.generateContent(contextPrompt)
      const response = result.response.text()

      const aiMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI response error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  
  
  // Add this function for particle effect
  const ParticleRing = () => (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at center, rgba(56, 189, 248, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      />
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 1, 0],
            x: [0, Math.random() * 400 - 200],
            y: [0, Math.random() * 400 - 200],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )

  return (
    <div className={`fixed inset-0 flex flex-col transition-[left] duration-300 ${
      sidebarOpen ? 'left-[250px]' : 'left-0'
    }`}>
      <Card className="flex-1 bg-zinc-950 border-zinc-800/50 relative overflow-hidden rounded-none">
        <ParticleRing />
        <CardContent className="p-0 flex flex-col h-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-sm p-4 z-10 border-b border-zinc-800/50"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-medium text-zinc-200">Chat with Synth AI</h2>
                <p className="text-sm text-zinc-400">Ask me anything about email management and automation</p>
              </div>
            </div>
          </motion.div>

          <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
            <div className="space-y-6 p-4">
              <AnimatePresence>
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-zinc-500 py-8"
                  >
                    <motion.div
                      className="relative"
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="absolute -inset-4 opacity-50"
                        animate={{
                          background: [
                            "radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
                            "radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    </motion.div>
                    <motion.p
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      Ask me anything...
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Update message bubbles */}
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    className={`flex items-start gap-4 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-zinc-800/50"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border border-zinc-700"
                        />
                        <Sparkles className="w-4 h-4 text-zinc-400" />
                      </motion.div>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`group relative rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-zinc-800/50 ml-auto'
                          : 'bg-zinc-800/0'
                      }`}
                    >
                      <p className="text-sm text-zinc-200 leading-relaxed">{message.content}</p>
                      <span className="absolute bottom-0 right-2 text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Update loading animation */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 pl-12"
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-blue-400/50"
                        animate={{
                          y: [-4, 4, -4],
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Update input area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-0 p-4 border-t border-zinc-800/50 bg-zinc-900/80 backdrop-blur-sm"
          >
            <motion.div 
              className="flex gap-2 max-w-4xl mx-auto relative"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Message Synth AI..."
                className="flex-1 bg-zinc-800 rounded-md px-3 py-2.5 text-zinc-200 placeholder:text-zinc-500 
                  focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md px-4
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendHorizontal className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}