
export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: number;
  category: string;
  platforms: string[];
  baseRate: number;
  engagementRate: number;
  location: string;
  bio: string;
}

export interface Campaign {
  id: string;
  name: string;
  budget: number;
  status: 'draft' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  targetAudience: string;
  description: string;
  platforms: { platform: string; contentType: string; quantity: number }[];
  targetCategories: { category: string; minFollowers: number; maxBudget: number }[];
  selectedCreators: string[];
}

export interface Negotiation {
  id: string;
  creatorId: string;
  campaignId: string;
  proposedRate: number;
  counterRate?: number;
  finalRate?: number;
  status: 'initiated' | 'email_sent' | 'deal_proposed' | 'negotiating' | 'accepted' | 'rejected';
  notes: string;
  deliverables: { platform: string; quantity: number; deadline: string }[];
  paymentStatus: 'pending' | 'completed' | 'failed';
}

export const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    handle: '@sarahjohnson',
    avatar: 'https://images.unsplash.com/photo-1516008161955-41230438b66f?w=400',
    followers: 250000,
    category: 'Lifestyle',
    platforms: ['Instagram', 'TikTok'],
    baseRate: 2500,
    engagementRate: 4.2,
    location: 'Los Angeles, CA',
    bio: 'Lifestyle influencer passionate about wellness and fashion'
  },
  {
    id: '2',
    name: 'Mike Chen',
    handle: '@mikechentech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    followers: 180000,
    category: 'Tech',
    platforms: ['YouTube', 'Instagram'],
    baseRate: 3200,
    engagementRate: 5.8,
    location: 'San Francisco, CA',
    bio: 'Tech reviewer and gadget enthusiast'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    handle: '@emmafit',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    followers: 320000,
    category: 'Fitness',
    platforms: ['Instagram', 'TikTok', 'YouTube'],
    baseRate: 4000,
    engagementRate: 6.1,
    location: 'Miami, FL',
    bio: 'Certified personal trainer and nutrition coach'
  },
  {
    id: '4',
    name: 'David Park',
    handle: '@davidcooks',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    followers: 95000,
    category: 'Food',
    platforms: ['Instagram', 'YouTube'],
    baseRate: 1800,
    engagementRate: 7.3,
    location: 'New York, NY',
    bio: 'Professional chef sharing easy recipes'
  },
  {
    id: '5',
    name: 'Lisa Taylor',
    handle: '@lisatravel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    followers: 450000,
    category: 'Travel',
    platforms: ['Instagram', 'YouTube', 'TikTok'],
    baseRate: 5500,
    engagementRate: 4.9,
    location: 'Austin, TX',
    bio: 'Travel photographer and adventure seeker'
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Fashion Collection',
    budget: 25000,
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-07-31',
    targetAudience: 'Women 18-35, fashion enthusiasts',
    description: 'Promote our new summer collection with lifestyle influencers',
    platforms: [
      { platform: 'Instagram', contentType: 'Posts', quantity: 3 },
      { platform: 'Instagram', contentType: 'Stories', quantity: 5 },
      { platform: 'TikTok', contentType: 'Videos', quantity: 2 }
    ],
    targetCategories: [
      { category: 'Lifestyle', minFollowers: 100000, maxBudget: 5000 },
      { category: 'Fashion', minFollowers: 50000, maxBudget: 3000 }
    ],
    selectedCreators: ['1', '5']
  },
  {
    id: '2',
    name: 'Tech Product Launch',
    budget: 40000,
    status: 'draft',
    startDate: '2024-07-15',
    endDate: '2024-08-30',
    targetAudience: 'Tech enthusiasts, early adopters',
    description: 'Launch campaign for our new smart home device',
    platforms: [
      { platform: 'YouTube', contentType: 'Reviews', quantity: 1 },
      { platform: 'Instagram', contentType: 'Posts', quantity: 2 }
    ],
    targetCategories: [
      { category: 'Tech', minFollowers: 150000, maxBudget: 8000 }
    ],
    selectedCreators: ['2']
  }
];

export const mockNegotiations: Negotiation[] = [
  {
    id: '1',
    creatorId: '1',
    campaignId: '1',
    proposedRate: 2500,
    counterRate: 3000,
    finalRate: 2750,
    status: 'accepted',
    notes: 'Creator agreed to include product styling in posts',
    deliverables: [
      { platform: 'Instagram', quantity: 3, deadline: '2024-06-15' },
      { platform: 'TikTok', quantity: 2, deadline: '2024-06-20' }
    ],
    paymentStatus: 'completed'
  },
  {
    id: '2',
    creatorId: '2',
    campaignId: '2',
    proposedRate: 3200,
    status: 'email_sent',
    notes: 'Initial outreach sent, waiting for response',
    deliverables: [
      { platform: 'YouTube', quantity: 1, deadline: '2024-07-30' }
    ],
    paymentStatus: 'pending'
  }
];
