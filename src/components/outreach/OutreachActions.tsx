import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiPhone, FiSend } from 'react-icons/fi';
import { Negotiation } from '@/services/negotiationsService';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';

interface OutreachActionsProps {
    negotiation: Negotiation | null;
    onAutoEmail: () => void;
    onAgentCall: () => void;
}

export const OutreachActions = ({
    negotiation,
    onAutoEmail,
    onAgentCall
}: OutreachActionsProps) => {
    const { currentUser } = useAuth();

    const getStatusBadge = () => {
        if (!negotiation) {
            return <Badge variant="secondary">Not Started</Badge>;
        }

        const statusColors = {
            'initiated': 'bg-blue-100 text-blue-800',
            'email_sent': 'bg-yellow-100 text-yellow-800',
            'phone_contacted': 'bg-purple-100 text-purple-800',
            'in_progress': 'bg-orange-100 text-orange-800',
            'deal_proposed': 'bg-cyan-100 text-cyan-800',
            'accepted': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            'cancelled': 'bg-gray-100 text-gray-800'
        };

        return (
            <Badge className={statusColors[negotiation.status]}>
                {negotiation.status.replace('_', ' ').toUpperCase()}
            </Badge>
        );
    };

    const canSendEmail = !negotiation || !['accepted', 'rejected', 'cancelled'].includes(negotiation.status);
    const canCall = canSendEmail;
    const hasPhoneAttempted = negotiation?.phoneContactAttempted;

    const handleAgentCall = async () => {
        if (!negotiation || !currentUser) {
            toast({
                title: 'Error',
                description: 'Missing negotiation or authentication.',
                variant: 'destructive',
            });
            return;
        }

        // Fetch the phone number from creatorAssignments
        const assignment = await creatorAssignmentsService.getCreatorAssignment(
            currentUser.uid,
            negotiation.creatorId
        );
        console.log('Assignment:', assignment);
        if (!assignment || !assignment.phone) {
            toast({
                title: 'Error',
                description: 'Phone number not found for the creator.',
                variant: 'destructive',
            });
            return;
        }
        const phone = assignment.phone;

        try {
            await apiService.initiateAgentCall(negotiation.negotiationId, phone);

            toast({
                title: 'Success',
                description: 'Call initiated successfully.',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to initiate call.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Outreach Status</h3>
                {getStatusBadge()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                    onClick={onAutoEmail}
                    disabled={!canSendEmail}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <FiSend className="h-4 w-4" />
                    Auto Email
                </Button>

                <Button
                    onClick={handleAgentCall}
                    disabled={!negotiation}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <FiPhone className="h-4 w-4" />
                    Agent Call
                    {negotiation?.phoneContactAttempted && <Badge variant="secondary" className="ml-1">Called</Badge>}
                </Button>
            </div>

            {negotiation && (
                <div className="text-sm text-gray-600">
                    <p>Initial Contact: {negotiation.initialContactMethod}</p>
                    <p>Availability: {negotiation.creatorAvailability}</p>
                    {negotiation.proposedRate > 0 && (
                        <p>Proposed Rate: ${negotiation.proposedRate.toLocaleString()}</p>
                    )}
                </div>
            )}
        </div>
    );
};
