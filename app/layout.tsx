import "./globals.css"
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { AIProvider } from '@/contexts/ai-context'
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata = {
  title: 'Synth',
  description: 'AI-powered email management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      
      <body className="min-h-screen bg-black font-sans antialiased">
      <AIProvider>
          {children}
          <Toaster />
        </AIProvider>
      </body>
    </html>
  )
}
