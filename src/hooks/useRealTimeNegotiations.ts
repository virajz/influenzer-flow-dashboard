
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Negotiation } from '@/services/negotiationsService';

export const useRealTimeNegotiations = (creatorId?: string) => {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!creatorId) {
      setNegotiations([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'negotiations'),
      where('creatorId', '==', creatorId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const negotiationsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        negotiationId: doc.id
      } as Negotiation));
      
      setNegotiations(negotiationsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [creatorId]);

  return { negotiations, isLoading };
};
