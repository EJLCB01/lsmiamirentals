'use client'

import { useState } from 'react'
import StarRating from './StarRating'
import ReviewCard from './ReviewCard'
import type { Review, VesselRating } from '@/types/database'
import { MessageSquare } from 'lucide-react'

interface ReviewSectionProps {
  vesselId: string
  rating: VesselRating
  reviews: Review[]
}

// Mock reviews for development
const mockReviews: Review[] = [
  {
    id: '1',
    vessel_id: '1',
    booking_id: 'b1',
    customer_email: 'john@example.com',
    customer_name: 'John D.',
    rating: 5,
    title: 'Amazing experience!',
    comment: 'The yacht was immaculate and the captain was extremely professional. Perfect for our anniversary celebration. Will definitely book again!',
    status: 'approved',
    admin_notes: null,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    vessel_id: '1',
    booking_id: 'b2',
    customer_email: 'sarah@example.com',
    customer_name: 'Sarah M.',
    rating: 4,
    title: 'Great day on the water',
    comment: 'Beautiful boat, smooth booking process. Only minor issue was we started 15 minutes late, but the crew made up for it.',
    status: 'approved',
    admin_notes: null,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    vessel_id: '1',
    booking_id: 'b3',
    customer_email: 'mike@example.com',
    customer_name: 'Mike R.',
    rating: 5,
    title: 'Best birthday party ever',
    comment: 'Rented for my 40th birthday. Everything was perfect - the vessel, the crew, the route. Miami looks incredible from the water!',
    status: 'approved',
    admin_notes: null,
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function ReviewSection({ vesselId, rating, reviews }: ReviewSectionProps) {
  const [showAll, setShowAll] = useState(false)
  
  // Use mock reviews for development
  const displayReviews = reviews.length > 0 ? reviews : mockReviews
  const displayRating = rating.review_count > 0 ? rating : { average_rating: 4.7, review_count: 3 }
  
  const visibleReviews = showAll ? displayReviews : displayReviews.slice(0, 3)

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        </div>
        <div className="flex items-center gap-2">
          <StarRating 
            rating={displayRating.average_rating} 
            showValue 
            reviewCount={displayRating.review_count} 
          />
        </div>
      </div>

      {displayReviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          
          {displayReviews.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAll ? 'Show less' : `Show all ${displayReviews.length} reviews`}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No reviews yet. Be the first to review after your rental!</p>
        </div>
      )}

      {/* Review submission notice */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <strong>Want to leave a review?</strong> Reviews can only be submitted after completing a rental. 
        Check your booking confirmation email for the review link.
      </div>
    </div>
  )
}
