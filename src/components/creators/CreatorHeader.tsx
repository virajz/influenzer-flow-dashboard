
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FiUsers, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { Creator } from '@/services/creatorsService';

interface CreatorHeaderProps {
  creator: Creator;
}

export const CreatorHeader = ({ creator }: CreatorHeaderProps) => {
  const getStatusColor = () => {
    return creator.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = () => {
    return creator.isAvailable ? 'Available' : 'Unavailable';
  };

  return (
    <Card className="rounded-2xl shadow-md mb-8">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={creator.profileURL} alt={creator.displayName} className="object-cover" />
            <AvatarFallback>{creator.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{creator.displayName}</h1>
                <p className="text-lg text-gray-600">@{creator.instagramHandle}</p>
              </div>
              <Badge className={getStatusColor()}>{getStatusText()}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-2">
                <FiUsers className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Instagram Followers</p>
                  <p className="font-semibold">{creator.instagramFollowers.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FiDollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Base Rate</p>
                  <p className="font-semibold">${creator.baseRate.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-500 rounded text-white flex items-center justify-center text-xs">%</div>
                <div>
                  <p className="text-sm text-gray-500">Engagement Rate</p>
                  <p className="font-semibold">{creator.averageEngagementRate}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{creator.category}</Badge>
                {creator.instagramHandle && (
                  <Badge variant="outline">Instagram</Badge>
                )}
                {creator.youtubeHandle && (
                  <Badge variant="outline">YouTube</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <FiMapPin className="h-4 w-4" />
                <span>Location TBD</span>
              </div>
            </div>

            <p className="text-gray-600 mt-4">
              {creator.category} creator with {creator.averageEngagementRate}% engagement rate. 
              {creator.hasManager && ' Managed by a professional team.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
