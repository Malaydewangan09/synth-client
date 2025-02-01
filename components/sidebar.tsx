"use client"

import { useEffect, useState } from 'react'
import { Button } from "./ui/button"
import { Inbox, Send, FileText, Star, AlertCircle, Archive, Mail, Calendar } from 'lucide-react'
import { SiGmail } from 'react-icons/si'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { BsMicrosoft } from "react-icons/bs"
import { Book , Cog} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Paperclip, Wand2 } from 'lucide-react'
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Add this type for email context
interface EmailContext {
  id: string;
  subject: string;
  content: string;
  from: string;
  to: string;
  date: string;
}

interface SidebarItem {
  icon: any; // Using any for brevity, but you can make this more specific
  label: string;
  active?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { icon: Inbox, label: "Inbox", active: true },
];

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return '';
};

// Add the NewsModal component before the Sidebar component
function NewsModal({ 
  open, 
  onOpenChange 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [newsResults, setNewsResults] = useState<any[]>([])

  const searchNews = async () => {
    try {
      const apiKey = 'b6ae48facdae430483bb1c9af13ee4f7'
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchTerm)}&apiKey=${apiKey}`
      )
      const data = await response.json()
      setNewsResults(data.articles?.filter((article: any) => article.source.id != null) || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>News Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term (e.g., bitcoin, technology)"
              onKeyPress={(e) => e.key === 'Enter' && searchNews()}
            />
            <Button onClick={searchNews}>Search News</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsResults.map((article, index) => (
              <div
                key={index}
                className="relative group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
              >
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative z-10">
                    <h3 className="font-semibold mb-2 text-white">{article.source.name}</h3>
                    <p className="text-sm text-white/60">
                      {article.description || 'No description available'}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Add this import at the top
import { Settings, LayoutGrid } from 'lucide-react'
import { HomeIcon } from "lucide-react"

interface SidebarProps {
  onViewChange: (view: string) => void;
  userEmail: string;
}

export function Sidebar(props: SidebarProps) {
  const { onViewChange = () => {}, userEmail = '' } = props;
  console.log('Sidebar props:', { onViewChange: typeof onViewChange, userEmail });

  // Remove the userEmail state since it's now a prop
  const [emailContext, setEmailContext] = useState<EmailContext[]>([])
  const [showIntegrateModal, setShowIntegrateModal] = useState(false)
  // const [showMemoriesModal, setShowMemoriesModal] = useState(false);
  // Add this state
  const [connectedEmail, setConnectedEmail] = useState<string>('');
  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  const handleIntegrationClick = () => {
    console.log('Integration button clicked')
    setShowIntegrateModal(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user email with simplified headers
        const userResponse = await fetch('http://localhost:8080/auth/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (userResponse.ok) {
          const userEmail = await userResponse.json();
          setConnectedEmail(userEmail);
        }
  
        // Updated emails fetch with same simplified headers
        const emailsResponse = await fetch('http://localhost:8080/auth/emails', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (emailsResponse.ok) {
          const emails = await emailsResponse.json();
          setEmailContext(emails);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [showComposeModal, setShowComposeModal] = useState(false)
  
  // Add these new state variables
  const [userMessage, setUserMessage] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const { toast } = useToast()

  async function main(userMessage: string) {
    const KEY = process.env.NEXT_PUBLIC_GEMINI;
    const genAI = new GoogleGenerativeAI(KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const completion = await model.generateContent(userMessage);
    return completion;
}


  // Add the sendMessageToAI function
  const sendMessageToAI = async (message: string) => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSendingMessage(true)
    try {
      // Use the raw email context from server
      const completion = await main(`Context: You are an AI email assistant. Here are the user's emails:
        ${JSON.stringify(emailContext)}
        
        User question: ${message}`);
      const result = completion.response.text();
      setAiResponse(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      })
    } finally {
      setIsSendingMessage(false)
    }
  }


const [toEmail, setToEmail] = useState("")
const [subject, setSubject] = useState("")
const [emailContent, setEmailContent] = useState("")
const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)

const generateEmail = async () => {
  setIsGeneratingEmail(true)
  try {
    const completion = await main(`Generate a professional email with the following context:
      To: ${toEmail}
      Subject: ${subject}
      Please write a professional email body.`);
    const result = completion.response.text();
    setEmailContent(result);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to generate email content",
      variant: "destructive",
    })
  } finally {
    setIsGeneratingEmail(false)
  }
}

  // Add this function after generateEmail
  // Add this state near other states
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const getCsrfToken = async () => {
    try {
      const response = await fetch('http://localhost:8080/csrf', {
        credentials: 'include',
      });
      if (response.ok) {
        // CSRF token will be automatically set in cookies
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      return false;
    }
  };
  // Update the sendEmail function
  const sendEmail = async () => {
    if (!toEmail || !subject || !emailContent) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
  
    setIsSendingEmail(true); // Add loading state
    try {
      // Get CSRF token first
      await getCsrfToken(); // Actually await the token fetch
      const csrfToken = getCookie('XSRF-TOKEN');

      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }
    
      const emailData = {
        to: toEmail,
        subject: subject,
        body: emailContent
      };
      
      const response = await fetch('http://localhost:8080/auth/send-email', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken, // Add the CSRF token in header
        },
        body: JSON.stringify(emailData)
      });
      console.log('Response:', response);
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server response:', errorData);
      throw new Error(`Server error: ${errorData}`);
    }

    toast({
      title: "Success",
      description: "Email sent successfully",
    });
    
    setToEmail('');
    setSubject('');
    setEmailContent('');
    setShowComposeModal(false);
  } catch (error: any) {
    console.error('Failed to send email:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to send email. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSendingEmail(false); // Reset loading state
  }
};
  
  // Update the Send button in the compose modal
  <Button onClick={sendEmail} disabled={isSendingEmail}>
    {isSendingEmail ? (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        Sending...
      </div>
    ) : (
      'Send'
    )}
  </Button>
  // Add this function at the top of the Sidebar component
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 17) return 'Good afternoon';
      return 'Good evening';
    };
  
    return (
      <aside className="w-64 flex-shrink-0 h-screen flex flex-col border-r border-white/10">
        <div className="p-4 flex-shrink-0">
          <div className="flex pt-1 pl-3 items-center gap-2 mb-6">
            <img 
              src='assets/synth-logo.svg' 
              alt="Synth Logo"
              className="w-24 h-auto" // Added size control
            />
            <p className="text-xl font-bold">synth</p>
            
          </div>
    
          {/* Email Accounts Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-white/50">Email Accounts</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-black/90 border-white/10">
                  <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/10">
                    <Mail className="mr-2 h-4 w-4" />
                    Add Gmail Account
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/10">
                    <Mail className="mr-2 h-4 w-4" />
                    Add Outlook Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
    
            {/* Connected Account */}
            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <img
                    src="./assets/gmail-logo.svg"
                    alt="Gmail"
                    className="w-6 h-6 object-contain" // Changed from w-5 h-5 to w-6 h-6
                  />
                  <span className="text-[13px] text-white/90 truncate">
                    {connectedEmail || 'Not connected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
    
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-1">
              {/* Quick Actions */}
              <div className="mt-3 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => onViewChange('home')}
                >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Home
                </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => onViewChange('integrations')}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Integrations
              </Button>

              <Button
      variant="ghost"
      className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
      onClick={() => onViewChange('memories')}
    >
      <Book className="mr-2 h-4 w-4" />
      Memories
    </Button>

              <Button
      variant="ghost"
      className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
      onClick={() => onViewChange('automation')}
    >
      <Book className="mr-2 h-4 w-4" />
      Automation
    </Button>

    <Button
      variant="ghost"
      className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
      onClick={() => onViewChange('settings')} // Changed from 'setting' to 'settings'
    >
      <Cog className="mr-2 h-4 w-4" />
      Settings
    </Button>

             <Button 
                variant="ghost" 
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => onViewChange('calendar')}
              >
                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Calendar</span>
              </Button>
            </div>
          </div>
        </div>
        </div>
    
        {/* Move the modal components here */}
        <Dialog open={showComposeModal} onOpenChange={setShowComposeModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose Email</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  placeholder="recipient@example.com"
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your message..."
                  className="min-h-[200px]"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => generateEmail()}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI Assist
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowComposeModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={sendEmail}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showIntegrateModal} onOpenChange={setShowIntegrateModal}>
        <DialogContent className="sm:max-w-md bg-[#121212] text-white border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">Add Email Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button 
              className="w-full flex items-center gap-2 bg-white hover:bg-gray-100 text-black"
              onClick={handleGoogleAuth}
            >
              <SiGmail className="h-5 w-5 text-red-500" />
              Continue with Gmail
            </Button>
            <Button 
              className="w-full flex items-center gap-2 bg-white hover:bg-gray-100 text-black"
              disabled
            >
              <BsMicrosoft className="h-5 w-5 text-blue-500" />
              Continue with Outlook (Coming Soon)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    
        <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
          <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Email Assistant</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1 p-4 border rounded-md">
              <div className="space-y-4">
                {aiResponse && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-white/90 whitespace-pre-wrap">{aiResponse}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
        
            <div className="flex gap-2 mt-4">
              <Input
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask about your emails, request drafts, or get summaries..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessageToAI(userMessage)}
              />
              <Button 
                onClick={() => sendMessageToAI(userMessage)}
                disabled={isSendingMessage}
              >
                {isSendingMessage ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  'Send'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <NewsModal open={showNewsModal} onOpenChange={setShowNewsModal} />

      
      </aside>
    )
  }
 

// iw ant a sectino which will display which email is connected please write the code for it
    
