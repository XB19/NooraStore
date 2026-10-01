import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../../api/client'
import ProductListing from '../../components/ProductListing'

export default function CataloguePage() {
  const location = useLocation()
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(null)
    api.get(`/api/products/${location.search}`).then(setData)
  }, [location.search])

  if (!data) return null

  return <ProductListing title={data.title} crumb={data.crumb} products={data.products} />
}
