'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/resumeo', label: 'Mock' },
  { href: '/jobs', label: 'Job Listings' },
  { href: '/interview-experiences', label: 'Interview Experiences' },
  { href: 'http://localhost:5173/', label: 'Resumeo', external: true },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white-900 text-purple-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-4xl font-bold text-purple-500 flex items-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-2">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
            </svg>
            Intervieo
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-black hover:text-purple-700 transition-colors duration-200"
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.label}
              </Link>
            ))}

            {/* Generate Resume Button */}
            <Link href="/generate-resume">
              <Button 
                variant="outline" 
                className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-200"
              >
                Generate Resume
              </Button>
            </Link>

            {/* ATS Score Button */}
            <Link href="/ats-score">
              <Button 
                variant="outline" 
                className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-200"
              >
                ATS Score
              </Button>
            </Link>

            {/* Questions Button */}
            <Link href="/questions">
              <Button 
                variant="outline" 
                className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-200"
              >
                Questions
              </Button>
            </Link>

            {/* Audio Recorder Button */}
            <Link href="/audio-recorder">
              <Button 
                variant="outline" 
                className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-200"
              >
                Audio Recorder
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="text-white hover:text-purple-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="block py-2 text-gray-300 hover:text-purple-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.label}
              </Link>
            ))}

            {/* Generate Resume Button */}
            <Link href="/generate-resume">
              <Button 
                variant="outline" 
                className="w-full mt-4 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-200"
              >
                Generate Resume
              </Button>
            </Link>

            {/* ATS Score Button */}
            <Link href="/ats-score">
              <Button 
                variant="outline" 
                className="w-full mt-4 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-200"
              >
                ATS Score
              </Button>
            </Link>

            {/* Questions Button */}
            <Link href="/questions">
              <Button 
                variant="outline" 
                className="w-full mt-4 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-200"
              >
                Questions
              </Button>
            </Link>

            {/* Audio Recorder Button */}
            <Link href="/audio-recorder">
              <Button 
                variant="outline" 
                className="w-full mt-4 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-200"
              >
                Audio Recorder
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
