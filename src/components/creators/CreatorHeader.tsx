
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
    return 'bg-green-100 text-green-800';
  };

  return (
    <Card className="rounded-2xl shadow-md mb-8">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={creator.avatar} alt={creator.name} className="object-cover" />
            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{creator.name}</h1>
                <p className="text-lg text-gray-600">{creator.handle}</p>
              </div>
              <Badge className={getStatusColor()}>Available</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-2">
                <FiUsers className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Followers</p>
                  <p className="font-semibold">{creator.followers.toLocaleString()}</p>
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
                  <p className="font-semibold">{creator.engagementRate}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{creator.category}</Badge>
                {creator.platforms.map((platform) => (
                  <Badge key={platform} variant="outline">{platform}</Badge>
                ))}
              </div>
              
              {creator.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin className="h-4 w-4" />
                  <span>{creator.location}</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 mt-4">{creator.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
