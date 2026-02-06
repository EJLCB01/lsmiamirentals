'use client'

import { useState } from 'react'
import { X, User, Mail, Phone, Loader2 } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (customerInfo: CustomerInfo) => void
  vesselName: string
  totalPrice: number
  bookingDetails: {
    date: string
    type: 'hourly' | 'daily'
    hours?: number
    withCaptain: boolean
  }
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  vesselName, 
  totalPrice,
  bookingDetails 
}: BookingModalProps) {
  const [step, setStep] = useState<'form' | 'terms'>('form')
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  })
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {}
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Let the parent persist the booking lead/request
    onSubmit(customerInfo)

    setIsSubmitting(false)
    setStep('terms')
  }

  const formatPhone = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  const handleClose = () => {
    setStep('form')
    setCustomerInfo({ name: '', email: '', phone: '' })
    setErrors({})
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold">
            {step === 'form' ? 'Complete Your Booking' : 'Reservation Terms'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">{vesselName}</p>
        </div>

        {/* Booking Summary */}
        <div className="bg-blue-50 px-6 py-4 border-b">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Date:</span>
            <span className="font-medium text-gray-900">
              {new Date(bookingDetails.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Duration:</span>
            <span className="font-medium text-gray-900">
              {bookingDetails.type === 'daily' ? 'Full Day (8 hrs)' : `${bookingDetails.hours} hours`}
            </span>
          </div>
          {bookingDetails.withCaptain && (
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Captain:</span>
              <span className="font-medium text-green-600">Included</span>
            </div>
          )}
          <div className="flex justify-between mt-2 pt-2 border-t border-blue-100">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="font-bold text-xl text-blue-600">${totalPrice.toFixed(0)}</span>
          </div>
        </div>

        {step === 'form' ? (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              Please provide your contact information to proceed.
            </p>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Smith"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ 
                  ...prev, 
                  phone: formatPhone(e.target.value) 
                }))}
                placeholder="(555) 123-4567"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Continue to Payment'
            )}
          </button>

            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        ) : (
          /* Terms */
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
              <p className="font-semibold mb-2">Please read before reserving:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold">$500 deposit</span> needed to reserve boat/yacht charter.</li>
                <li><span className="font-semibold">Zelle or CashApp only</span> forms of payment.</li>
                <li><span className="font-semibold">No refunds.</span></li>
                <li><span className="font-semibold">Must be at pick up location on time.</span></li>
              </ul>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              If you have questions, call us at <a className="text-blue-600 font-semibold hover:underline" href="tel:+19547442612">(954) 744-2612</a>.
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 px-4 py-3 rounded-lg border font-semibold hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
