import React from 'react';
import { 
  FileText, 
  CheckSquare, 
  Package, 
  Building, 
  PlusCircle, 
  BarChart2, 
  Search, 
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  User
} from 'lucide-react';

function Dashboard({ userRole = 'admin' }) {
  const summaryCards = [
    { 
      title: 'Pending Requisitions', 
      value: '12', 
      change: '+2', 
      changeType: 'increase', 
      icon: <FileText size={22} />,
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      title: 'Approved Orders', 
      value: '28', 
      change: '+5', 
      changeType: 'increase', 
      icon: <CheckSquare size={22} />,
      color: 'from-emerald-500 to-green-600'
    },
    { 
      title: 'Inventory Items', 
      value: '143', 
      change: '-3', 
      changeType: 'decrease', 
      icon: <Package size={22} />,
      color: 'from-amber-500 to-orange-600'
    },
    { 
      title: 'Active Vendors', 
      value: '15', 
      change: '+1', 
      changeType: 'increase', 
      icon: <Building size={22} />,
      color: 'from-purple-500 to-pink-600'
    },
  ];

  const recentActivity = [
    { id: 1, action: 'New requisition created', date: 'Today, 10:30 AM', user: 'John Smith' },
    { id: 2, action: 'Order #1234 delivered', date: 'Yesterday, 2:15 PM', user: 'Lisa Johnson' },
    { id: 3, action: 'Vendor approval requested', date: 'Yesterday, 11:45 AM', user: 'Michael Brown' },
    { id: 4, action: 'Inventory updated', date: '2 days ago', user: 'Robert Davis' },
    { id: 5, action: 'New report generated', date: '3 days ago', user: 'Jennifer Wilson' },
  ];

  const getDashboardTitle = () => {
    switch(userRole) {
      case 'admin': return 'Administrator Dashboard';
      case 'vendor': return 'Vendor Dashboard';
      default: return 'User Dashboard';
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to your Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center">
          <User size={16} className="mr-2" />
          {getDashboardTitle()}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-all hover:shadow-md">
            <div className={`h-1 bg-gradient-to-r ${card.color}`}></div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</p>
                  <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{card.value}</p>
                  <div className={`flex items-center mt-2 text-sm ${
                    card.changeType === 'increase' ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'
                  }`}>
                    {card.changeType === 'increase' ? 
                      <TrendingUp size={16} className="mr-1" /> : 
                      <TrendingDown size={16} className="mr-1" />
                    }
                    <span>{card.change}</span>
                    <span className="ml-1">from last week</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} text-white`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center">
              <Clock size={18} className="mr-2" />
              Recent Activity
            </h3>
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-600 dark:text-gray-300">
              Last 7 days
            </span>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-gray-100 dark:divide-slate-700">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-md transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <User size={14} className="mr-1" />
                        {activity.user}
                      </p>
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full flex items-center whitespace-nowrap">
                      {activity.date}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-center">
              <button className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 font-medium flex items-center transition-colors">
                View All Activity
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center shadow-sm transition-all hover:shadow">
                <PlusCircle size={18} className="mr-2" /> 
                New Requisition
              </button>
              
              <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center shadow-sm transition-all hover:shadow">
                <BarChart2 size={18} className="mr-2" /> 
                Generate Report
              </button>
              
              <button className="w-full bg-white dark:bg-slate-700 border border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                <Search size={18} className="mr-2" /> 
                Track Order
              </button>
              
              <button className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                <Settings size={18} className="mr-2" /> 
                Settings
              </button>
            </div>
            
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-slate-700">
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Check our documentation or contact support for assistance.
                </p>
                <a href="#" className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 font-medium flex items-center">
                  View Documentation
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;