
import { collection, doc, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Communication {
  communicationId: string;
  negotiationId: string;
  type: 'email' | 'voice_call' | 'instagram_dm' | 'youtube_message';
  direction: 'outbound' | 'inbound';
  status: 'sent' | 'delivered' | 'opened' | 'replied' | 'failed' | 'completed';
  subject: string;
  content: string;
  aiAgentUsed: boolean;
  voiceCallDuration: number;
  voiceCallSummary: string;
  followUpRequired: boolean;
  followUpDate: string;
  messageId: string;
  createdAt: string;
  references?: string;
}

const COMMUNICATIONS_COLLECTION = 'communications';

export const communicationsService = {
  async addCommunication(communication: Omit<Communication, 'communicationId' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COMMUNICATIONS_COLLECTION), {
      ...communication,
      createdAt: new Date().toISOString(),
    });
    
    return docRef.id;
  },

  async getCommunicationsByNegotiation(negotiationId: string): Promise<Communication[]> {
    const q = query(
      collection(db, COMMUNICATIONS_COLLECTION),
      where('negotiationId', '==', negotiationId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      communicationId: doc.id
    } as Communication));
  },

  async getAllCommunications(): Promise<Communication[]> {
    const q = query(
      collection(db, COMMUNICATIONS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      communicationId: doc.id
    } as Communication));
  }
};
