'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Ship, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Flame,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import type { Vessel, VesselType } from '@/types/database'

export default function AdminVesselsPage() {
  const [vessels, setVessels] = useState<Vessel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<VesselType | 'all'>('all')
  const supabase = createClient()

  const fetchVessels = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('vessels')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setVessels(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVessels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vessel? This action cannot be undone.')) return

    const { error } = await supabase
      .from('vessels')
      .delete()
      .eq('id', id)

    if (!error) {
      setVessels(vessels.filter(v => v.id !== id))
    } else {
      alert('Error deleting vessel: ' + error.message)
    }
  }

  const filteredVessels = vessels.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || v.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600">Add, edit, and manage your vessels</p>
        </div>
        <Link
          href="/admin/vessels/new"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add New Vessel
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as VesselType | 'all')}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="yacht">Yachts</option>
            <option value="boat">Boats</option>
            <option value="jetski">Jet Skis</option>
          </select>
        </div>
      </div>

      {/* Vessels Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
            <p className="text-gray-500">Loading fleet...</p>
          </div>
        ) : filteredVessels.length === 0 ? (
          <div className="py-20 text-center">
            <Ship className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No vessels found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Vessel</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Pricing</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Hot Deal</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredVessels.map((vessel) => (
                  <tr key={vessel.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden">
                          {vessel.images?.[0] ? (
                            <img 
                              src={vessel.images[0]} 
                              alt={vessel.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Ship className="h-full w-full p-2 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{vessel.name}</p>
                          <p className="text-xs text-gray-500">{vessel.capacity} Guests • {vessel.length_ft || 'N/A'} ft</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm text-gray-600">{vessel.type}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-gray-900">${vessel.price_per_hour}/hr</p>
                      <p className="text-gray-500">${vessel.price_per_day}/day</p>
                    </td>
                    <td className="px-6 py-4">
                      {vessel.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {vessel.is_hot_deal ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          <Flame className="h-3 w-3" /> {vessel.hot_deal_discount}% Off
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/vessels/${vessel.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(vessel.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
