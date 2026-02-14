import { Suspense } from 'react'
import VesselsClient from './VesselsClient'

export default function VesselsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <VesselsClient />
    </Suspense>
  )
}
