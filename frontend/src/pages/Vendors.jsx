import React, { useState, useEffect } from 'react';
import { fetchVendors } from '../services/api';

function Vendors() {
  // State for vendors data and UI
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Fetch vendors data on component mount
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoading(true);
        const data = await fetchVendors();
        setVendors(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };
    
    loadVendors();
  }, []);

  // Filter vendors based on active tab, search query and category filter
  const filteredVendors = vendors.filter(vendor => {
    const matchesTab = activeTab === 'all' || vendor.status === activeTab;
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           vendor.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || vendor.category === categoryFilter;
    
    return matchesTab && matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(vendors.map(vendor => vendor.category))];

  // Function to render rating stars
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">★</span>);
    }
    
    return stars;
  };

  // Handler for adding a new vendor (to be implemented)
  const handleAddVendor = () => {
    alert('Add vendor functionality will be implemented!');
    // Here you would open a modal form or navigate to a new vendor page
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          className="mt-2 btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Vendors</h1>
        <button 
          className="btn-primary flex items-center"
          onClick={handleAddVendor}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Vendor
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-dark-light rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md dark:bg-dark-lighter dark:border-dark-lighter focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select 
              className="block w-full py-2 px-3 border border-gray-300 rounded-md dark:bg-dark-lighter dark:border-dark-lighter focus:outline-none focus:ring-primary focus:border-primary"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-dark-lighter mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            All Vendors
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inactive'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            Inactive
          </button>
        </nav>
      </div>

      {/* Empty State */}
      {filteredVendors.length === 0 && !loading && (
        <div className="bg-white dark:bg-dark-light rounded-lg shadow p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No vendors found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {activeTab !== 'all' ? 
              `No ${activeTab} vendors found. Try changing your filter.` :
              'No vendors match your search criteria.'}
          </p>
          <div className="mt-6">
            <button
              className="btn-primary"
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
                setCategoryFilter('');
              }}
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Vendors Table */}
      {filteredVendors.length > 0 && (
        <div className="bg-white dark:bg-dark-light rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-lighter">
              <thead className="bg-gray-50 dark:bg-dark-lighter">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-light divide-y divide-gray-200 dark:divide-dark-lighter">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-dark-lighter">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{vendor.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: V-{vendor.id.toString().padStart(4, '0')}
                      </div>
                      {vendor.contactPerson && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Contact: {vendor.contactPerson}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {renderRatingStars(vendor.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{vendor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vendor.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-primary hover:text-primary-dark dark:hover:text-primary-light mr-3"
                        onClick={() => alert(`View vendor details for: ${vendor.name}`)}
                      >
                        View
                      </button>
                      <button 
                        className="text-primary hover:text-primary-dark dark:hover:text-primary-light mr-3"
                        onClick={() => alert(`Edit vendor: ${vendor.name}`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete vendor: ${vendor.name}?`)) {
                            alert('Delete functionality would be implemented here');
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white dark:bg-dark-light px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-dark-lighter sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredVendors.length}</span> of{' '}
                  <span className="font-medium">{filteredVendors.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-dark-lighter bg-white dark:bg-dark-lighter text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-light"
                    disabled={true} // Would be controlled by pagination state
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-lighter bg-white dark:bg-dark-light text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-lighter">
                    1
                  </button>
                  <button 
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-dark-lighter bg-white dark:bg-dark-lighter text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-light"
                    disabled={true} // Would be controlled by pagination state
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendors;