// pages/Results/AllResults.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiAward } from "react-icons/fi";
import "./AllResults.css";

// Same storage key as in Results.jsx
const RESULTS_STORAGE_KEY = 'allResultsData';

// Get results from sessionStorage
const getResultsFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(RESULTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading results from sessionStorage:', error);
  }
  return null;
};

// Color mapping for different rank ranges
const getRankColors = (rank) => {
  const num = parseInt(rank);
  if (num <= 50) {
    return {
      bg: '#0a1330',
      accent: '#e8b430',
      text: '#ffffff',
      badgeBg: '#e8b430',
      badgeText: '#0a1330'
    };
  }
  if (num <= 100) {
    return {
      bg: '#1a2a1a',
      accent: '#4CAF50',
      text: '#ffffff',
      badgeBg: '#4CAF50',
      badgeText: '#ffffff'
    };
  }
  if (num <= 200) {
    return {
      bg: '#0a1a3a',
      accent: '#2196F3',
      text: '#ffffff',
      badgeBg: '#2196F3',
      badgeText: '#ffffff'
    };
  }
  if (num <= 500) {
    return {
      bg: '#2a0a3a',
      accent: '#9C27B0',
      text: '#ffffff',
      badgeBg: '#9C27B0',
      badgeText: '#ffffff'
    };
  }
  if (num <= 1000) {
    return {
      bg: '#3a1a0a',
      accent: '#FF5722',
      text: '#ffffff',
      badgeBg: '#FF5722',
      badgeText: '#ffffff'
    };
  }
  return {
    bg: '#1a1a2e',
    accent: '#8e97b0',
    text: '#ffffff',
    badgeBg: '#8e97b0',
    badgeText: '#ffffff'
  };
};

const getMedalEmoji = (rank) => {
  const num = parseInt(rank);
  if (num <= 50) return "🥇";
  if (num <= 200) return "🥈";
  if (num <= 500) return "🥉";
  return "⭐";
};

const AllResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allResults, setAllResults] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setIsVisible(true);
    
    let results = [];
    
    if (location.state?.allResults && location.state.allResults.length > 0) {
      results = location.state.allResults;
      try {
        sessionStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }
    } 
    else {
      const stored = getResultsFromStorage();
      if (stored && stored.length > 0) {
        results = stored;
      } 
      else {
        results = [];
      }
    }
    
    setAllResults(results);
    
  }, [location]);

  const handleBack = () => {
    navigate("/");
    setTimeout(() => {
      const resultsSection = document.getElementById('results');
      if (resultsSection) {
        const navbarHeight = 78;
        const y = resultsSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="all-results-page">
      <div className="sticky-back-button">
        <button className="back-button" onClick={handleBack}>
          <FiArrowLeft /> Back to Results
        </button>
      </div>

      <div className="all-results-container">
        <div className={`all-results-header ${isVisible ? "animate-in" : ""}`}>
          <div className="header-icon">
            <FiAward />
          </div>
          <h1 className="page-title">All Results</h1>
          <p className="page-subtitle">
            Celebrating the success of our brilliant students
          </p>
        </div>

        <div className={`results-grid ${isVisible ? "animate-in" : ""}`} style={{ animationDelay: "0.2s" }}>
          {allResults && allResults.length > 0 ? (
            allResults.map((result, index) => {
              const colors = getRankColors(result.rank);
              const isHovered = hoveredCard === index;
              
              return (
                <div
                  key={`${result.rank}-${result.name}-${index}`}
                  className={`result-card ${isHovered ? 'hovered' : ''}`}
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    backgroundColor: isHovered ? colors.bg : '#ffffff',
                    borderColor: isHovered ? colors.accent : 'rgba(231, 233, 242, 0.6)',
                    boxShadow: isHovered 
                      ? `0 8px 30px rgba(0, 0, 0, 0.15), 0 0 20px ${colors.accent}22`
                      : '0 2px 10px rgba(0, 0, 0, 0.06)',
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div 
                    className="result-rank-badge"
                    style={{ 
                      backgroundColor: isHovered ? colors.accent : colors.badgeBg,
                      color: isHovered ? colors.badgeText : colors.badgeText,
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    <span className="medal-emoji">{getMedalEmoji(result.rank)}</span>
                    <span className="rank-number">#{result.rank}</span>
                  </div>
                  
                  <div className="result-details">
                    <h3 className="result-name" style={{ 
                      color: isHovered ? colors.text : '#0a1330'
                    }}>
                      {result.name}
                    </h3>
                    <p className="result-college" style={{ 
                      color: isHovered ? colors.text + 'cc' : '#5a6488'
                    }}>
                      {result.college}
                    </p>
                    <div className="result-meta">
                      <span className="result-exam" style={{ 
                        backgroundColor: isHovered ? colors.accent + '33' : '#f0f2f7',
                        color: isHovered ? colors.text : '#8e97b0',
                        border: isHovered ? `1px solid ${colors.accent}44` : '1px solid transparent',
                      }}>
                        {result.exam}
                      </span>
                      <span className="result-year" style={{ 
                        backgroundColor: isHovered ? colors.accent + '33' : '#f0f2f7',
                        color: isHovered ? colors.text : '#8e97b0',
                        border: isHovered ? `1px solid ${colors.accent}44` : '1px solid transparent',
                      }}>
                        {result.year}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-glow" style={{
                    background: `radial-gradient(circle, ${colors.accent}15, transparent 70%)`,
                    opacity: isHovered ? 1 : 0,
                  }}></div>
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <p>No results found. Please go back and try again.</p>
              <button className="back-button" onClick={handleBack} style={{ marginTop: '20px' }}>
                <FiArrowLeft /> Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllResults;