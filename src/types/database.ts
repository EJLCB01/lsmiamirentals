export type VesselType = 'yacht' | 'boat' | 'jetski'

export interface Vessel {
  id: string
  name: string
  type: VesselType
  description: string
  capacity: number
  length_ft: number | null
  price_per_hour: number
  price_per_day: number
  captain_available: boolean
  captain_price_per_hour: number | null
  images: string[]
  features: string[]
  is_hot_deal: boolean
  hot_deal_discount: number | null
  hot_deal_expires: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  vessel_id: string
  customer_email: string
  customer_name: string
  customer_phone: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  with_captain: boolean
  total_price: number
  stripe_payment_intent_id: string | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
  vessel?: Vessel
}

export interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  is_admin: boolean
  created_at: string
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Review {
  id: string
  vessel_id: string
  booking_id: string
  customer_email: string
  customer_name: string
  rating: number // 1-5
  title: string | null
  comment: string | null
  status: ReviewStatus
  admin_notes: string | null
  created_at: string
  reviewed_at: string | null
}

export interface VesselRating {
  average_rating: number
  review_count: number
}

export interface Database {
  public: {
    Tables: {
      vessels: {
        Row: Vessel
        Insert: Omit<Vessel, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Vessel, 'id' | 'created_at' | 'updated_at'>>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>
      }
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
    }
  }
}
