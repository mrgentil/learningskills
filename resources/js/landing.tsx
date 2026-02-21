import React from 'react';
import { createRoot } from 'react-dom/client';
import Index from './Landing/pages/Index';

import { Toaster } from './Landing/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from './Landing/components/ui/tooltip';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

if (document.getElementById('landing-app')) {
    const root = createRoot(document.getElementById('landing-app') as HTMLElement);
    root.render(
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <BrowserRouter>
                    <Index />
                    {/* <Toaster /> */}
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
}
