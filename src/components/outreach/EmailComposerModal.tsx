
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmailComposerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
  creatorEmail?: string;
  onSend: (emailData: EmailData) => void;
}

export interface EmailData {
  to: string;
  subject: string;
  content: string;
  template: string;
}

export const EmailComposerModal = ({ 
  open, 
  onOpenChange, 
  creatorName, 
  creatorEmail = '', 
  onSend 
}: EmailComposerModalProps) => {
  const [emailData, setEmailData] = useState<EmailData>({
    to: creatorEmail,
    subject: '',
    content: '',
    template: 'custom'
  });

  const emailTemplates = {
    'initial_outreach': {
      subject: `Collaboration Opportunity with [Brand Name]`,
      content: `Hi ${creatorName},

I hope this email finds you well! I'm reaching out because I've been following your content and I'm impressed by your engagement and authentic voice.

We'd love to explore a potential collaboration opportunity that aligns with your brand and audience.

Would you be interested in learning more about this partnership?

Best regards,
[Your Name]`
    },
    'follow_up': {
      subject: `Following up on our collaboration opportunity`,
      content: `Hi ${creatorName},

I wanted to follow up on my previous email regarding a potential collaboration opportunity.

I understand you're probably busy, but I believe this partnership could be mutually beneficial.

Would you have a few minutes to discuss this opportunity?

Best regards,
[Your Name]`
    },
    'custom': {
      subject: '',
      content: ''
    }
  };

  const handleTemplateChange = (template: string) => {
    setEmailData({
      ...emailData,
      template,
      subject: emailTemplates[template as keyof typeof emailTemplates].subject,
      content: emailTemplates[template as keyof typeof emailTemplates].content
    });
  };

  const handleSend = () => {
    onSend(emailData);
    onOpenChange(false);
    setEmailData({ to: creatorEmail, subject: '', content: '', template: 'custom' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Compose Email to {creatorName}</DialogTitle>
          <DialogDescription>
            Send a personalized email to reach out to this creator
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="template">Email Template</Label>
            <Select value={emailData.template} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="initial_outreach">Initial Outreach</SelectItem>
                <SelectItem value="follow_up">Follow Up</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              value={emailData.to}
              onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
              placeholder="creator@example.com"
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              placeholder="Email subject"
            />
          </div>

          <div>
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              value={emailData.content}
              onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
              placeholder="Write your message..."
              rows={12}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!emailData.to || !emailData.subject || !emailData.content}>
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
