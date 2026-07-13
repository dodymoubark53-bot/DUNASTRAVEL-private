import { usePrograms } from './usePrograms';

export const useDubaiPrograms = () => {
  return usePrograms('dubai');
};

export const useDubaiProgram = (programSlug) => {
  const programs = usePrograms('dubai');
  return programs.find((p) => p.slug === programSlug) || null;
};