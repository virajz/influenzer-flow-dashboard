
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Negotiation } from '@/services/negotiationsService';

interface CampaignDebugSectionProps {
  campaignId: string | undefined;
  allNegotiations: Negotiation[];
  negotiations: Negotiation[];
}

export const CampaignDebugSection = ({ 
  campaignId, 
  allNegotiations, 
  negotiations 
}: CampaignDebugSectionProps) => {
  return (
    <Card className="mb-8 border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800">DEBUG: ALL Negotiations Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-red-700 mb-2">Current Campaign ID:</h4>
            <div className="bg-white p-3 rounded border">
              <code className="text-sm font-mono">{campaignId}</code>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-red-700 mb-2">ALL Negotiations in Database ({allNegotiations.length} total):</h4>
            <div className="bg-white p-4 rounded border max-h-60 overflow-y-auto">
              {allNegotiations.length === 0 ? (
                <p className="text-gray-500 italic">No negotiations found in database</p>
              ) : (
                <div className="space-y-2">
                  {allNegotiations.map((neg, idx) => (
                    <div key={neg.negotiationId} className="border-b pb-2 mb-2 last:border-b-0">
                      <p className="text-xs"><strong>#{idx + 1}</strong> ID: {neg.negotiationId}</p>
                      <p className="text-xs"><strong>Campaign ID:</strong> <code>{neg.campaignId}</code></p>
                      <p className="text-xs"><strong>Creator ID:</strong> {neg.creatorId}</p>
                      <p className="text-xs"><strong>Status:</strong> {neg.status}</p>
                      <p className="text-xs text-green-600">
                        <strong>Match with current campaign:</strong> {neg.campaignId === campaignId ? '✅ YES' : '❌ NO'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-red-700 mb-2">Filtered Negotiations for Current Campaign ({negotiations.length} items):</h4>
            <div className="bg-white p-4 rounded border max-h-40 overflow-y-auto">
              {negotiations.length === 0 ? (
                <p className="text-gray-500 italic">No negotiations found for this campaign</p>
              ) : (
                <pre className="text-xs">{JSON.stringify(negotiations, null, 2)}</pre>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-red-700 mb-2">Campaign ID Analysis:</h4>
            <div className="bg-white p-4 rounded border">
              <p className="text-sm">Current Campaign ID: <code>{campaignId}</code></p>
              <p className="text-sm">Unique Campaign IDs in negotiations: {[...new Set(allNegotiations.map(n => n.campaignId))].map(id => `"${id}"`).join(', ') || 'None'}</p>
              <p className="text-sm">Exact matches found: {allNegotiations.filter(n => n.campaignId === campaignId).length}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
