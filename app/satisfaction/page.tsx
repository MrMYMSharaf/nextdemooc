'use client'
import React, { useEffect, useState } from 'react';
import { Star, Flag, Zap, Users, Clipboard, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  Name: string;
  Comment: string;
  Rating?: string;
  "Sentiment Analysis": 'Positive' | 'Neutral' | 'Negative';
  "Issue Type"?: string;
  "Urgency Level"?: string;
  "Churn Prediction"?: string;
  "AI Suggested Resolution"?: string;
  "Feature Requests"?: string;
  AppName?: string;
  ScrapedIN?: string;
}

const fetchReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch('/api/reviews');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

const CustomerSatisfactionDashboard: React.FC = () => {
  const [sentimentSummary, setSentimentSummary] = useState({ Positive: 0, Neutral: 0, Negative: 0 });
  const [userComments, setUserComments] = useState<{ [key: string]: number }>({});
  const [highRiskReviews, setHighRiskReviews] = useState<Review[]>([]);
  const [featureRequests, setFeatureRequests] = useState<Review[]>([]);

  // Pagination for High Risk Reviews
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const getReviews = async () => {
      const fetchedReviews = await fetchReviews();
      // Only perform analysis if you need the data
      if (fetchedReviews.length > 0) {
        // Sentiment Summary
        const sentiment = { Positive: 0, Neutral: 0, Negative: 0 };
        fetchedReviews.forEach(review => {
          sentiment[review["Sentiment Analysis"]]++;
        });
        setSentimentSummary(sentiment);

        // User Comment Frequency
        const userCount: { [key: string]: number } = {};
        fetchedReviews.forEach(review => {
          userCount[review.Name] = (userCount[review.Name] || 0) + 1;
        });
        setUserComments(userCount);

        // High Risk Reviews
        const highRisk = fetchedReviews.filter(review => 
          parseInt(review["Churn Prediction"]?.replace('%', '') || '0') > 80
        );
        setHighRiskReviews(highRisk);

        // Feature Requests
        const requests = fetchedReviews.filter(review => 
          review["Feature Requests"] && 
          review["Feature Requests"] !== "None" && 
          review["Feature Requests"]
        );
        setFeatureRequests(requests);
      }
    };
    getReviews();
  }, []);

  // Pagination Handlers for High Risk Reviews
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = highRiskReviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'Positive': return 'bg-yellow-100 text-yellow-800';
      case 'Neutral': return 'bg-yellow-200 text-yellow-900';
      case 'Negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-900 flex items-center justify-center">
          <Zap className="mr-4 text-yellow-600" size={40} />
          Customer Insights Dashboard
        </h1>
        
        {/* Top Insights Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Sentiment Summary */}
          <div className="bg-white shadow-lg rounded-xl p-6 transform transition hover:scale-105">
            <div className="flex items-center mb-4">
              <Star className="mr-3 text-yellow-500" size={30} />
              <h2 className="text-xl font-semibold text-yellow-900">Sentiment Analysis</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(sentimentSummary).map(([key, value]) => (
                <div 
                  key={key} 
                  className={`p-4 rounded-lg text-center ${getSentimentColor(key)} hover:shadow-md transition`}
                >
                  <p className="text-sm font-medium">{key} Reviews</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Frequent Users */}
          <div className="bg-white shadow-lg rounded-xl p-6 transform transition hover:scale-105">
            <div className="flex items-center mb-4">
              <Users className="mr-3 text-yellow-500" size={30} />
              <h2 className="text-xl font-semibold text-yellow-900">Frequent Commenters</h2>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <ul className="space-y-2">
                {Object.entries(userComments)
                  .filter(([_, count]) => count > 1) // eslint-disable-line @typescript-eslint/no-unused-vars
                  .sort((a, b) => b[1] - a[1])
                  .map(([user, count]) => (
                    <li 
                      key={user} 
                      className="flex justify-between bg-yellow-50 p-2 rounded hover:bg-yellow-100 transition"
                    >
                      <span className="font-medium text-yellow-900">{user}</span>
                      <span className="text-yellow-600">{count} comments</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Feature Requests */}
          {featureRequests.length > 0 && (
            <div className="bg-white shadow-lg rounded-xl p-6 transform transition hover:scale-105">
              <div className="flex items-center mb-4">
                <Clipboard className="mr-3 text-yellow-500" size={30} />
                <h2 className="text-xl font-semibold text-yellow-900">Feature Requests</h2>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <ul className="space-y-2">
                  {featureRequests.map(request => (
                    <li 
                      key={request.id} 
                      className="bg-yellow-50 p-2 rounded hover:bg-yellow-100 transition"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-yellow-900 font-medium">{request.Name}</p>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-600 mr-2">{request.AppName}</span>
                          <span className="text-xs text-gray-500 bg-yellow-100 px-1 rounded">
                            {request.ScrapedIN}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-yellow-700 mb-1">{request["Feature Requests"]}</p>
                      <p className="text-xs text-gray-600 italic">{request.Comment}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* High Risk Reviews */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Flag className="mr-3 text-red-500" size={30} />
            <h2 className="text-xl font-semibold text-yellow-900">High Churn Risk Reviews</h2>
          </div>
          {highRiskReviews.length > 0 ? (
            <>
              <ul className="space-y-4">
                {currentReviews.map(review => (
                  <li 
                    key={review.id} 
                    className="border-b pb-4 last:border-b-0 hover:bg-yellow-50 p-3 rounded transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-3/4">
                        <p className="font-semibold text-red-600">
                          {review.Name} (Churn Risk: {review["Churn Prediction"]})
                        </p>
                        <p className="text-yellow-900 mt-2">{review.Comment}</p>
                        {review["Issue Type"] && (
                          <div className="mt-2">
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              {review["Issue Type"]}
                            </span>
                          </div>
                        )}
                      </div>
                      {review["AI Suggested Resolution"] && (
                        <div className="w-1/4 bg-yellow-50 p-2 rounded text-sm border border-yellow-200">
                          <strong className="text-yellow-900">Suggested Resolution:</strong>
                          <p className="text-yellow-700">{review["AI Suggested Resolution"]}</p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-6">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="mx-2 p-2 bg-yellow-100 text-yellow-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-yellow-900">
                  Page {currentPage} of {Math.ceil(highRiskReviews.length / reviewsPerPage)}
                </span>
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === Math.ceil(highRiskReviews.length / reviewsPerPage)}
                  className="mx-2 p-2 bg-yellow-100 text-yellow-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          ) : (
            <p className="text-yellow-600 text-center">No high-risk reviews at the moment</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSatisfactionDashboard;