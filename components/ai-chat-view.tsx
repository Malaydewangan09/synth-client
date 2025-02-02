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
  // const [emailContext, setEmailContext] = useState<any[]>([])
  // Fix: Correct the typo in sidebarOpen state declaration
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Fetch emails when component mounts
  React.useEffect(() => {
    fetch('http://localhost:8080/auth/emails', {
      credentials: 'include'
    })
      .then(res => res.json())
      // .then(setEmailContext)
      .catch(error => {
        console.error('Failed to fetch emails:', error)
        toast({
          title: "Error",
          description: "Failed to load email context",
          variant: "destructive",
        })
      })
  }, [])

  // Add typing animation state
  const [isTyping, setIsTyping] = useState(false)

  // Enhanced handleSend with typing animation
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
    setIsTyping(true)

    try {
      const contextPrompt = `You are an AI email assistant named Synth AI.
      User request: ${input}`

      const result = await model.generateContent(contextPrompt)
      const response = result.response.text()

      // Add slight delay for more natural feeling
      await new Promise(resolve => setTimeout(resolve, 500))
      setIsTyping(false)

      const aiMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI response error:', error)
      setIsTyping(false)
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

  // Enhanced ParticleRing with more particles and better animation
  const ParticleRing = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
            "radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
            "radial-gradient(circle at center, rgba(244, 63, 94, 0.15) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0, 1, 0],
            x: [0, Math.random() * 600 - 300],
            y: [0, Math.random() * 600 - 300],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.1,
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
    <div className={`fixed inset-0 flex flex-col transition-all duration-300 ${
      sidebarOpen ? 'left-[250px]' : 'left-0'
    }`}>
      <Card className="flex-1 bg-zinc-950/95 border-zinc-800/50 relative overflow-hidden rounded-none">
        <ParticleRing />
        <CardContent className="p-0 flex flex-col h-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 left-0 right-0 bg-gradient-to-b from-zinc-900/90 to-zinc-900/70 backdrop-blur-md p-4 z-10 border-b border-zinc-800/50"
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
            <div className="space-y-6 p-4 max-w-4xl mx-auto">
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
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    className={`flex items-start gap-4 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        className="relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-2 border-blue-500/20"
                        />
                        <Sparkles className="w-4 h-4 text-blue-400" />
                      </motion.div>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`group relative rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 ml-auto'
                          : 'bg-zinc-800/30 backdrop-blur-sm'
                      } border border-white/5`}
                    >
                      <p className="text-sm text-zinc-200 leading-relaxed">{message.content}</p>
                      <motion.span 
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute bottom-1 right-2 text-[10px] text-zinc-500"
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </motion.span>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Enhanced typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2 pl-12"
                  >
                    <div className="flex items-center gap-2 bg-zinc-800/30 backdrop-blur-sm rounded-full px-4 py-2">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Enhanced input area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-0 p-4 bg-gradient-to-t from-zinc-900/90 to-zinc-900/70 backdrop-blur-md border-t border-zinc-800/50"
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
                className="flex-1 bg-zinc-800/50 backdrop-blur-sm rounded-xl px-4 py-3 text-zinc-200 
                  placeholder:text-zinc-500 border border-zinc-700/50 focus:border-blue-500/50 
                  focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 
                  hover:to-purple-600 text-white rounded-xl px-6 transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 
                  disabled:hover:to-purple-500"
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