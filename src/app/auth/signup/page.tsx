'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
}

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [faceMatch, setFaceMatch] = useState<boolean | null>(null)

  const [formData, setFormData] = useState({
    nid: '',
    fullName: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  
  const [nidInfo, setNidInfo] = useState<any>(null)
  const router = useRouter()

  // useEffect(() => {
  //   if (formData.nid.length === 15) {
  //     setLoading(true)
  //     setError(null)

  //     fetch(`https://asiafashion.com.bd/e-vote-version-3.0/auth/send_user_data.php?nid=${formData.nid}`, {
  //       method: 'GET',
  //     })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok')
  //       }
  //       return response.json()
  //     })
  //     .then(data => {
  //       if (data.error) {
  //         setError(data.error)
  //       } else if (data) {
  //         setNidInfo(data)
  //       } else {
  //         setError("User not found")
  //       }
  //     })
  //     .catch(err => {
  //       setError("Error fetching user data: " + err.message)
  //     })
  //     .finally(() => {
  //       setLoading(false)
  //     })
  //   }
  // }, [formData.nid])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size exceeds 2MB limit')
        return
      }

      const validTypes = ['image/jpeg', 'image/png']
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a JPG or PNG image.')
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const handleImageSubmit = async () => {
    if (!formData.nid || !imageFile) {
      setError("Please provide both NID and image");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const formDataToSend = new FormData();
    formDataToSend.append('image', imageFile);
  
    try {
      const response = await fetch(
        `https://asiafashion.com.bd/e-vote-version-3.0/auth/send_user_data.php?nid=${formData.nid}`,
        {
          method: 'POST',
          body: formDataToSend,  // No need to set Content-Type header explicitly when using FormData
          credentials: 'include',  // Include cookies/tokens (if needed)
        }
      );
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      if (data.error) {
        setError(data.error);
        return;
      }
  
      if (data.face_comparison && typeof data.face_comparison.match === 'boolean') {
        setFaceMatch(data.face_comparison.match);
        if (data.face_comparison.match) {
          setNidInfo(data.user_data);
          setStep(2);
        } else {
          setError("Face verification failed. Please try again with a clearer photo.");
        }
      } else {
        setError("Invalid response from face comparison");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing image');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(
        `https://asiafashion.com.bd/e-vote-version-3.0/auth/signup.php?nid=${formData.nid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: formData.password,
            confirm_password: formData.confirmPassword,
          }),
          credentials: 'include',  // Ensures cookies or tokens are included
        }
      );
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      if (data.success) {
        alert("Password set successfully! You will be redirected to OTP.");
        setTimeout(() => {
          router.push(`/auth/otp/${formData.nid}`);
        }, 1500);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during signup');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[rgb(38,219,131)]/20 via-transparent to-[rgb(38,219,131)]/20 font-poppins">
      <div className="container flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[rgb(38,219,131)]">
              {step === 1 && 'Sign Up'}
              {step === 2 && 'Confirm Your Details'}
              {step === 3 && 'Set Password'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nid">NID Card Number</Label>
                      <Input
                        id="nid"
                        value={formData.nid}
                        onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                        placeholder="Enter your NID number"
                        className="border-gray-300 focus:border-[rgb(38,219,131)] focus:ring-[rgb(38,219,131)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Your Photo</Label>
                      <div className="flex flex-col items-center gap-4">
                        {image ? (
                          <div className="relative">
                            <motion.img
                              src={image}
                              alt="Uploaded"
                              className="h-48 w-48 rounded-full object-cover ring-4 ring-[rgb(38,219,131)]"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute -right-2 -top-2"
                              onClick={() => setImage(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <label className="cursor-pointer">
                              {/* Hidden file input */}
                              <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <Button
                                variant="ghost"
                                className="text-[rgb(38,219,131)]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  document.querySelector('input[type="file"]')?.click();
                                }}
                              >
                                Upload Photo
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && nidInfo && (
                  <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <img
                        src={nidInfo.profile_picture || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover ring-4 ring-[rgb(38,219,131)]"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Full Name:</span>
                        <span>{nidInfo.name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Father Name:</span>
                        <span>{nidInfo.father_name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Mother Name:</span>
                        <span>{nidInfo.mother_name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Date of Birth:</span>
                        <span>{nidInfo.dob || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Phone Number:</span>
                        <span>{nidInfo.phone_no || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="border-gray-300 focus:border-[rgb(38,219,131)] focus:ring-[rgb(38,219,131)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="border-gray-300 focus:border-[rgb(38,219,131)] focus:ring-[rgb(38,219,131)]"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
           <Button
  className="ml-auto bg-[rgb(38,219,131)] hover:bg-[rgb(38,219,131)]/90"
  onClick={() => step === 3 ? handleSubmit() : step === 1 ? handleImageSubmit() : setStep(step + 1)}
  disabled={step === 1 ? (!formData.nid || !imageFile) : false}  // Disable only on Step 1
>
  {step === 3 ? 'Complete' : 'Next'} <ChevronRight className="ml-2 h-4 w-4" />
</Button>

          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
