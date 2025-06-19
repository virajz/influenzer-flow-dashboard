import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
    {
        name: 'Maya Mathur',
        role: 'Marketing Director',
        company: 'Beauty Brand Co.',
        content: 'InfluencerFlow AI transformed our influencer marketing. We saw a 300% increase in ROI within 3 months.',
        avatar: 'SJ'
    },
    {
        name: 'Pavan Patel',
        role: 'Founder',
        company: 'Tech Startup',
        content: 'The AI-powered outreach saved us countless hours. We closed deals 5x faster than before.',
        avatar: 'MC'
    },
    {
        name: 'Natasha Naik',
        role: 'Brand Manager',
        company: 'Fashion House',
        content: 'The analytics and insights helped us make data-driven decisions that boosted our campaign performance.',
        avatar: 'ER'
    }
];

export const Testimonial = () => {
    return (
        <section id="testimonials" className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                    What Our Customers Say
                </h2>
                <p className="text-xl text-gray-600 animate-fade-in">
                    Real results from real brands
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="bg-white shadow-lg hover-scale animate-fade-in">
                        <CardContent className="pt-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-semibold">{testimonial.name}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    <div className="text-sm text-purple-600">{testimonial.company}</div>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">"{testimonial.content}"</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}