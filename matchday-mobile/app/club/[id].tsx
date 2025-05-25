import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../components/theme-provider';
import { useClub } from '../../lib/useClub';

export default function ClubScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { data: club, isLoading, error } = useClub(id as string);

  const renderPlayer = ({ item }: { item: typeof club.members[0] }) => (
    <View
      style={[
        styles.playerCard,
        { backgroundColor: isDark ? '#333' : '#f5f5f5' }
      ]}
    >
      <View style={styles.playerInfo}>
        <Text style={[styles.playerName, { color: isDark ? '#fff' : '#000' }]}>
          {item.profile.firstname} {item.profile.lastname}
        </Text>
        <Text style={[styles.position, { color: isDark ? '#ccc' : '#666' }]}>
          {item.role || 'Member'}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Text style={[styles.error, { color: isDark ? '#fff' : '#000' }]}>
          Error loading club data
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          {club.name}
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#666' }]}>
          Members ({club.members.length})
        </Text>
      </View>
      <FlatList
        data={club.members}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
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
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 