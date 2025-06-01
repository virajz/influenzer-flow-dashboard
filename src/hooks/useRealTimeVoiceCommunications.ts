
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { VoiceCommunication } from '@/services/voiceCommunicationsService';

export const useRealTimeVoiceCommunications = (negotiationIds: string[]) => {
  const [voiceCommunications, setVoiceCommunications] = useState<VoiceCommunication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (negotiationIds.length === 0) {
      setVoiceCommunications([]);
      setIsLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsLoading(true);

      const q = query(
        collection(db, 'voiceCommunications'),
        where('negotiationId', 'in', negotiationIds),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const voiceCommData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          voiceCommunicationId: doc.id
        } as VoiceCommunication));
        
        setVoiceCommunications(voiceCommData);
        setIsLoading(false);
      }, (error) => {
        console.error('Error fetching voice communications:', error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [negotiationIds.join(',')]);

  return { voiceCommunications, isLoading };
};
