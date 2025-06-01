
import { collection, doc, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CommunicationRecord {
  id: string;
  creatorId: string;
  brandId: string;
  campaignId?: string;
  negotiationId?: string;
  type: 'email' | 'call' | 'dm' | 'agent_call';
  method: 'manual' | 'auto' | 'ai_agent';
  subject: string;
  content?: string;
  status: 'sent' | 'delivered' | 'read' | 'replied' | 'failed' | 'completed';
  timestamp: string;
  details: string;
  metadata?: {
    hasAudio?: boolean;
    hasTranscript?: boolean;
    audioUrl?: string;
    transcriptUrl?: string;
    duration?: number;
    recipientResponse?: string;
  };
}

const COMMUNICATION_COLLECTION = 'communication_history';

export const communicationHistoryService = {
  async addCommunicationRecord(record: Omit<CommunicationRecord, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COMMUNICATION_COLLECTION), {
      ...record,
      timestamp: record.timestamp || new Date().toISOString(),
    });
    
    return docRef.id;
  },

  async getCommunicationHistory(creatorId: string, brandId: string): Promise<CommunicationRecord[]> {
    const q = query(
      collection(db, COMMUNICATION_COLLECTION),
      where('creatorId', '==', creatorId),
      where('brandId', '==', brandId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as CommunicationRecord));
  },

  async getCommunicationByNegotiation(negotiationId: string): Promise<CommunicationRecord[]> {
    const q = query(
      collection(db, COMMUNICATION_COLLECTION),
      where('negotiationId', '==', negotiationId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as CommunicationRecord));
  }
};
