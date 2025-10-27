import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button, Surface, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSession } from '../src/hooks/useSession';
import BalanceDisplay from '../src/components/BalanceDisplay';
import SessionView from '../src/components/SessionView';
import { mockAvatars, mockUserProfile } from '../src/data/mockData';
import { SessionType } from '../src/types';

export default function SessionScreen() {
  const params = useLocalSearchParams<{ avatarId: string; sessionType: string }>();
  const router = useRouter();

  const avatar = useMemo(
    () => mockAvatars.find((a) => a.id === params.avatarId),
    [params.avatarId]
  );

  const sessionType = params.sessionType as SessionType;

  const {
    sessionState,
    sessionDuration,
    tokensConsumed,
    showLowBalanceWarning,
    handleStartSession,
    handleEndSession,
  } = useSession(avatar!, sessionType, mockUserProfile);

  // Get pricing for display
  const effectivePrice = avatar ? avatar.pricePerMinute : 0;

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get session state display text
  const getStateText = (): string => {
    switch (sessionState) {
      case 'idle':
        return 'Ready to start';
      case 'initializing':
        return 'Initializing...';
      case 'active':
        return 'Session Active';
      case 'ending':
        return 'Ending session...';
      case 'ended':
        return 'Session Ended';
      default:
        return '';
    }
  };

  // Handle session end and navigation
  const handleEndAndNavigate = () => {
    if (sessionState === 'ended') {
      router.back();
    } else {
      handleEndSession();
    }
  };

  if (!avatar) {
    return (
      <View style={styles.container}>
        <Text>Avatar not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* Avatar Header */}
        <Surface style={styles.header} elevation={1}>
          <View>
            <Text variant="headlineSmall" style={styles.avatarName}>
              {avatar.name}
            </Text>
            <Text variant="titleMedium" style={styles.avatarTitle}>
              {avatar.title}
            </Text>
          </View>
          <View style={styles.sessionTypeContainer}>
            <Text variant="labelLarge" style={styles.sessionTypeLabel}>
              {sessionType === 'VIDEO' ? '🎥 Video' : '🎤 Voice'}
            </Text>
          </View>
        </Surface>

        {/* Balance Display */}
        {sessionState !== 'idle' && sessionState !== 'ended' && (
          <BalanceDisplay
            totalBalance={mockUserProfile.tokenBalance}
            tokensConsumed={tokensConsumed}
            showLowBalanceWarning={showLowBalanceWarning}
          />
        )}

        {/* Session State & Timer */}
        <Surface style={styles.timerCard} elevation={2}>
          <View style={styles.timerRow}>
            <View style={styles.timerItem}>
              <Text variant="labelMedium" style={styles.timerLabel}>
                Status
              </Text>
              <View style={styles.stateContainer}>
                {(sessionState === 'initializing' || sessionState === 'ending') && (
                  <ActivityIndicator size="small" style={styles.spinner} />
                )}
                <Text variant="titleLarge" style={styles.stateText}>
                  {getStateText()}
                </Text>
              </View>
            </View>

            {sessionState === 'active' && (
              <>
                <View style={styles.timerItem}>
                  <Text variant="labelMedium" style={styles.timerLabel}>
                    Duration
                  </Text>
                  <Text variant="displaySmall" style={styles.timerValue}>
                    {formatDuration(sessionDuration)}
                  </Text>
                </View>

                <View style={styles.timerItem}>
                  <Text variant="labelMedium" style={styles.timerLabel}>
                    Consumed
                  </Text>
                  <Text variant="titleLarge" style={styles.consumedValue}>
                    {tokensConsumed.toFixed(2)}
                  </Text>
                </View>
              </>
            )}
          </View>

          {sessionState === 'active' && (
            <View style={styles.pricingInfo}>
              <Text variant="bodyMedium" style={styles.pricingText}>
                Rate: ${effectivePrice.toFixed(2)}/min
              </Text>
            </View>
          )}
        </Surface>

        {/* Session View (Video/Voice Placeholder) */}
        {sessionState === 'active' && <SessionView sessionType={sessionType} />}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {sessionState === 'idle' && (
            <Button
              mode="contained"
              onPress={handleStartSession}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Start Session
            </Button>
          )}

          {sessionState === 'active' && (
            <Button
              mode="contained"
              onPress={handleEndAndNavigate}
              style={[styles.button, styles.endButton]}
              contentStyle={styles.buttonContent}
            >
              End Session
            </Button>
          )}

          {sessionState === 'ended' && (
            <Button
              mode="contained"
              onPress={handleEndAndNavigate}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Back to Home
            </Button>
          )}
        </View>
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
  header: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarName: {
    fontWeight: 'bold',
  },
  avatarTitle: {
    opacity: 0.8,
    marginTop: 4,
  },
  sessionTypeContainer: {
    backgroundColor: '#FF5F00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sessionTypeLabel: {
    fontWeight: 'bold',
  },
  timerCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  timerItem: {
    flex: 1,
    alignItems: 'center',
  },
  timerLabel: {
    opacity: 0.7,
    marginBottom: 8,
  },
  stateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spinner: {
    marginRight: 4,
  },
  stateText: {
    fontWeight: 'bold',
  },
  timerValue: {
    color: '#FF5F00',
    fontWeight: 'bold',
  },
  consumedValue: {
    color: '#FFB833',
    fontWeight: 'bold',
  },
  pricingInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
    alignItems: 'center',
  },
  pricingText: {
    opacity: 0.8,
  },
  discount: {
    color: '#FFB833',
    fontStyle: 'italic',
  },
  actions: {
    marginTop: 24,
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  endButton: {
    backgroundColor: '#DC2626',
  },
});
