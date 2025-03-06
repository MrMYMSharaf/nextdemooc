"use client";

import { useEffect, useState } from "react";
import React from "react";
import DataTable from "react-data-table-component";

// Updated interface to match your actual data structure
interface Review {
  id: string;
  Name: string;
  Rating: string;
  Date: string;
  Comment: string;
  AppName: string;
  ScrapedIN: string;
  "Emotion Detection": string;
  "Urgency Level": string;
  Language: string;
  "Issue Type": string;
  "Assigned Team": string;
  "AI Reply": string;
  "Sentiment Analysis": string;
  "Keywords Extraction": string;
  "AI Suggested Resolution": string;
  "Impact Score": string;
  "Retention Risk Score": string;
  "Security Concern Detection": string;
  "Legal Risk Detection": string;
  "High-Value Customers": string;
  "Competitor Mentions": string;
  "Feature Requests": string;
  "Language Accuracy": string;
  "User Psychology": string;
  "Churn Prediction": string;
  "ATM or Branch Mentioned": string;
  "Marketing Opportunity Detection": string;
  "Onboarding Experience": string;
  "Impact of Updates": string;
  Status: string;
  "Developer Reply Date": string;
  "Developer Reply": string;
}

// Custom styling for DataTable
const customStyles = {
  headRow: {
    style: {
      backgroundColor: '#f3f4f6',
      borderBottom: '2px solid #e5e7eb',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      color: '#374151',
    },
  },
  rows: {
    style: {
      minHeight: '60px',
      fontSize: '0.875rem',
      '&:hover': {
        backgroundColor: '#f9fafb',
        transition: '0.2s',
      },
    },
    stripedStyle: {
      backgroundColor: '#f9fafb',
    },
  },
  pagination: {
    style: {
      borderTop: '1px solid #e5e7eb',
      fontSize: '0.875rem',
    },
    pageButtonsStyle: {
      borderRadius: '0.375rem',
      height: '2rem',
      width: '2rem',
      padding: '0.25rem',
      margin: '0.125rem',
      cursor: 'pointer',
      transition: '0.2s',
      fill: '#6b7280',
      backgroundColor: 'transparent',
      '&:hover:not(:disabled)': {
        backgroundColor: '#e5e7eb',
      },
      '&:focus': {
        outline: 'none',
        backgroundColor: '#e5e7eb',
      },
    },
  },
};

const DataTableComponent = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Review[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
    const [appNameFilter, setAppNameFilter] = useState("");
    const [scrapedInFilter, setScrapedInFilter] = useState("");
    const [sentimentFilter, setSentimentFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log("✅ Fetched Reviews:", data);
        
        if (Array.isArray(data)) {
          console.log("✅ Data is an array with length:", data.length);
          setReviews(data);
        } else if (data.reviews && Array.isArray(data.reviews)) {
          console.log("✅ Data contains reviews array with length:", data.reviews.length);
          setReviews(data.reviews);
        } else {
          setError("API response is not in the expected format");
          console.error("❌ API response is not an array:", data);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error occurred");
        console.error("❌ Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  // Show loading state with a skeleton loader
  if (loading) return (
    <div className="p-4">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-80 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
  
  // Show error state if there's an error
  if (error) return (
    <div className="p-4 border border-red-300 bg-red-50 rounded-md">
      <h3 className="text-red-800 font-medium">Error Loading Data</h3>
      <p className="text-red-600">{error}</p>
      <button 
        className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md transition-colors"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
  
  // Show empty state if no reviews
  if (reviews.length === 0) return (
    <div className="p-8 text-center border rounded-md">
      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <h3 className="mt-2 text-xl font-medium text-gray-600">No Reviews Found</h3>
      <p className="mt-1 text-gray-500">There are no reviews available at this time.</p>
    </div>
  );


  const handleRowSelected = (selected: { 
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Review[];
  }) => {
    setSelectedRows(selected.selectedRows);
  };

  const handleBulkAction = () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row');
      return;
    }
    
    const ids = selectedRows.map(row => row.id).join(', ');
    alert(`Bulk action initiated for IDs: ${ids}`);
    setToggleCleared(!toggleCleared);
  };

  // Extract rating number from string like "Rated 1 star out of five"
  const extractRatingNumber = (ratingString: string): number => {
    const match = ratingString.match(/Rated (\d+) star/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Get star rendering based on rating number
  const renderStars = (ratingString: string) => {
    const rating = extractRatingNumber(ratingString);
    
    return React.createElement(
      "div",
      { className: "flex space-x-1" },
      ...Array.from({ length: 5 }, (_, i) =>
        React.createElement(
          "span",
          { key: i, className: i < rating ? "text-yellow-400" : "text-gray-300" },
          "★"
        )
      )
    );
  };

  // Format date properly to handle "Invalid Date"
  const formatDate = (dateString: string): string => {
    try {
      // Handle format like "5/16/2024"
      const parts = dateString.split('/');
      if (parts.length === 3) {
        // Convert to YYYY-MM-DD format for better parsing
        const formattedDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        return new Date(formattedDate).toLocaleDateString();
      }
      return new Date(dateString).toLocaleDateString();
    } catch (error: unknown) {
      console.error('Date parsing error:', error);
      return dateString; // Return original if parsing fails
    }
  };

  // Calculate time ago
  const timeAgo = (dateString: string): string => {
    try {
      const parts = dateString.split('/');
      if (parts.length !== 3) return '';
      
      const date = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    } catch (error: unknown) {
      // Option 1: Log the error if you want to track parsing issues
      console.error('Time ago calculation error:', error);
      return ''; // Return empty string if calculation fails
    }
  };

  // Filter the data based on filter text
  

  // Subheader component with search and filters
  // Inside DataTableComponent function, replace the SubHeaderComponent with this:
const SubHeaderComponent = () => {
  // Get unique values for filter dropdowns
  const uniqueAppNames = [...new Set(reviews.map(item => item.AppName))].filter(Boolean);
  const uniqueScrapedIns = [...new Set(reviews.map(item => item.ScrapedIN))].filter(Boolean);
  const uniqueSentiments = [...new Set(reviews.map(item => item["Sentiment Analysis"]))].filter(Boolean);
  const uniqueStatuses = [...new Set(reviews.map(item => item.Status))].filter(Boolean);
  
  // Apply filters
  const applyFilters = () => {
    // Your filter logic here
    setShowFilters(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setAppNameFilter("");
    setScrapedInFilter("");
    setSentimentFilter("");
    setStatusFilter("");
    // Reset filter text too if needed
    setFilterText("");
    setResetPaginationToggle(!resetPaginationToggle);
  };
  
  // Cancel and close filters
  const cancelFilters = () => {
    // Just close the filter panel without applying changes
    setShowFilters(false);
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full mb-4">
      <div className="relative w-full md:w-1/3">
        <input
          className="shadow-sm text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 border border-gray-300"
          type="text"
          placeholder="Search reviews..."
          value={filterText}
          onChange={e => {
            setFilterText(e.target.value);
            setResetPaginationToggle(!resetPaginationToggle);
          }}
        />
        {filterText && (
          <button 
            className="absolute inset-y-0 right-0 px-3 flex items-center"
            onClick={() => {
              setFilterText("");
              setResetPaginationToggle(!resetPaginationToggle);
            }}
          >
            ×
          </button>
        )}
      </div>
      <div className="flex space-x-2 w-full md:w-auto">
        {selectedRows.length > 0 && (
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
            onClick={handleBulkAction}
          >
            Bulk Action ({selectedRows.length})
          </button>
        )}
        <button
          className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      
      {showFilters && (
        <div className="absolute z-10 mt-16 right-4 bg-white border rounded-lg shadow-lg p-4 w-64">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Filter by:</h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={cancelFilters}
            >
              ×
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
              <select 
                className="w-full text-sm rounded-lg border border-gray-300 p-2"
                value={appNameFilter}
                onChange={(e) => setAppNameFilter(e.target.value)}
              >
                <option value="">All</option>
                {uniqueAppNames.map(app => (
                  <option key={app} value={app}>{app}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scraped In</label>
              <select 
                className="w-full text-sm rounded-lg border border-gray-300 p-2"
                value={scrapedInFilter}
                onChange={(e) => setScrapedInFilter(e.target.value)}
              >
                <option value="">All</option>
                {uniqueScrapedIns.map(scrape => (
                  <option key={scrape} value={scrape}>{scrape}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sentiment Analysis</label>
              <select 
                className="w-full text-sm rounded-lg border border-gray-300 p-2"
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
              >
                <option value="">All</option>
                {uniqueSentiments.map(sentiment => (
                  <option key={sentiment} value={sentiment}>{sentiment}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="w-full text-sm rounded-lg border border-gray-300 p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status || "None"}>{status || "Unassigned"}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-between pt-2">
              <button 
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                onClick={resetFilters}
              >
                Reset
              </button>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                  onClick={cancelFilters}
                >
                  Cancel
                </button>
                <button 
                  className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  onClick={applyFilters}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  const filteredItems = reviews.filter(
    item => 
      (item.Name && item.Name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.Comment && item.Comment.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.AppName && item.AppName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item["Sentiment Analysis"] && item["Sentiment Analysis"].toLowerCase().includes(filterText.toLowerCase())) ||
      (item.Status && item.Status.toLowerCase().includes(filterText.toLowerCase()))
  ).filter(item => {
    // Additional filtering based on dropdown selections
    return (
      (!appNameFilter || item.AppName === appNameFilter) &&
      (!scrapedInFilter || item.ScrapedIN === scrapedInFilter) &&
      (!sentimentFilter || item["Sentiment Analysis"] === sentimentFilter) &&
      (!statusFilter || (statusFilter === "None" ? !item.Status : item.Status === statusFilter))
    );
  });

  const columns = [
    { 
      name: "Name", 
      selector: (row: Review) => row.Name, 
      sortable: true,
      cell: (row: Review) => (
        <div className="font-medium">{row.Name}</div>
      )
    },
    { 
      name: "Comment", 
      selector: (row: Review) => row.Comment, 
      wrap: true,
      grow: 2,
      cell: (row: Review) => (
        <div className="py-2">
          <div className="line-clamp-2 text-sm">{row.Comment}</div>
        </div>
      )
    },
    { 
      name: "Rating", 
      selector: (row: Review) => row.Rating, 
      sortable: true,
      cell: (row: Review) => renderStars(row.Rating),
      sortFunction: (a: Review, b: Review) => {
        return extractRatingNumber(a.Rating) - extractRatingNumber(b.Rating);
      }
    },
    { 
      name: "App Name", 
      selector: (row: Review) => row.AppName, 
      sortable: true,
      cell: (row: Review) => (
        <div className="text-sm">{row.AppName}</div>
      )
    },
    { 
      name: "Sentiment", 
      selector: (row: Review) => row["Sentiment Analysis"], 
      sortable: true,
      cell: (row: Review) => {
        let color = "bg-gray-100";
        if (row["Sentiment Analysis"] === "Positive") color = "bg-green-100 text-green-800";
        if (row["Sentiment Analysis"] === "Negative") color = "bg-red-100 text-red-800";
        if (row["Sentiment Analysis"] === "Neutral") color = "bg-blue-100 text-blue-800";
        
        return (
          <span className={`px-2 py-1 rounded ${color} text-sm font-medium`}>
            {row["Sentiment Analysis"]}
          </span>
        );
      }
    },
    { 
      name: "Status", 
      selector: (row: Review) => row.Status, 
      sortable: true,
      cell: (row: Review) => {
        let color = "bg-gray-100";
        if (row.Status === "New") color = "bg-purple-100 text-purple-800";
        if (row.Status === "In Progress") color = "bg-yellow-100 text-yellow-800";
        if (row.Status === "Resolved") color = "bg-green-100 text-green-800";
        if (row.Status === "None" || !row.Status) color = "bg-gray-100 text-gray-800";
        
        const displayStatus = row.Status === "None" || !row.Status ? "Unassigned" : row.Status;
        
        return (
          <span className={`px-2 py-1 rounded ${color} text-sm font-medium`}>
            {displayStatus}
          </span>
        );
      }
    },
    { 
      name: "Date", 
      selector: (row: Review) => row.Date, 
      sortable: true,
      cell: (row: Review) => (
        <div className="text-sm">
          <div>{formatDate(row.Date)}</div>
          <div className="text-xs text-gray-500">{timeAgo(row.Date)}</div>
        </div>
      ),
      sortFunction: (a: Review, b: Review) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);
        return dateA.getTime() - dateB.getTime();
      }
    },
    {
      name: "Urgency",
      selector: (row: Review) => row["Urgency Level"],
      sortable: true,
      cell: (row: Review) => {
        const urgency = parseInt(row["Urgency Level"], 10) || 0;
        let color = "bg-green-100 text-green-800";
        if (urgency > 70) color = "bg-red-100 text-red-800";
        else if (urgency > 40) color = "bg-yellow-100 text-yellow-800";
        
        // Progress bar style
        return (
          <div className="w-full flex flex-col">
            <span className={`px-2 py-1 rounded ${color} text-xs font-medium text-center`}>
              {row["Urgency Level"]}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className={`h-1.5 rounded-full ${urgency > 70 ? 'bg-red-500' : urgency > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                style={{ width: row["Urgency Level"] }}
              ></div>
            </div>
          </div>
        );
      },
      sortFunction: (a: Review, b: Review) => {
        const urgencyA = parseInt(a["Urgency Level"], 10) || 0;
        const urgencyB = parseInt(b["Urgency Level"], 10) || 0;
        return urgencyA - urgencyB;
      }
    },
  ];

  const expandedComponent = ({ data }: { data: Review }) => (
    <div className="p-4 bg-gray-50 border-t border-b">
      <h3 className="font-bold text-lg mb-4">Review Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-blue-600 mb-3 pb-2 border-b">Issue Analysis</h4>
          <div className="space-y-2">
            <p><span className="font-medium text-gray-700">Issue Type:</span> <span className="text-gray-900">{data["Issue Type"]}</span></p>
            <p><span className="font-medium text-gray-700">Emotions:</span> <span className="text-gray-900">{data["Emotion Detection"]}</span></p>
            <p><span className="font-medium text-gray-700">User Psychology:</span> <span className="text-gray-900">{data["User Psychology"]}</span></p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-green-600 mb-3 pb-2 border-b">AI Response</h4>
          <p className="text-sm italic bg-gray-50 p-3 rounded border mb-3">{data["AI Reply"]}</p>
          <p><span className="font-medium text-gray-700">AI Resolution:</span> <span className="text-gray-900">{data["AI Suggested Resolution"]}</span></p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-purple-600 mb-3 pb-2 border-b">Business Impact</h4>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-700">Impact Score:</span>
              <div className="w-full bg-gray-200 rounded-full h-2 my-1">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: data["Impact Score"] }}></div>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Retention Risk:</span>
              <div className="w-full bg-gray-200 rounded-full h-2 my-1">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: data["Retention Risk Score"] }}></div>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Churn Prediction:</span>
              <div className="w-full bg-gray-200 rounded-full h-2 my-1">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: data["Churn Prediction"] }}></div>
              </div>
            </div>
            <p><span className="font-medium text-gray-700">Assigned Team:</span> <span className="text-gray-900">{data["Assigned Team"]}</span></p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-yellow-600 mb-3 pb-2 border-b">User Comment</h4>
          <p className="text-sm italic bg-gray-50 p-3 rounded border mb-3">{data["Comment"]}</p>
          <p><span className="font-medium text-gray-700">Language Accuracy:</span> <span className="text-gray-900">{data["Language Accuracy"]}</span></p>
          <p><span className="font-medium text-gray-700">Language:</span> <span className="text-gray-900">{data["Language"]}</span></p>
          <p><span className="font-medium text-gray-700">User Psychology:</span> <span className="text-gray-900">{data["User Psychology"]}</span></p>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
          Respond to Review
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
          Mark as Resolved
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-1">User Review Analytics</h2>
      <p className="text-gray-500 mb-6">Track and respond to app feedback from users</p>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800">Total Reviews</h3>
          <p className="text-2xl font-bold text-blue-900">{reviews.length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm font-medium text-red-800">Negative Reviews</h3>
          <p className="text-2xl font-bold text-red-900">
            {reviews.filter(r => r["Sentiment Analysis"] === "Negative").length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-sm font-medium text-green-800">Positive Reviews</h3>
          <p className="text-2xl font-bold text-green-900">
            {reviews.filter(r => r["Sentiment Analysis"] === "Positive").length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="text-sm font-medium text-purple-800">Avg. Rating</h3>
          <p className="text-2xl font-bold text-purple-900">
            {(reviews.reduce((acc, curr) => acc + extractRatingNumber(curr.Rating || ""), 0) / Math.max(1, reviews.length)).toFixed(1)}
          </p>
        </div>
      </div>
      
    
      
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        paginationComponentOptions={{
          rowsPerPageText: 'Reviews per page:',
          rangeSeparatorText: 'of',
        }}
        highlightOnHover
        striped
        persistTableHead
        responsive
        selectableRows
        selectableRowsHighlight
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        expandableRows
        expandableRowsComponent={expandedComponent}
        defaultSortFieldId={1}
        customStyles={customStyles}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 25, 50]}
        noDataComponent={
          <div className="p-6 text-center">
            <p className="text-gray-500">No matching reviews found</p>
          </div>
        }
        subHeader
        subHeaderComponent={<SubHeaderComponent />}
      />
    </div>
  );
};

export default DataTableComponent;