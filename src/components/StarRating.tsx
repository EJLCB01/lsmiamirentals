'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  reviewCount?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const stars = []
  for (let i = 1; i <= maxRating; i++) {
    const filled = i <= rating
    const halfFilled = !filled && i - 0.5 <= rating

    stars.push(
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onChange?.(i)}
        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
      >
        <Star
          className={`${sizeClasses[size]} ${
            filled
              ? 'fill-yellow-400 text-yellow-400'
              : halfFilled
              ? 'fill-yellow-400/50 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {showValue && (
        <span className="text-gray-600 text-sm ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-gray-400"> ({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
          )}
        </span>
      )}
    </div>
  )
}
