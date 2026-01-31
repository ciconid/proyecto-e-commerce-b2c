import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";

function ProductsPage() {
    const { user, isAuthenticated, isAdmin } = useAuth();
    const { setAuth, clearAuth} = useAuthStore();

    const handleFakeLogin = () => {
        const fakeUser = {
            id: '1',
            email: 'test@example.com',
            name: 'Usuario Test',
            role: 'user' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setAuth(fakeUser, 'fake-at', 'fake-rt');
    };



    return (
        <div style={{ padding: '20px' }}>
        <h1>Products Page</h1>
        
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
            <h3>Estado de Auth:</h3>
            <p>Autenticado: {isAuthenticated ? '✅ Sí' : '❌ No'}</p>
            <p>Es Admin: {isAdmin ? '✅ Sí' : '❌ No'}</p>
            {user && <p>Usuario: {user.name} ({user.email})</p>}
            
            <div style={{ marginTop: '10px' }}>
            <button onClick={handleFakeLogin}>Fake Login</button>
            <button onClick={clearAuth} style={{ marginLeft: '10px' }}>Logout</button>
            </div>
        </div>
        </div>
    );
}

export default ProductsPage;