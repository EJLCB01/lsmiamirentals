-- Miami Wave Rentals Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vessel types enum
CREATE TYPE vessel_type AS ENUM ('yacht', 'boat', 'jetski');

-- Booking status enum
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Vessels table
CREATE TABLE vessels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type vessel_type NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  length_ft DECIMAL(5,1),
  price_per_hour DECIMAL(10,2) NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  captain_available BOOLEAN DEFAULT false,
  captain_price_per_hour DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  is_hot_deal BOOLEAN DEFAULT false,
  hot_deal_discount INTEGER, -- percentage off
  hot_deal_expires TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vessel_id UUID NOT NULL REFERENCES vessels(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  with_captain BOOLEAN DEFAULT false,
  total_price DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  status booking_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_vessels_type ON vessels(type);
CREATE INDEX idx_vessels_is_active ON vessels(is_active);
CREATE INDEX idx_vessels_is_hot_deal ON vessels(is_hot_deal);
CREATE INDEX idx_bookings_vessel_id ON bookings(vessel_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to vessels
CREATE TRIGGER update_vessels_updated_at
  BEFORE UPDATE ON vessels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Vessels: Public read, admin write
CREATE POLICY "Vessels are viewable by everyone" ON vessels
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can do everything with vessels" ON vessels
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- Bookings: Users see their own, admins see all
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- Users: Own profile or admin
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (id = auth.uid() OR is_admin = true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.uid());

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Sample data (optional - remove in production)
INSERT INTO vessels (name, type, description, capacity, length_ft, price_per_hour, price_per_day, captain_available, captain_price_per_hour, images, features) VALUES
('Sea Breeze', 'yacht', 'Luxurious 60ft yacht perfect for corporate events and celebrations. Features a spacious deck, full bar, and premium sound system.', 12, 60, 500, 3500, true, 150, ARRAY['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800'], ARRAY['Full Bar', 'Sound System', 'Sun Deck', 'Air Conditioning', 'Jet Ski Included']),
('Ocean Spirit', 'yacht', 'Elegant 45ft yacht ideal for intimate gatherings and sunset cruises along the Miami coastline.', 8, 45, 350, 2500, true, 150, ARRAY['https://images.unsplash.com/photo-1605281317010-fe5ece3098e9?w=800'], ARRAY['Swim Platform', 'Bluetooth Audio', 'Cabin', 'Kitchenette']),
('Wave Runner', 'boat', 'Speedy 28ft speedboat for thrill-seekers. Perfect for island hopping and water sports.', 6, 28, 200, 1400, true, 100, ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'], ARRAY['Wake Board Rack', 'Cooler', 'Bluetooth Audio']),
('Bay Cruiser', 'boat', 'Comfortable 32ft pontoon boat, great for family outings and fishing trips.', 10, 32, 150, 1000, true, 100, ARRAY['https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800'], ARRAY['Fishing Gear', 'Shade Canopy', 'Cooler', 'GPS']),
('Jet Blast 1', 'jetski', 'High-performance Yamaha WaveRunner for adrenaline junkies.', 2, NULL, 75, 400, false, NULL, ARRAY['https://images.unsplash.com/photo-1626446636368-0c857ce5d29e?w=800'], ARRAY['Life Jackets Included', 'GPS Tracker']),
('Jet Blast 2', 'jetski', 'Sea-Doo GTX for smooth rides and easy handling. Perfect for beginners.', 2, NULL, 65, 350, false, NULL, ARRAY['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'], ARRAY['Life Jackets Included', 'GPS Tracker', 'Beginner Friendly']);

-- Set one as hot deal
UPDATE vessels SET is_hot_deal = true, hot_deal_discount = 25, hot_deal_expires = NOW() + INTERVAL '3 days' WHERE name = 'Ocean Spirit';

-- Reviews table (moderated, verified customers only)
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vessel_id UUID NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  status review_status DEFAULT 'pending',
  admin_notes TEXT, -- Internal notes for admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE, -- When admin approved/rejected
  UNIQUE(booking_id) -- One review per booking
);

-- Indexes for reviews
CREATE INDEX idx_reviews_vessel_id ON reviews(vessel_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);

-- RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can only see approved reviews
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

-- Customers can create reviews for their completed bookings
CREATE POLICY "Customers can create reviews for their bookings" ON reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = booking_id 
      AND bookings.customer_email = customer_email
      AND bookings.status = 'completed'
    )
  );

-- Admins can see and manage all reviews
CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- Function to calculate average rating for a vessel
CREATE OR REPLACE FUNCTION get_vessel_rating(vessel_uuid UUID)
RETURNS TABLE (average_rating DECIMAL, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating)::DECIMAL, 1) as average_rating,
    COUNT(*)::BIGINT as review_count
  FROM reviews
  WHERE vessel_id = vessel_uuid AND status = 'approved';
END;
$$ LANGUAGE plpgsql;
