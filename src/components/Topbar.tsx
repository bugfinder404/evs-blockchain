'use client'

import { Bell, LogOut, Menu, Moon, Sun, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface TopbarProps {
  toggleSidebar: () => void
  toggleTheme: () => void
  isDark: boolean
  sidebarOpen: boolean
}

export function Topbar({ toggleSidebar, toggleTheme, isDark, sidebarOpen }: TopbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Send a request to the logout API
      const response = await fetch('https://asiafashion.com.bd/e-vote-version-3.0/auth/logout.php', {
        method: 'POST',
        credentials: 'same-origin', // Ensure cookies/session are sent
      })

      if (response.ok) {
        // If logout is successful, redirect to login page
        router.push('/auth/login')
      } else {
        // Handle error if logout fails
        console.error('Logout failed')
        // You can also notify the user here if you want
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Handle any error with the request
    }
  }

  return (
    <>
      <header className="fixed right-0 top-0 z-30 flex h-16 w-full items-center  px-4 backdrop-blur-xl dark:bg-gray-900/80">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-700 dark:text-gray-200"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#26db83] text-xs text-white">
                  3
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-start gap-4 rounded-lg border p-4 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="h-2 w-2 rounded-full bg-[#26db83] mt-1.5" />
                    <div>
                      <p className="font-medium">New Election Started</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="Profile"
                  className="h-8 w-8 rounded-full ring-2 ring-[#26db83]"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="flex w-full items-center">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="flex w-full items-center">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {/* This div adds space below the fixed header */}
      <div className="h-8"></div>
    </>
  )
}
