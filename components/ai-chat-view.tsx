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
import { fal } from "@fal-ai/client";
import { Download, Video, Image as ImageIcon, Camera } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL,
});

// Update Message interface
interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'image' | 'video'
  imageUrl?: string
  videoUrl?: string
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
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'video'>('chat')
  const [imagePrompt, setImagePrompt] = useState("")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  // Add generateImage function
  const generateImage = async (prompt: string) => {
    try {
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: prompt,
          seed: Math.floor(Math.random() * 1000000),
          image_size: "landscape_4_3",
          num_images: 1,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      return {
        imageUrl: result.data.images[0].url
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  };

  // Add handleImageGeneration function
  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: imagePrompt,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setImagePrompt("");
    setIsGeneratingImage(true);

    try {
      const result = await generateImage(imagePrompt);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: 'Here\'s your generated image:',
        timestamp: new Date(),
        type: 'image',
        imageUrl: result.imageUrl
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

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
          <motion.div className="sticky top-0 left-0 right-0 bg-gradient-to-b from-zinc-900/90 to-zinc-900/70 backdrop-blur-md p-4 z-10 border-b border-zinc-800/50">
            {/* Add tabs under the header */}
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-medium text-zinc-200">Synth AI Assistant</h2>
                <p className="text-sm text-zinc-400">Chat and generate images with AI</p>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={(value: 'chat' | 'image' | 'video') => setActiveTab(value)}>
              <TabsList className="bg-zinc-800/50">
                <TabsTrigger value="chat" className="data-[state=active]:bg-zinc-700/50">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-zinc-700/50">
                  Generate Image
                </TabsTrigger>
                <TabsTrigger value="video" className="data-[state=active]:bg-zinc-700/50">
                  Generate Video from image
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Update the message rendering to handle images */}
          {messages.map((message, index) => (
            <motion.div key={index}>
              {message.type === 'image' && message.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={message.imageUrl} 
                    alt="AI Generated"
                    className="rounded-lg max-w-sm mx-auto shadow-lg"
                  />
                </div>
              )}
              {/* ... rest of message rendering ... */}
            </motion.div>
          ))}

          {/* Update input area */}
          <motion.div className="sticky bottom-0 p-4 bg-gradient-to-t from-zinc-900/90 to-zinc-900/70 backdrop-blur-md border-t border-zinc-800/50">
            <motion.div className="flex gap-2 max-w-4xl mx-auto relative">
              {activeTab === 'chat' ? (
                // Existing chat input
                <>
                  {/* ... existing chat input ... */}
                </>
              ) : (
                // Image generation input
                <>
                  <input
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleImageGeneration()}
                    placeholder="Describe the image you want to generate..."
                    className="flex-1 bg-zinc-800/50 backdrop-blur-sm rounded-xl px-4 py-3 text-zinc-200 
                      placeholder:text-zinc-500 border border-zinc-700/50 focus:border-blue-500/50 
                      focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                  <Button
                    onClick={handleImageGeneration}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 
                      hover:to-purple-600 text-white rounded-xl px-6 transition-all duration-300"
                  >
                    {isGeneratingImage ? (
                      <Sparkles className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}