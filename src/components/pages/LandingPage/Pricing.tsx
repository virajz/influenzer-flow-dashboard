import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { useNavigate } from "react-router-dom";

const pricingPlans = [
    {
        name: 'Starter',
        price: '$99',
        period: 'per month',
        description: 'Perfect for small businesses starting with influencer marketing',
        features: [
            'Up to 5 campaigns',
            '100 creator contacts',
            'Basic analytics',
            'Email support',
            'Campaign templates'
        ],
        limitations: [
            'No AI-powered outreach',
            'Limited integrations'
        ],
        popular: false
    },
    {
        name: 'Professional',
        price: '$299',
        period: 'per month',
        description: 'Ideal for growing brands with serious influencer marketing needs',
        features: [
            'Unlimited campaigns',
            '1,000 creator contacts',
            'AI-powered outreach',
            'Advanced analytics',
            'Priority support',
            'Custom integrations',
            'Team collaboration',
            'Performance tracking'
        ],
        limitations: [],
        popular: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'pricing',
        description: 'For large organizations with complex requirements',
        features: [
            'Everything in Professional',
            'Unlimited creator contacts',
            'Dedicated account manager',
            'Custom integrations',
            'White-label solution',
            'Advanced security',
            'API access',
            'Custom reporting'
        ],
        limitations: [],
        popular: false
    }
];

export const Pricing = () => {
    const navigate = useNavigate();

    const handleWhatsAppContact = () => {
        window.open('https://wa.me/+15557772435?text=Start%20a%20new%20campaign', '_blank');
    };

    return (
        <section id="pricing" className="bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                        Choose Your Plan
                    </h2>
                    <p className="text-xl text-gray-600 animate-fade-in">
                        Start free, scale as you grow
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <Card key={index} className={`relative hover-scale animate-fade-in ${plan.popular ? 'ring-2 ring-purple-600 scale-105' : ''}`}>
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                                    Most Popular
                                </Badge>
                            )}
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <div className="text-4xl font-bold text-purple-600 my-4">
                                    {plan.price}
                                    <span className="text-lg text-gray-600 font-normal">/{plan.period}</span>
                                </div>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {plan.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center space-x-3">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                                {plan.limitations.map((limitation, limitIndex) => (
                                    <div key={limitIndex} className="flex items-center space-x-3">
                                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                                        <span className="text-gray-500">{limitation}</span>
                                    </div>
                                ))}
                                <Button
                                    className="w-full mt-6 hover-scale"
                                    variant={plan.popular ? "default" : "outline"}
                                    onClick={() => plan.price === 'Custom' ? handleWhatsAppContact() : navigate('/login')}
                                >
                                    {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}