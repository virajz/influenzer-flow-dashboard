
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, PhoneCall } from 'lucide-react';
import { VoiceCommunication } from '@/services/voiceCommunicationsService';
import { TranscriptModal } from './TranscriptModal';

interface VoiceHistoryTabProps {
  voiceCommunications: VoiceCommunication[];
  creatorName: string;
}

export const VoiceHistoryTab = ({ voiceCommunications, creatorName }: VoiceHistoryTabProps) => {
  const [selectedTranscript, setSelectedTranscript] = useState<{
    transcript: any[];
    conversationId: string;
  } | null>(null);

  // Filter out communications without audio URLs
  // const communicationsWithAudio = voiceCommunications;
  const communicationsWithAudio = voiceCommunications.filter(comm => comm.audioUrl);

  const handleDownload = (audioUrl: string, conversationId: string) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `voice-call-${conversationId}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTranscript = (transcript: any[], conversationId: string) => {
    setSelectedTranscript({ transcript, conversationId });
  };

  if (communicationsWithAudio.length === 0) {
    return (
      <div className="text-center py-12">
        <PhoneCall className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No voice communications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {communicationsWithAudio.map((comm) => (
        <div key={comm.voiceCommunicationId} className="p-4 border rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Voice Call</h4>
                <span className="text-sm text-gray-500">
                  {new Date(comm.createdAt).toLocaleDateString()} {new Date(comm.createdAt).toLocaleTimeString()}
                </span>
              </div>

              {/* Audio Player */}
              <div className="mb-3">
                <audio controls className="w-full max-w-md">
                  <source src={comm.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Badge variant="outline">voice_call</Badge>
                <Badge className="bg-green-100 text-green-800">{comm.status}</Badge>
                {comm.duration > 0 && (
                  <Badge variant="outline" className="text-blue-600">
                    Duration: {comm.duration}s
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(comm.audioUrl, comm.conversationId)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTranscript(comm.transcript, comm.conversationId)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Transcript
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {selectedTranscript && (
        <TranscriptModal
          open={!!selectedTranscript}
          onOpenChange={() => setSelectedTranscript(null)}
          transcript={selectedTranscript.transcript}
          conversationId={selectedTranscript.conversationId}
          creatorName={creatorName}
        />
      )}
    </div>
  );
};
