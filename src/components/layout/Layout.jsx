import { useState, useEffect, lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { JaiderChatProvider } from '../../context/JaiderChatContext';

const FloatingContact = lazy(() => import('./FloatingContact'));
const BackgroundMusic = lazy(() => import('../ui/BackgroundMusic'));
const FloatingGuideR = lazy(() => import('../ui/FloatingGuideR'));
const JaiderChatWindow = lazy(() => import('../ui/JaiderChatWindow'));

const Layout = () => {
  const [loadWidgets, setLoadWidgets] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(() => setLoadWidgets(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => setLoadWidgets(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <JaiderChatProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>

        <Footer />
        {loadWidgets && (
          <Suspense fallback={null}>
            <FloatingContact />
            <BackgroundMusic />
            <FloatingGuideR />
            <JaiderChatWindow />
          </Suspense>
        )}
      </div>
    </JaiderChatProvider>
  );
};

export default Layout;
