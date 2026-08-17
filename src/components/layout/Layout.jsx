import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingContact from './FloatingContact';
import BackgroundMusic from '../ui/BackgroundMusic';
import { JaiderChatProvider } from '../../context/JaiderChatContext';
import JaiderChatWindow from '../ui/JaiderChatWindow';
import FloatingGuideR from '../ui/FloatingGuideR';

const Layout = () => {
  const { t } = useTranslation();
  return (
    <JaiderChatProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>

        <Footer />
        <FloatingContact />
        <BackgroundMusic />
        <FloatingGuideR />
        <JaiderChatWindow />
      </div>
    </JaiderChatProvider>
  );
};

export default Layout;
