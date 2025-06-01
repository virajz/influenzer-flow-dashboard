
import { Campaign } from '@/services/campaignsService';
import { Negotiation } from '@/services/negotiationsService';

export const filterCampaignsByStatus = (
  campaigns: Campaign[],
  negotiations: Negotiation[]
) => {
  const campaignsWithNegotiations = campaigns.map(campaign => {
    const negotiation = negotiations.find(n => n.campaignId === campaign.campaignId);
    return { campaign, negotiation };
  });

  const currentCampaigns = campaignsWithNegotiations.filter(({ campaign, negotiation }) => {
    const endDate = new Date(campaign.endDate);
    const today = new Date();
    return (campaign.status === 'active' || campaign.status === 'draft' || endDate >= today) && 
           (!negotiation || !['rejected', 'cancelled'].includes(negotiation.status));
  });

  const pastCampaigns = campaignsWithNegotiations.filter(({ campaign, negotiation }) => {
    const endDate = new Date(campaign.endDate);
    const today = new Date();
    return endDate < today || campaign.status === 'completed' || campaign.status === 'cancelled' ||
           (negotiation && ['rejected', 'cancelled', 'accepted'].includes(negotiation.status));
  });

  return { currentCampaigns, pastCampaigns };
};
