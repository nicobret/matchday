import { ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../components/auth-provider';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { spacing } from '../../constants/theme';

export default function HomeScreen() {
  const { session } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedView style={styles.header}>
          <ThemedText variant="default" size="2xl" weight="bold">
            Welcome to MatchDay
          </ThemedText>
          {session?.user && (
            <ThemedText variant="muted" size="base" style={styles.subtitle}>
              Logged in as {session.user.email}
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing['3xl'],
  },
  subtitle: {
    marginTop: spacing.sm,
  },
});
