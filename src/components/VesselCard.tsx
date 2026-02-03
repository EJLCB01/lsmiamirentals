import Image from 'next/image'
import Link from 'next/link'
import { Users, Ruler, Clock, Flame, Star } from 'lucide-react'
import type { Vessel } from '@/types/database'

interface VesselCardProps {
  vessel: Vessel
}

export default function VesselCard({ vessel }: VesselCardProps) {
  const discountedPrice = vessel.is_hot_deal && vessel.hot_deal_discount
    ? vessel.price_per_hour * (1 - vessel.hot_deal_discount / 100)
    : null

  return (
    <Link href={`/vessels/${vessel.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        {/* Image */}
        <div className="relative h-48 sm:h-56">
          {vessel.images[0] ? (
            <Image
              src={vessel.images[0]}
              alt={vessel.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {/* Badges at bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            {/* Hot Deal Badge */}
            {vessel.is_hot_deal ? (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                <Flame className="h-4 w-4" />
                {vessel.hot_deal_discount}% OFF
              </div>
            ) : (
              <div />
            )}
            
            {/* Type Badge */}
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm capitalize shadow-lg">
              {vessel.type}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{vessel.name}</h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.8</span>
              <span className="text-gray-400">(12)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{vessel.capacity} guests</span>
            </div>
            {vessel.length_ft && (
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span>{vessel.length_ft} ft</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" />
              {discountedPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-sm">
                    ${vessel.price_per_hour}
                  </span>
                  <span className="text-green-600 font-bold">
                    ${discountedPrice.toFixed(0)}/hr
                  </span>
                </div>
              ) : (
                <span className="text-gray-900 font-semibold">
                  ${vessel.price_per_hour}/hr
                </span>
              )}
            </div>
            
            {vessel.captain_available && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Captain Available
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
