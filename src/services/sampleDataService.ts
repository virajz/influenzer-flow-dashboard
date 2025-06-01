
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const sampleCreators = [
  {
    creatorId: "creator_209",
    displayName: "Aarav Kapoor",
    email: "aarav.kapoor@example.com",
    phone: "",
    instagramHandle: "@aaravkapoor",
    instagramFollowers: 43659,
    youtubeHandle: "aaravyt",
    youtubeSubscribers: 9857,
    category: "tech",
    averageEngagementRate: 3.2,
    baseRate: 8126,
    isAvailable: true,
    preferredContactMethod: "email",
    hasManager: false,
    managerEmail: "",
    managerPhone: "+911234560009",
    profileURL: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400",
    createdAt: "2025-06-01T10:33:16Z",
    updatedAt: "2025-06-01T10:33:16Z"
  },
  {
    creatorId: "creator_210",
    displayName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+911234567890",
    instagramHandle: "@priyasharma",
    instagramFollowers: 125000,
    youtubeHandle: "priyayt",
    youtubeSubscribers: 45000,
    category: "lifestyle",
    averageEngagementRate: 4.8,
    baseRate: 15000,
    isAvailable: true,
    preferredContactMethod: "email",
    hasManager: true,
    managerEmail: "manager@priya.com",
    managerPhone: "+911234567891",
    profileURL: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    createdAt: "2025-06-01T10:33:16Z",
    updatedAt: "2025-06-01T10:33:16Z"
  },
  {
    creatorId: "creator_211",
    displayName: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "",
    instagramHandle: "@rahulverma",
    instagramFollowers: 78000,
    youtubeHandle: "",
    youtubeSubscribers: 0,
    category: "fitness",
    averageEngagementRate: 5.2,
    baseRate: 12000,
    isAvailable: true,
    preferredContactMethod: "email",
    hasManager: false,
    managerEmail: "",
    managerPhone: "",
    profileURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    createdAt: "2025-06-01T10:33:16Z",
    updatedAt: "2025-06-01T10:33:16Z"
  }
];

export const sampleDataService = {
  async addSampleCreators(): Promise<void> {
    try {
      console.log('Adding sample creators to Firebase...');
      const promises = sampleCreators.map(creator => 
        addDoc(collection(db, 'creators'), creator)
      );
      await Promise.all(promises);
      console.log('Sample creators added successfully!');
    } catch (error) {
      console.error('Error adding sample creators:', error);
      throw error;
    }
  }
};
