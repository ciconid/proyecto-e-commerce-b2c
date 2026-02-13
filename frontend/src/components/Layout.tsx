import { Box } from '@mantine/core';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {

    return (
        <Box style={{ width: '100vw', minHeight: '100vh' }}>
            <Navbar />
            {children}
        </Box>
    );
}

export default Layout;