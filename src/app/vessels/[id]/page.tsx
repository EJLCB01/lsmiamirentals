'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, Users, Ruler, Clock, Calendar, 
  Check, Flame, Anchor, ChevronLeft, ChevronRight 
} from 'lucide-react'
import type { Vessel } from '@/types/database'
import ReviewSection from '@/components/ReviewSection'
import StarRating from '@/components/StarRating'
import BookingModal, { CustomerInfo } from '@/components/BookingModal'

// Mock data
const mockVessels: Record<string, Vessel> = {
  '1': {
    id: '1',
    name: 'Sea Breeze',
    type: 'yacht',
    description: 'Luxurious 60ft yacht perfect for corporate events and celebrations. Features a spacious deck, full bar, and premium sound system. Enjoy breathtaking views of the Miami skyline as you cruise through Biscayne Bay.',
    capacity: 12,
    length_ft: 60,
    price_per_hour: 500,
    price_per_day: 3500,
    captain_available: true,
    captain_price_per_hour: 150,
    images: [
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80',
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80',
    ],
    features: ['Full Bar', 'Sound System', 'Sun Deck', 'Air Conditioning', 'Jet Ski Included', 'Swimming Platform', 'Cabin', 'Kitchen'],
    is_hot_deal: false,
    hot_deal_discount: null,
    hot_deal_expires: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  '2': {
    id: '2',
    name: 'Ocean Spirit',
    type: 'yacht',
    description: 'Elegant 45ft yacht ideal for intimate gatherings and sunset cruises along the Miami coastline. Perfect for romantic evenings or small celebrations.',
    capacity: 8,
    length_ft: 45,
    price_per_hour: 350,
    price_per_day: 2500,
    captain_available: true,
    captain_price_per_hour: 150,
    images: ['https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80'],
    features: ['Swim Platform', 'Bluetooth Audio', 'Cabin', 'Kitchenette'],
    is_hot_deal: true,
    hot_deal_discount: 25,
    hot_deal_expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

export default function VesselDetailPage() {
  const params = useParams()
  const vessel = mockVessels[params.id as string]
  
  const [currentImage, setCurrentImage] = useState(0)
  const [bookingType, setBookingType] = useState<'hourly' | 'daily'>('hourly')
  const [hours, setHours] = useState(4)
  const [withCaptain, setWithCaptain] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [showBookingModal, setShowBookingModal] = useState(false)

  const handleBookingSubmit = (customerInfo: CustomerInfo) => {
    // Here you would typically:
    // 1. Save customer info to database
    // 2. Create a booking record
    // 3. Redirect to Stripe checkout
    console.log('Customer Info:', customerInfo)
    console.log('Booking Details:', {
      vesselId: vessel?.id,
      date: selectedDate,
      type: bookingType,
      hours: bookingType === 'hourly' ? hours : 8,
      withCaptain,
      total: calculateTotal()
    })
    
    // For now, show a success message
    alert(`Thank you ${customerInfo.name}! We'll contact you at ${customerInfo.phone} to confirm your booking.`)
    setShowBookingModal(false)
  }

  if (!vessel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vessel Not Found</h1>
          <Link href="/vessels" className="text-blue-600 hover:underline">
            Browse all vessels
          </Link>
        </div>
      </div>
    )
  }

  const formatNumber0 = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)

  const formatUSD0 = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)

  const discountedPrice = vessel.is_hot_deal && vessel.hot_deal_discount
    ? vessel.price_per_hour * (1 - vessel.hot_deal_discount / 100)
    : vessel.price_per_hour

  const calculateTotal = () => {
    let basePrice = bookingType === 'hourly' 
      ? discountedPrice * hours 
      : (vessel.is_hot_deal && vessel.hot_deal_discount 
          ? vessel.price_per_day * (1 - vessel.hot_deal_discount / 100) 
          : vessel.price_per_day)
    
    if (withCaptain && vessel.captain_available && vessel.captain_price_per_hour) {
      basePrice += bookingType === 'hourly' 
        ? vessel.captain_price_per_hour * hours 
        : vessel.captain_price_per_hour * 8
    }
    
    return basePrice
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href="/vessels" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all vessels
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden mb-4">
              {vessel.images[currentImage] ? (
                <Image
                  src={vessel.images[currentImage]}
                  alt={vessel.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Anchor className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
              {/* Hot Deal Badge */}
              {vessel.is_hot_deal && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  {formatNumber0(vessel.hot_deal_discount ?? 0)}% OFF - Hot Deal!
                </div>
              )}

              {/* Image Navigation */}
              {vessel.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage(i => i === 0 ? vessel.images.length - 1 : i - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage(i => i === vessel.images.length - 1 ? 0 : i + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {vessel.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {vessel.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                      currentImage === i ? 'ring-2 ring-blue-600' : ''
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Booking */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">
                    {vessel.type}
                  </span>
                  {vessel.captain_available && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Captain Available
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{vessel.name}</h1>
                <div className="mb-2">
                  <StarRating rating={4.7} showValue reviewCount={12} />
                </div>
                
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span>{formatNumber0(vessel.capacity)} guests</span>
                  </div>
                  {vessel.length_ft && (
                    <div className="flex items-center gap-1">
                      <Ruler className="h-5 w-5" />
                      <span>{formatNumber0(vessel.length_ft)} ft</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600">{vessel.description}</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {vessel.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-gray-600">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t pt-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      Per Hour
                    </span>
                    {vessel.is_hot_deal ? (
                      <div>
                        <span className="text-gray-400 line-through mr-2">{formatUSD0(vessel.price_per_hour)}</span>
                        <span className="font-semibold text-green-600">{formatUSD0(discountedPrice)}</span>
                      </div>
                    ) : (
                      <span className="font-semibold">{formatUSD0(vessel.price_per_hour)}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Full Day (8 hrs)
                    </span>
                    {vessel.is_hot_deal ? (
                      <div>
                        <span className="text-gray-400 line-through mr-2">{formatUSD0(vessel.price_per_day)}</span>
                        <span className="font-semibold text-green-600">
                          {formatUSD0(
                            vessel.price_per_day * (1 - (vessel.hot_deal_discount || 0) / 100)
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold">{formatUSD0(vessel.price_per_day)}</span>
                    )}
                  </div>
                  {vessel.captain_available && (
                    <div className="flex justify-between text-gray-600">
                      <span>Captain (optional)</span>
                      <span>{formatUSD0(vessel.captain_price_per_hour ?? 0)}/hr</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Form */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Book This Vessel</h3>
                
                {/* Date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Booking Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rental Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBookingType('hourly')}
                      className={`flex-1 py-2 rounded-lg font-medium transition ${
                        bookingType === 'hourly' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Hourly
                    </button>
                    <button
                      onClick={() => setBookingType('daily')}
                      className={`flex-1 py-2 rounded-lg font-medium transition ${
                        bookingType === 'daily' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Full Day
                    </button>
                  </div>
                </div>

                {/* Hours (if hourly) */}
                {bookingType === 'hourly' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration: {hours} hours
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="8"
                      value={hours}
                      onChange={(e) => setHours(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>2 hrs</span>
                      <span>8 hrs</span>
                    </div>
                  </div>
                )}

                {/* Captain Option */}
                {vessel.captain_available && (
                  <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={withCaptain}
                        onChange={(e) => setWithCaptain(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        Add Captain (+{formatUSD0(vessel.captain_price_per_hour ?? 0)}/hr)
                      </span>
                    </label>
                  </div>
                )}

                {/* Total & Book Button */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatUSD0(calculateTotal())}
                    </span>
                  </div>
                </div>

                <button
                  disabled={!selectedDate}
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {selectedDate ? 'Proceed to Checkout' : 'Select a Date'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="lg:col-span-2 mt-8">
          <ReviewSection 
            vesselId={vessel.id} 
            rating={{ average_rating: 4.7, review_count: 3 }}
            reviews={[]}
          />
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleBookingSubmit}
        vesselName={vessel.name}
        totalPrice={calculateTotal()}
        bookingDetails={{
          date: selectedDate,
          type: bookingType,
          hours: bookingType === 'hourly' ? hours : undefined,
          withCaptain
        }}
      />
    </div>
  )
}
