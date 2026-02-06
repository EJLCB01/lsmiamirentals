import { Flame, Clock } from 'lucide-react'
import VesselCard from '@/components/VesselCard'
import Link from 'next/link'
import type { Vessel } from '@/types/database'

// Mock data
const mockHotDeals: Vessel[] = [
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
    description: 'Speedy 28ft speedboat - last minute cancellation!',
    capacity: 6,
    length_ft: 28,
    price_per_hour: 200,
    price_per_day: 1400,
    captain_available: true,
    captain_price_per_hour: 100,
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'],
    features: ['Wake Board Rack', 'Cooler'],
    is_hot_deal: true,
    hot_deal_discount: 30,
    hot_deal_expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function getTimeRemaining(expires: string) {
  const now = new Date()
  const expDate = new Date(expires)
  const diff = expDate.getTime() - now.getTime()
  
  if (diff <= 0) return 'Expired'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`
  return `${hours} hour${hours > 1 ? 's' : ''} left`
}

export default function HotDealsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-full mb-4">
            <Flame className="h-6 w-6" />
            <span className="font-bold text-lg">HOT DEALS</span>
            <Flame className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Last-Minute Deals from Cancellations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Grab these incredible offers before they&apos;re gone! Premium vessels at 
            unbeatable prices from last-minute cancellations.
          </p>
        </div>

        {/* Deals Grid */}
        {mockHotDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockHotDeals.map((vessel) => (
              <div key={vessel.id} className="relative group">
                <VesselCard vessel={vessel} />
                {/* Time Remaining Badge - Bottom Center */}
                {vessel.hot_deal_expires && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                    <Clock className="h-4 w-4" />
                    {getTimeRemaining(vessel.hot_deal_expires)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Hot Deals Right Now
            </h2>
            <p className="text-gray-600 mb-8">
              Check back soon! We regularly add new deals from cancellations.
            </p>
            <Link
              href="/vessels"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse All Vessels
            </Link>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How Hot Deals Work
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🚫</div>
              <h3 className="font-semibold mb-1">Cancellation Happens</h3>
              <p className="text-gray-600 text-sm">
                When someone cancels a reservation, that slot becomes a hot deal.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold mb-1">Deep Discounts</h3>
              <p className="text-gray-600 text-sm">
                We offer 20-40% off to fill these last-minute openings.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Act Fast</h3>
              <p className="text-gray-600 text-sm">
                Deals are time-limited and first-come, first-served!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
