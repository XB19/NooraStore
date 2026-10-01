import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import ProductListing from '../../components/ProductListing'

export default function Favorites() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/api/favorites/').then(setData)
  }, [])

  if (!data) return null

  return <ProductListing title={data.title} crumb={data.crumb} products={data.products} />
}
