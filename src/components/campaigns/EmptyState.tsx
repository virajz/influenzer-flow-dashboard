
import { useNavigate } from 'react-router-dom';
import { Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  searchTerm: string;
  statusFilter: string;
}

export const EmptyState = ({ searchTerm, statusFilter }: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-8">
      <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
      <p className="text-gray-500 mb-4">
        {searchTerm || statusFilter !== 'all' 
          ? 'Try adjusting your search or filters' 
          : 'Get started by creating your first campaign'}
      </p>
      {!searchTerm && statusFilter === 'all' && (
        <Button onClick={() => navigate('/campaigns/new')} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      )}
    </div>
  );
};
