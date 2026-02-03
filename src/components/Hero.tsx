import Link from 'next/link'
import { Ship, Sailboat, Waves } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Experience Miami&apos;s Waters
            <span className="block text-blue-300">Like Never Before</span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Premium yacht, boat, and jet ski rentals in Miami. 
            Create unforgettable memories with our pristine fleet and optional captain services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/vessels"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition shadow-lg"
            >
              Browse All Vessels
            </Link>
            <Link
              href="/hot-deals"
              className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition shadow-lg"
            >
              🔥 View Hot Deals
            </Link>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/vessels?type=yacht" className="group">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition">
                <Ship className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold mb-2">Yachts</h3>
                <p className="text-blue-200 text-sm">Luxury vessels for special occasions</p>
              </div>
            </Link>

            <Link href="/vessels?type=boat" className="group">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition">
                <Sailboat className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold mb-2">Boats</h3>
                <p className="text-blue-200 text-sm">Perfect for fishing & family fun</p>
              </div>
            </Link>

            <Link href="/vessels?type=jetski" className="group">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition">
                <Waves className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold mb-2">Jet Skis</h3>
                <p className="text-blue-200 text-sm">High-speed thrills on the water</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
