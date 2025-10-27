import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AvatarCard from '../src/components/AvatarCard';
import { mockAvatars, mockUserProfile } from '../src/data/mockData';

export default function HomeScreen() {
  const router = useRouter();

  const handleStartSession = (avatarId: string, sessionType: 'VIDEO' | 'VOICE') => {
    router.push({
      pathname: '/session',
      params: { avatarId, sessionType },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* User Balance Display */}
        <Surface style={styles.balanceCard} elevation={3}>
          <Text variant="labelLarge" style={styles.balanceLabel}>
            Your Balance
          </Text>
          <Text variant="displayMedium" style={styles.balanceAmount}>
            {mockUserProfile.tokenBalance.toFixed(2)}
          </Text>
          <Text variant="titleMedium" style={styles.balanceUnit}>
            tokens
          </Text>
        </Surface>

        {/* Avatar Selection Grid */}
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Select an Avatar
        </Text>

        {mockAvatars.map((avatar) => (
          <AvatarCard
            key={avatar.id}
            avatar={avatar}
            onStartVideo={() => handleStartSession(avatar.id, 'VIDEO')}
            onStartVoice={() => handleStartSession(avatar.id, 'VOICE')}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: 600,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#1E1E1E',
  },
  balanceLabel: {
    opacity: 0.7,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FF5F00',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceUnit: {
    opacity: 0.8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
});
