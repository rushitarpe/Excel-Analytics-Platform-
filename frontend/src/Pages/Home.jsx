import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, BarChart, Brain, Download, TrendingUp, Shield } from 'lucide-react';

const Home = ()=> {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: 'Easy Upload',
      description: 'Drag and drop Excel files (.xls, .xlsx) for instant processing'
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: 'Rich Visualizations',
      description: '80+ chart types including 2D, 3D, and interactive visualizations'
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI-Powered Insights',
      description: 'Get intelligent analysis, trends, and anomaly detection'
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: 'Export Options',
      description: 'Download charts as PNG or PDF with high resolution'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Analytics Dashboard',
      description: 'Track uploads, charts, and insights in one place'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with role-based access control'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Excel Analytics & Visualization Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Upload, Analyze, and Visualize Your Data with AI-Powered Insights
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/upload" className="btn btn-white px-8 py-3 text-lg bg-white text-primary-600 hover:bg-gray-100">
                    Upload Data Now
                  </Link>
                  <Link to="/dashboard" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for advanced data analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry Use Cases
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by professionals across industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Business Intelligence', 'Financial Analysis', 'Marketing Analytics', 
              'Sales Reporting', 'Data Science', 'Academic Research'].map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-primary-600 mb-2">{useCase}</h3>
                <p className="text-gray-600">
                  Powerful analytics and visualization tools for {useCase.toLowerCase()}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of users who trust our platform for their data analysis needs.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Start Free Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
export default Home;