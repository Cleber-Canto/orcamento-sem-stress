
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Você precisará adicionar sua chave do Clerk aqui
const PUBLISHABLE_KEY = "pk_test_Z2VuZXJhbC1kZWVyLTM1LmNsZXJrLmFjY291bnRzLmRldiQ"

if (!PUBLISHABLE_KEY) {
  throw new Error("Por favor, adicione sua chave do Clerk em VITE_CLERK_PUBLISHABLE_KEY")
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
