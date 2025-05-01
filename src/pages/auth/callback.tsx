import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@/util/supabase/component'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()
  const { createUser } = useAuth()

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error during auth callback:', error)
        router.push('/login?error=Authentication%20failed')
        return
      }

      if (session?.user) {
        try {
          await createUser(session.user)
          router.push('/dashboard-indian')
        } catch (error) {
          console.error('Error creating user:', error)
          router.push('/login?error=User%20creation%20failed')
        }
      } else {
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router, createUser, supabase.auth])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Completing login...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}