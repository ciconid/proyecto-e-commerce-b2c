import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProductsPage from "./pages/ProductsPage"
import CartPage from "./pages/CartPage"
import OrdersPage from "./pages/OrdersPage"
import AdminPage from "./pages/AdminPage"
import NotFoundPage from "./pages/NotFoundPage"
import PrivateRoute from "./components/PrivateRoute"
import Layout from "./components/Layout"

function App() {

    return (
        <BrowserRouter>
            <Layout>

                <Routes>
                    {/* Rutas publicas */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Rutas protegidas */}
                    <Route path="/products" element={
                        <PrivateRoute>
                            <ProductsPage />
                        </PrivateRoute>
                    } />
                    <Route path="/cart" element={
                        <PrivateRoute>
                            <CartPage />
                        </PrivateRoute>
                    } />
                    <Route path="/orders" element={
                        <PrivateRoute>
                            <OrdersPage />
                        </PrivateRoute>
                    } />

                    {/* Ruta admin */}
                    <Route path="/admin" element={
                        <PrivateRoute requireAdmin={true}>
                            <AdminPage />
                        </PrivateRoute>
                    } />

                    {/* Redirect por defecto */}
                    <Route path="/" element={<Navigate to="/products" replace />} />

                    {/* Ruta invalida */}
                    <Route path="*" element={<NotFoundPage />} />

                </Routes>
            </Layout>

        </BrowserRouter>
    )
}

export default App