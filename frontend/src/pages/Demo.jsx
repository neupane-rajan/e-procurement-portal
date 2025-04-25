import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IconStreamline = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M4 4v16h16"></path>
      <path d="M4 12h2a3 3 0 0 0 3-3V7a3 3 0 0 1 3-3h2"></path>
      <path d="M16 16l3-8 3 8"></path>
      <path d="M18 14h4"></path>
    </svg>
  );
  
  const IconVendor = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M17 8l4 4-4 4"></path>
      <path d="M3 12h18"></path>
      <path d="M11 4a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path>
      <path d="M11 20a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path>
    </svg>
  );
  
  const IconInventory = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M5 8V5c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v3"></path>
      <path d="M19 8H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z"></path>
      <path d="M12 12v6"></path>
      <path d="M9 15h6"></path>
    </svg>
  );
  
  const IconRequisition = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
  
  const IconReporting = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
      <line x1="12" y1="6" x2="18" y2="6"></line>
      <line x1="12" y1="18" x2="18" y2="18"></line>
    </svg>
  );
  
  const IconAccess = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      <circle cx="12" cy="16" r="1"></circle>
    </svg>
  );

function Demo() {
  // State for animation
  const [isVisible, setIsVisible] = useState({});
  const [activeFeature, setActiveFeature] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll for parallax and reveal animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      // Check elements visibility for animations
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          setIsVisible(prev => ({...prev, [el.id]: true}));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check visibility on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: 'Streamlined Procurement Process',
      description: 'Automate your procurement workflow from requisition to payment.',
      icon: <IconStreamline />,
      color: 'bg-blue-500',
    },
    {
      title: 'Vendor Management',
      description: 'Maintain a database of trusted vendors with performance tracking.',
      icon: <IconVendor />,
      color: 'bg-green-500',
    },
    {
      title: 'Inventory Control',
      description: 'Real-time tracking of inventory levels and automated reorder points.',
      icon: <IconInventory />,
      color: 'bg-purple-500',
    },
    {
      title: 'Requisition Management',
      description: 'Create, track, and approve purchase requisitions efficiently.',
      icon: <IconRequisition />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Comprehensive Reporting',
      description: 'Generate insights with customizable reports on procurement activities.',
      icon: <IconReporting />,
      color: 'bg-red-500',
    },
    {
      title: 'Multi-role Access',
      description: 'Different access levels for administrators, users, and vendors.',
      icon: <IconAccess />,
      color: 'bg-indigo-500',
    },
  ];
  
  // Animated counter
  const Counter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (isVisible['stats-section']) {
        let start = 0;
        const increment = end / (duration / 16);
        
        const timer = setInterval(() => {
          start += increment;
          setCount(Math.floor(start));
          
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          }
        }, 16);
        
        return () => clearInterval(timer);
      }
    }, [isVisible['stats-section']]);
    
    return <span>{count}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <header 
        className="relative bg-gradient-to-br from-blue-600 to-indigo-800 min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundPositionY: scrollPosition * 0.5,
        }}
      >
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-40 h-40 bg-white opacity-10 rounded-full animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-400 opacity-10 rounded-full animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-400 opacity-10 rounded-full animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="transform transition-all duration-1000 translate-y-0 opacity-100">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-text-gradient bg-gradient-to-r from-teal-300 via-white to-purple-300 bg-clip-text text-transparent">
              E-Procurement Portal
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Streamline your procurement process with our modern, efficient platform
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 hover:shadow-lg"
              >
                Sign In
              </Link>
              <button
                className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-all transform hover:scale-105"
              >
                Learn More
              </button>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 bg-white dark:bg-gray-800 animate-on-scroll">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 transform transition-all duration-500 hover:scale-105">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {isVisible['stats-section'] ? <Counter end={500} /> : 0}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-2">Organizations</div>
            </div>
            <div className="text-center p-6 transform transition-all duration-500 hover:scale-105">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {isVisible['stats-section'] ? <Counter end={10000} /> : 0}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-2">Transactions</div>
            </div>
            <div className="text-center p-6 transform transition-all duration-500 hover:scale-105">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {isVisible['stats-section'] ? <Counter end={98} /> : 0}%
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-2">Satisfaction</div>
            </div>
            <div className="text-center p-6 transform transition-all duration-500 hover:scale-105">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                $<Counter end={15} />M
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-2">Cost Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-16 bg-gray-50 dark:bg-gray-900 animate-on-scroll">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-white relative">
            <span className="relative inline-block">
              Key Features
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
            <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transform transition-all duration-500 ${
                isVisible['features-section'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } hover:shadow-xl hover:-translate-y-2`}
                style={{
                transitionDelay: `${index * 100}ms`,
                }}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
            >
                <div className={`h-16 w-16 rounded-full ${feature.color} flex items-center justify-center mb-6 text-white ${
                activeFeature === index ? 'animate-pulse' : ''
                }`}>
                {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">
                {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
                </p>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-100 dark:bg-gray-800 animate-on-scroll">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-white relative">
            <span className="relative inline-block">
              How It Works
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </span>
          </h2>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute h-1 bg-blue-500 top-24 left-0 right-0 transform translate-y-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Create Requisition",
                  description: "Submit purchase requisitions with detailed specifications"
                },
                {
                  step: 2,
                  title: "Approval Process",
                  description: "Multi-level approval workflow with notifications"
                },
                {
                  step: 3,
                  title: "Vendor Selection",
                  description: "Choose from qualified vendors or request bids"
                },
                {
                  step: 4,
                  title: "Order & Delivery",
                  description: "Track orders and receive goods with inventory updates"
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center transform transition-all duration-700 ${
                    isVisible['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative">
                    <div className={`h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold transform transition-all duration-500 hover:scale-110 hover:rotate-12 shadow-lg`}>
                      {item.step}
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-center text-gray-600 dark:text-gray-300 max-w-xs">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="interactive-demo" className="py-16 bg-white dark:bg-gray-900 animate-on-scroll">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-white relative">
            <span className="relative inline-block">
              Interactive Demo
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-1/2 h-6 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                procurement.example.com
              </div>
              <div></div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-lg text-gray-800 dark:text-white">Latest Requisitions</h4>
                  <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400">View All</button>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    { id: "REQ-2023-0342", title: "Office Supplies", status: "Approved", date: "Today" },
                    { id: "REQ-2023-0341", title: "IT Equipment", status: "Pending", date: "Yesterday" },
                    { id: "REQ-2023-0340", title: "Maintenance Supplies", status: "Processing", date: "Apr 23" }
                  ].map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-6 rounded-full ${
                          req.status === 'Approved' ? 'bg-green-400' : 
                          req.status === 'Pending' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`}></div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">{req.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{req.id}</div>
                        </div>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">{req.date}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-lg text-gray-800 dark:text-white">Vendor Performance</h4>
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400">Week</button>
                    <button className="text-blue-500 font-medium">Month</button>
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400">Year</button>
                  </div>
                </div>
                <div className="mt-4 h-40 flex items-end space-x-2">
                  {[65, 45, 75, 50, 85, 70, 90].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-t transition-all duration-500" 
                        style={{ 
                          height: `${isVisible['interactive-demo'] ? height : 0}%`,
                          transition: 'height 1s ease-out'
                        }}
                      ></div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gradient-to-br from-blue-500 to-indigo-700 animate-on-scroll">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            What Our Clients Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "This procurement platform transformed our purchasing process. We've saved 40% on procurement time.",
                author: "Sarah Johnson",
                role: "Procurement Manager",
                company: "TechGlobal Inc."
              },
              {
                quote: "The inventory management feature alone was worth the investment. Real-time tracking has eliminated our stockouts.",
                author: "Michael Chen",
                role: "Supply Chain Director",
                company: "Nova Manufacturing"
              },
              {
                quote: "We've reduced our approval cycle by 60% and gained incredible visibility into our spending patterns.",
                author: "Elena Rodriguez",
                role: "CFO",
                company: "Summit Healthcare"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition-all duration-700 ${
                  isVisible['testimonials'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-800 to-purple-900">
        <div className="container mx-auto px-6 text-center relative overflow-hidden">
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500 opacity-10 rounded-full animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500 opacity-10 rounded-full animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to streamline your procurement process?
            </h2>
            <p className="text-xl text-indigo-100 mb-12 max-w-3xl mx-auto">
              Join organizations that have improved efficiency and reduced costs by up to 35%.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-all transform hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </Link>
              <button
                className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-all transform hover:scale-105"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Add global animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(30px, -50px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes text-gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-text-gradient {
          animation: text-gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default Demo;