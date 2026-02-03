import { formatDistanceToNow } from 'date-fns'
import StarRating from './StarRating'
import type { Review } from '@/types/database'
import { User } from 'lucide-react'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-full p-2">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{review.customer_name}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      
      {review.title && (
        <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
      )}
      
      {review.comment && (
        <p className="text-gray-600 text-sm">{review.comment}</p>
      )}
      
      <div className="mt-3 flex items-center gap-2">
        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
          ✓ Verified Rental
        </span>
      </div>
    </div>
  )
}
