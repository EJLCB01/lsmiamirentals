'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import VesselCard from '@/components/VesselCard'
import { Filter, Ship, Sailboat, Waves } from 'lucide-react'
import type { Vessel, VesselType } from '@/types/database'

// Mock data - will be replaced with Supabase
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
    name: 'Bay Cruiser',
    type: 'boat',
    description: 'Comfortable 32ft pontoon boat, great for family outings.',
    capacity: 10,
    length_ft: 32,
    price_per_hour: 150,
    price_per_day: 1000,
    captain_available: true,
    captain_price_per_hour: 100,
    images: ['https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&q=80'],
    features: ['Fishing Gear', 'Shade Canopy'],
    is_hot_deal: false,
    hot_deal_discount: null,
    hot_deal_expires: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
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
  {
    id: '6',
    name: 'Jet Blast 2',
    type: 'jetski',
    description: 'Sea-Doo GTX for smooth rides.',
    capacity: 2,
    length_ft: null,
    price_per_hour: 65,
    price_per_day: 350,
    captain_available: false,
    captain_price_per_hour: null,
    images: ['https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=800&q=80'],
    features: ['Life Jackets Included', 'Beginner Friendly'],
    is_hot_deal: false,
    hot_deal_discount: null,
    hot_deal_expires: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function VesselsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedType = (searchParams.get('type') as VesselType | null) ?? 'all'
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'capacity'>('price-low')

  const setType = (type: VesselType | 'all') => {
    const params = new URLSearchParams(searchParams.toString())
    if (type === 'all') params.delete('type')
    else params.set('type', type)
    router.push(`/vessels${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const filteredVessels = useMemo(() => {
    let vessels = [...mockVessels]
    
    // Filter by type
    if (selectedType !== 'all') {
      vessels = vessels.filter(v => v.type === selectedType)
    }
    
    // Sort
    vessels.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price_per_hour - b.price_per_hour
        case 'price-high':
          return b.price_per_hour - a.price_per_hour
        case 'capacity':
          return b.capacity - a.capacity
        default:
          return 0
      }
    })
    
    return vessels
  }, [selectedType, sortBy])

  const typeButtons: { type: VesselType | 'all'; label: string; icon: React.ReactNode }[] = [
    { type: 'all', label: 'All', icon: <Filter className="h-4 w-4" /> },
    { type: 'yacht', label: 'Yachts', icon: <Ship className="h-4 w-4" /> },
    { type: 'boat', label: 'Boats', icon: <Sailboat className="h-4 w-4" /> },
    { type: 'jetski', label: 'Jet Skis', icon: <Waves className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Fleet</h1>
          <p className="text-gray-600">
            Choose from our selection of premium yachts, boats, and jet skis
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {typeButtons.map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => setType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="sm:ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-gray-600">
          {filteredVessels.length} vessel{filteredVessels.length !== 1 ? 's' : ''} found
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVessels.map((vessel) => (
            <VesselCard key={vessel.id} vessel={vessel} />
          ))}
        </div>

        {filteredVessels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No vessels found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
