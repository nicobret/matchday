import { useQuery } from '@tanstack/react-query';
import { getClub } from './club.repository';

export function useClub(id: string) {
  return useQuery({
    queryKey: ['club', id],
    queryFn: () => getClub(id),
    enabled: !!id,
  });
} 