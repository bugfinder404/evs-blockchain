'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [nid, setNid] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState<File | null>(null) // State for holding the uploaded file
  const [imagePreview, setImagePreview] = useState<string | null>(null) // State for holding the image preview
  const router = useRouter()

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    // Create a FormData object to send image and user credentials
    const formData = new FormData()
    formData.append('nid', nid)
    formData.append('password', password)
    if (image) formData.append('image', image)
  
    try {
      const response = await fetch('https://asiafashion.com.bd/e-vote-version-3.0/auth/signin.php', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
  
      const data = await response.json()
      console.log('Response data:', data) // Debugging statement
  
      // Handle the response based on 'verified' status
      if (data.image_match.status === 'success' && data.verified === "1") {
        // Redirect to dashboard if verified
        router.push('/dashboard')
      } else if (data.image_match.status === 'success' && data.verified === "0") {
        // Redirect to OTP page if not verified
        router.push(`/otp/${nid}`)
      } else {
        alert(data.error || 'Unknown error occurred.')
      }
    } catch (error) {
      console.error('Error during sign-in:', error)
      alert('Failed to sign in. Please try again later.')
    }
  }
  

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[rgb(38,219,131)]/20 via-transparent to-[rgb(38,219,131)]/20 font-poppins">
      <div className="container flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[rgb(38,219,131)]">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nid">NID Card Number</Label>
                <Input
                  id="nid"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  className="border-gray-300 focus:border-[rgb(38,219,131)] focus:ring-[rgb(38,219,131)]"
                  placeholder="Enter your NID number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:ring-[rgb(38,219,131)] outline-none focus:border-[rgb(38,219,131)]"
                  placeholder="Enter your password"
                />
              </div>
              <div className="space-y-2">
                <Label>Your Photo</Label>
                <div className="flex flex-col items-center gap-4">
                  {imagePreview ? (
                    <motion.img
                      src={imagePreview}
                      alt="Selected"
                      className="h-48 w-48 rounded-full object-cover ring-4 ring-[rgb(38,219,131)]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    />
                  ) : (
                    <div className="text-center">
                      <Label htmlFor="image" className="text-[rgb(38,219,131)]">
                        Upload your image
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-2 border-gray-300 focus:border-[rgb(38,219,131)] focus:ring-[rgb(38,219,131)]"
                      />
                    </div>
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
              Sign In <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}