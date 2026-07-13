import { usePrograms } from './usePrograms';

export const useJordanPrograms = () => {
  return usePrograms('jordan');
};

export const useJordanProgram = (programSlug) => {
  const programs = usePrograms('jordan');
  return programs.find((p) => p.slug === programSlug) || null;
};
