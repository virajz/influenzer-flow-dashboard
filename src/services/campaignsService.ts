
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
  budget: number;
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
      const now = new Date().toISOString();
      const campaignData = {
        ...campaign,
        createdAt: now,
        updatedAt: now
      };
      
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
      console.log('Fetching campaigns for brand:', brandId);
      const q = query(
        collection(db, CAMPAIGNS_COLLECTION),
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
      
      console.log('Fetched campaigns:', campaigns);
      return campaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  // Get a single campaign by ID
  async getCampaignById(campaignId: string): Promise<Campaign | null> {
    try {
      const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          campaignId: docSnap.id,
          ...docSnap.data()
        } as Campaign;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  },

  // Update a campaign
  async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<void> {
    try {
      const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      console.log('Campaign updated:', campaignId);
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  // Delete a campaign
  async deleteCampaign(campaignId: string): Promise<void> {
    try {
      const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
      await deleteDoc(docRef);
      console.log('Campaign deleted:', campaignId);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
};
