
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CreatorAssignment {
  id?: string;
  userId: string;
  creatorId: string;
  campaignIds: string[];
  phoneDiscovered: boolean;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const creatorAssignmentsService = {
  // Create or update a creator assignment with campaign IDs array
  async createOrUpdateAssignment(userId: string, creatorId: string, campaignId: string): Promise<void> {
    const q = query(
      collection(db, 'creatorAssignments'),
      where('userId', '==', userId),
      where('creatorId', '==', creatorId)
    );
    const querySnapshot = await getDocs(q);
    
    const now = new Date();
    
    if (!querySnapshot.empty) {
      // Update existing assignment
      const existingDoc = querySnapshot.docs[0];
      const existingData = existingDoc.data() as CreatorAssignment;
      
      // Add campaignId to array if not already present
      const updatedCampaignIds = existingData.campaignIds || [];
      if (!updatedCampaignIds.includes(campaignId)) {
        updatedCampaignIds.push(campaignId);
        
        await updateDoc(doc(db, 'creatorAssignments', existingDoc.id), {
          campaignIds: updatedCampaignIds,
          updatedAt: now
        });
      }
    } else {
      // Create new assignment
      const assignmentData: Omit<CreatorAssignment, 'id'> = {
        userId,
        creatorId,
        campaignIds: [campaignId],
        phoneDiscovered: false,
        createdAt: now,
        updatedAt: now
      };
      
      await addDoc(collection(db, 'creatorAssignments'), assignmentData);
    }
  },

  // Get assignments by user ID
  async getAssignmentsByUser(userId: string): Promise<CreatorAssignment[]> {
    const q = query(collection(db, 'creatorAssignments'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as CreatorAssignment[];
  },

  // Get single creator assignment
  async getCreatorAssignment(userId: string, creatorId: string): Promise<CreatorAssignment | null> {
    const q = query(
      collection(db, 'creatorAssignments'),
      where('userId', '==', userId),
      where('creatorId', '==', creatorId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as CreatorAssignment;
  },

  // Check if creator is already assigned to campaign
  async isCreatorAssigned(userId: string, creatorId: string, campaignId: string): Promise<boolean> {
    const assignment = await this.getCreatorAssignment(userId, creatorId);
    return assignment ? assignment.campaignIds.includes(campaignId) : false;
  },

  // Remove campaign from creator's assignment
  async removeCampaignFromCreator(userId: string, creatorId: string, campaignId: string): Promise<void> {
    const q = query(
      collection(db, 'creatorAssignments'),
      where('userId', '==', userId),
      where('creatorId', '==', creatorId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      const existingData = existingDoc.data() as CreatorAssignment;
      
      const updatedCampaignIds = existingData.campaignIds.filter(id => id !== campaignId);
      
      if (updatedCampaignIds.length === 0) {
        // Delete the document if no campaigns left
        await deleteDoc(doc(db, 'creatorAssignments', existingDoc.id));
      } else {
        // Update with remaining campaigns
        await updateDoc(doc(db, 'creatorAssignments', existingDoc.id), {
          campaignIds: updatedCampaignIds,
          updatedAt: new Date()
        });
      }
    }
  },

  // Update phone discovery status
  async updatePhoneDiscovery(userId: string, creatorId: string, phoneNumber?: string): Promise<void> {
    const q = query(
      collection(db, 'creatorAssignments'),
      where('userId', '==', userId),
      where('creatorId', '==', creatorId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const assignmentRef = doc(db, 'creatorAssignments', querySnapshot.docs[0].id);
      await updateDoc(assignmentRef, {
        phoneDiscovered: !!phoneNumber,
        phoneNumber: phoneNumber || null,
        updatedAt: new Date()
      });
    }
  }
};
