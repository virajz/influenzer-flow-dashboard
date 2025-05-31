
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCreators, mockNegotiations } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { FiMail, FiPhone, FiMessageSquare, FiSend, FiClock, FiCheck } from 'react-icons/fi';

const OutreachConsole = () => {
  const [selectedCreator, setSelectedCreator] = useState(mockCreators[0]);
  const [emailDraft, setEmailDraft] = useState(`Hi ${mockCreators[0].name},

I hope this email finds you well! I'm reaching out from InfluencerFlow AI regarding an exciting collaboration opportunity with our brand.

We've been following your content and are impressed by your engagement with your audience, particularly in the ${mockCreators[0].category.toLowerCase()} space. We believe your authentic voice would be a perfect fit for our upcoming campaign.

We'd love to discuss:
- Campaign details and creative direction
- Compensation and deliverables
- Timeline and expectations

Would you be interested in learning more? I'd be happy to set up a call at your convenience.

Best regards,
John Doe
Brand Manager`);

  const [outreachLog, setOutreachLog] = useState([
    {
      id: '1',
      type: 'email',
      timestamp: '2024-05-30 10:30 AM',
      creator: 'Sarah Johnson',
      status: 'sent',
      subject: 'Collaboration Opportunity - Summer Campaign'
    },
    {
      id: '2',
      type: 'voice',
      timestamp: '2024-05-30 09:15 AM',
      creator: 'Mike Chen',
      status: 'completed',
      subject: 'Follow-up call regarding tech review'
    },
    {
      id: '3',
      type: 'dm',
      timestamp: '2024-05-29 04:20 PM',
      creator: 'Emma Rodriguez',
      status: 'delivered',
      subject: 'Instagram DM - Initial outreach'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <FiSend className="h-4 w-4" />;
      case 'completed':
        return <FiCheck className="h-4 w-4" />;
      default:
        return <FiClock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const sendEmail = () => {
    toast({
      title: "Email Sent!",
      description: `Email sent to ${selectedCreator.name} successfully.`,
    });
    
    const newLogEntry = {
      id: Date.now().toString(),
      type: 'email',
      timestamp: new Date().toLocaleString(),
      creator: selectedCreator.name,
      status: 'sent',
      subject: 'Collaboration Opportunity - Campaign'
    };
    
    setOutreachLog([newLogEntry, ...outreachLog]);
  };

  const initiateVoiceCall = () => {
    toast({
      title: "Voice Call Initiated",
      description: `Connecting to ${selectedCreator.name}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Call Completed",
        description: "Voice call completed successfully.",
      });
      
      const newLogEntry = {
        id: Date.now().toString(),
        type: 'voice',
        timestamp: new Date().toLocaleString(),
        creator: selectedCreator.name,
        status: 'completed',
        subject: 'Voice call - Campaign discussion'
      };
      
      setOutreachLog([newLogEntry, ...outreachLog]);
    }, 3000);
  };

  const sendDM = () => {
    toast({
      title: "DM Sent!",
      description: `Direct message sent to ${selectedCreator.name} on Instagram.`,
    });
    
    const newLogEntry = {
      id: Date.now().toString(),
      type: 'dm',
      timestamp: new Date().toLocaleString(),
      creator: selectedCreator.name,
      status: 'delivered',
      subject: 'Instagram DM - Campaign inquiry'
    };
    
    setOutreachLog([newLogEntry, ...outreachLog]);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Outreach Console</h1>
        <p className="text-gray-600">Manage creator communications and outreach</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creator Selection & Actions */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Selected Creator</CardTitle>
            <CardDescription>Choose a creator to contact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <img
                src={selectedCreator.avatar}
                alt={selectedCreator.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{selectedCreator.name}</h3>
                <p className="text-sm text-gray-600">{selectedCreator.handle}</p>
                <p className="text-xs text-gray-500">{selectedCreator.followers.toLocaleString()} followers</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={sendEmail} className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <FiMail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button onClick={initiateVoiceCall} className="w-full justify-start bg-green-600 hover:bg-green-700">
                <FiPhone className="mr-2 h-4 w-4" />
                Voice Call
              </Button>
              <Button onClick={sendDM} className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                <FiMessageSquare className="mr-2 h-4 w-4" />
                Send DM
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Switch Creator</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {mockCreators.map((creator) => (
                  <button
                    key={creator.id}
                    onClick={() => setSelectedCreator(creator)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                      selectedCreator.id === creator.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{creator.name}</p>
                      <p className="text-xs text-gray-500">{creator.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Composer & Activity Log */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="email" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email Composer</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle>AI-Generated Email Draft</CardTitle>
                  <CardDescription>
                    Customize this AI-generated email for {selectedCreator.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>To:</strong> {selectedCreator.handle}@email.com
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Subject:</strong> Collaboration Opportunity - {selectedCreator.category} Campaign
                    </div>
                  </div>

                  <Textarea
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    rows={12}
                    className="resize-none"
                  />

                  <div className="flex gap-4">
                    <Button onClick={sendEmail} className="bg-blue-600 hover:bg-blue-700">
                      <FiSend className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                    <Button variant="outline">
                      Save Draft
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setEmailDraft(`Hi ${selectedCreator.name},

I hope this email finds you well! I'm reaching out from InfluencerFlow AI regarding an exciting collaboration opportunity with our brand.

We've been following your content and are impressed by your engagement with your audience, particularly in the ${selectedCreator.category.toLowerCase()} space. We believe your authentic voice would be a perfect fit for our upcoming campaign.

We'd love to discuss:
- Campaign details and creative direction
- Compensation and deliverables
- Timeline and expectations

Would you be interested in learning more? I'd be happy to set up a call at your convenience.

Best regards,
John Doe
Brand Manager`)}
                    >
                      Regenerate with AI
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="rounded-2xl shadow-md">
                <CardHeader>
                  <CardTitle>Recent Outreach Activity</CardTitle>
                  <CardDescription>
                    Track all your communications with creators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {outreachLog.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {activity.type === 'email' && <FiMail className="h-4 w-4" />}
                            {activity.type === 'voice' && <FiPhone className="h-4 w-4" />}
                            {activity.type === 'dm' && <FiMessageSquare className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.creator}</p>
                            <p className="text-sm text-gray-600">{activity.subject}</p>
                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(activity.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(activity.status)}
                              {activity.status}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OutreachConsole;
