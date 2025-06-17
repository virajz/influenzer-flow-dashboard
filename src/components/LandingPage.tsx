
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  FiTarget, 
  FiUsers, 
  FiBarChart, 
  FiMessageSquare, 
  FiDollarSign, 
  FiStar,
  FiArrowRight,
  FiPlay,
  FiCheckCircle
} from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FiTarget,
      title: 'Campaign Management',
      description: 'Create, manage, and track your influencer campaigns with powerful analytics and insights.'
    },
    {
      icon: FiUsers,
      title: 'Creator Discovery',
      description: 'Find the perfect influencers for your brand with our advanced search and filtering system.'
    },
    {
      icon: FiMessageSquare,
      title: 'Smart Communications',
      description: 'AI-powered email outreach and voice calls to streamline creator negotiations.'
    },
    {
      icon: FiBarChart,
      title: 'Performance Analytics',
      description: 'Track ROI, engagement rates, and campaign performance with detailed reporting.'
    },
    {
      icon: FiDollarSign,
      title: 'Negotiation Tracker',
      description: 'Manage contracts, payments, and negotiations all in one centralized platform.'
    },
    {
      icon: FiStar,
      title: 'Creator Profiles',
      description: 'Detailed creator profiles with performance history and collaboration insights.'
    }
  ];

  const benefits = [
    'Save 80% time on creator outreach',
    'Increase campaign ROI by 3x',
    'Manage unlimited campaigns',
    'AI-powered creator matching',
    'Real-time performance tracking',
    'Automated contract management'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <FiTarget className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-purple-600">InfluencerFlow AI</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">Features</a>
            <a href="#benefits" className="text-gray-600 hover:text-purple-600 transition-colors">Benefits</a>
            <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">Pricing</a>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/login')}>
              Get Started
            </Button>
          </div>
          <div className="md:hidden">
            <Button onClick={() => navigate('/login')}>
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-6">
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
          <Button size="lg" className="text-lg px-8 py-3" onClick={() => navigate('/login')}>
            Start Free Trial
            <FiArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3">
            <FiPlay className="mr-2 w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        {/* Hero Image/Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">10M+</div>
              <div className="text-gray-600">Creators in Network</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Active Brands</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Scale
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and AI-powered features to streamline your entire influencer marketing workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-white hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
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
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose InfluencerFlow AI?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-8" onClick={() => navigate('/login')}>
                Get Started Today
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-purple-600 mb-4">3x</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">Better ROI</div>
              <div className="text-gray-600">
                Our AI-powered platform helps brands achieve 3x better return on investment 
                compared to traditional influencer marketing methods.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Influencer Marketing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of brands already using InfluencerFlow AI to scale their campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" onClick={() => navigate('/login')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-purple-600">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FiTarget className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">InfluencerFlow AI</h3>
              </div>
              <p className="text-gray-400">
                The future of influencer marketing is here.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InfluencerFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
