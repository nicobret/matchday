import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { borderRadius, shadows, spacing } from '../../constants/theme';

// Mock data - replace with actual data fetching
const mockGames = [
  {
    id: '1',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Real Madrid',
    date: '2024-03-20',
    time: '20:00',
    status: 'upcoming',
  },
  {
    id: '2',
    homeTeam: 'Manchester United',
    awayTeam: 'Bayern Munich',
    date: '2024-03-18',
    time: '19:45',
    status: 'completed',
    score: '2-1',
  },
  {
    id: '3',
    homeTeam: 'PSG',
    awayTeam: 'Juventus',
    date: '2024-03-25',
    time: '21:00',
    status: 'upcoming',
  },
];

export default function GamesScreen() {
  const renderGame = ({ item }: { item: typeof mockGames[0] }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => router.push(`/game/${item.id}` as any)}
    >
      <ThemedView variant="card" style={styles.gameCardInner}>
        <ThemedView style={styles.gameInfo}>
          <ThemedView style={styles.teams}>
            <ThemedText variant="default" size="base" weight="semibold">
              {item.homeTeam}
            </ThemedText>
            <ThemedText variant="muted" size="sm" style={styles.vs}>
              vs
            </ThemedText>
            <ThemedText variant="default" size="base" weight="semibold">
              {item.awayTeam}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.gameDetails}>
            <ThemedText variant="muted" size="sm">
              {item.date} at {item.time}
            </ThemedText>
            {item.status === 'completed' && (
              <ThemedText variant="default" size="base" weight="semibold">
                {item.score}
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>
        <FontAwesome
          name="chevron-right"
          size={16}
          color="#64748B"
        />
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={mockGames}
        renderItem={renderGame}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: spacing.md,
  },
  gameCard: {
    marginBottom: spacing.md,
  },
  gameCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  gameInfo: {
    flex: 1,
  },
  teams: {
    marginBottom: spacing.sm,
  },
  vs: {
    textAlign: 'center',
    marginVertical: spacing.xs,
  },
  gameDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}); 