'use client'

import { Flame, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import VesselCard from './VesselCard'
import type { Vessel } from '@/types/database'

interface HotDealsSectionProps {
  deals: Vessel[]
}

export default function HotDealsSection({ deals }: HotDealsSectionProps) {
  if (deals.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Flame className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold text-gray-900">Hot Deals</h2>
          </div>
          <Link 
            href="/hot-deals" 
            className="flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <p className="text-gray-600 mb-8">
          Grab these limited-time offers from cancelled reservations — premium experiences at unbeatable prices!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.slice(0, 3).map((vessel) => (
            <VesselCard key={vessel.id} vessel={vessel} />
          ))}
        </div>
      </div>
    </section>
  )
}
