import React, { useState } from 'react';
import { BarChart3, Upload, Download, Eye, Shield, Zap, FileSpreadsheet, TrendingUp, Users, Sparkles, CheckCircle, ArrowRight, Star, Play, Clock, Database, Cpu, Globe, Lock, RefreshCw, Target, Award, Layers } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Easy File Upload",
      description: "Drag & drop or browse to upload your Excel files (.xls/.xlsx). Secure and fast processing with real-time progress tracking."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Interactive Charts",
      description: "Generate stunning 2D/3D charts with Chart.js and Three.js. Choose your own X & Y axes dynamically from your data."
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Download & Export",
      description: "Export your visualizations as PNG or PDF files for presentations and reports. High-quality output guaranteed."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Track your upload history, manage analyses, and view all your charts in one centralized, intuitive dashboard."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI Insights",
      description: "Get smart summaries and insights from your data using integrated AI tools. Discover patterns you might have missed."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "JWT-based authentication ensures your data remains secure and private. Enterprise-grade security standards."
    }
  ];

  const stats = [
    { number: "50K+", label: "Files Processed", description: "Excel files analyzed" },
    { number: "15K+", label: "Active Users", description: "Trusted by professionals" },
    { number: "100+", label: "Chart Types", description: "Visualization options" },
    { number: "99.9%", label: "Uptime", description: "Reliable service" }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Upload Your Excel File",
      description: "Simply drag and drop your Excel file or browse to select it. We support both .xls and .xlsx formats.",
      icon: <Upload className="w-6 h-6" />
    },
    {
      step: 2,
      title: "Select Data Points",
      description: "Choose your X and Y axes from the column headers. Our smart detection helps identify the best options.",
      icon: <Target className="w-6 h-6" />
    },
    {
      step: 3,
      title: "Choose Chart Type",
      description: "Pick from our extensive library of 2D and 3D chart types including bar, line, pie, scatter, and more.",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      step: 4,
      title: "Generate & Download",
      description: "Create your visualization instantly and download it in high-quality PNG or PDF format.",
      icon: <Download className="w-6 h-6" />
    }
  ];

  const chartTypes = [
    { name: "Bar Charts", count: "15+ variants", popular: true },
    { name: "Line Charts", count: "12+ variants", popular: true },
    { name: "Pie Charts", count: "8+ variants", popular: false },
    { name: "Scatter Plots", count: "10+ variants", popular: true },
    { name: "3D Charts", count: "20+ variants", popular: true },
    { name: "Heat Maps", count: "6+ variants", popular: false },
    { name: "Bubble Charts", count: "5+ variants", popular: false },
    { name: "Area Charts", count: "8+ variants", popular: false }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Data Analyst at TechCorp",
      avatar: "SJ",
      content: "ExcelAnalytics has revolutionized how we handle data visualization. The AI insights feature saved us hours of manual analysis.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      avatar: "MC",
      content: "The 3D charts are absolutely stunning! Our presentations have never looked better. The export quality is top-notch.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Business Intelligence Lead",
      avatar: "ER",
      content: "Love how easy it is to upload files and get insights instantly. The dashboard keeps everything organized perfectly.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for individuals getting started",
      features: [
        "5 files per month",
        "Basic chart types",
        "PNG downloads",
        "Community support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$19",
      period: "per month",
      description: "Ideal for professionals and small teams",
      features: [
        "Unlimited files",
        "All chart types including 3D",
        "PNG & PDF downloads",
        "AI insights",
        "Priority support",
        "Custom branding"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large teams and organizations",
      features: [
        "Everything in Professional",
        "Advanced AI analytics",
        "Custom integrations",
        "Dedicated support",
        "SSO authentication",
        "API access"
      ],
      popular: false
    }
  ];

  const useCases = [
    {
      title: "Business Intelligence",
      description: "Transform raw business data into actionable insights with powerful visualizations.",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Financial Analysis",
      description: "Create comprehensive financial reports and dashboards for better decision making.",
      icon: <Database className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Marketing Analytics",
      description: "Visualize campaign performance, ROI, and customer behavior patterns.",
      icon: <Target className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Sales Reporting",
      description: "Track sales performance, forecasts, and team productivity with dynamic charts.",
      icon: <Award className="w-8 h-8" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    "No coding or technical skills required",
    "Instant chart generation from Excel data",
    "Professional-quality visualizations",
    "Secure cloud-based processing",
    "Mobile-responsive dashboard",
    "Collaborative sharing features",
    "Real-time data updates",
    "Custom branding options"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                Excel Data
              </span>
              Into Insights
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Upload any Excel file and create stunning interactive charts with AI-powered insights. 
              No coding required - just drag, drop, and visualize your data in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                <Upload className="w-5 h-5 inline mr-2" />
                Start Free Trial
              </button>
              <button className="bg-white/10 backdrop-blur text-white border border-white/20 px-10 py-5 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 group">
                <Play className="w-5 h-5 inline mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />No Credit Card Required</div>
              <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Free Forever Plan</div>
              <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Setup in 30 Seconds</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/20 backdrop-blur-lg border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="text-5xl md:text-6xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-300 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started in minutes with our simple 4-step process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <div className="text-blue-400 mb-4 flex justify-center group-hover:text-purple-400 transition-colors duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to turn your spreadsheet data into beautiful, interactive visualizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-blue-400 mb-6 group-hover:text-purple-400 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chart Types Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              100+ Chart Types
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From simple bar charts to complex 3D visualizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chartTypes.map((chart, index) => (
              <div key={index} className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
                {chart.popular && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white mb-2">{chart.name}</h3>
                <p className="text-gray-400 text-sm">{chart.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Perfect For Any Industry
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trusted by professionals across various industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${useCase.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {useCase.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{useCase.title}</h3>
                <p className="text-gray-300 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Choose ExcelAnalytics?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of professionals who trust us with their data visualization needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300">
              Don't just take our word for it
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-300 mb-8 leading-relaxed">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">{testimonials[activeTestimonial].name}</div>
                    <div className="text-gray-400">{testimonials[activeTestimonial].role}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === activeTestimonial ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join over 15,000 professionals who trust ExcelAnalytics for their data visualization needs. 
            Start your free trial today and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              <Zap className="w-5 h-5 inline mr-2" />
              Start Free Trial
            </button>
            <button className="bg-white/10 backdrop-blur text-white border border-white/20 px-12 py-5 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300">
              <Users className="w-5 h-5 inline mr-2" />
              Book a Demo
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-gray-400">
            <div className="flex items-center"><Shield className="w-4 h-4 mr-2 text-green-400" />Enterprise Security</div>
            <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-green-400" />24/7 Support</div>
            <div className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 text-green-400" />Cancel Anytime</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;