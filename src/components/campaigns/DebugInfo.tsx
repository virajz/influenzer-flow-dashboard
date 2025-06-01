
import { useAuth } from '@/contexts/AuthContext';

interface DebugInfoProps {
  campaignsCount: number;
  isError: boolean;
  error: Error | null;
}

export const DebugInfo = ({ campaignsCount, isError, error }: DebugInfoProps) => {
  const { currentUser } = useAuth();

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
      <p>Debug Info:</p>
      <p>User ID: {currentUser?.uid}</p>
      <p>Campaigns count: {campaignsCount}</p>
      <p>Is Error: {isError ? 'Yes' : 'No'}</p>
      <p>Error: {error instanceof Error ? error.message : 'None'}</p>
    </div>
  );
};
