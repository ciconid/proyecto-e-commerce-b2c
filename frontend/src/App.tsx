import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProductsPage from "./pages/ProductsPage"
import CartPage from "./pages/CartPage"
import OrdersPage from "./pages/OrdersPage"
import AdminPage from "./pages/AdminPage"
import NotFoundPage from "./pages/NotFoundPage"
import Navbar from "./components/Navbar"
import PrivateRoute from "./components/PrivateRoute"
import { useAuthStore } from "./store/authStore"

function App() {
    const accessToken = useAuthStore((state) => state.accessToken);

    return (
        <BrowserRouter>
            {accessToken && <Navbar />}

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
                    <PrivateRoute>
                        <AdminPage />
                    </PrivateRoute>
                } />

                {/* Redirect por defecto */}
                <Route path="/" element={<Navigate to="/products" replace />} />

                {/* Ruta invalida */}
                <Route path="*" element={<NotFoundPage />} />
                
            </Routes>
        </BrowserRouter>
    )
}

export default App