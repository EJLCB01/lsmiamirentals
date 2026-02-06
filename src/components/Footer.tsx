import { Anchor, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Anchor className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">LS Miami Rentals</span>
            </div>
            <p className="text-gray-400 mb-4">
              Experience Miami&apos;s beautiful waters with our premium fleet of yachts, boats, and jet skis. 
              Creating unforgettable memories on the water since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vessels?type=yacht" className="text-gray-400 hover:text-white transition">
                  Yachts
                </Link>
              </li>
              <li>
                <Link href="/vessels?type=boat" className="text-gray-400 hover:text-white transition">
                  Boats
                </Link>
              </li>
              <li>
                <Link href="/vessels?type=jetski" className="text-gray-400 hover:text-white transition">
                  Jet Skis
                </Link>
              </li>
              <li>
                <Link href="/hot-deals" className="text-red-400 hover:text-red-300 transition">
                  🔥 Hot Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>(305) 555-WAVE</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>info@miamiwaverentals.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Miami Beach Marina, FL</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LS Miami Rentals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
