import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../components/auth-provider';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { borderRadius, shadows, spacing } from '../../constants/theme';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth' as any);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView variant="muted" style={styles.avatar}>
          <FontAwesome
            name="user"
            size={40}
            color="#64748B"
          />
        </ThemedView>
        <ThemedText variant="default" size="lg" weight="semibold">
          {session?.user?.email}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/account' as any)}
        >
          <ThemedView variant="card" style={styles.menuItemInner}>
            <FontAwesome
              name="cog"
              size={20}
              color="#64748B"
              style={styles.menuIcon}
            />
            <ThemedText variant="default" size="base" style={styles.menuText}>
              Account Settings
            </ThemedText>
            <FontAwesome
              name="chevron-right"
              size={16}
              color="#64748B"
            />
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleSignOut}
        >
          <ThemedView variant="card" style={styles.menuItemInner}>
            <FontAwesome
              name="sign-out"
              size={20}
              color="#64748B"
              style={styles.menuIcon}
            />
            <ThemedText variant="default" size="base" style={styles.menuText}>
              Sign Out
            </ThemedText>
            <FontAwesome
              name="chevron-right"
              size={16}
              color="#64748B"
            />
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing['3xl'],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  section: {
    padding: spacing.md,
  },
  menuItem: {
    marginBottom: spacing.md,
  },
  menuItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  menuIcon: {
    marginRight: spacing.md,
  },
  menuText: {
    flex: 1,
  },
}); 