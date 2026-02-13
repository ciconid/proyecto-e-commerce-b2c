import React from 'react';
import './index.css';
import App from './App.tsx';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000        // Datos "frescos" por 5 minutos
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider >
                <Notifications
                    position="top-right" 
                    autoClose={1500}
                    style={{ width:350 }}
                />
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
            </MantineProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
