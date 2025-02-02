"use client"
import React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FcGoogle } from "react-icons/fc"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

// Add this import at the top
import Image from 'next/image'

// Add to imports at the top
import { Space_Grotesk } from 'next/font/google'
import { Plus_Jakarta_Sans } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-plus-jakarta',
})

const handleClick = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google"

}

const BackgroundAnimation = () => {
  const particles = React.useMemo(() => 
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      width: 3 + (i % 4),
      height: 3 + (i % 4),
      top: `${(i * 5) % 100}%`,
      left: `${(i * 7) % 100}%`,
      yOffset: Math.abs(((i * 7) % 100) - 50),
      duration: 10 + (i % 5),
    })), []
  )

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {particles.map(({ id, width, height, top, left, yOffset, duration }) => (
        <motion.div
          key={id}
          className="absolute bg-white rounded-full"
          style={{
            width,
            height,
            top,
            left,
          }}
          animate={{
            y: [0, yOffset],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isHovering, setIsHovering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Check for OAuth success token in URL
    const token = searchParams.get('token')
    if (token) {
      localStorage.setItem('auth_token', token)
      router.push('/dashboard')
    }

    

    return () => clearTimeout(timer)
  }, [searchParams, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: {
              duration: 2,
              ease: "linear",
              repeat: Infinity,
            },
            scale: {
              duration: 2,
              repeat: Infinity,
            }
          }}
        >
          <Image
            src="/assets/synth-logo.svg"
            alt="Synth Logo"
            width={128}
            height={128}
            className="w-32 h-32"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-indigo-300 text-2xl font-medium"
        >
          {/* <span className="text-white/80">Synth</span> */}
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col bg-zinc-950 text-white relative overflow-hidden selection:bg-indigo-500/20 ${spaceGrotesk.variable}`}>
      <BackgroundAnimation />
      
      {/* Logo in top left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8 z-20 flex items-center space-x-1"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <Image
            src="/assets/synth-logo.svg"
            alt="Synth Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </motion.div>
        <h2 className="text-3xl font-medium text-white/90 font-inter tracking-tight">
          Synth
        </h2>
      </motion.div>

      {/* Login link in top right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 right-8 z-20"
      >
        <div className="text-zinc-400">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium ml-2">
            Log in
          </a>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-5xl w-full px-4 space-y-16 mx-auto h-screen flex flex-col items-center justify-center"
      >
        <div className="text-center space-y-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-7xl sm:text-7xl font-bold tracking-tight"
          >
            Join Synth.
            <br />
            <span className="text-indigo-400">
              Start Free
            </span>
          </motion.h1>
          
          {/* Added subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            Streamline your financial operations with automated sync and smart payments
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center"
        >
          {/* Feature highlights */}
          <div className="flex-1 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Real-time Sync</h3>
                <p className="text-zinc-400">Instant synchronization across all your financial accounts</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Bank-grade Security</h3>
                <p className="text-zinc-400">Enterprise-level encryption and security protocols</p>
              </div>
            </div>
          </div>

          {/* Sign up card */}
          <Card className="max-w-md flex-2 bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl">
            <CardHeader className="space-y-2 relative z-10">
              <CardTitle className="text-xl text-center font-bold text-indigo-300">
                Create Account
              </CardTitle>
              <CardDescription className="text-center text-zinc-400 text-md">
                Sign up to get started with Synth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <Button
                variant="outline"
                onClick={handleClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="w-full bg-indigo-500 text-white h-12 flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all duration-300 border-0 rounded-md"
              >
                <AnimatePresence>
                  {isHovering && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-11"
                    >
                      <FcGoogle className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="font-medium text-base">Continue with Google</span>
                <motion.div
                  animate={{ x: isHovering ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-11"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>

              <p className="text-center text-sm text-zinc-500 px-4">
                By signing in, you agree to our{" "}
                <a href="#" className="text-indigo-400 hover:text-indigo-300 underline transition-colors duration-200">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-400 hover:text-indigo-300 underline transition-colors duration-200">
                  Privacy Policy
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Added social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center space-y-4"
        >
         
        </motion.div>
      </motion.div>
    </div>
  )
}

