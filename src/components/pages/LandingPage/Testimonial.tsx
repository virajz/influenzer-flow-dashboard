
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
    {
        name: 'Maya Mathur',
        role: 'Marketing Director',
        company: 'Beauty Brand Co.',
        content: 'InfluencerFlow AI transformed our influencer marketing. We saw a 300% increase in ROI within 3 months.',
        avatar: 'MM'
    },
    {
        name: 'Pavan Patel',
        role: 'Founder',
        company: 'Tech Startup',
        content: 'The AI-powered outreach saved us countless hours. We closed deals 5x faster than before.',
        avatar: 'PP'
    },
    {
        name: 'Natasha Naik',
        role: 'Brand Manager',
        company: 'Fashion House',
        content: 'The analytics and insights helped us make data-driven decisions that boosted our campaign performance.',
        avatar: 'NN'
    }
];

export const Testimonial = () => {
    return (
        <section id="testimonials" className="container mx-auto px-4 py-12 lg:py-16">
            <div className="text-center mb-12 lg:mb-16">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                    What Our Customers Say
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 animate-fade-in">
                    Real results from real brands
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="bg-white shadow-lg hover-scale animate-fade-in">
                        <CardContent className="p-4 lg:pt-6">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3 lg:mr-4 text-sm lg:text-base">
                                    {testimonial.avatar}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-sm lg:text-base truncate">{testimonial.name}</div>
                                    <div className="text-xs lg:text-sm text-gray-600 truncate">{testimonial.role}</div>
                                    <div className="text-xs lg:text-sm text-purple-600 truncate">{testimonial.company}</div>
                                </div>
                            </div>
                            <p className="text-gray-700 italic text-sm lg:text-base leading-relaxed">"{testimonial.content}"</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
