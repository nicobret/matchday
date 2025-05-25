import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { borderRadius, shadows, spacing } from '../../constants/theme';
import { Club } from '../../lib/club.repository';
import { useClubs } from '../../lib/useClubs';

export default function ClubsScreen() {
  const { data: clubs, isLoading, error } = useClubs();

  const renderClub = ({ item }: { item: Club }) => (
    <TouchableOpacity
      style={styles.clubCard}
      onPress={() => router.push(`/club/${item.id}` as any)}
    >
      <ThemedView variant="card" style={styles.clubCardInner}>
        <ThemedView style={styles.clubInfo}>
          <ThemedText variant="default" size="lg" weight="semibold">
            {item.name}
          </ThemedText>
          <ThemedText variant="muted" size="sm">
            {item.members?.length || 0} members
          </ThemedText>
        </ThemedView>
        <FontAwesome
          name="chevron-right"
          size={16}
          color="#64748B"
        />
      </ThemedView>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText variant="default" size="lg">
          Error loading clubs
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={clubs}
        renderItem={renderClub}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.md,
  },
  clubCard: {
    marginBottom: spacing.md,
  },
  clubCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  clubInfo: {
    flex: 1,
  },
}); 