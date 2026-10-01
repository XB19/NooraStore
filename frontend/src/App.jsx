import { Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import AdminLayout from './layouts/AdminLayout'
import PublicLayout from './layouts/PublicLayout'
import Login from './pages/accounts/Login'
import Register from './pages/accounts/Register'
import Dashboard from './pages/admin/Dashboard'
import CategoryDelete from './pages/admin/categories/CategoryDelete'
import CategoryForm from './pages/admin/categories/CategoryForm'
import CategoryList from './pages/admin/categories/CategoryList'
import MessageDelete from './pages/admin/messages/MessageDelete'
import MessageDetail from './pages/admin/messages/MessageDetail'
import MessageList from './pages/admin/messages/MessageList'
import AdminOrderDetail from './pages/admin/orders/OrderDetail'
import AdminOrderList from './pages/admin/orders/OrderList'
import ProductDelete from './pages/admin/products/ProductDelete'
import ProductForm from './pages/admin/products/ProductForm'
import ProductList from './pages/admin/products/ProductList'
import CataloguePage from './pages/catalog/CataloguePage'
import CategoryPage from './pages/catalog/CategoryPage'
import Favorites from './pages/catalog/Favorites'
import ProductDetail from './pages/catalog/ProductDetail'
import Cart from './pages/cart/Cart'
import Checkout from './pages/orders/Checkout'
import Confirmation from './pages/orders/Confirmation'
import OrderList from './pages/orders/OrderList'
import Home from './pages/storefront/Home'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/compte/connexion" element={<Login />} />
        <Route path="/compte/inscription" element={<Register />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/produit/:slug" element={<ProductDetail />} />
        <Route path="/favoris" element={<RequireAuth><Favorites /></RequireAuth>} />
        <Route path="/panier" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="/commander" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="/commande/:orderId/confirmation" element={<RequireAuth><Confirmation /></RequireAuth>} />
        <Route path="/mes-commandes" element={<RequireAuth><OrderList /></RequireAuth>} />
        <Route path="/:slug" element={<CategoryPage />} />
      </Route>

      <Route path="/gestion" element={<RequireAuth staffOnly><AdminLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="produits" element={<ProductList />} />
        <Route path="produits/nouveau" element={<ProductForm />} />
        <Route path="produits/:id/modifier" element={<ProductForm />} />
        <Route path="produits/:id/supprimer" element={<ProductDelete />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/nouvelle" element={<CategoryForm />} />
        <Route path="categories/:id/modifier" element={<CategoryForm />} />
        <Route path="categories/:id/supprimer" element={<CategoryDelete />} />
        <Route path="commandes" element={<AdminOrderList />} />
        <Route path="commandes/:id" element={<AdminOrderDetail />} />
        <Route path="messages" element={<MessageList />} />
        <Route path="messages/:id" element={<MessageDetail />} />
        <Route path="messages/:id/supprimer" element={<MessageDelete />} />
      </Route>
    </Routes>
  )
}
