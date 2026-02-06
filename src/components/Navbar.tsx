'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Anchor, Phone } from 'lucide-react'
import AuthButton from './AuthButton'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Top bar with phone number */}
      <div className="bg-blue-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center md:justify-end items-center gap-2">
          <Phone className="h-4 w-4" />
          <a href="tel:+19547442612" className="font-medium hover:text-blue-100 transition">
            Call Us: (954) 744-2612
          </a>
        </div>
      </div>
      
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Anchor className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LS Miami Rentals</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/vessels" className="text-gray-700 hover:text-blue-600 transition">
              All Vessels
            </Link>
            <Link href="/vessels?type=yacht" className="text-gray-700 hover:text-blue-600 transition">
              Yachts
            </Link>
            <Link href="/vessels?type=boat" className="text-gray-700 hover:text-blue-600 transition">
              Boats
            </Link>
            <Link href="/vessels?type=jetski" className="text-gray-700 hover:text-blue-600 transition">
              Jet Skis
            </Link>
            <Link href="/hot-deals" className="text-red-600 font-semibold hover:text-red-700 transition">
              🔥 Hot Deals
            </Link>
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link href="/vessels" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>
                All Vessels
              </Link>
              <Link href="/vessels?type=yacht" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>
                Yachts
              </Link>
              <Link href="/vessels?type=boat" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>
                Boats
              </Link>
              <Link href="/vessels?type=jetski" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>
                Jet Skis
              </Link>
              <Link href="/hot-deals" className="text-red-600 font-semibold py-2" onClick={() => setIsOpen(false)}>
                🔥 Hot Deals
              </Link>
              <div className="pt-2 border-t">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
        </div>
      </nav>
    </>
  )
}
