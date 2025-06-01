import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FiUsers, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { Creator } from '@/services/creatorsService';
import { SiInstagram, SiYoutube } from 'react-icons/si';

interface CreatorHeaderProps {
    creator: Creator;
}

export const CreatorHeader = ({ creator }: CreatorHeaderProps) => {


    return (
        <Card className="rounded-2xl shadow-md mb-8">
            <CardContent className="p-8">
                <div className="flex">

                    <div className="flex flex-1 flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-between gap-4">
                                <Avatar className="size-20">
                                    <AvatarImage src={creator.profileURL} alt={creator.displayName} className="object-cover" />
                                    <AvatarFallback>{creator.displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{creator.displayName}</h1>
                                    <p className="text-lg text-gray-600">@{creator.instagramHandle}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">{creator.category}</Badge>
                            </div>
                            <div className='flex items-center gap-2'>
                                {creator.instagramHandle && (
                                    <Badge variant="outline" className='flex items-center gap-1 px-2 py-1'>
                                        <SiInstagram className="size-4 text-pink-600" />
                                        Instagram
                                    </Badge>
                                )}
                                {creator.youtubeHandle && (
                                    <Badge variant="outline" className='flex items-center gap-1 px-2 py-1'>
                                        <SiYoutube className="size-4 text-red-600" />
                                        YouTube
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
                                <FiUsers className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Instagram Followers</p>
                                    <p className="font-semibold">{creator.instagramFollowers.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
                                <FiDollarSign className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Base Rate</p>
                                    <p className="font-semibold">₹{creator.baseRate.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
                                <div className="w-5 h-5 bg-purple-500 rounded text-white flex items-center justify-center text-xs">%</div>
                                <div>
                                    <p className="text-sm text-gray-500">Engagement Rate</p>
                                    <p className="font-semibold">{creator.averageEngagementRate}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
