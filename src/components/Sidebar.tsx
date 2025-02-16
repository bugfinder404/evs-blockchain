'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import {
  BarChart3,
  ChevronRight,
  History,
  MessageSquare,
  Settings,
  Users2,
  Vote,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
  { icon: Vote, label: 'Elections', href: '/elections' },
  { icon: Users2, label: 'Teams', href: '/teams' },
  { icon: History, label: 'History', href: '/history' },
  { icon: MessageSquare, label: 'Public Opinion', href: '/public-opinion' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform bg-white/80 backdrop-blur-xl transition-transform duration-200 dark:bg-gray-900/80 lg:translate-x-0",
      )}
    >
      <div className="flex h-20 items-center gap-0 px-10">
        <img
          src="https://asiafashion.com.bd/mash/evs/E-Voting%20System.png"
          alt="EVB Logo"
          className="w-full mt-10"
        />
      </div>
      <nav className="space-y-1 p-4 mt-5">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 transition-colors duration-150",
              pathname === item.href
                ? "bg-[#26db83] text-white"
                : "text-gray-700 hover:bg-[#26db83]/10 hover:text-[#26db83] dark:text-gray-200"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
            {/* <ChevronRight className="ml-auto h-4 w-4" /> */}
          </Link>
        ))}
      </nav>
    </motion.aside>
  )
}