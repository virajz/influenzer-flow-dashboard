
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { creatorsService } from '@/services/creatorsService';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';
import { toast } from '@/hooks/use-toast';
import { Search, Users } from 'lucide-react';

interface CreatorSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  onCreatorAssigned: () => void;
}

export const CreatorSelectionModal = ({
  open,
  onOpenChange,
  campaignId,
  onCreatorAssigned
}: CreatorSelectionModalProps) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch all creators
  const { data: creators = [], isLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: creatorsService.getAllCreators,
    enabled: open,
  });

  // Filter creators based on search
  const filteredCreators = creators.filter(creator =>
    creator.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.instagramHandle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCreatorSelection = (creatorId: string) => {
    setSelectedCreatorIds(prev =>
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleAssign = async () => {
    if (!currentUser?.uid || selectedCreatorIds.length === 0) return;

    setIsAssigning(true);
    try {
      let assignedCount = 0;
      let alreadyAssignedCount = 0;

      for (const creatorId of selectedCreatorIds) {
        const isAlreadyAssigned = await creatorAssignmentsService.isCreatorAssigned(
          currentUser.uid,
          creatorId,
          campaignId
        );

        if (isAlreadyAssigned) {
          alreadyAssignedCount++;
        } else {
          await creatorAssignmentsService.createOrUpdateAssignment(
            currentUser.uid,
            creatorId,
            campaignId
          );
          assignedCount++;
        }
      }

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: ['creatorAssignments', currentUser.uid]
      });

      if (assignedCount > 0) {
        toast({
          title: "Creators Assigned!",
          description: `${assignedCount} creator(s) successfully assigned to campaign.${
            alreadyAssignedCount > 0 ? ` ${alreadyAssignedCount} were already assigned.` : ''
          }`,
        });
      } else if (alreadyAssignedCount > 0) {
        toast({
          title: "Already Assigned",
          description: "All selected creators were already assigned to this campaign.",
          variant: "destructive"
        });
      }

      onCreatorAssigned();
      onOpenChange(false);
      setSelectedCreatorIds([]);
      setSearchTerm('');
    } catch (error) {
      console.error('Error assigning creators:', error);
      toast({
        title: "Error",
        description: "Failed to assign creators to campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Creators to Campaign</DialogTitle>
          <DialogDescription>
            Select creators to assign to this campaign.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search creators by name, handle, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected count */}
          {selectedCreatorIds.length > 0 && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">
                {selectedCreatorIds.length} creator(s) selected
              </p>
            </div>
          )}

          {/* Creators list */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredCreators.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No creators match your search.' : 'No creators found.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCreators.map((creator) => (
                <div
                  key={creator.creatorId}
                  className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleCreatorSelection(creator.creatorId)}
                >
                  <Checkbox
                    checked={selectedCreatorIds.includes(creator.creatorId)}
                    onChange={() => toggleCreatorSelection(creator.creatorId)}
                  />
                  
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={creator.profileURL} alt={creator.displayName} />
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
                      {creator.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{creator.displayName}</h4>
                    <p className="text-sm text-gray-600">
                      {creator.instagramHandle && `@${creator.instagramHandle}`}
                      {creator.instagramHandle && creator.email && ' • '}
                      {creator.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatFollowers(creator.instagramFollowers)} followers
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {creator.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium">₹{creator.baseRate.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{creator.averageEngagementRate}% engagement</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedCreatorIds.length === 0 || isAssigning}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isAssigning ? 'Assigning...' : `Add ${selectedCreatorIds.length || ''} Creator${selectedCreatorIds.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
