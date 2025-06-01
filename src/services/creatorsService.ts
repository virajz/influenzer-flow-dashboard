
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Creator {
  creatorId: string;
  displayName: string;
  email: string;
  phone: string;
  instagramHandle: string;
  instagramFollowers: number;
  youtubeHandle: string;
  youtubeSubscribers: number;
  category: string;
  averageEngagementRate: number;
  baseRate: number;
  isAvailable: boolean;
  preferredContactMethod: string;
  hasManager: boolean;
  managerEmail: string;
  managerPhone: string;
  profileURL: string;
  createdAt: string;
  updatedAt: string;
}

export const creatorsService = {
  // Get all creators
  async getAllCreators(): Promise<Creator[]> {
    try {
      const creatorsCollection = collection(db, 'creators');
      const q = query(creatorsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const creators: Creator[] = [];
      querySnapshot.forEach((doc) => {
        const creatorData = {
          ...doc.data(),
          creatorId: doc.id
        } as Creator;
        creators.push(creatorData);
      });

      return creators;
    } catch (error) {
      console.error('Error fetching creators:', error);
      throw error;
    }
  }
};
