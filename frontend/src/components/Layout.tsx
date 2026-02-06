import { Box } from '@mantine/core';
import Navbar from './Navbar';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    const accessToken = useAuthStore((state) => state.accessToken);

    return (
        <Box style={{ width: '100vw', minHeight: '100vh' }}>
            {accessToken && <Navbar />}
            {children}
        </Box>
    );
}

export default Layout;