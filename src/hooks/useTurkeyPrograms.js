import { usePrograms } from './usePrograms';

export const useTurkeyPrograms = () => {
  return usePrograms('turkey');
};

export const useTurkeyProgram = (programSlug) => {
  const programs = usePrograms('turkey');
  return programs.find((p) => p.slug === programSlug) || null;
};
