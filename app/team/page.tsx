"use client";
import React, { useState, useEffect } from 'react';
import {BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// TypeScript interface for feedback data
interface FeedbackItem {
  id: string;
  Name?: string;
  Rating?: string;
  Date?: string;
  Comment?: string;
  AppName?: string;
  ScrapedIN?: string;
  "Emotion Detection"?: string;
  "Urgency Level"?: string;
  Language?: string;
  "Issue Type"?: string;
  "Assigned Team"?: string;
  "AI Reply"?: string;
  "Sentiment Analysis"?: string;
  "Keywords Extraction"?: string;
  "AI Suggested Resolution"?: string;
  "Impact Score"?: string;
  "Retention Risk Score"?: string;
  "Security Concern Detection"?: string;
  "Legal Risk Detection"?: string;
  "High-Value Customers"?: string;
  "Competitor Mentions"?: string;
  "Feature Requests"?: string;
  "Language Accuracy"?: string;
  "User Psychology"?: string;
  "Churn Prediction"?: string;
  "ATM or Branch Mentioned"?: string;
  "Marketing Opportunity Detection"?: string;
  "Onboarding Experience"?: string;
  "Impact of Updates"?: string;
  Status?: string;
  "Developer Reply Date"?: string;
  "Developer Reply"?: string;
}

const TeamPerformanceDashboard = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [filteredFeedbackData, setFilteredFeedbackData] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState('All Apps');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const itemsPerPage = 10;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reviews");
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        setFeedbackData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

   // Update filtered data when filters change
  useEffect(() => {
    const filtered = feedbackData.filter(item => {
      const matchesTeam = selectedTeam === 'All Teams' || 
        (item["Assigned Team"] && item["Assigned Team"].includes(selectedTeam));
      
      const matchesApp = selectedApp === 'All Apps' || 
        item.AppName === selectedApp;
      
      const matchesPlatform = selectedPlatform === 'All Platforms' || 
        item.ScrapedIN === selectedPlatform;
      
      return matchesTeam && matchesApp && matchesPlatform;
    });

    setFilteredFeedbackData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [feedbackData, selectedTeam, selectedApp, selectedPlatform]);

  // Extract all teams from the data
  const allTeams = [...new Set(
    feedbackData.flatMap(item => 
      item["Assigned Team"] ? item["Assigned Team"].split(', ') : []
    )
  )];

  // Extract unique app names and platforms from the data
  const allAppNames = [...new Set(
  feedbackData.map(item => item.AppName || 'Unassigned')
  )];

  const allPlatforms = [...new Set(
  feedbackData.map(item => item.ScrapedIN || 'Unassigned')
  )];

  // Calculate team-based metrics
  const calculateTeamMetrics = () => {
    // Define types explicitly
    type TeamMetrics = {
      openTasks: number;
      closedTasks: number;
      criticalTasks: number;
      averageImpact: number;
      averageRetentionRisk: number;
      totalTasks: number;
      impactScores: number[];
      retentionRiskScores: number[];
    };
  
    type TeamStatus = Record<string, number>;
    type TeamSentiment = Record<string, number>;
    type TeamIssueTypes = Record<string, number>;
  
    // Use TypeScript Record<> to define object structures
    const teamMetrics: Record<string, TeamMetrics> = {};
    const teamTasks: Record<string, number> = {};
    const teamIssueTypes: Record<string, TeamIssueTypes> = {};
    const teamStatus: Record<string, TeamStatus> = {};
    const teamSentiment: Record<string, TeamSentiment> = {};
  
    // If no teams exist in filtered data, return empty metrics
  if (allTeams.length === 0) {
    return { teamMetrics, teamTasks, teamIssueTypes, teamStatus, teamSentiment };
  }

    // Initialize teams
    allTeams.forEach(team => {
      teamMetrics[team] = {
        openTasks: 0,
        closedTasks: 0,
        criticalTasks: 0,
        averageImpact: 0,
        averageRetentionRisk: 0,
        totalTasks: 0,
        impactScores: [],
        retentionRiskScores: []
      };
      teamTasks[team] = 0;
      teamIssueTypes[team] = {};
      teamStatus[team] = {
        Pending: 0,
        "In Progress": 0,
        Blocked: 0,
        Completed: 0,
        Critical: 0
      };
      teamSentiment[team] = {
        Positive: 0,
        Neutral: 0,
        Negative: 0
      };
    });
  

    // Process data
     // Process feedback data
     filteredFeedbackData.forEach(item => {
      const teams = item["Assigned Team"] ? item["Assigned Team"].split(', ') : ["Unassigned"];
      const status = item["Status"] || "Open";
      const sentiment = item["Sentiment Analysis"] || "Neutral";
      const impactScore = parseInt(item["Impact Score"]?.replace('%', '') || "0");
      const retentionRisk = parseInt(item["Retention Risk Score"]?.replace('%', '') || "0");
      const issueTypes = item["Issue Type"] ? item["Issue Type"].split(', ') : [];

      teams.forEach(team => {
        // Ensure team exists in `teamMetrics`
        if (!teamMetrics[team]) {
          teamMetrics[team] = {
            openTasks: 0,
            closedTasks: 0,
            criticalTasks: 0,
            averageImpact: 0,
            averageRetentionRisk: 0,
            totalTasks: 0,
            impactScores: [],
            retentionRiskScores: []
          };
        }

        teamTasks[team] = (teamTasks[team] || 0) + 1;

      if (!teamStatus[team]) {
        teamStatus[team] = { Pending: 0, "In Progress": 0, Blocked: 0, Completed: 0, Critical: 0 };
      }
      if (!teamSentiment[team]) {
        teamSentiment[team] = { Positive: 0, Neutral: 0, Negative: 0 };
      }

      // Track status
      if (teamStatus[team][status] !== undefined) {
        teamStatus[team][status]++;
      }

      // Track sentiment
      if (teamSentiment[team][sentiment] !== undefined) {
        teamSentiment[team][sentiment]++;
      }

      // Track issue types
      if (!teamIssueTypes[team]) {
        teamIssueTypes[team] = {};
      }
      issueTypes.forEach(issue => {
        teamIssueTypes[team][issue] = (teamIssueTypes[team][issue] || 0) + 1;
      });

      // Update metrics
      teamMetrics[team].totalTasks++;
      if (status === "Open" || status === "Critical" || status === "In Progress") {
        teamMetrics[team].openTasks++;
      } else {
        teamMetrics[team].closedTasks++;
      }
      if (status === "Critical") {
        teamMetrics[team].criticalTasks++;
      }

      // Track scores for averages
      if (!isNaN(impactScore)) {
        teamMetrics[team].impactScores.push(impactScore);
      }
      if (!isNaN(retentionRisk)) {
        teamMetrics[team].retentionRiskScores.push(retentionRisk);
      }
    });
  });
    // Calculate averages
  allTeams.forEach(team => {
    teamMetrics[team].averageImpact = teamMetrics[team].impactScores.length > 0 
      ? Math.round(teamMetrics[team].impactScores.reduce((a, b) => a + b, 0) / teamMetrics[team].impactScores.length) 
      : 0;
    
    teamMetrics[team].averageRetentionRisk = teamMetrics[team].retentionRiskScores.length > 0 
      ? Math.round(teamMetrics[team].retentionRiskScores.reduce((a, b) => a + b, 0) / teamMetrics[team].retentionRiskScores.length) 
      : 0;
  });
  
  return { teamMetrics, teamTasks, teamIssueTypes, teamStatus, teamSentiment };
};

  const { teamMetrics, teamTasks, teamStatus } = calculateTeamMetrics();


  // Prepare data for visualizations
  const tasksPerTeamData = Object.entries(teamTasks).map(([team, count]) => ({
    name: team,
    tasks: count
  }));

  const statusDistributionData = (team: string): { name: string; value: number }[] => {
    if (team === 'All Teams') {
      const combinedStatus: Record<string, number> = {};
      Object.values(teamStatus).forEach(statusObj => {
        Object.entries(statusObj as Record<string, number>).forEach(([status, count]) => {
          combinedStatus[status] = (combinedStatus[status] || 0) + count;
        });
      });
      return Object.entries(combinedStatus).map(([status, count]) => ({
        name: status,
        value: count
      }));
    } else {
      return Object.entries(teamStatus[team] || {}).map(([status, count]) => ({
        name: status,
        value: count
      }));
    }
  };

  


  // Recommendations based on metrics
  const generateRecommendations = (team:string) => {
    if (team === 'All Teams') {
      // General recommendations
      return [
        "Conduct cross-team knowledge sharing sessions to address common issues",
        "Implement standardized incident response protocols across all teams",
        "Review resource allocation based on task distribution analysis",
        "Schedule regular product reviews with representatives from each team"
      ];
    }
    
    const teamData = teamMetrics[team];
    const recommendations = [];
    
    if (teamData.criticalTasks > 1) {
      recommendations.push(`Prioritize resolution of ${teamData.criticalTasks} critical issues currently assigned`);
    }
    
    if (teamData.averageImpact > 70) {
      recommendations.push("Implement additional quality checks before deployment to reduce high-impact issues");
    }
    
    if (teamData.averageRetentionRisk > 70) {
      recommendations.push("Focus on customer retention strategies by addressing key pain points");
    }
    
    if (teamData.openTasks > teamData.closedTasks * 2) {
      recommendations.push("Consider task redistribution or additional resources to address backlog");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Maintain current performance levels and continue regular quality checks");
    }
    
    return recommendations;
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const statusData = statusDistributionData(selectedTeam);
  const recommendations = generateRecommendations(selectedTeam);

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl text-center">
        <div className="text-red-600 text-xl mb-2">Error loading data</div>
        <div className="text-gray-700">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

 

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Team Performance Dashboard</h1>
        <div className="flex items-center space-x-4">
  <div className="text-sm text-gray-500">Select Team:</div>
  <select 
    value={selectedTeam}
    onChange={(e) => setSelectedTeam(e.target.value)}
    className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
  >
    <option value="All Teams">All Teams</option>
    {allTeams.map(team => (
      <option key={team} value={team}>{team}</option>
    ))}
  </select>

  <div className="text-sm text-gray-500">Select App:</div>
  <select 
    value={selectedApp}
    onChange={(e) => setSelectedApp(e.target.value)}
    className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
  >
    <option value="All Apps">All Apps</option>
    {allAppNames.map(app => (
      <option key={app} value={app}>{app}</option>
    ))}
  </select>

  <div className="text-sm text-gray-500">Select Platform:</div>
  <select 
    value={selectedPlatform}
    onChange={(e) => setSelectedPlatform(e.target.value)}
    className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
  >
    <option value="All Platforms">All Platforms</option>
    {allPlatforms.map(platform => (
      <option key={platform} value={platform}>{platform}</option>
    ))}
  </select>
</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700 mb-2">Tasks</h2>
          <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-blue-600">
  {selectedTeam === 'All Teams' 
    ? filteredFeedbackData.length 
    : (teamMetrics[selectedTeam]?.totalTasks || 0)}
</div>
<div className="text-xs text-gray-500">
  {selectedTeam === 'All Teams' 
    ? `Across ${allTeams.length} teams` 
    : `${teamMetrics[selectedTeam]?.openTasks || 0} open, ${teamMetrics[selectedTeam]?.closedTasks || 0} closed`}
</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700 mb-2">Avg. Impact Score</h2>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-orange-500">
              {selectedTeam === 'All Teams' 
                ? Math.round(Object.values(teamMetrics).reduce((sum, team) => sum + team.averageImpact, 0) / allTeams.length)
                : teamMetrics[selectedTeam]?.averageImpact || 0}%
            </div>
            <div className={`text-xs ${
              (selectedTeam === 'All Teams' 
                ? Math.round(Object.values(teamMetrics).reduce((sum, team) => sum + team.averageImpact, 0) / allTeams.length)
                : teamMetrics[selectedTeam]?.averageImpact || 0) > 70 
              ? 'text-red-500' : 'text-gray-500'}`}
            >
              {(selectedTeam === 'All Teams' 
                ? Math.round(Object.values(teamMetrics).reduce((sum, team) => sum + team.averageImpact, 0) / allTeams.length)
                : teamMetrics[selectedTeam]?.averageImpact || 0) > 70 
                ? 'High Impact Issues' : 'Moderate Impact'}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700 mb-2">Retention Risk</h2>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-red-500">
              {selectedTeam === 'All Teams' 
                ? Math.round(Object.values(teamMetrics).reduce((sum, team) => sum + team.averageRetentionRisk, 0) / allTeams.length)
                : teamMetrics[selectedTeam]?.averageRetentionRisk || 0}%
            </div>
            <div className={`text-xs ${
              (selectedTeam === 'All Teams' 
                ? Math.round(Object.values(teamMetrics).reduce((sum, team) => sum + team.averageRetentionRisk, 0) / allTeams.length)
                : teamMetrics[selectedTeam]?.averageRetentionRisk || 0) > 70 
              ? 'text-red-500' : 'text-gray-500'}`}
            >
              {(selectedTeam === 'All Teams' 
                ? Math.round(Object.values(teamMetrics).reduce((sum, team) => sum + team.averageRetentionRisk, 0) / allTeams.length)
                : teamMetrics[selectedTeam]?.averageRetentionRisk || 0) > 70 
                ? 'High Risk' : 'Moderate Risk'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Task Distribution By Team */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700 mb-4">Task Distribution By Team</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksPerTeamData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700 mb-4">Task Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Recommendations for {selectedTeam}</h2>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      


{/* AI Response Section with Pagination */}
<div className="bg-white p-4 rounded-lg shadow mt-6">
  <h2 className="font-semibold text-gray-700 mb-4">
    AI Suggested Resolutions for {selectedTeam}
  </h2>

  <div className="space-y-4">
    {feedbackData.length === 0 ? (
      <div className="text-gray-500 italic">
        No feedback data available.
      </div>
    ) : (
      feedbackData
        .filter(item =>
          selectedTeam === "All Teams" ||
          (item["Assigned Team"] &&
            item["Assigned Team"].includes(selectedTeam))
        )
        .filter(item => item["AI Suggested Resolution"])
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((item, index) => (
          <div key={index} className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">
              Feedback ID: {item.id}
            </div>
            <div className="text-gray-800">{item["AI Suggested Resolution"]}</div>
          </div>
        ))
    )}
  </div>

  {/* Pagination Controls */}
  {(() => {
    const filteredItems = feedbackData
      .filter(item =>
        selectedTeam === "All Teams" ||
        (item["Assigned Team"] &&
          item["Assigned Team"].includes(selectedTeam))
      )
      .filter(item => item["AI Suggested Resolution"]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    console.log("Total Pages:", totalPages, "Current Page:", currentPage);

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    );
  })()}
</div>

    </div>
  );
};

export default TeamPerformanceDashboard;