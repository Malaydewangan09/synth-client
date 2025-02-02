import "./globals.css"
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'Sign up - Synth',
  description: 'AI-powered email management',
  icons: {
    icon: [
      {
        url: '/assets/synth-logo.svg',
        href: '/assets/synth-logo.svg',
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black antialiased">{children}</body>
    </html>
  )
}
