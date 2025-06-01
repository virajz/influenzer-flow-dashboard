
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface VoiceCommunication {
    voiceCommunicationId: string;
    negotiationId: string;
    creatorId: string;
    conversationId: string;
    audioUrl: string;
    transcript: ConversationTurn[];
    phone: string;
    duration: number;
    status: 'completed' | 'failed' | 'in_progress';
    createdAt: string;
}

export interface ConversationTurn {
    role: 'agent' | 'creator';
    message: string;
    time_in_call_secs: number;
}

const VOICE_COMMUNICATIONS_COLLECTION = 'voiceCommunications';

export const voiceCommunicationsService = {
    async getVoiceCommunicationsByNegotiation(negotiationId: string): Promise<VoiceCommunication[]> {
        try {
            const q = query(
                collection(db, VOICE_COMMUNICATIONS_COLLECTION),
                where('negotiationId', '==', negotiationId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                ...doc.data(),
                voiceCommunicationId: doc.id
            } as VoiceCommunication));
        } catch (error: any) {
            if (error?.code === 'failed-precondition') {
                console.error('Missing composite index for voiceCommunications query. Please create an index for:', {
                    collection: VOICE_COMMUNICATIONS_COLLECTION,
                    fields: ['negotiationId', 'createdAt'],
                    error: error.message
                });
            }
            console.error('Error fetching voice communications by negotiation:', error);
            throw error;
        }
    }
};
