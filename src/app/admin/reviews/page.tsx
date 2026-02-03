'use client'

import { useState } from 'react'
import StarRating from '@/components/StarRating'
import { Check, X, Clock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import type { Review, ReviewStatus } from '@/types/database'

// Mock pending reviews
const mockPendingReviews: (Review & { vessel_name: string })[] = [
  {
    id: 'r1',
    vessel_id: '1',
    vessel_name: 'Sea Breeze',
    booking_id: 'b10',
    customer_email: 'alex@example.com',
    customer_name: 'Alex Thompson',
    rating: 5,
    title: 'Incredible yacht experience!',
    comment: 'Everything was perfect. The yacht was spotless, the crew was professional and friendly. We had an amazing sunset cruise. Highly recommend!',
    status: 'pending',
    admin_notes: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reviewed_at: null,
  },
  {
    id: 'r2',
    vessel_id: '3',
    vessel_name: 'Wave Runner',
    booking_id: 'b11',
    customer_email: 'maria@example.com',
    customer_name: 'Maria Garcia',
    rating: 2,
    title: 'Disappointed with the experience',
    comment: 'The boat was late and had some mechanical issues. We lost an hour of our rental time. Staff was apologetic but it ruined our plans.',
    status: 'pending',
    admin_notes: null,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reviewed_at: null,
  },
  {
    id: 'r3',
    vessel_id: '5',
    vessel_name: 'Jet Blast 1',
    booking_id: 'b12',
    customer_email: 'david@example.com',
    customer_name: 'David Lee',
    rating: 4,
    title: 'Fun jet ski rental',
    comment: 'Good jet skis, easy process. Would give 5 stars but the life jackets were a bit worn.',
    status: 'pending',
    admin_notes: null,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reviewed_at: null,
  },
]

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(mockPendingReviews)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('pending')

  const handleAction = (reviewId: string, action: 'approved' | 'rejected') => {
    setReviews(reviews.map(r => 
      r.id === reviewId 
        ? { ...r, status: action, reviewed_at: new Date().toISOString(), admin_notes: adminNotes[reviewId] || null }
        : r
    ))
    setExpandedId(null)
  }

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => r.status === filter)

  const pendingCount = reviews.filter(r => r.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Management</h1>
          <p className="text-gray-600">
            Approve or reject customer reviews before they go public
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-700">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-800 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="h-5 w-5" />
              <span className="font-semibold">Approved</span>
            </div>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {reviews.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700">
              <X className="h-5 w-5" />
              <span className="font-semibold">Rejected</span>
            </div>
            <p className="text-2xl font-bold text-red-800 mt-1">
              {reviews.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No {filter !== 'all' ? filter : ''} reviews</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Review Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(expandedId === review.id ? null : review.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">{review.customer_name}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-blue-600">{review.vessel_name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          review.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {review.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <StarRating rating={review.rating} size="sm" />
                        {review.title && (
                          <span className="text-gray-700 font-medium">{review.title}</span>
                        )}
                      </div>
                    </div>
                    {expandedId === review.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === review.id && (
                  <div className="border-t px-4 py-4 bg-gray-50">
                    {/* Review Content */}
                    <div className="mb-4">
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Review</label>
                      <p className="text-gray-700 mt-1">{review.comment || 'No comment provided'}</p>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-4 text-sm text-gray-500">
                      <p>Email: {review.customer_email}</p>
                      <p>Submitted: {new Date(review.created_at).toLocaleString()}</p>
                    </div>

                    {review.status === 'pending' && (
                      <>
                        {/* Admin Notes */}
                        <div className="mb-4">
                          <label className="text-xs text-gray-500 uppercase tracking-wide">
                            Internal Notes (optional)
                          </label>
                          <textarea
                            value={adminNotes[review.id] || ''}
                            onChange={(e) => setAdminNotes({ ...adminNotes, [review.id]: e.target.value })}
                            placeholder="Add notes about this review (not visible to customer)"
                            rows={2}
                            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAction(review.id, 'approved')}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(review.id, 'rejected')}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </>
                    )}

                    {review.status !== 'pending' && review.admin_notes && (
                      <div className="mt-2 p-3 bg-white rounded border text-sm">
                        <span className="text-gray-500">Admin notes:</span> {review.admin_notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
