import React, { useState } from 'react';
import { reports } from '../data/mockData';

const Reports = () => {
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter(report => {
    const matchesType = filterType === '' || report.type === filterType;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const reportTypes = [...new Set(reports.map(report => report.type))];
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Mock data for charts
  const budgetData = [
    { month: 'Jan', actual: 24000, planned: 25000 },
    { month: 'Feb', actual: 26000, planned: 25000 },
    { month: 'Mar', actual: 23500, planned: 25000 },
    { month: 'Apr', actual: 27500, planned: 25000 },
    { month: 'May', actual: 28500, planned: 27000 },
    { month: 'Jun', actual: 31000, planned: 27000 },
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Reports</h1>
        <div className="flex space-x-2">
          <button className="btn-outline">
            Export
          </button>
          <button className="btn-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Generate Report
          </button>
        </div>
      </div>

      {/* Dashboard overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Budget Overview Chart */}
        <div className="bg-white dark:bg-dark-light rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Procurement Budget Overview</h2>
          <div className="h-64 relative">
            {/* Mock Chart - In real app, use a proper chart library */}
            <div className="absolute inset-0 flex flex-col">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>$35,000</span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="flex-1 flex items-end">
                {budgetData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full px-1">
                      <div 
                        className="absolute bottom-0 left-0 right-0 mx-auto w-4 bg-primary rounded-t"
                        style={{ height: `${(data.actual / 35000) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute bottom-0 left-0 right-0 mx-auto w-4 border-2 border-gray-400 dark:border-gray-500 border-dashed"
                        style={{ 
                          width: '12px', 
                          height: '2px', 
                          bottom: `${(data.planned / 35000) * 100}%`,
                          marginLeft: '-2px'
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary rounded mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Actual</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border border-gray-400 dark:border-gray-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Target</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white dark:bg-dark-light rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Procurement Statistics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Vendors</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">15 active vendors</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-lighter rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Order Processing Time</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">2.3 days</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-lighter rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Order Fulfillment Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">94%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-lighter rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Budget Utilization</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">73%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-lighter rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '73%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Order Accuracy</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">98%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-lighter rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-dark-light rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
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
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="block w-full py-2 px-3 border border-gray-300 rounded-md dark:bg-dark-lighter dark:border-dark-lighter focus:outline-none focus:ring-primary focus:border-primary"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Report Types</option>
              {reportTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1 text-sm rounded-full ${filterType === '' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-lighter text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-light'}`}
            onClick={() => setFilterType('')}
          >
            All Reports
          </button>
          {reportTypes.map(type => (
            <button 
              key={type}
              className={`px-3 py-1 text-sm rounded-full ${filterType === type ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-lighter text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-light'}`}
              onClick={() => setFilterType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white dark:bg-dark-light rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-lighter">
            <thead className="bg-gray-50 dark:bg-dark-lighter">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Report Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Format
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Generated On
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-light divide-y divide-gray-200 dark:divide-dark-lighter">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-dark-lighter">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: R-{report.id.toString().padStart(4, '0')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`p-1 rounded ${
                        report.format === 'PDF' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {report.format === 'PDF' ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{report.format}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(report.dateGenerated)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary-dark dark:hover:text-primary-light mr-3">View</button>
                    <button className="text-primary hover:text-primary-dark dark:hover:text-primary-light mr-3">Download</button>
                    <button className="text-primary hover:text-primary-dark dark:hover:text-primary-light">Share</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="px-6 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No reports match your current filters.
            </p>
            <div className="mt-6">
              <button onClick={() => {setFilterType(''); setSearchQuery('');}} className="btn-primary">
                Clear Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Pagination */}
        <div className="bg-white dark:bg-dark-light px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-dark-lighter sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredReports.length}</span> of{' '}
                <span className="font-medium">{filteredReports.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-dark-lighter bg-white dark:bg-dark-lighter text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-light">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-lighter bg-white dark:bg-dark-light text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-lighter">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-dark-lighter bg-white dark:bg-dark-lighter text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-light">
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
      
      {/* Report Generation Form */}
      <div className="mt-8 bg-white dark:bg-dark-light rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-lighter">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create Custom Report</h3>
        </div>
        <div className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="report-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Report Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="report-title"
                    id="report-title"
                    className="input"
                    placeholder="Enter report title"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Report Type
                </label>
                <div className="mt-1">
                  <select
                    id="report-type"
                    name="report-type"
                    className="input"
                  >
                    <option value="">Select type</option>
                    {reportTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="report-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Format
                </label>
                <div className="mt-1">
                  <select
                    id="report-format"
                    name="report-format"
                    className="input"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Range
                </label>
                <div className="mt-1">
                  <select
                    id="date-range"
                    name="date-range"
                    className="input"
                  >
                    <option value="last-7">Last 7 days</option>
                    <option value="last-30">Last 30 days</option>
                    <option value="last-90">Last 90 days</option>
                    <option value="last-year">Last year</option>
                    <option value="custom">Custom range</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="include-charts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Include Charts
                </label>
                <div className="mt-1">
                  <select
                    id="include-charts"
                    name="include-charts"
                    className="input"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="report-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="report-description"
                    name="report-description"
                    rows="3"
                    className="input"
                    placeholder="Enter report description (optional)"
                  ></textarea>
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <fieldset>
                  <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">Data to Include</legend>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <input
                        id="orders"
                        name="data-include"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="orders" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Orders
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="vendors"
                        name="data-include"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="vendors" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Vendors
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="inventory"
                        name="data-include"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="inventory" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Inventory
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="requisitions"
                        name="data-include"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="requisitions" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Requisitions
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="budget"
                        name="data-include"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="budget" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Budget
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-lighter hover:bg-gray-50 dark:hover:bg-dark-light focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Generate Report
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Additional Report Features - Current Time Stamp */}
      <div className="mt-8 bg-white dark:bg-dark-light rounded-lg shadow p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Current System Information</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Date and Time (UTC): <span className="font-mono text-gray-900 dark:text-white">2025-04-24 16:32:22</span>
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Current User: <span className="font-medium text-primary">neupane-rajan</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;