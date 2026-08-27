import HomeExperienceSection from '../components/home/HomeExperienceSection';

/**
 * Route-level composition for the home experience. Interaction state stays
 * inside the section components so this route remains cheap to load and safe
 * to evolve without changing its public URL.
 */
export default function Home() {
  return <HomeExperienceSection />;
}
