
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, DollarSign, MessageSquare, Star, Target, Users } from "lucide-react";

const features = [
    {
        icon: Target,
        title: 'Campaign Management',
        description: 'Create, manage, and track your influencer campaigns with powerful analytics and insights.'
    },
    {
        icon: Users,
        title: 'Creator Discovery',
        description: 'Find the perfect influencers for your brand with our advanced search and filtering system.'
    },
    {
        icon: MessageSquare,
        title: 'Smart Communications',
        description: 'AI-powered email outreach and voice calls to streamline creator negotiations.'
    },
    {
        icon: BarChart3,
        title: 'Performance Analytics',
        description: 'Track ROI, engagement rates, and campaign performance with detailed reporting.'
    },
    {
        icon: DollarSign,
        title: 'Negotiation Tracker',
        description: 'Manage contracts, payments, and negotiations all in one centralized platform.'
    },
    {
        icon: Star,
        title: 'Creator Profiles',
        description: 'Detailed creator profiles with performance history and collaboration insights.'
    }
];

export const Features = () => {
    return (
        <section id="features" className="container mx-auto px-4 py-12 lg:py-20">
            <div className="text-center mb-12 lg:mb-16">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                    Everything You Need to Scale
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in px-4">
                    Comprehensive tools and AI-powered features to streamline your entire influencer marketing workflow.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <Card key={index} className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover-scale animate-fade-in">
                            <CardHeader className="p-4 lg:p-6">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-lg lg:text-xl mb-2">{feature.title}</CardTitle>
                                <CardDescription className="text-gray-600 leading-relaxed text-sm lg:text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    );
                })}
            </div>
        </section>
    )
};
