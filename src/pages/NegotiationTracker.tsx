import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService } from '@/services/campaignsService';
import { toast } from '@/hooks/use-toast';
import { FiDollarSign, FiCalendar, FiUser, FiMessageSquare, FiCheck, FiClock } from 'react-icons/fi';
import { negotiationsService } from '@/services/negotiationsService';

const NegotiationTracker = () => {
    const { currentUser } = useAuth();
    const { data: negotiations = [], isLoading } = useQuery({
        queryKey: ['negotiations', currentUser?.uid],
        queryFn: () => {
            if (!currentUser?.uid) {
                throw new Error('User not authenticated');
            }
            return negotiationsService.getNegotiationsByBrand(currentUser.uid);
        },
        enabled: !!currentUser?.uid,
    });

    const [counterOffer, setCounterOffer] = useState<{ [key: string]: string }>({});

    // Fetch campaigns to get campaign names
    const { data: campaigns = [] } = useQuery({
        queryKey: ['campaigns', currentUser?.uid],
        queryFn: () => {
            if (!currentUser?.uid) {
                throw new Error('User not authenticated');
            }
            return campaignsService.getCampaignsByBrand(currentUser.uid);
        },
        enabled: !!currentUser?.uid,
    });

    const getCampaignName = (campaignId: string) => {
        const campaign = campaigns.find(c => c.campaignId === campaignId);
        return campaign?.campaignName || 'Unknown Campaign';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'negotiating': return 'bg-yellow-100 text-yellow-800';
            case 'email_sent': return 'bg-blue-100 text-blue-800';
            case 'deal_proposed': return 'bg-purple-100 text-purple-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCounterOffer = (negotiationId: string) => {
        const amount = counterOffer[negotiationId];
        if (amount) {
            toast({
                title: "Counter Offer Sent",
                description: `Counter offer of ₹${amount} sent successfully.`,
            });
            setCounterOffer({ ...counterOffer, [negotiationId]: '' });
        }
    };

    const markAsPaid = (negotiationId: string) => {
        toast({
            title: "Payment Marked as Complete",
            description: "Payment status updated successfully.",
        });
    };

    const sendContract = (negotiationId: string) => {
        toast({
            title: "Contract Sent",
            description: "Contract has been sent to the creator for signature.",
        });
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Negotiation Tracker</h1>
                <p className="text-gray-600">Monitor deal progress and manage negotiations</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="rounded-2xl shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FiMessageSquare className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Negotiations</p>
                                <p className="text-2xl font-bold text-gray-900">{negotiations.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FiCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Deals Accepted</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {negotiations.filter(n => n.status === 'accepted').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FiClock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Response</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {negotiations.filter(n => n.status === 'email_sent').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FiDollarSign className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg. Final Rate</p>
                                <p className="text-2xl font-bold text-gray-900">₹2,750</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Negotiations List */}
            <div className="space-y-6">
                {negotiations.length === 0 ? (
                    <Card className="rounded-2xl shadow-md">
                        <CardContent className="p-8 text-center">
                            <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No active negotiations</h3>
                            <p className="text-gray-500">Start reaching out to creators to begin negotiations.</p>
                        </CardContent>
                    </Card>
                ) : (
                    negotiations.map((negotiation) => (
                        <Card key={negotiation.negotiationId} className="rounded-2xl shadow-md">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                            <FiUser className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Creator #{negotiation.creatorId}</CardTitle>
                                            <CardDescription>{getCampaignName(negotiation.campaignId) || 'Sample Campaign'}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(negotiation.status)}>
                                            {negotiation.status.replace('_', ' ')}
                                        </Badge>
                                        <Badge className={getPaymentStatusColor(negotiation.paymentStatus)}>
                                            {negotiation.paymentStatus}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Rate Negotiation */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center">
                                            <FiDollarSign className="mr-2 h-4 w-4" />
                                            Proposed Rate
                                        </h4>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ₹{negotiation.proposedRate.toLocaleString()}
                                        </p>
                                    </div>

                                    {negotiation.counterRate && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Counter Rate</h4>
                                            <p className="text-2xl font-bold text-orange-600">
                                                ₹{negotiation.counterRate.toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    {negotiation.finalRate && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Final Rate</h4>
                                            <p className="text-2xl font-bold text-green-600">
                                                ₹{negotiation.finalRate.toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Deliverables */}
                                <div>
                                    <h4 className="font-medium mb-3 flex items-center">
                                        <FiCalendar className="mr-2 h-4 w-4" />
                                        Deliverables
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {negotiation.deliverables.map((deliverable, index) => (
                                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                                <p className="font-medium">{deliverable.platform}</p>
                                                <p className="text-sm text-gray-600">{deliverable.quantity} pieces</p>
                                                <p className="text-xs text-gray-500">Due: {deliverable.deadline}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Notes */}
                                <div>
                                    <h4 className="font-medium mb-2">AI Agent Notes</h4>
                                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                        {negotiation.aiAgentNotes}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-4 pt-4 border-t">
                                    {negotiation.status === 'email_sent' && (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Counter offer amount"
                                                value={counterOffer[negotiation.negotiationId] || ''}
                                                onChange={(e) => setCounterOffer({
                                                    ...counterOffer,
                                                    [negotiation.negotiationId]: e.target.value
                                                })}
                                                className="w-40"
                                            />
                                            <Button
                                                onClick={() => handleCounterOffer(negotiation.negotiationId)}
                                                variant="outline"
                                            >
                                                Send Counter
                                            </Button>
                                        </div>
                                    )}

                                    {negotiation.status === 'accepted' && (
                                        <>
                                            <Button onClick={() => sendContract(negotiation.negotiationId)}>
                                                Send Contract
                                            </Button>
                                            {negotiation.paymentStatus === 'pending' && (
                                                <Button
                                                    onClick={() => markAsPaid(negotiation.negotiationId)}
                                                    variant="outline"
                                                >
                                                    Mark as Paid
                                                </Button>
                                            )}
                                        </>
                                    )}

                                    <Button variant="ghost">
                                        View Full History
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default NegotiationTracker;
