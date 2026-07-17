import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { CollectionsPage } from '@/pages/CollectionsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
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
        path: 'gifts',
        element: <CollectionsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;



