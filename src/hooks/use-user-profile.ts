'use client';

import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirebase } from '@/firebase';
import { UserProfile, getWeeksFromDueDate, getTrimester } from '@/lib/types/user-profile';

/**
 * Hook to get user profile data with pregnancy tracking
 */
export function useUserProfile() {
  const { firestore, user } = useFirebase();

  // Memoize the document reference
  const userDocRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data, isLoading, error } = useDoc<UserProfile>(userDocRef);

  // Calculate updated pregnancy data if available
  const enrichedData = useMemo(() => {
    if (!data?.pregnancyData) return data;

    const dueDate = new Date(data.pregnancyData.dueDate);
    const currentWeek = getWeeksFromDueDate(dueDate);
    const currentTrimester = getTrimester(currentWeek);

    return {
      ...data,
      pregnancyData: {
        ...data.pregnancyData,
        currentWeek,
        currentTrimester,
        dueDate: dueDate.toISOString(),
      },
    };
  }, [data]);

  return {
    userProfile: enrichedData,
    isLoading,
    error,
    hasPregnancyData: !!enrichedData?.pregnancyData,
  };
}
