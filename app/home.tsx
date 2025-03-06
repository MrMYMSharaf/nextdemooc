"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  FaRegComment as MessageSquare, 
  FaRegCalendarAlt as Calendar, 
  FaStar as Star, 
  FaExclamationTriangle as AlertTriangle, 
  FaFilter as Filter 
} from "react-icons/fa";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { motion } from "framer-motion";

interface ReviewData {
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

const HomePage = () => {
  const [data, setData] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reviews");
        const result = await response.json();
        
        // Ensure it's an array
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Unexpected API response format:", result);
          setData([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); // Fallback to empty array in case of error
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // Filter data for the last one year
  const oneYearAgo = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date;
  }, []);

  // Processed and filtered data
  const processedData = useMemo(() => {
    return data
      .filter(item => {
        const itemDate = new Date(item.Date);
        return itemDate >= oneYearAgo && 
               (!selectedPlatform || item.ScrapedIN === selectedPlatform) &&
               (!selectedApp || item.AppName === selectedApp);
      })
      .map(item => ({
        ...item,
        parsedDate: new Date(item.Date)
      }));
  }, [data, selectedPlatform, selectedApp, oneYearAgo]);

  // Unique Platforms and App Names
  const uniquePlatforms = [...new Set(data.map(item => item.ScrapedIN))];
  const uniqueAppNames = [...new Set(data.map(item => item.AppName))];

  // Date-based XY Scatter Data with Month and Year
  const scatterData = processedData.map(item => ({
    x: `${item.parsedDate.toLocaleString('default', { month: 'short' })} ${item.parsedDate.getFullYear()}`,
    y: parseFloat(item["Impact Score"] || '0%'),
    app: item.AppName,
    platform: item.ScrapedIN,
    date: item.Date
  }));

  // Total Comments Metrics
  const totalComments = processedData.length;

  // Sentiment Analysis
  const sentimentData = [
    { 
      name: "Positive", 
      value: processedData.filter(item => item["Sentiment Analysis"] === "Positive").length,
      color: "#fde047"
    },
    { 
      name: "Negative", 
      value: processedData.filter(item => item["Sentiment Analysis"] === "Negative").length,
      color: "#facc15"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300">
        <div className="animate-pulse text-2xl font-bold text-yellow-600">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {/* Platform and App Filters */}
        <div className="flex items-center space-x-4">
          <Filter className="text-yellow-500 w-6 h-6" />
          <select 
            value={selectedPlatform || ''} 
            onChange={(e) => setSelectedPlatform(e.target.value || null)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
          >
            <option value="">All Platforms</option>
            {uniquePlatforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
          <select 
            value={selectedApp || ''} 
            onChange={(e) => setSelectedApp(e.target.value || null)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">All Apps</option>
            {uniqueAppNames.map(appName => (
              <option key={appName} value={appName}>{appName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          icon={<MessageSquare className="w-6 h-6" />} 
          title="Total Comments" 
          value={totalComments.toString()} 
          color="yellow" 
        />
        <MetricCard 
          icon={<Calendar className="w-6 h-6" />} 
          title="Date Range" 
          value={`${oneYearAgo.toLocaleString('default', { month: 'short', year: 'numeric' })} - ${new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}`}

          color="amber" 
        />
        <MetricCard 
          icon={<Star className="w-6 h-6" />} 
          title="Positive Comments" 
          value={sentimentData[0].value.toString()} 
          color="gold" 
        />
        <MetricCard 
          icon={<AlertTriangle className="w-6 h-6" />} 
          title="Negative Comments" 
          value={sentimentData[1].value.toString()} 
          color="orange" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* XY Scatter Chart - Month vs Impact Score */}
        <motion.div 
          className="bg-white p-6 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-yellow-700 mb-4">
            Comments: Month vs Impact Score
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis 
                type="category"
                dataKey="x"
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Impact Score" 
                unit="%" 
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-yellow-100 p-4 rounded-lg shadow-lg">
                        <p>Month: {data.x}</p>
                        <p>Impact Score: {data.y}%</p>
                        <p>App: {data.app}</p>
                        <p>Platform: {data.platform}</p>
                        <p>Date: {data.date}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Comments" data={scatterData} fill="#fbbf24" />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Comments */}
        <motion.div 
          className="bg-white p-6 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-yellow-700 mb-4">
            Recent Comments
          </h2>
          <div className="space-y-4">
            {processedData
              .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
              .slice(0, 5)
              .map((item, index) => (
                <div 
                  key={index} 
                  className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 rounded-lg"
                >
                  <p className="text-sm text-gray-700 line-clamp-2">{item.Comment}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-yellow-600">{item.AppName}</span>
                    <span className="text-xs text-gray-500">{item.Date}</span>
                  </div>
                  <span 
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      item["Sentiment Analysis"] === "Positive" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item["Sentiment Analysis"]}
                  </span>
                </div>
              ))
            }
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ 
  icon, 
  title, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  color: string 
}) => {
  const colorVariants: Record<string, string> = {
    yellow: "from-yellow-500 to-yellow-400",
    amber: "from-amber-500 to-amber-400",
    gold: "from-amber-600 to-yellow-500",
    orange: "from-orange-500 to-orange-400"
  };

  return (
    <motion.div 
      className={`bg-gradient-to-r ${colorVariants[color]} p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center space-x-4">
        <div className="p-4 bg-white text-cyan-300 bg-opacity-20 rounded-lg">{icon}</div>
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;