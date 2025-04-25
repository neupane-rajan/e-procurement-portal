import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    name: 'Neupane Rajan',
    email: 'neupane.rajan@example.com',
    role: 'Administrator',
    department: 'IT Department',
    joinDate: '2024-01-15',
    lastLogin: '2025-04-24 19:19:24',
    phoneNumber: '+977-9812345678',
    status: 'Active'
  });

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // In a real app, you'd fetch user data here
    const storedRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
    if (storedRole) {
      setUserInfo(prev => ({ ...prev, role: storedRole }));
    }
    
    const storedUsername = sessionStorage.getItem('username') || localStorage.getItem('username');
    if (storedUsername) {
      // Format the username (e.g., neupane-rajan -> Neupane Rajan)
      const formattedName = storedUsername
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      setUserInfo(prev => ({ ...prev, name: formattedName }));
    }
  }, []);

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, action: 'Logged in', date: '2025-04-24 19:19:24' },
    { id: 2, action: 'Updated vendor profile', date: '2025-04-24 18:45:11' },
    { id: 3, action: 'Created requisition #R-2025-0042', date: '2025-04-24 16:30:27' },
    { id: 4, action: 'Approved purchase order #PO-2025-0038', date: '2025-04-24 14:22:56' },
    { id: 5, action: 'Added new inventory items', date: '2025-04-23 11:10:05' }
  ];

  // Mock data for assigned requisitions
  const assignedRequisitions = [
    { id: 'R-2025-0042', title: 'Office Supplies', status: 'Pending', date: '2025-04-24' },
    { id: 'R-2025-0039', title: 'IT Equipment', status: 'Approved', date: '2025-04-22' },
    { id: 'R-2025-0036', title: 'Maintenance Services', status: 'In Progress', date: '2025-04-20' },
    { id: 'R-2025-0031', title: 'Software Licenses', status: 'Completed', date: '2025-04-18' }
  ];

  // Mock data for notifications
  const notifications = [
    { id: 1, message: 'Your requisition #R-2025-0042 is awaiting approval', read: false, date: '2025-04-24 16:31:00' },
    { id: 2, message: 'Vendor XYZ Ltd. updated their catalog', read: true, date: '2025-04-24 12:15:30' },
    { id: 3, message: 'Purchase order #PO-2025-0038 has been delivered', read: true, date: '2025-04-24 09:45:22' },
    { id: 4, message: 'System maintenance scheduled for 2025-04-25', read: false, date: '2025-04-23 14:00:00' }
  ];

  const renderProfileContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-dark-light rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Email Address</label>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Phone Number</label>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Department</label>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.department}</p>
                </div>
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                  Edit Information
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-light rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Username</label>
                  <p className="font-medium text-gray-900 dark:text-white">neupane-rajan</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Role</label>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.role}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Join Date</label>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.joinDate}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Last Login</label>
                  <p className="font-medium text-gray-900 dark:text-white">{userInfo.lastLogin}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                  <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    {userInfo.status}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-lighter focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="bg-white dark:bg-dark-light rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activities</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white dark:ring-dark-light">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">{activity.action}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {activity.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 text-center">
              <button className="px-4 py-2 text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light">
                View All Activities
              </button>
            </div>
          </div>
        );
      case 'requisitions':
        return (
          <div className="bg-white dark:bg-dark-light rounded-lg shadow overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white p-6 pb-3">Assigned Requisitions</h3>
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-dark">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-light divide-y divide-gray-200 dark:divide-gray-700">
                      {assignedRequisitions.map((req) => (
                        <tr key={req.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {req.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {req.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                              req.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                              req.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {req.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-primary hover:text-primary-dark dark:hover:text-primary-light">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-dark-light px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light">
                View All Requisitions
              </button>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white dark:bg-dark-light rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notifications</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <li key={notification.id} className="py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <span className={`h-3 w-3 rounded-full ${notification.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500'}`}></span>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="text-sm text-gray-900 dark:text-white">{notification.message}</div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{notification.date}</div>
                      </div>
                      <div>
                        <button className="text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light">Mark as read</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 text-center">
              <button className="px-4 py-2 text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light">
                View All Notifications
              </button>
            </div>
          </div>
        );
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-light rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-4xl font-medium text-gray-700 dark:text-gray-300">
              {userInfo.name.charAt(0)}
            </div>
          </div>
          <div className="md:ml-6 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userInfo.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{userInfo.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                {userInfo.role}
              </span>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {userInfo.department}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-light rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-primary text-primary dark:text-primary-light'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`${
                activeTab === 'activity'
                  ? 'border-primary text-primary dark:text-primary-light'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('requisitions')}
              className={`${
                activeTab === 'requisitions'
                  ? 'border-primary text-primary dark:text-primary-light'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Requisitions
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-primary text-primary dark:text-primary-light'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm relative`}
            >
              Notifications
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                2
              </span>
            </button>
          </nav>
        </div>
        <div className="p-6">
          {renderProfileContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;