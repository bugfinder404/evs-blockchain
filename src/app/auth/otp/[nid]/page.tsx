'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useParams } from 'next/navigation'

export default function OTPPage() {
  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(0)  // Countdown starts at 0, will start after OTP is sent
  const [otpSent, setOtpSent] = useState(false)  // Flag to check if OTP was sent
  const [isSending, setIsSending] = useState(false)  // Flag to handle sending state
  const [nid, setNid] = useState<string | undefined>(undefined)  // State to store 'nid'

  const router = useRouter()
  const params = useParams()  // Get URL parameters using useParams()

  // Set nid from params when the component mounts
  useEffect(() => {
    if (params.nid) {
      setNid(params.nid)  // Set 'nid' when it's available
    }
  }, [params.nid])

  // Start countdown when OTP is successfully sent
  useEffect(() => {
    if (otpSent && countdown === 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => (prevCountdown < 600 ? prevCountdown + 1 : 600)) // Countdown to 600 seconds (10 minutes)
      }, 1000)

      return () => clearInterval(timer)  // Clean up the interval when the component unmounts
    }
  }, [otpSent, countdown])

  const handleSendOtp = async () => {
    if (!nid) return
    setIsSending(true)

    // Call API to send OTP
    const response = await fetch(`https://asiafashion.com.bd/e-vote-version-3.0/auth/send_otp.php?nid=${nid}`)
    const data = await response.json()

    setIsSending(false)

    if (data.status === 'success') {
      alert(data.message)
      setOtpSent(true)  // Set OTP sent flag to true
      setCountdown(0)  // Reset countdown to 0 (will start incrementing once we have success)
    } else {
      alert(data.error || 'Failed to send OTP. Please try again later.')
    }
  }

  const handleResend = async () => {
    if (!nid) return
    // Call API to resend OTP
    const response = await fetch(`https://asiafashion.com.bd/e-vote-version-3.0/auth/resend.php?nid=${nid}`)
    const data = await response.json()

    if (data.status === 'success') {
      alert(data.message)
      setOtpSent(true)  // Set OTP sent flag to true
      setCountdown(600)  // Reset countdown
    } else {
      alert(data.error || 'Failed to resend OTP. Please try again later.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) {
      alert('Please enter the OTP.')
      return
    }

    // Send OTP to backend for verification
    const response = await fetch(`https://asiafashion.com.bd/e-vote-version-3.0/auth/verify_otp.php?nid=${nid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp })
    })

    const data = await response.json()

    if (data.status === 'success') {
      alert(data.message)
      // Redirect to dashboard after successful OTP verification
      router.push('/dashboard/')  // Adjust the route to your dashboard page
    } else {
      alert(data.error || 'Invalid OTP or OTP has expired.')
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[rgb(38,219,131)]/20 via-transparent to-[rgb(38,219,131)]/20 font-poppins">
      <div className="container flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[rgb(38,219,131)]">Enter OTP</CardTitle>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <div className="text-center">
                <motion.div
                  className="text-lg text-[rgb(38,219,131)] cursor-pointer"
                  onClick={handleSendOtp}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    className="w-full bg-[rgb(38,219,131)] hover:bg-[rgb(38,219,131)]/90 text-white"
                    disabled={isSending}
                  >
                    {isSending ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="text-center text-2xl tracking-widest border-gray-300 focus:border-[rgb(38,219,131)] focus:ring-[rgb(38,219,131)]"
                      maxLength={6}
                      placeholder="••••••"
                    />
                  </div>
                  <motion.p
                    className="text-center text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {countdown > 0 ? (
                      <>Resend OTP in {Math.floor((600 - countdown) / 60)}:{(600 - countdown) % 60}</>
                    ) : (
                      <Button
                        variant="link"
                        onClick={handleResend}
                        className="p-0 h-auto text-[rgb(38,219,131)]"
                        style={{ backgroundColor: 'rgba(38, 219, 131, 0.001)' }}
                      >
                        Resend OTP
                      </Button>
                    )}
                  </motion.p>
                </form>
              </motion.div>
            )}
          </CardContent>
          <CardFooter>
            {otpSent && (
              <Button
                type="submit"
                className="w-full bg-[rgb(38,219,131)] hover:bg-[rgb(38,219,131)]/90"
                onClick={handleSubmit}
              >
                Verify OTP <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
