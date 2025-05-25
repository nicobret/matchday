import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../components/auth-provider';
import { useTheme } from '../../components/theme-provider';

// Mock data - replace with actual data fetching
const mockGame = {
  id: '1',
  club: {
    id: '1',
    name: 'FC Barcelona',
  },
  date: '2024-03-20T20:00:00',
  location: 'Camp Nou',
  duration: '90',
  total_players: 22,
  status: 'upcoming',
  score: null,
  players: [
    { id: '1', name: 'Lionel Messi', status: 'confirmed', position: 'Forward' },
    { id: '2', name: 'Sergio Busquets', status: 'confirmed', position: 'Midfielder' },
    { id: '3', name: 'Gerard Piqué', status: 'pending', position: 'Defender' },
  ],
};

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { session } = useAuth();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'players' | 'stats'>('players');

  const confirmedPlayers = mockGame.players.filter(p => p.status === 'confirmed');
  const gameDate = new Date(mockGame.date);
  const hasStarted = new Date() > gameDate;
  const hasEnded = false; // TODO: Implement based on game status

  const gameStatus = hasEnded
    ? `Match terminé${mockGame.score ? ` • ${mockGame.score[0]} - ${mockGame.score[1]}` : ''}`
    : hasStarted
      ? 'Match en cours'
      : `Le match commence dans ${Math.floor(
          (gameDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )} jours.`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome
            name="arrow-left"
            size={20}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <Text style={[styles.clubName, { color: isDark ? '#ccc' : '#666' }]}>
          {mockGame.club.name}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.date, { color: isDark ? '#fff' : '#000' }]}>
          {gameDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>

        <Text style={[styles.status, { color: isDark ? '#ccc' : '#666' }]}>
          {gameStatus}
        </Text>

        <View style={[styles.infoCard, { backgroundColor: isDark ? '#333' : '#f5f5f5' }]}>
          <View style={styles.infoRow}>
            <FontAwesome
              name="clock-o"
              size={16}
              color={isDark ? '#ccc' : '#666'}
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: isDark ? '#fff' : '#000' }]}>
              {gameDate.toLocaleTimeString('fr-FR', { timeStyle: 'short' })}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <FontAwesome
              name="map-marker"
              size={16}
              color={isDark ? '#ccc' : '#666'}
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: isDark ? '#fff' : '#000' }]}>
              {mockGame.location}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <FontAwesome
              name="hourglass"
              size={16}
              color={isDark ? '#ccc' : '#666'}
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: isDark ? '#fff' : '#000' }]}>
              Durée : {mockGame.duration} minutes
            </Text>
          </View>

          <View style={styles.infoRow}>
            <FontAwesome
              name="users"
              size={16}
              color={isDark ? '#ccc' : '#666'}
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: isDark ? '#fff' : '#000' }]}>
              {confirmedPlayers.length} / {mockGame.total_players} joueurs inscrits
            </Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'players' && {
                backgroundColor: isDark ? '#333' : '#f5f5f5',
              },
            ]}
            onPress={() => setActiveTab('players')}
          >
            <FontAwesome
              name="users"
              size={16}
              color={isDark ? '#fff' : '#000'}
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, { color: isDark ? '#fff' : '#000' }]}>
              Joueurs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'stats' && {
                backgroundColor: isDark ? '#333' : '#f5f5f5',
              },
            ]}
            onPress={() => setActiveTab('stats')}
          >
            <FontAwesome
              name="bar-chart"
              size={16}
              color={isDark ? '#fff' : '#000'}
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, { color: isDark ? '#fff' : '#000' }]}>
              Stats
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'players' ? (
          <View style={styles.playersList}>
            {mockGame.players.map((player) => (
              <View
                key={player.id}
                style={[
                  styles.playerCard,
                  { backgroundColor: isDark ? '#333' : '#f5f5f5' },
                ]}
              >
                <View style={styles.playerInfo}>
                  <Text style={[styles.playerName, { color: isDark ? '#fff' : '#000' }]}>
                    {player.name}
                  </Text>
                  <Text style={[styles.playerPosition, { color: isDark ? '#ccc' : '#666' }]}>
                    {player.position}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        player.status === 'confirmed'
                          ? isDark
                            ? '#4CAF50'
                            : '#81C784'
                          : isDark
                          ? '#FFA726'
                          : '#FFB74D',
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {player.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.statsContainer}>
            <Text style={[styles.statsText, { color: isDark ? '#fff' : '#000' }]}>
              Statistiques à venir...
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  clubName: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  content: {
    padding: 20,
  },
  date: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
    width: 20,
  },
  infoText: {
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  playersList: {
    gap: 12,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerPosition: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
  },
}); 