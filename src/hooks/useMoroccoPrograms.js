import { usePrograms } from './usePrograms';

export const useMoroccoPrograms = () => {
  return usePrograms('morocco');
};

export const useMoroccoProgram = (programSlug) => {
  const programs = usePrograms('morocco');
  return programs.find((p) => p.slug === programSlug) || null;
};
