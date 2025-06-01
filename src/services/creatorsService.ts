
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

// Transform Firebase creator to the format expected by the UI
const transformCreatorForUI = (creator: Creator) => ({
  id: creator.creatorId,
  name: creator.displayName,
  handle: creator.instagramHandle,
  avatar: creator.profileURL,
  followers: creator.instagramFollowers,
  category: creator.category,
  location: 'Location TBD', // You might want to add this field to your schema
  bio: `${creator.category} creator with ${creator.averageEngagementRate}% engagement rate`,
  platforms: [
    ...(creator.instagramHandle ? ['Instagram'] : []),
    ...(creator.youtubeHandle ? ['YouTube'] : [])
  ],
  baseRate: creator.baseRate,
  engagementRate: creator.averageEngagementRate
});

export const creatorsService = {
  // Get all creators
  async getAllCreators(): Promise<any[]> {
    try {
      console.log('Fetching creators from Firebase...');
      const creatorsCollection = collection(db, 'creators');
      const q = query(creatorsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      console.log('Creators query snapshot size:', querySnapshot.size);
      
      const creators: any[] = [];
      querySnapshot.forEach((doc) => {
        const creatorData = doc.data() as Creator;
        console.log('Processing creator:', creatorData);
        creators.push(transformCreatorForUI(creatorData));
      });
      
      console.log('Transformed creators:', creators);
      return creators;
    } catch (error) {
      console.error('Error fetching creators:', error);
      throw error;
    }
  }
};
