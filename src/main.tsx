import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux';

import './index.css'
import App from './App'
import {store} from './app/store';
import {BrowserRouter, Route, Routes} from "react-router";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
    </StrictMode>
)
