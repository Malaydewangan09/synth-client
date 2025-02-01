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

  React.useEffect(() => {
    // Check for OAuth success token in URL
    const token = searchParams.get('token')
    if (token) {
      // Store the token
      localStorage.setItem('auth_token', token)
      // Redirect to dashboard
      router.push('/dashboard')
    }
  }, [searchParams, router])

  const handleClick = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden selection:bg-purple-500/30">
      <BackgroundAnimation />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-5xl w-full px-4 space-y-16"
      >
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center space-x-3 mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <Image
                src="/assets/synth-logo.svg"
                alt="Synth Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </motion.div>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
              Synth
            </h2>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-7xl sm:text-8xl font-bold tracking-tight"
          >
            Seamless Sync.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
              Simple Pay
            </span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Card className="max-w-md mx-auto bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-2 relative z-10">
              <CardTitle className="text-3xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                Get Started
              </CardTitle>
              <CardDescription className="text-center text-white/60 text-lg">
                Sign in to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <Button
                variant="outline"
                onClick={handleClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white h-14 flex items-center justify-center gap-3 hover:opacity-90 transition-all duration-300 border-0 rounded-md shadow-xl hover:shadow-purple-500/20 transform hover:-translate-y-1"
              >
                <AnimatePresence>
                  {isHovering && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-4"
                    >
                      <FcGoogle className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="font-medium text-lg">Continue with Google</span>
                <motion.div
                  animate={{ x: isHovering ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-4"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>

              <p className="text-center text-sm text-white/40 px-4">
                By signing in, you agree to our{" "}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200">
                  Privacy Policy
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

