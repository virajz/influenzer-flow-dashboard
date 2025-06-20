
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CampaignPlatformRequirement {
  platform: 'instagram' | 'youtube' | 'tiktok' | 'facebook' | 'twitter';
  contentType: 'post' | 'story' | 'reel' | 'video' | 'live';
  quantity: number;
}

export interface CampaignTargetCategory {
  category: string;
  minFollowers: number;
  maxBudgetPerCreator: number;
}

export interface Campaign {
  campaignId: string;
  brandId: string;
  campaignName: string;
  description: string;
  budgetPerCreator: number;
  targetAudience: string;
  requiredPlatforms: CampaignPlatformRequirement[];
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'negotiating' | 'completed' | 'cancelled';
  targetCreatorCategories: CampaignTargetCategory[];
  createdAt: string;
  updatedAt: string;
}

const CAMPAIGNS_COLLECTION = 'campaigns';

export const campaignsService = {
  // Create a new campaign
  async createCampaign(campaign: Omit<Campaign, 'campaignId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      console.log('Creating campaign with data:', campaign);
      const now = new Date().toISOString();
      const campaignData = {
        ...campaign,
        createdAt: now,
        updatedAt: now
      };

      console.log('Final campaign data to save:', campaignData);
      const docRef = await addDoc(collection(db, CAMPAIGNS_COLLECTION), campaignData);
      console.log('Campaign created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  // Get all campaigns for a brand
  async getCampaignsByBrand(brandId: string): Promise<Campaign[]> {
    try {
      const campaignsCollection = collection(db, CAMPAIGNS_COLLECTION);

      const q = query(
        campaignsCollection,
        where('brandId', '==', brandId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);

      const campaigns: Campaign[] = [];

      querySnapshot.forEach((doc) => {
        campaigns.push({
          campaignId: doc.id,
          ...doc.data()
        } as Campaign);
      });

      return campaigns;
    } catch (error: any) {
      if (error?.code === 'failed-precondition') {
        console.error('Missing composite index for campaigns query. Please create an index for:', {
          collection: CAMPAIGNS_COLLECTION,
          fields: ['brandId', 'createdAt'],
          error: error.message
        });
      }
      console.error('Error fetching campaigns by brand:', error);
      throw error;
    }
  },

  // Get a single campaign by ID
  async getCampaignById(campaignId: string): Promise<Campaign | null> {
    const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        campaignId: docSnap.id,
        ...docSnap.data()
      } as Campaign;
    }

    return null;
  },

  // Update a campaign
  async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<void> {
    const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  // Delete a campaign
  async deleteCampaign(campaignId: string): Promise<void> {
    const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
    await deleteDoc(docRef);
  }
};
