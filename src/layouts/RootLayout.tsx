import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useCartStore } from '@/store/useCartStore';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export function RootLayout() {
  const { pathname } = useLocation();
  const { isCartOpen } = useCartStore();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      autoRaf: true,
      allowNestedScroll: true,
      prevent: (node) => {
        if (!node || !(node instanceof HTMLElement)) return false;
        return (
          node.hasAttribute('data-lenis-prevent') ||
          Boolean(node.closest('[data-lenis-prevent]')) ||
          Boolean(node.closest('#cart-drawer')) ||
          Boolean(node.closest('#search-modal'))
        );
      },
    });

    lenisRef.current = lenis;

    // Synchronize ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis whenever cart drawer is open so nested scroll is 100% native
  useEffect(() => {
    if (lenisRef.current) {
      if (isCartOpen) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [isCartOpen]);

  // Scroll to top instantly on every route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </ThemeProvider>
  );
}

