
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CreatorAssignment {
  id?: string;
  userId: string;
  creatorId: string;
  campaignId: string;
  phoneDiscovered: boolean;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const creatorAssignmentsService = {
  // Create a new creator assignment
  async createAssignment(assignment: Omit<CreatorAssignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const assignmentData = {
      ...assignment,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'creatorAssignments'), assignmentData);
    return docRef.id;
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

  // Check if creator is already assigned to campaign
  async isCreatorAssigned(userId: string, creatorId: string, campaignId: string): Promise<boolean> {
    const q = query(
      collection(db, 'creatorAssignments'),
      where('userId', '==', userId),
      where('creatorId', '==', creatorId),
      where('campaignId', '==', campaignId)
    );
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  },

  // Update phone discovery status
  async updatePhoneDiscovery(assignmentId: string, phoneNumber?: string): Promise<void> {
    const assignmentRef = doc(db, 'creatorAssignments', assignmentId);
    await updateDoc(assignmentRef, {
      phoneDiscovered: !!phoneNumber,
      phoneNumber: phoneNumber || null,
      updatedAt: new Date()
    });
  }
};
