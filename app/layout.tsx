import "./globals.css"

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
    <html lang="en">
      <body className="min-h-screen bg-black antialiased">{children}</body>
    </html>
  )
}
