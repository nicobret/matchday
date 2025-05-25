import { useQuery } from '@tanstack/react-query';
import { getClubs } from './club.repository';

export function useClubs() {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: getClubs,
  });
} 