"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dashboard } from '@/components/dashboard'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/user', {
          credentials: 'include',
        })
        
        if (!response.ok) {
          router.push('/')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/')
      }
    }

    checkAuth()
  }, [router])

  return <Dashboard />
}