import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ProductListing from '../../components/ProductListing'

export default function CategoryPage() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setData(null)
    setNotFound(false)
    api.get(`/api/categories/${slug}/`)
      .then(setData)
      .catch((err) => {
        if (err.status === 404) setNotFound(true)
      })
  }, [slug])

  if (notFound) {
    return (
      <section className="cathead">
        <div className="wrap"><p>Cette catégorie n'existe pas.</p></div>
      </section>
    )
  }

  if (!data) return null

  return <ProductListing title={data.title} crumb={data.crumb} products={data.products} />
}
