'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  Loader2, 
  Ship, 
  Flame, 
  Anchor 
} from 'lucide-react'
import Link from 'next/link'
import type { VesselType } from '@/types/database'

export default function NewVesselPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'boat' as VesselType,
    description: '',
    capacity: 6,
    length_ft: 30,
    price_per_hour: 150,
    price_per_day: 1000,
    captain_available: true,
    captain_price_per_hour: 100,
    is_hot_deal: false,
    hot_deal_discount: 20,
    is_active: true,
  })

  const [features, setFeatures] = useState<string[]>(['Bluetooth Audio', 'Cooler'])
  const [newFeature, setNewFeature] = useState('')
  const [images, setImages] = useState<string[]>(['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'])
  const [newImage, setNewImage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const addImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()])
      setNewImage('')
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const vesselData = {
      ...formData,
      features,
      images,
      capacity: Number(formData.capacity),
      length_ft: formData.length_ft ? Number(formData.length_ft) : null,
      price_per_hour: Number(formData.price_per_hour),
      price_per_day: Number(formData.price_per_day),
      captain_price_per_hour: formData.captain_price_per_hour ? Number(formData.captain_price_per_hour) : null,
      hot_deal_discount: formData.is_hot_deal ? Number(formData.hot_deal_discount) : null,
    }

    const { error } = await supabase
      .from('vessels')
      .insert([vesselData])

    if (error) {
      alert('Error creating vessel: ' + error.message)
      setLoading(false)
    } else {
      router.push('/admin/vessels')
      router.refresh()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link 
          href="/admin/vessels"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Fleet
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Vessel</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Ship className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Vessel Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Midnight Express"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="yacht">Yacht</option>
                <option value="boat">Boat</option>
                <option value="jetski">Jet Ski</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Tell guests about this vessel..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Capacity (Guests)</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Length (ft)</label>
              <input
                type="number"
                name="length_ft"
                value={formData.length_ft}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Anchor className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Pricing & Logistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Price per Hour ($)</label>
              <input
                type="number"
                name="price_per_hour"
                value={formData.price_per_hour}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Price per Day ($)</label>
              <input
                type="number"
                name="price_per_day"
                value={formData.price_per_day}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="captain_available"
                checked={formData.captain_available}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Captain Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Active Listing</span>
            </label>
          </div>
          {formData.captain_available && (
            <div className="space-y-1 w-full md:w-1/2">
              <label className="text-sm font-medium text-gray-700">Captain Price per Hour ($)</label>
              <input
                type="number"
                name="captain_price_per_hour"
                value={formData.captain_price_per_hour}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        </section>

        {/* Hot Deals */}
        <section className="bg-orange-50 p-6 rounded-xl shadow-sm border border-orange-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-900">Hot Deal Settings</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_hot_deal"
                checked={formData.is_hot_deal}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-orange-700">Mark as Hot Deal (Appears on landing page)</span>
            </label>
            {formData.is_hot_deal && (
              <div className="space-y-1 w-full md:w-1/2">
                <label className="text-sm font-medium text-orange-700">Discount Percentage (%)</label>
                <input
                  type="number"
                  name="hot_deal_discount"
                  value={formData.hot_deal_discount}
                  onChange={handleInputChange}
                  className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                />
              </div>
            )}
          </div>
        </section>

        {/* Features & Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Features */}
          <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <div className="flex gap-2">
              <input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                placeholder="Add a feature..."
                className="flex-1 border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addFeature}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, i) => (
                <span key={i} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {feature}
                  <button type="button" onClick={() => removeFeature(i)}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </section>

          {/* Images */}
          <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h2 className="text-lg font-semibold">Images (URLs)</h2>
            <div className="flex gap-2">
              <input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                placeholder="Paste image URL..."
                className="flex-1 border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addImage}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {images.map((img, i) => (
                <div key={i} className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg text-xs truncate">
                  <span className="truncate flex-1">{img}</span>
                  <button type="button" onClick={() => removeImage(i)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pb-12">
          <Link
            href="/admin/vessels"
            className="px-6 py-2 border rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Create Vessel
          </button>
        </div>
      </form>
    </div>
  )
}
