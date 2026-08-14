import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { I18nProvider } from './i18n/i18nContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import { BannersProvider } from './context/BannersContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <I18nProvider>
            <ProductsProvider>
              <BannersProvider>
                <FavoritesProvider>
                  <CartProvider>
                    <App />
                  </CartProvider>
                </FavoritesProvider>
              </BannersProvider>
            </ProductsProvider>
          </I18nProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
