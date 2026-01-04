// src/hooks/useActivityTracker.js
import { useEffect, useRef } from 'react';
import api from '../services/api';

export const useActivityTracker = (userEmail, isLoggedIn) => {
  const minutesRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn || !userEmail) return;

    // Increment every minute
    intervalRef.current = setInterval(() => {
      minutesRef.current += 1;
    }, 60 * 1000); // 1 minute

    const sendActivity = async () => {
      if (minutesRef.current > 0) {
        try {
          await api.post('/activity/update', {
            email: userEmail,
            minutesSpent: minutesRef.current
          });
          minutesRef.current = 0;
        } catch (err) {
          console.error('Activity update failed:', err);
        }
      }
    };

    window.addEventListener('beforeunload', sendActivity);

    return () => {
      clearInterval(intervalRef.current);
      sendActivity();
      window.removeEventListener('beforeunload', sendActivity);
    };
  }, [userEmail, isLoggedIn]);
};
