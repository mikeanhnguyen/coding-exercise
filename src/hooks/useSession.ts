import { useState, useEffect, useRef } from "react";
import { Avatar, SessionType, SessionState, UserProfile } from "../types";

export function useSession(
  avatar: Avatar,
  sessionType: SessionType,
  userProfile: UserProfile
) {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [sessionDuration, setSessionDuration] = useState(0); // seconds
  const [tokensConsumed, setTokensConsumed] = useState(0);
  const [showLowBalanceWarning, setShowLowBalanceWarning] = useState(false);
  const lowBalanceWarningShown = useRef(false);
  const actualTokensConsumed = useRef(0);
  const actualSessionDurartion = useRef(0);

  // Calculate tokens consumed based on session duration
  // This is already implemented - you can see tokens incrementing in real-time
  const calculateTokensConsumed = (durationSeconds: number): number => {
    const durationMinutes = durationSeconds / 60;
    return avatar.pricePerMinute * durationMinutes;
  };

  // TODO: Candidates must implement
  // Check if user has enough balance to start a session
  const checkSufficientBalance = (): boolean => {
    // IMPLEMENT: Check if the user's balance is enough to start
    // Hint: Compare userProfile.tokenBalance with avatar.pricePerMinute
    // Should return false if they don't have enough for at least 1 minute
    const remainingBalance =
      userProfile.tokenBalance - actualTokensConsumed.current;
    const remainingMinutes = remainingBalance / avatar.pricePerMinute;
    if (remainingMinutes < 1.5) {
      return false;
    }

    return true; // Placeholder - candidates must implement
  };

  // TODO: Candidates must implement
  // Check if balance is getting low and show warning
  const checkLowBalance = () => {
    // IMPLEMENT: Show a warning when the user has less than 1 minute of time remaining
    // Hint: Calculate how much balance is left, then figure out how much time that buys
    // Remember: Warning should only appear ONCE per session (use lowBalanceWarningShown ref)
    const remainingBalance =
      userProfile.tokenBalance - actualTokensConsumed.current;
    const remainingMinutes = remainingBalance / avatar.pricePerMinute;
    if (!lowBalanceWarningShown.current && remainingMinutes < 1) {
      setShowLowBalanceWarning(true);
      lowBalanceWarningShown.current = true;
    }
  };

  // TODO: Candidates must implement
  // Check if the user's balance has run out
  const checkBalanceDepleted = (): boolean => {
    // IMPLEMENT: Return true if the user has used up all their tokens
    // Hint: Compare tokensConsumed with userProfile.tokenBalance
    const remainingBalance =
      userProfile.tokenBalance - actualTokensConsumed.current;
    return remainingBalance <= 0; // Placeholder - candidates must implement
  };

  const handleStartSession = () => {
    if (!checkSufficientBalance()) {
      alert("Insufficient balance to start session");
      return;
    }

    setSessionState("initializing");

    // Simulate connection delay
    setTimeout(() => {
      setSessionState("active");
    }, 1500);
  };

  const handleEndSession = () => {
    setSessionState("ending");

    setTimeout(() => {
      setSessionState("ended");
      const minutes = Math.floor(actualSessionDurartion.current / 60);
      const seconds = actualSessionDurartion.current % 60;
      alert(
        `Session ended.\n\nDuration: ${minutes}m ${seconds}s\nTokens charged: ${actualTokensConsumed.current.toFixed(
          2
        )}`
      );
    }, 500);
  };

  // Timer effect - runs every second during active session
  useEffect(() => {
    if (sessionState === "active") {
      const interval = setInterval(() => {
        setSessionDuration((prev) => {
          const newDuration = prev + 1;

          actualSessionDurartion.current = newDuration;

          // Calculate tokens consumed (already implemented - you can see this working)
          const consumed = calculateTokensConsumed(newDuration);
          setTokensConsumed(consumed);

          actualTokensConsumed.current = consumed;

          checkLowBalance();
          if (checkBalanceDepleted()) {
            handleEndSession(); // Auto-terminate when balance runs out
          }

          return newDuration;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionState]);

  return {
    sessionState,
    sessionDuration,
    tokensConsumed,
    showLowBalanceWarning,
    handleStartSession,
    handleEndSession,
  };
}
