import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useTranslation } from "react-i18next";
import Layout from "./components/layout/Layout";
import Logo from "./components/ui/Logo";
import { trackEvent } from "./utils/analytics";

// Lazy loaded pages for performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const Egypt = lazy(() => import("./pages/destinations/Egipto"));
const Turkey = lazy(() => import("./pages/destinations/Turquia"));
const Jordan = lazy(() => import("./pages/destinations/Jordania"));
const Morocco = lazy(() => import("./pages/destinations/Marruecos"));
const Greece = lazy(() => import("./pages/destinations/Grecia"));
const Dubai = lazy(() => import("./pages/destinations/Dubai"));
const Tunisia = lazy(() => import("./pages/destinations/Tunez"));
const HolyLand = lazy(() => import("./pages/destinations/TierraSanta"));
const Destinations = lazy(() => import("./pages/destinations/Destinations"));
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
const MultiCountryTours = lazy(() => import("./pages/programs/MultiCountryTours"));
const MultiCountryTourDetails = lazy(() => import("./pages/programs/MultiCountryTourDetails"));
const ReligiousTours = lazy(() => import("./pages/programs/ReligiousTours"));
const TurkeyProgramDetails = lazy(() => import("./pages/programs/TurkeyProgramDetails"));
const JordanProgramDetails = lazy(() => import("./pages/programs/JordanProgramDetails"));
const DubaiProgramDetails = lazy(() => import("./pages/programs/DubaiProgramDetails"));
const MoroccoProgramDetails = lazy(() => import("./pages/programs/MoroccoProgramDetails"));
const Honeymooners = lazy(() => import("./pages/Honeymooners"));
const HoneymoonersDetails = lazy(() => import("./pages/HoneymoonersDetails"));

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
  const [initialLoading, setInitialLoading] = React.useState(true);
  const { i18n } = useTranslation();

  React.useEffect(() => {
    // Cinematic load duration
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

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
    <>
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999] bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500"
      />

      <AnimatePresence>
        {initialLoading && (
          <CinematicLoader onComplete={() => setInitialLoading(false)} />
        )}
      </AnimatePresence>

      {!initialLoading && (
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
                    path=":service"
                    element={
                      <PageTransition>
                        <Services />
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
                </Route>
                <Route path="programs">
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
                        <ReligiousTours />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="turkey/:programId"
                    element={
                      <PageTransition>
                        <TurkeyProgramDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="jordan/:programId"
                    element={
                      <PageTransition>
                        <JordanProgramDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="dubai/:programId"
                    element={
                      <PageTransition>
                        <DubaiProgramDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="morocco/:programId"
                    element={
                      <PageTransition>
                        <MoroccoProgramDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="multi-country"
                    element={
                      <PageTransition>
                        <MultiCountryTours />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="multi-country/:slug"
                    element={
                      <PageTransition>
                        <MultiCountryTourDetails />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="honeymooners"
                    element={
                      <PageTransition>
                        <Honeymooners />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="honeymooners/:id"
                    element={
                      <PageTransition>
                        <HoneymoonersDetails />
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
                        <Egypt />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="turkey"
                    element={
                      <PageTransition>
                        <Turkey />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="jordan"
                    element={
                      <PageTransition>
                        <Jordan />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="morocco"
                    element={
                      <PageTransition>
                        <Morocco />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="greece"
                    element={
                      <PageTransition>
                        <Greece />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="dubai"
                    element={
                      <PageTransition>
                        <Dubai />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="tunisia"
                    element={
                      <PageTransition>
                        <Tunisia />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="holyland"
                    element={
                      <PageTransition>
                        <HolyLand />
                      </PageTransition>
                    }
                  />
                </Route>
                <Route path="tours">
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
                  path="booking/cancel"
                  element={
                    <PageTransition>
                      <BookingCancel />
                    </PageTransition>
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
              </Route>
            </Routes>
          </AnimatePresence>
        </Suspense>
      )}
    </>
  );
}

export default App;