
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
      console.log('Fetching creators from Firebase...');
      const creatorsCollection = collection(db, 'creators');
      const q = query(creatorsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      console.log('Creators query snapshot size:', querySnapshot.size);
      
      const creators: Creator[] = [];
      querySnapshot.forEach((doc) => {
        const creatorData = doc.data() as Creator;
        console.log('Processing creator:', creatorData);
        creators.push(creatorData);
      });
      
      console.log('Firebase creators:', creators);
      return creators;
    } catch (error) {
      console.error('Error fetching creators:', error);
      throw error;
    }
  }
};
