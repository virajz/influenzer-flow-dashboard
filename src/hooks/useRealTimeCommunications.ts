
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Communication } from '@/services/communicationsService';

export const useRealTimeCommunications = (negotiationIds: string[]) => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no negotiation IDs, clear communications and don't set up listener
    if (negotiationIds.length === 0) {
      setCommunications([]);
      setIsLoading(false);
      return;
    }

    // Add a small delay to prevent rapid successive queries
    const timeoutId = setTimeout(() => {
      setIsLoading(true);

      const q = query(
        collection(db, 'communications'),
        where('negotiationId', 'in', negotiationIds),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const communicationsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          communicationId: doc.id
        } as Communication));
        
        setCommunications(communicationsData);
        setIsLoading(false);
      }, (error) => {
        setIsLoading(false);
      });

      return () => unsubscribe();
    }, 100); // Small delay to debounce rapid changes

    return () => {
      clearTimeout(timeoutId);
    };
  }, [negotiationIds.join(',')]); // Use join to create a stable dependency

  return { communications, isLoading };
};
