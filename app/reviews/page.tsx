"use client";
import { useEffect, useState } from "react";

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
export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]); // ✅ Store reviews as an array
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        console.log("🔹 API Response Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Reviews Data:", data);
        if (Array.isArray(data)) {
          setReviews(data); // ✅ Store array in state
        } else {
          setError("Invalid data format received.");
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching reviews:", err);
        setError("Failed to fetch reviews.");
      });
  }, []);

  return (
    <div>
      <h1>App Reviews</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <li key={index}>
              <strong>{review.Name}</strong> ({review.Rating}) - {review.Date}
              <br />
              <em>{review.Comment}</em>
            </li>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </ul>
    </div>
  );
}
