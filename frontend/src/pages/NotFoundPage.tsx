import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>404</h1>
      <p>Página no encontrada</p>
      <button onClick={() => navigate('/products')}>
        Volver al inicio
      </button>
    </div>
  );
}

export default NotFoundPage;