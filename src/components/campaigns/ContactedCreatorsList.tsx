
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Creator } from '@/services/creatorsService';
import { Negotiation } from '@/services/negotiationsService';
import { CreatorAssignment } from '@/services/creatorAssignmentsService';
import { CreatorFilters } from './CreatorFilters';

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
  creatorAssignments: CreatorAssignment[];
  communications: any[];
  onAutoEmail?: (creatorId: string) => void;
  onAgentCall?: (creatorId: string) => void;
}

export const ContactedCreatorsList = ({ 
  contactedCreators, 
  selectedCreatorId, 
  onCreatorSelect,
  negotiationsCount,
  allNegotiationsCount,
  creatorAssignments,
  communications,
  onAutoEmail,
  onAgentCall
}: ContactedCreatorsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter creators based on search and status
  const filteredCreators = contactedCreators.filter(({ creator, negotiation }) => {
    const matchesSearch = creator.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.instagramHandle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || negotiation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
      case 'deal_proposed':
        return 'bg-blue-100 text-blue-800';
      case 'email_sent':
      case 'phone_contacted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="rounded-2xl shadow-md flex flex-col h-full min-h-[300px] lg:min-h-[500px]">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-base sm:text-lg">
          Contacted Creators ({filteredCreators.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 px-3 sm:px-6">
        <div className="flex-shrink-0 mb-4">
          <CreatorFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
          />
        </div>
        
        {filteredCreators.length === 0 ? (
          <div className="text-center py-8 flex-1 flex items-center justify-center">
            <p className="text-gray-600 text-sm sm:text-base">
              {contactedCreators.length === 0 
                ? "No creators contacted yet" 
                : "No creators match your filters"}
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-2 sm:pr-4">
              {filteredCreators.map(({ creator, negotiation }) => (
                <div
                  key={creator.creatorId}
                  className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    selectedCreatorId === creator.creatorId
                      ? 'bg-purple-50 border-2 border-purple-200'
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => onCreatorSelect(creator.creatorId)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarImage 
                        src={creator.profileURL} 
                        alt={creator.displayName}
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-medium text-xs sm:text-sm">
                        {creator.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {creator.displayName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {creator.instagramHandle && `@${creator.instagramHandle}`}
                        {creator.instagramHandle && creator.email && ' • '}
                        {creator.email}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(negotiation.status)}`}
                        >
                          {negotiation.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
