
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Creator } from '@/services/creatorsService';
import { Negotiation } from '@/services/negotiationsService';

interface ContactedCreator {
  creator: Creator;
  negotiation: Negotiation;
}

interface ContactedCreatorsListProps {
  contactedCreators: ContactedCreator[];
  selectedCreatorId: string | null;
  onCreatorSelect: (creatorId: string) => void;
  negotiationsCount: number;
  allNegotiationsCount: number;
}

export const ContactedCreatorsList = ({ 
  contactedCreators, 
  selectedCreatorId, 
  onCreatorSelect,
  negotiationsCount,
  allNegotiationsCount
}: ContactedCreatorsListProps) => {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Contacted Creators</CardTitle>
      </CardHeader>
      <CardContent>
        {contactedCreators.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No creators contacted yet</p>
            <p className="text-xs text-gray-500 mt-2">
              Debug: Found {negotiationsCount} negotiations for this campaign, {allNegotiationsCount} total negotiations
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {contactedCreators.map(({ creator, negotiation }) => (
              <div
                key={creator.creatorId}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCreatorId === creator.creatorId
                    ? 'bg-purple-100 border-purple-200'
                    : 'hover:bg-gray-50 border-gray-200'
                } border`}
                onClick={() => onCreatorSelect(creator.creatorId)}
              >
                <div className="font-medium text-sm">{creator.displayName}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {creator.instagramHandle && `@${creator.instagramHandle}`}
                </div>
                <Badge 
                  variant="outline" 
                  className="mt-2 text-xs"
                >
                  {negotiation.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
