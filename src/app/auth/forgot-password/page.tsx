'use client'

import { useState } from 'react'
<<<<<<< Tabnine <<<<<<<
import { motion } from 'framer-motion'
>>>>>>> Tabnine >>>>>>>// {"conversationId":"e98b60cd-cd1f-479c-b5ad-c7910b90b74f","source":"instruct"}
import { Camera, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState('')
  const [image, setImage] = useState<string | null>(null)

  // Simulated camera capture
  const captureImage = () => {
    // In a real app, this would use the Web Camera API
    setImage('/placeholder.svg?height=200&width=200')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted:', { phone, image })
    // Here you would typically send this data to your backend
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[rgb(38,219,131)]/20 via-transparent to-[rgb(38,219,131)]/20 font-poppins">
      <div className="container flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[rgb(38,219,131)]">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    +880
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-l-none border-gray-300 focus:border-[rgb(38,219,131)] focus:ring-[rgb(38,219,131)]"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Your Photo</Label>
                <div className="flex flex-col items-center gap-4">
                  {image ? (
                    <motion.img
                      src={image}
                      alt="Captured"
                      className="h-48 w-48 rounded-full object-cover ring-4 ring-[rgb(38,219,131)]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    />
                  ) : (
                    <Button onClick={captureImage} variant="ghost" className="text-[rgb(38,219,131)]">
                      <Camera className="mr-2 h-4 w-4" /> Capture Photo
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-[rgb(38,219,131)] hover:bg-[rgb(38,219,131)]/90"
              onClick={handleSubmit}
            >
              Send Reset Link <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}