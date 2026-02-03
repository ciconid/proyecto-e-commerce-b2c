import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProductsPage from "./pages/ProductsPage"
import CartPage from "./pages/CartPage"
import OrdersPage from "./pages/OrdersPage"
import AdminPage from "./pages/AdminPage"
import NotFoundPage from "./pages/NotFoundPage"
import Navbar from "./components/Navbar"

function App() {

    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Rutas publicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Rutas protegidas */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />

                {/* Ruta admin */}
                <Route path="/admin" element={<AdminPage />} />

                {/* Redirect por defecto */}
                <Route path="/" element={<Navigate to="/products" replace />} />

                {/* Ruta invalida */}
                <Route path="*" element={<NotFoundPage />} />
                
            </Routes>
        </BrowserRouter>
    )
}

export default App