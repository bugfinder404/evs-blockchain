'use client'

import { useState, ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import FloatingChatButton from './chatbot'
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className={cn(
      "min-h-screen font-poppins",
      isDark && "dark"
    )}>
      <Sidebar isOpen={sidebarOpen} />

      <div className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:pl-64" : "lg:pl-0"
      )}>
        <Topbar
          toggleSidebar={toggleSidebar}
          toggleTheme={toggleTheme}
          isDark={isDark}
          sidebarOpen={sidebarOpen}
        />

        <main className="min-h-screen pt-16 p-6 bg-gradient-to-br from-[#26db83]/10 via-transparent to-[#26db83]/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 50 }}   
              animate={{ opacity: 1, y: 0 }}    
              exit={{ opacity: 0, y: -50 }}     
              transition={{ duration: 0.3 }}    
              className=""
            >
              {children}
              <FloatingChatButton />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
