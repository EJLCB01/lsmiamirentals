import Hero from '@/components/Hero'
import HotDealsSection from '@/components/HotDealsSection'
import VesselCard from '@/components/VesselCard'
import { ArrowRight, Shield, Clock, Award } from 'lucide-react'
import Link from 'next/link'
import type { Vessel } from '@/types/database'

// Mock data for development - will be replaced with Supabase fetch
const mockVessels: Vessel[] = [
  {
    id: '1',
    name: 'Sea Breeze',
    type: 'yacht',
    description: 'Luxurious 60ft yacht perfect for corporate events and celebrations.',
    capacity: 12,
    length_ft: 60,
    price_per_hour: 500,
    price_per_day: 3500,
    captain_available: true,
    captain_price_per_hour: 150,
    images: ['https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80'],
    features: ['Full Bar', 'Sound System', 'Sun Deck'],
    is_hot_deal: false,
    hot_deal_discount: null,
    hot_deal_expires: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Ocean Spirit',
    type: 'yacht',
    description: 'Elegant 45ft yacht ideal for intimate gatherings.',
    capacity: 8,
    length_ft: 45,
    price_per_hour: 350,
    price_per_day: 2500,
    captain_available: true,
    captain_price_per_hour: 150,
    images: ['https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80'],
    features: ['Swim Platform', 'Bluetooth Audio'],
    is_hot_deal: true,
    hot_deal_discount: 25,
    hot_deal_expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Wave Runner',
    type: 'boat',
    description: 'Speedy 28ft speedboat for thrill-seekers.',
    capacity: 6,
    length_ft: 28,
    price_per_hour: 200,
    price_per_day: 1400,
    captain_available: true,
    captain_price_per_hour: 100,
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'],
    features: ['Wake Board Rack', 'Cooler'],
    is_hot_deal: false,
    hot_deal_discount: null,
    hot_deal_expires: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Jet Blast 1',
    type: 'jetski',
    description: 'High-performance Yamaha WaveRunner.',
    capacity: 2,
    length_ft: null,
    price_per_hour: 75,
    price_per_day: 400,
    captain_available: false,
    captain_price_per_hour: null,
    images: ['https://images.unsplash.com/photo-1599255068390-206e0d068539?w=800&q=80'],
    features: ['Life Jackets Included'],
    is_hot_deal: false,
    hot_deal_discount: null,
    hot_deal_expires: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function Home() {
  const hotDeals = mockVessels.filter(v => v.is_hot_deal)
  const featuredVessels = mockVessels.filter(v => !v.is_hot_deal).slice(0, 3)

  return (
    <>
      <Hero />
      
      {/* Hot Deals */}
      <HotDealsSection deals={hotDeals} />

      {/* Featured Vessels */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Vessels</h2>
            <Link 
              href="/vessels" 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVessels.map((vessel) => (
              <VesselCard key={vessel.id} vessel={vessel} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Miami Wave Rentals?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fully Insured</h3>
              <p className="text-gray-600">
                All our vessels are fully insured for your peace of mind.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
              <p className="text-gray-600">
                Book by the hour or full day. Cancel up to 24 hours in advance.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
              <p className="text-gray-600">
                Meticulously maintained vessels for the best experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Hit the Water?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your perfect vessel today and experience Miami&apos;s stunning coastline like never before.
          </p>
          <Link
            href="/vessels"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
          >
            Browse Vessels
          </Link>
        </div>
      </section>
    </>
  )
}
