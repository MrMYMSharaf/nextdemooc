"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

const getRandomColor = () => {
  const colors = [
    "#ff0080", "#7928ca", "#0070f3", "#00bfff", "#00f5a0", 
    "#ff4d4d", "#f9cb28", "#ff9966", "#a5f3fc", "#c084fc",
    "#fda4af", "#d8b4fe", "#7dd3fc", "#5eead4", "#fef08a"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

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

interface WordCloudOptions {
  list?: [string, number][]; // List of words and their weights
  gridSize?: number; // Size of the grid in pixels
  weightFactor?: number | ((size: number) => number); // Scaling factor for word weights
  fontFamily?: string; // Font family to use
  color?: string | ((word: string, weight: number | string) => string); // Color of the words
  backgroundColor?: string; // Background color of the canvas
  rotateRatio?: number; // Probability of rotating a word
  rotationSteps?: number; // Number of rotation steps
  shape?: 'circle' | 'cardioid' | 'diamond' | 'square' | 'triangle-forward' | 'triangle' | 'pentagon' | 'star'; // Shape of the word cloud
  ellipticity?: number; // Degree of flatness of the shape
  classes?: (word: string) => string; // CSS classes for words
  hover?: (item: [string, number], dimension: DOMRect, event: MouseEvent) => void; // Hover callback
  click?: (item: [string, number]) => void; // Click callback
  shrinkToFit?: boolean; // Whether to shrink words to fit
  drawOutOfBound?: boolean; // Whether to draw words outside the canvas
  minSize?: number; // Minimum font size for words
}

type WordCloudType = (element: HTMLCanvasElement, options: WordCloudOptions) => void;

const WordCloudComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [WordCloud, setWordCloud] = useState<WordCloudType | null>(null);
  const [words, setWords] = useState<[string, number][]>([]);
  const [tooltip, setTooltip] = useState({ text: "", visible: false, x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWord, setActiveWord] = useState<string | null>(null);

  useEffect(() => {
    const fetchKeywords = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Review[] = await response.json();

        if (data && Array.isArray(data)) {
          const keywordList: string[] = data
            .map((review: Review) => review["Keywords Extraction"]?.split(",").map((word: string) => word.trim()))
            .flat()
            .filter((word): word is string => !!word);

          const keywordFrequency: Record<string, number> = {};
          keywordList.forEach((word) => {
            keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
          });

          const extractedKeywords: [string, number][] = Object.entries(keywordFrequency).map(
            ([word, count]) => [word, count * 10 + 20]
          );

          setWords(extractedKeywords);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching keywords:", error);
        setError("Failed to load keywords. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("wordcloud").then((wc) => {
        setWordCloud(() => wc.default);
      });
    }
  }, []);

  useEffect(() => {
    if (WordCloud && canvasRef.current && words.length > 0 && containerRef.current) {
      const updateCanvasSize = () => {
        if (canvasRef.current && containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          canvasRef.current.width = containerWidth > 800 ? 800 : containerWidth - 40;
          canvasRef.current.height = canvasRef.current.width * 0.7;
        }
      };
  
      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);
  
      // Use the WordCloudOptions type here
      WordCloud(canvasRef.current, {
        list: words,
        gridSize: 12,
        weightFactor: (size: number) => size * 2.2,
        fontFamily: "'Poppins', 'Montserrat', sans-serif",
        color: getRandomColor,
        backgroundColor: "transparent",
        rotateRatio: 0.4,
        rotationSteps: 8,
        shape: 'circle',
        ellipticity: 1.2,
        classes: (text: string) => 'word-' + text,
        shrinkToFit: true,
        drawOutOfBound: false,
        minSize: 14,
        hover: (item: [string, number], dimension: DOMRect, event: MouseEvent) => {
          if (item) {
            setActiveWord(item[0]);
            setTooltip((prevTooltip) => ({
              ...prevTooltip,
              text: `${item[0]} (${item[1]})`,
              visible: true,
              x: event.clientX,
              y: event.clientY - 3,
            }));
          } else {
            setActiveWord(null);
            setTooltip((prevTooltip) => ({ ...prevTooltip, visible: false }));
          }
        },
        click: (item: [string, number]) => {
          if (item) {
            console.log(`Clicked on: ${item[0]}`);
            const clickSound = new Audio('/sounds/click.mp3');
            clickSound.volume = 0.3;
            clickSound.play().catch((e) => console.log('Audio play failed:', e));
          }
        },
      });
  
      return () => {
        window.removeEventListener('resize', updateCanvasSize);
      };
    }
  }, [WordCloud, words]);

  const backgroundVariants: Variants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop'
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl max-w-4xl mx-auto relative overflow-hidden"
      style={{ 
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1), 0 10px 30px rgba(0, 0, 0, 0.1), inset 0 1px 3px rgba(255, 255, 255, 0.3)" 
      }}
    >
      <motion.div 
        className="absolute inset-0 z-0 bg-gradient-to-br from-amber-200 via-pink-200 to-purple-200" 
        variants={backgroundVariants}
        animate="animate"
        style={{ backgroundSize: "200% 200%" }}
      />
      <div className="absolute inset-0 z-0 bg-white/30 backdrop-blur-sm rounded-3xl border border-white/40" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 h-32 w-32 bg-pink-400/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-blue-400/20 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 left-1/3 h-24 w-24 bg-yellow-400/20 rounded-full filter blur-3xl" />
      </div>
      <div className="w-full text-center mb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-4xl font-extrabold mb-3 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
              Trending Keywords
            </span>
            <motion.span 
              className="absolute -top-6 -right-6 text-4xl"
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            >
              🔥
            </motion.span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full mb-3" />
          <p className="text-gray-700 max-w-md mx-auto text-lg">
            Discover what our customers are raving about
          </p>
        </motion.div>
      </div>
      {isLoading ? (
        <motion.div 
          className="flex flex-col items-center justify-center h-64 w-full relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 relative">
            <div className="absolute w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute w-16 h-16 border-4 border-transparent border-l-pink-500 rounded-full animate-spin animation-delay-300"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Gathering trending insights...</p>
        </motion.div>
      ) : error ? (
        <motion.div 
          className="text-red-500 p-6 bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-200 shadow-lg relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button 
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-300"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="relative w-full h-full z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${activeWord ? 'shadow-lg ring-2 ring-purple-300/50' : ''}`}>
            <canvas 
              ref={canvasRef} 
              className="cursor-pointer max-w-full mx-auto"
            ></canvas>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-pink-500/5 to-purple-500/5"></div>
          </div>
          {tooltip.visible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bg-gray-900/90 backdrop-blur-md text-white text-sm px-4 py-2 rounded-lg shadow-xl border border-gray-700/50 z-20"
              style={{ top: tooltip.y, left: tooltip.x }}
            >
              <div className="font-semibold">{tooltip.text}</div>
            </motion.div>
          )}
        </motion.div>
      )}
      <motion.div 
        className="mt-6 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/40 text-sm text-gray-600 shadow-sm relative z-10 flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Click on any keyword to explore related customer reviews</span>
      </motion.div>
    </motion.div>
  );
};

export default WordCloudComponent;