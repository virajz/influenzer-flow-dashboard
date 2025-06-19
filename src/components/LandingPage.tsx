
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Play, X, MessageCircle } from 'lucide-react';
import { Faqs } from './pages/LandingPage/Faqs';
import { Features } from './pages/LandingPage/Features';
import { Pricing } from './pages/LandingPage/Pricing';
import { Testimonial } from './pages/LandingPage/Testimonial';
import { SiWhatsapp } from 'react-icons/si';

const LandingPage = () => {
	const navigate = useNavigate();

	const handleWhatsAppContact = () => {
		window.open('https://wa.me/+15557772435?text=Start%20a%20new%20campaign', '_blank');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 pt-10">
			{/* Header */}
			<header className="container mx-auto px-6 py-6 animate-fade-in sticky top-0 z-50 bg-white/60 rounded-2xl shadow-lg backdrop-blur-sm">
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
						<Button size="lg" className="px-8 py-3 hover-scale" onClick={() => navigate('/login')}>
							Start Free Trial
							<ArrowRight className="ml-2 w-5 h-5" />
						</Button>
						<Button variant="outline" size="lg" className="px-8 py-3 hover-scale">
							<Play className="mr-2 w-5 h-5" />
							Watch Demo
						</Button>
					</div>
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
			<Features />

			{/* Pricing Section */}
			<Pricing />

			{/* Testimonials Section */}
			<Testimonial />

			{/* FAQ Section */}
			<Faqs />

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
							className="text-lg px-8 py-3 hover-scale"
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
						<p>&copy; 2025 InfluencerFlow AI. All rights reserved.</p>
					</div>
				</div>
			</footer>

			{/* Floating WhatsApp Button */}
			<div className="fixed bottom-6 right-6 z-50">
				<span
					className="rounded-full p-4 text-white cursor-pointer inline-block bg-green-500 hover:bg-green-600 shadow-lg hover-scale animate-scale-in"
					onClick={handleWhatsAppContact}
				>
					<SiWhatsapp className="w-6 h-6" />
				</span>
			</div>
		</div>
	);
};

export default LandingPage;
