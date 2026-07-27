import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { CollectionsPage } from '@/pages/CollectionsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProductDetailsPage } from '@/pages/ProductDetailsPage';
import { JournalPage } from '@/pages/JournalPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { TermsPage } from '@/pages/TermsPage';
import { ShippingReturnsPage } from '@/pages/ShippingReturnsPage';
import { FaqPage } from '@/pages/FaqPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminOverview } from '@/pages/admin/AdminOverview';
import { ProductManager } from '@/pages/admin/ProductManager';
import { CategoryManager } from '@/pages/admin/CategoryManager';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'collections',
        element: <CollectionsPage />,
      },
      {
        path: 'product/:id',
        element: <ProductDetailsPage />,
      },
      {
        path: 'necklaces',
        element: <CollectionsPage />,
      },
      {
        path: 'earrings',
        element: <CollectionsPage />,
      },
      {
        path: 'rings',
        element: <CollectionsPage />,
      },
      {
        path: 'bracelets',
        element: <CollectionsPage />,
      },
      {
        path: 'gifts',
        element: <CollectionsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'about-us',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'contact-us',
        element: <ContactPage />,
      },
      {
        path: 'journal',
        element: <JournalPage />,
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicyPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'shipping-returns',
        element: <ShippingReturnsPage />,
      },
      {
        path: 'faq',
        element: <FaqPage />,
      },
      {
        path: 'faqs',
        element: <FaqPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: 'admin-dashboard',
    children: [
      {
        path: 'login',
        element: <AdminLogin />,
      },
      {
        path: '',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminOverview />,
          },
          {
            path: 'products',
            element: <ProductManager />,
          },
          {
            path: 'categories',
            element: <CategoryManager />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;



