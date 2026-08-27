import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useTranslation } from "react-i18next";
import Layout from "./components/layout/Layout";
import Logo from "./components/ui/Logo";
import { trackEvent } from "./utils/analytics";

// ── Global Error Boundary ────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#060d1a',
          color: '#E8CB72',
          fontFamily: 'sans-serif',
          padding: '2rem',
          textAlign: 'center',
          gap: '1rem'
        }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#C9A227', margin: 0 }}>
            حدث خطأ غير متوقع
          </h1>
          <p style={{ color: '#aaa', margin: 0, fontSize: '0.95rem' }}>
            An unexpected error occurred. Please refresh the page.
          </p>
          {this.state.error && (
            <pre style={{
              color: '#ef4444',
              background: '#111827',
              padding: '1rem',
              borderRadius: '0.5rem',
              maxWidth: '90vw',
              maxHeight: '300px',
              overflow: 'auto',
              textAlign: 'left',
              fontSize: '0.8rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {this.state.error.toString()}
              {'\n'}
              {this.state.error.stack}
            </pre>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.6rem 1.8rem',
              background: '#C9A227',
              color: '#060d1a',
              border: 'none',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy loaded pages for performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Destinations = lazy(() => import("./pages/destinations/Destinations"));
const LandingPageDetails = lazy(() => import("./pages/destinations/LandingPageDetails"));
const BackendToursPage = lazy(() => import("./pages/tours/BackendToursPage"));
const TourDetails = lazy(() => import("./pages/tours/TourDetails"));
const BlogDetails = lazy(() => import("./pages/blogs/BlogDetails"));
const ServiceDetails = lazy(() => import("./pages/services/ServiceDetails"));
const Transportation = lazy(
  () => import("./pages/transportation/Transportation"),
);
const TailorTour = lazy(() => import("./pages/TailorTour"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Invoice = lazy(() => import("./pages/Invoice"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const BookingCancel = lazy(() => import("./pages/BookingCancel"));
const HotelDetails = lazy(() => import("./pages/hotels/HotelDetails"));
const RoomDetails = lazy(() => import("./pages/hotels/RoomDetails"));
const MediaGallery = lazy(() => import("./pages/MediaGallery"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));
import ProtectedRoute from "./components/auth/ProtectedRoute";


const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

import { variants } from "./animations/variants";

const CinematicLoader = ({ onComplete }) => (
  <motion.div
    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary-900"
    variants={variants.loadingExit}
    initial="initial"
    animate="animate"
    exit="exit"
    onAnimationComplete={onComplete}
  >
    <div aria-live="polite" className="sr-only">
      Loading Dunas Travel experiences...
    </div>
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Logo theme="dark" height={80} />
      </motion.div>

      {/* Gold Line Expands */}
      <motion.div
        className="h-[1px] bg-gold-500 mt-8"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 120, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  </motion.div>
);

const FallbackLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-primary-900">
    <div className="w-8 h-8 border-2 border-gold-300 border-t-gold-500 rounded-full animate-spin"></div>
  </div>
);

function App() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const { i18n } = useTranslation();

  React.useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('page_view', { pathname: location.pathname });
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999] bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 pointer-events-none"
      />

      <Suspense fallback={<FallbackLoader />}>
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Layout />}>
                <Route
                  index
                  element={
                    <PageTransition>
                      <Home />
                    </PageTransition>
                  }
                />
                <Route
                  path="media-gallery"
                  element={
                    <PageTransition>
                      <MediaGallery />
                    </PageTransition>
                  }
                />
                <Route
                  path="about"
                  element={
                    <PageTransition>
                      <About />
                    </PageTransition>
                  }
                />
                <Route path="blogs">
                  <Route
                    index
                    element={
                      <PageTransition>
                        <Blogs />
                      </PageTransition>
                    }
                  />
                  <Route
                    path=":slug"
                    element={
                      <PageTransition>
                        <BlogDetails />
                      </PageTransition>
                    }
                  />
                </Route>
                <Route path="services">
                  <Route
                    index
                    element={
                      <PageTransition>
                        <Services />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="religious"
                    element={
                      <PageTransition>
                        <BackendToursPage titleKey="programs.religiousTitle" titleDefault="Religious Tours" filters={{ category: 'Religious' }} />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="religious/:slug"
                    element={
                      <PageTransition>
                        <TourDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="hotels/:slug"
                    element={
                      <PageTransition>
                        <HotelDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="hotels/:hotelSlug/:roomSlug"
                    element={
                      <PageTransition>
                        <RoomDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path=":category/:slug"
                    element={
                      <PageTransition>
                        <ServiceDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path=":service"
                    element={
                      <PageTransition>
                        <Services />
                      </PageTransition>
                    }
                  />
                </Route>
                <Route path="programs">
                  <Route
                    index
                    element={
                      <PageTransition>
                        <BackendToursPage titleKey="nav.tours" titleDefault="All Tours" />
                      </PageTransition>
                    }
                  />
                  <Route path="honeymooners" element={<PageTransition><BackendToursPage titleKey="programs.honeymoonersTitle" titleDefault="Honeymoon Tours" filters={{ category: 'Honeymoon' }} /></PageTransition>} />
                  <Route path="honeymooners/:id" element={<PageTransition><TourDetails /></PageTransition>} />
                  <Route path="religious" element={<PageTransition><BackendToursPage titleKey="programs.religiousTitle" titleDefault="Religious Tours" filters={{ category: 'Religious' }} /></PageTransition>} />
                  <Route path="religious/:slug" element={<PageTransition><TourDetails /></PageTransition>} />
                  <Route path="multi-country" element={<PageTransition><BackendToursPage titleKey="programs.multiCountryTitle" titleDefault="Multi-Country Tours" filters={{ destination: 'Multi-Country' }} /></PageTransition>} />
                  <Route path="multi-country/:slug" element={<PageTransition><TourDetails /></PageTransition>} />
                  <Route path="extension" element={<PageTransition><BackendToursPage titleKey="programs.extensionTitle" titleDefault="Extension Tours" filters={{ destination: 'Egypt' }} /></PageTransition>} />
                  <Route path="extension/:id" element={<PageTransition><TourDetails /></PageTransition>} />
                  <Route path="classic" element={<PageTransition><BackendToursPage titleKey="programs.classicTitle" titleDefault="Classic Tours" filters={{ destination: 'Egypt' }} /></PageTransition>} />
                  <Route path="classic/:slug" element={<PageTransition><TourDetails /></PageTransition>} />
                  <Route path="turkey" element={<PageTransition><BackendToursPage titleKey="nav.turkey" titleDefault="Turkey Tours" filters={{ destination: 'Turkey' }} /></PageTransition>} />
                  <Route path="turkey/:slug" element={<PageTransition><TourDetails /></PageTransition>} />
                  <Route path="jordan" element={<PageTransition><BackendToursPage titleKey="nav.jordan" titleDefault="Jordan Tours" filters={{ destination: 'Jordan' }} /></PageTransition>} />
                  <Route path="jordan/:slug" element={<PageTransition><TourDetails /></PageTransition>} />
                  <Route path="dubai" element={<PageTransition><BackendToursPage titleKey="nav.dubai" titleDefault="Dubai Tours" filters={{ destination: 'United Arab Emirates' }} /></PageTransition>} />
                  <Route path="dubai/:slug" element={<PageTransition><TourDetails /></PageTransition>} />
                  <Route path=":slug" element={<PageTransition><TourDetails /></PageTransition>} />
                </Route>
                <Route path="destinations">
                  <Route
                    index
                    element={
                      <PageTransition>
                        <Destinations />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="egypt"
                    element={
                      <PageTransition>
                        <LandingPageDetails destinationOnly />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="egito"
                    element={
                      <PageTransition>
                        <LandingPageDetails destinationOnly />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="jordan"
                    element={
                      <PageTransition>
                        <LandingPageDetails destinationOnly />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="jordan/:programId"
                    element={
                      <PageTransition>
                        <TourDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="dubai"
                    element={
                      <PageTransition>
                        <LandingPageDetails destinationOnly />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="dubai/:programId"
                    element={
                      <PageTransition>
                        <TourDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="turkey"
                    element={
                      <PageTransition>
                        <LandingPageDetails destinationOnly />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="turquia"
                    element={
                      <PageTransition>
                        <LandingPageDetails destinationOnly />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="turkey/:programId"
                    element={
                      <PageTransition>
                        <TourDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="turquia/:programId"
                    element={
                      <PageTransition>
                        <TourDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path=":slug"
                    element={
                      <PageTransition>
                        <LandingPageDetails destinationOnly />
                      </PageTransition>
                    }
                  />
                </Route>
                <Route path="tours">
                  <Route
                    index
                    element={
                      <PageTransition>
                        <BackendToursPage titleKey="nav.tours" titleDefault="All Tours" />
                      </PageTransition>
                    }
                  />
                  <Route
                    path=":slug"
                    element={
                      <PageTransition>
                        <TourDetails />
                      </PageTransition>
                    }
                  />
                </Route>
                <Route path="transportation">
                  <Route
                    index
                    element={
                      <PageTransition>
                        <Transportation />
                      </PageTransition>
                    }
                  />
                </Route>
                <Route
                  path="contact"
                  element={
                    <PageTransition>
                      <Contact />
                    </PageTransition>
                  }
                />
                <Route
                  path="tailor-a-tour"
                  element={
                    <PageTransition>
                      <TailorTour />
                    </PageTransition>
                  }
                />
                <Route
                  path="tailor-tour"
                  element={
                    <PageTransition>
                      <TailorTour />
                    </PageTransition>
                  }
                />
                <Route
                  path="faq"
                  element={
                    <PageTransition>
                      <FAQ />
                    </PageTransition>
                  }
                />
                <Route
                  path="invoice"
                  element={
                    <PageTransition>
                      <Invoice />
                    </PageTransition>
                  }
                />
                <Route
                  path="booking/success"
                  element={
                    <PageTransition>
                      <BookingSuccess />
                    </PageTransition>
                  }
                />
                <Route
                  path="payment/return"
                  element={
                    <Suspense fallback={<FallbackLoader />}>
                      <BookingSuccess />
                    </Suspense>
                  }
                />
                <Route
                  path="booking/cancel"
                  element={
                    <PageTransition>
                      <BookingCancel />
                    </PageTransition>
                  }
                />
                <Route
                  path="payment/cancel"
                  element={
                    <Suspense fallback={<FallbackLoader />}>
                      <BookingCancel />
                    </Suspense>
                  }
                />
                <Route
                  path="login"
                  element={
                    <PageTransition>
                      <Login />
                    </PageTransition>
                  }
                />
                <Route
                  path="register"
                  element={
                    <PageTransition>
                      <Register />
                    </PageTransition>
                  }
                />
                <Route
                  path="forgot-password"
                  element={
                    <PageTransition>
                      <ForgotPassword />
                    </PageTransition>
                  }
                />
                <Route
                  path="reset-password"
                  element={
                    <PageTransition>
                      <ResetPassword />
                    </PageTransition>
                  }
                />
                <Route
                  path="verify-email"
                  element={
                    <PageTransition>
                      <VerifyEmail />
                    </PageTransition>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <UserDashboard initialTab="overview" />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <UserDashboard initialTab="profile" />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bookings"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <UserDashboard initialTab="bookings" />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="trips/:slug"
                  element={
                    <PageTransition>
                      <ServiceDetails />
                    </PageTransition>
                  }
                />
                <Route
                  path="*"
                  element={
                    <PageTransition>
                      <NotFound />
                    </PageTransition>
                  }
                />
              </Route>
            </Routes>
          </AnimatePresence>
        </Suspense>
    </ErrorBoundary>
  );
}

export default App;
