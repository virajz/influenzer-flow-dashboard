import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FiInstagram, FiYoutube, FiUsers, FiDollarSign, FiMapPin, FiMail } from 'react-icons/fi';
import { SiTiktok, SiX, SiLinkedin } from 'react-icons/si';

interface Creator {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    followers: number;
    category: string;
    location: string;
    bio: string;
    platforms: string[];
    baseRate: number;
    engagementRate: number;
}

interface CreatorDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    creator: Creator | null;
}

export const CreatorDetailModal = ({ open, onOpenChange, creator }: CreatorDetailModalProps) => {
    if (!creator) return null;

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'instagram': return <FiInstagram className="h-5 w-5" />;
            case 'youtube': return <FiYoutube className="h-5 w-5" />;
            case 'tiktok': return <SiTiktok className="h-5 w-5" />;
            case 'twitter': return <SiX className="h-5 w-5" />;
            case 'linkedin': return <SiLinkedin className="h-5 w-5" />;
            default: return <FiUsers className="h-5 w-5" />;
        }
    };

    const formatFollowers = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
        return count.toString();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Creator Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-6">
                        <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{creator.name}</h2>
                            <p className="text-lg text-gray-600">{creator.handle}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <FiMapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{creator.location}</span>
                            </div>
                            <Badge className="mt-2">{creator.category}</Badge>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                        <p className="text-gray-700">{creator.bio}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <FiUsers className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{formatFollowers(creator.followers)}</div>
                            <div className="text-sm text-gray-600">Followers</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <FiDollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">₹{creator.baseRate.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Base Rate</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{creator.engagementRate}%</div>
                            <div className="text-sm text-gray-600">Engagement</div>
                        </div>
                    </div>

                    {/* Platforms */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Platforms</h3>
                        <div className="flex gap-3">
                            {creator.platforms.map((platform) => (
                                <div key={platform} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                                    {getPlatformIcon(platform)}
                                    <span className="font-medium">{platform}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                            <FiMail className="mr-2 h-4 w-4" />
                            Contact Creator
                        </Button>
                        <Button variant="outline" className="flex-1">
                            View Portfolio
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
