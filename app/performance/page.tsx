'use client'
import React, { useEffect, useState } from "react";
import { AlertCircle, Users, TrendingUp, MapPin, Target, UserPlus, RefreshCw } from "lucide-react";

// Enhanced Review interface with explicit typing
interface Review {
  id: string;
  Name: string;
  Comment: string;
  "Security Concern Detection": string;
  "Legal Risk Detection": string;
  "High-Value Customers": string;
  "Competitor Mentions": string;
  "ATM or Branch Mentioned": string;
  "Marketing Opportunity Detection": string;
  "Onboarding Experience": string;
  "Impact of Updates": string;
}

// Type for category-related mappings
type CategoryKey = keyof Omit<Review, 'id' | 'Name' | 'Comment'>;

const reviewsPerPage = 2;

// Explicitly typed icons mapping
const categoryIcons: Record<CategoryKey, React.ReactNode> = {
  "Security Concern Detection": <AlertCircle className="h-5 w-5 text-amber-600" />,
  "Legal Risk Detection": <AlertCircle className="h-5 w-5 text-amber-600" />,
  "High-Value Customers": <Users className="h-5 w-5 text-amber-600" />,
  "Competitor Mentions": <TrendingUp className="h-5 w-5 text-amber-600" />,
  "ATM or Branch Mentioned": <MapPin className="h-5 w-5 text-amber-600" />,
  "Marketing Opportunity Detection": <Target className="h-5 w-5 text-amber-600" />,
  "Onboarding Experience": <UserPlus className="h-5 w-5 text-amber-600" />,
  "Impact of Updates": <RefreshCw className="h-5 w-5 text-amber-600" />
};

// Explicitly typed friendly names mapping
const categoryFriendlyNames: Record<CategoryKey, string> = {
  "Security Concern Detection": "Security Concerns",
  "Legal Risk Detection": "Legal Risks",
  "High-Value Customers": "VIP Customers",
  "Competitor Mentions": "Competition",
  "ATM or Branch Mentioned": "Branch Feedback",
  "Marketing Opportunity Detection": "Marketing Opportunities",
  "Onboarding Experience": "Onboarding",
  "Impact of Updates": "Update Impact"
};

// Strongly typed fetch function
const fetchReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch("/api/reviews");
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const data: Review[] = await response.json();
    return data.filter(review => {
      return Object.entries(review).some(([key, value]) => {
        if (['id', 'Name', 'Comment'].includes(key)) return false;
        return value && value.toString().toLowerCase() !== "none";
      });
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

const Performance: React.FC = () => {
  const [organizedData, setOrganizedData] = useState<Record<CategoryKey, Review[]>>({} as Record<CategoryKey, Review[]>);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getReviews = async () => {
      const fetchedReviews = await fetchReviews();
      
      const categories = Object.keys(categoryFriendlyNames) as CategoryKey[];
      const organized: Record<CategoryKey, Review[]> = {} as Record<CategoryKey, Review[]>;
      
      categories.forEach(category => {
        organized[category] = fetchedReviews.filter(review => 
          review[category] && review[category].toString().toLowerCase() !== "none"
        );
      });
      
      setOrganizedData(organized);
      
      const firstNonEmptyCategory = categories.find(category => organized[category]?.length > 0) || null;
      setActiveCategory(firstNonEmptyCategory);
    };
    
    getReviews();
  }, []);

  const totalPages = activeCategory ? Math.ceil((organizedData[activeCategory]?.length || 0) / reviewsPerPage) : 0;
  const displayedReviews = activeCategory ? organizedData[activeCategory]?.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage) : [];

  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">Customer Review Insights Dashboard</h1>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(organizedData).map(([category, categoryReviews]) => (
              categoryReviews.length > 0 && (
                <button 
                  key={`nav-${category}`}
                  className={`flex items-center rounded-full py-1 px-3 text-sm font-medium transition-colors ${
                    activeCategory === category ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                  }`}
                  onClick={() => { 
                    setActiveCategory(category as CategoryKey); 
                    setCurrentPage(1); 
                  }}
                >
                  <span className="mr-1">{categoryIcons[category as CategoryKey]}</span>
                  {categoryFriendlyNames[category as CategoryKey]} ({categoryReviews.length})
                </button>
              )
            ))}
          </div>

          {activeCategory && displayedReviews.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">{categoryFriendlyNames[activeCategory]}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedReviews.map(review => (
                  <div key={`${activeCategory}-${review.id}`} className="bg-white rounded-lg shadow p-4 border border-amber-200">
                    <h3 className="text-lg font-semibold">{review.Name}</h3>
                    <p className="text-gray-600 mb-4">{review.Comment}</p>
                    <p className="font-medium text-amber-600">{review[activeCategory]}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)} 
                    className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;