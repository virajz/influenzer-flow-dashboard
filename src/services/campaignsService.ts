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
      console.log('Fetching campaigns for brand:', brandId);
      console.log('Database instance:', db);
      console.log('Collection name:', CAMPAIGNS_COLLECTION);
      
      const campaignsCollection = collection(db, CAMPAIGNS_COLLECTION);
      console.log('Collection reference:', campaignsCollection);
      
      const q = query(
        campaignsCollection,
        where('brandId', '==', brandId),
        orderBy('createdAt', 'desc')
      );
      
      console.log('Query created:', q);
      
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot received:', querySnapshot);
      console.log('Query snapshot size:', querySnapshot.size);
      console.log('Query snapshot empty:', querySnapshot.empty);
      
      const campaigns: Campaign[] = [];
      
      querySnapshot.forEach((doc) => {
        console.log('Processing document:', doc.id, doc.data());
        campaigns.push({
          campaignId: doc.id,
          ...doc.data()
        } as Campaign);
      });
      
      console.log('Final campaigns array:', campaigns);
      return campaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      console.error('Error details:', error);
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
