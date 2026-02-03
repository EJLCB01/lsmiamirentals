'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import StarRating from '@/components/StarRating'
import { CheckCircle, Ship } from 'lucide-react'

export default function SubmitReviewPage() {
  const params = useParams()
  const bookingId = params.bookingId as string
  
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Mock booking data - would come from Supabase
  const booking = {
    id: bookingId,
    vessel_name: 'Sea Breeze',
    date: '2024-01-15',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    
    // TODO: Submit to Supabase
    // const { error } = await supabase.from('reviews').insert({
    //   vessel_id: booking.vessel_id,
    //   booking_id: bookingId,
    //   customer_email: booking.customer_email,
    //   customer_name: booking.customer_name,
    //   rating,
    //   title: title || null,
    //   comment: comment || null,
    //   status: 'pending'
    // })
    
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-md max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your review has been submitted and is pending approval. 
            We appreciate your feedback!
          </p>
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Ship className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Review Your Experience
            </h1>
            <p className="text-gray-600">
              Tell us about your rental of <strong>{booking.vessel_name}</strong> on {booking.date}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-center">
                <StarRating 
                  rating={rating} 
                  size="lg" 
                  interactive 
                  onChange={setRating} 
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {rating === 0 && 'Click to rate'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent!'}
              </p>
              {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </div>

            {/* Review Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Title (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sum up your experience in a few words"
                maxLength={100}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Review Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell others about your experience — the vessel, the crew, highlights of your trip..."
                rows={5}
                maxLength={1000}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/1000</p>
            </div>

            {/* Notice */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-blue-800">
              <strong>Note:</strong> Your review will be published after our team reviews it. 
              This typically takes 1-2 business days.
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
