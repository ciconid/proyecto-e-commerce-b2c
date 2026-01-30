import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider>
            <Notifications position="top-right" />
            <App />
        </MantineProvider>
    </StrictMode>,
)
