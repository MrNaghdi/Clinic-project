import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { DarkModeProvider } from "./shared/context/DarkModeContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     
      gcTime: 10 * 60 * 1000,        
      refetchOnWindowFocus: false,   
      refetchOnMount: false,         
      retry: 1,                  
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
