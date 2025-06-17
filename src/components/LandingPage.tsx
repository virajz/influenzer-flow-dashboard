
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Users, 
  BarChart3, 
  MessageSquare, 
  DollarSign, 
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Check,
  X,
  MessageCircle
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

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

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'Beauty Brand Co.',
      content: 'InfluencerFlow AI transformed our influencer marketing. We saw a 300% increase in ROI within 3 months.',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Founder',
      company: 'Tech Startup',
      content: 'The AI-powered outreach saved us countless hours. We closed deals 5x faster than before.',
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Brand Manager',
      company: 'Fashion House',
      content: 'The analytics and insights helped us make data-driven decisions that boosted our campaign performance.',
      avatar: 'ER'
    }
  ];

  const faqs = [
    {
      question: 'How does the AI-powered outreach work?',
      answer: 'Our AI analyzes creator profiles, past performance, and your brand requirements to craft personalized outreach messages that have a higher response rate than generic templates.'
    },
    {
      question: 'Can I integrate with my existing tools?',
      answer: 'Yes, we offer integrations with popular marketing tools, CRM systems, and social media platforms. Our API also allows for custom integrations.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We offer email support for all plans, priority support for Professional plans, and dedicated account managers for Enterprise clients.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial with full access to Professional features. No credit card required.'
    },
    {
      question: 'How do you ensure creator authenticity?',
      answer: 'We use advanced verification systems and analyze engagement patterns to identify authentic creators and flag potential fake accounts.'
    }
  ];

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/your-number?text=Hi,%20I%27m%20interested%20in%20InfluencerFlow%20AI%20and%20would%20like%20to%20learn%20more%20about%20your%20services.', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 animate-fade-in">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 hover-scale">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-purple-600">InfluencerFlow AI</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors story-link">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors story-link">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors story-link">Testimonials</a>
            <a href="#faq" className="text-gray-600 hover:text-purple-600 transition-colors story-link">FAQ</a>
            <Button variant="outline" onClick={() => navigate('/login')} className="hover-scale">
              Sign In
            </Button>
            <Button onClick={() => navigate('/login')} className="hover-scale">
              Get Started
            </Button>
          </div>
          <div className="md:hidden">
            <Button onClick={() => navigate('/login')} className="hover-scale">
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="animate-fade-in">
          <Badge variant="secondary" className="mb-6 animate-scale-in">
            AI-Powered Influencer Marketing Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your
            <span className="text-purple-600"> Influencer Marketing</span>
            <br />
            With AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover, connect, and collaborate with top creators. Automate outreach, track performance, 
            and scale your influencer campaigns with the power of artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3 hover-scale" onClick={() => navigate('/login')}>
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 hover-scale">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mb-16 animate-scale-in">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop&crop=center"
            alt="AI-powered influencer marketing dashboard"
            className="mx-auto rounded-2xl shadow-2xl max-w-4xl w-full hover-scale"
          />
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover-scale animate-fade-in">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">10M+</div>
              <div className="text-gray-600">Creators in Network</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover-scale animate-fade-in">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Active Brands</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover-scale animate-fade-in">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 animate-fade-in">
            The Influencer Marketing Challenge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 animate-fade-in hover-scale">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time-Consuming Outreach</h3>
              <p className="text-gray-600">Manually finding and contacting creators takes weeks of work</p>
            </div>
            <div className="p-6 animate-fade-in hover-scale">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Poor Campaign Tracking</h3>
              <p className="text-gray-600">Scattered data makes it impossible to measure true ROI</p>
            </div>
            <div className="p-6 animate-fade-in hover-scale">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Low Response Rates</h3>
              <p className="text-gray-600">Generic outreach messages get ignored by top creators</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-in">
            Transform Your Results with AI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-scale-in hover-scale">
              <div className="text-4xl font-bold mb-2">80%</div>
              <div className="text-lg opacity-90">Time Saved</div>
            </div>
            <div className="text-center animate-scale-in hover-scale">
              <div className="text-4xl font-bold mb-2">3x</div>
              <div className="text-lg opacity-90">Better ROI</div>
            </div>
            <div className="text-center animate-scale-in hover-scale">
              <div className="text-4xl font-bold mb-2">5x</div>
              <div className="text-lg opacity-90">Faster Deals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 animate-fade-in">
            Trusted by Leading Brands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {['Brand A', 'Brand B', 'Brand C', 'Brand D'].map((brand, index) => (
              <div key={index} className="text-2xl font-bold text-gray-400 hover-scale animate-fade-in">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
            Everything You Need to Scale
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
            Comprehensive tools and AI-powered features to streamline your entire influencer marketing workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover-scale animate-fade-in">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Feature Image */}
        <div className="mt-16 text-center animate-scale-in">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop&crop=center"
            alt="Advanced analytics dashboard"
            className="mx-auto rounded-2xl shadow-xl max-w-4xl w-full hover-scale"
          />
        </div>
      </section>

      {/* Pricing Section */}
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

      {/* Testimonials Section */}
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

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in">
              Everything you need to know
            </p>
          </div>

          <div className="max-w-3xl mx-auto animate-fade-in">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover-scale">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white animate-scale-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Influencer Marketing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of brands already using InfluencerFlow AI to scale their campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3 hover-scale" onClick={() => navigate('/login')}>
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-purple-600 hover-scale"
              onClick={handleWhatsAppContact}
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">InfluencerFlow AI</h3>
              </div>
              <p className="text-gray-400">
                The future of influencer marketing is here.
              </p>
            </div>
            <div className="animate-fade-in">
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors story-link">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors story-link">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors story-link">API</a></li>
              </ul>
            </div>
            <div className="animate-fade-in">
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors story-link">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors story-link">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors story-link">Careers</a></li>
              </ul>
            </div>
            <div className="animate-fade-in">
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors story-link">Help Center</a></li>
                <li><a href={`https://wa.me/your-number`} className="hover:text-white transition-colors story-link">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors story-link">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InfluencerFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 shadow-lg hover-scale animate-scale-in"
          onClick={handleWhatsAppContact}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
