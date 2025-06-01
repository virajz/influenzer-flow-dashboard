
import { collection, doc, addDoc, updateDoc, getDocs, getDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Deliverable {
    platform: string;
    contentType: string;
    quantity: number;
    deadline: string;
    status?: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'completed';
}

export interface Negotiation {
    negotiationId: string;
    campaignId: string;
    brandId: string;
    creatorId: string;
    status: 'initiated' | 'email_sent' | 'phone_contacted' | 'in_progress' | 'deal_proposed' | 'accepted' | 'rejected' | 'cancelled';
    proposedRate: number;
    counterRate: number;
    finalRate: number;
    maxBudget: number;
    deliverables: Deliverable[];
    aiAgentNotes: string;
    creatorAvailability: 'available' | 'busy' | 'unavailable' | 'unknown';
    initialContactMethod: 'email' | 'phone' | 'instagram' | 'youtube';
    phoneContactAttempted: boolean;
    voiceCallCompleted: boolean;
    paymentStatus: 'pending' | 'completed' | 'failed';
    createdAt: string;
    updatedAt: string;
    escalationCount: number;
}

const NEGOTIATIONS_COLLECTION = 'negotiations';

export const negotiationsService = {
    async createNegotiation(negotiationData: Omit<Negotiation, 'negotiationId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const now = new Date().toISOString();
        const negotiation = {
            ...negotiationData,
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await addDoc(collection(db, NEGOTIATIONS_COLLECTION), negotiation);
        await updateDoc(docRef, { negotiationId: docRef.id });

        return docRef.id;
    },

    async updateNegotiation(negotiationId: string, updates: Partial<Negotiation>): Promise<void> {
        const docRef = doc(db, NEGOTIATIONS_COLLECTION, negotiationId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },

    async getNegotiation(negotiationId: string): Promise<Negotiation | null> {
        const docRef = doc(db, NEGOTIATIONS_COLLECTION, negotiationId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { ...docSnap.data(), negotiationId: docSnap.id } as Negotiation;
        }

        return null;
    },

    async getNegotiationsByCreator(creatorId: string): Promise<Negotiation[]> {
        try {
            const q = query(
                collection(db, NEGOTIATIONS_COLLECTION),
                where('creatorId', '==', creatorId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                ...doc.data(),
                negotiationId: doc.id
            } as Negotiation));
        } catch (error: any) {
            if (error?.code === 'failed-precondition') {
                console.error('Missing composite index for negotiations query by creator. Please create an index for:', {
                    collection: NEGOTIATIONS_COLLECTION,
                    fields: ['creatorId', 'createdAt'],
                    error: error.message
                });
            }
            console.error('Error fetching negotiations by creator:', error);
            throw error;
        }
    },

    async getNegotiationsByCampaign(campaignId: string): Promise<Negotiation[]> {
        try {
            console.log('Querying negotiations for campaignId:', campaignId);
            
            const q = query(
                collection(db, NEGOTIATIONS_COLLECTION),
                where('campaignId', '==', campaignId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            console.log('Query snapshot size:', querySnapshot.size);
            
            const negotiations = querySnapshot.docs.map(doc => {
                const data = { ...doc.data(), negotiationId: doc.id } as Negotiation;
                console.log('Found negotiation:', data.negotiationId, 'for campaign:', data.campaignId);
                return data;
            });
            
            console.log('Total negotiations found for campaign:', negotiations.length);
            return negotiations;
        } catch (error: any) {
            if (error?.code === 'failed-precondition') {
                console.error('Missing composite index for negotiations query by campaign. Please create an index for:', {
                    collection: NEGOTIATIONS_COLLECTION,
                    fields: ['campaignId', 'createdAt'],
                    error: error.message
                });
            }
            console.error("Firestore query failed for getNegotiationsByCampaign:", error);
            console.error("Campaign ID:", campaignId);
            console.error("Error details:", {
                code: error?.code,
                message: error?.message,
                stack: error?.stack
            });
            throw error;
        }
    },

    async getAllNegotiations(): Promise<Negotiation[]> {
        const q = query(
            collection(db, NEGOTIATIONS_COLLECTION),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            negotiationId: doc.id
        } as Negotiation));
    },

    async getNegotiationsByBrand(brandId: string): Promise<Negotiation[]> {
        try {
            const q = query(
                collection(db, NEGOTIATIONS_COLLECTION),
                where('brandId', '==', brandId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                ...doc.data(),
                negotiationId: doc.id
            } as Negotiation));
        } catch (error: any) {
            if (error?.code === 'failed-precondition') {
                console.error('Missing composite index for negotiations query by brand. Please create an index for:', {
                    collection: NEGOTIATIONS_COLLECTION,
                    fields: ['brandId', 'createdAt'],
                    error: error.message
                });
            }
            console.error("Firestore query failed for getNegotiationsByBrand:", error);
            throw error;
        }
    }
};
