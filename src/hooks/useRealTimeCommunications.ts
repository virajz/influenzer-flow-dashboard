
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Communication } from '@/services/communicationsService';

export const useRealTimeCommunications = (negotiationIds: string[]) => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (negotiationIds.length === 0) {
      setCommunications([]);
      setIsLoading(false);
      return;
    }

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
    });

    return () => unsubscribe();
  }, [negotiationIds]);

  return { communications, isLoading };
};
