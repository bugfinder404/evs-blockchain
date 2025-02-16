'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, PartyPopper } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function VoteSuccessPage() {
  const router = useRouter()

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#26db83]/10 via-transparent to-[#26db83]/10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={launchConfetti}
      >
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#26db83] flex items-center justify-center gap-2">
              <CheckCircle className="w-8 h-8" />
              Vote Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-gray-600 mb-4">
                Thank you for participating in the democratic process. Your vote has been recorded successfully.
              </p>
              <PartyPopper className="w-16 h-16 mx-auto text-[#26db83]" />
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => router.push('/dashboard')} className="bg-[#26db83] hover:bg-[#1fa76a]">
                Back to Dashboard
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}