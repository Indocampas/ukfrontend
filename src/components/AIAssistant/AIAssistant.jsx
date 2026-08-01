// src/components/AIAssistant/AIAssistant.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiSend,
  FiX,
  FiBookOpen,
  FiAward,
  FiCalendar,
  FiMapPin,
  FiTarget,
  FiCheck,
  FiCpu,
  FiLoader,
  FiAlertCircle,
  FiVolume2,
  FiVolumeX,
  FiPause,
  FiPlay,
} from "react-icons/fi";
import { useFormModal } from "../../context/FormModalContext";
import { sendMessageToAI, getQuickResponse } from "../../services/aiService";
import tts from "../../services/ttsService";
import botImage from "../../assets/images/AIbot/bot.png";
import "./AIAssistant.css";

const NAVBAR_OFFSET = 78;
const GREETING_TEXT = "How can I help you?";
const GREETING_DELAY_MS = 1400;
const GREETING_VISIBLE_MS = 5000;

const QUICK_ACTIONS = [
  { id: "neet", label: "NEET Coaching", icon: FiBookOpen },
  { id: "jee", label: "JEE Coaching", icon: FiTarget },
  { id: "scholarship", label: "Scholarship Information", icon: FiAward },
  { id: "counselling", label: "Book Free Counselling", icon: FiCalendar },
  { id: "campus", label: "Campus Details", icon: FiMapPin },
];

// Sound Effects Engine
class SoundEffects {
  constructor() {
    this.enabled = true;
    this.volume = 0.3;
    this.initialized = false;
    this.audioContext = null;
    this.userInteracted = false;
  }

  enable() {
    this.userInteracted = true;
    this.init();
  }

  init() {
    if (this.initialized || !this.userInteracted) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  playTone(frequency, duration, type = 'sine', volume = this.volume) {
    if (!this.initialized || !this.enabled || !this.userInteracted) return;
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      // Silently fail
    }
  }

  playChatOpen() {
    this.playTone(523.25, 0.15, 'sine', 0.15);
    setTimeout(() => this.playTone(659.25, 0.2, 'sine', 0.12), 120);
  }

  playChatClose() {
    this.playTone(440, 0.15, 'sine', 0.12);
    setTimeout(() => this.playTone(349.23, 0.2, 'sine', 0.10), 100);
  }

  playSend() {
    this.playTone(880, 0.08, 'sine', 0.15);
    setTimeout(() => this.playTone(1046.5, 0.06, 'sine', 0.10), 60);
  }

  playReceive() {
    this.playTone(659.25, 0.1, 'sine', 0.12);
    setTimeout(() => this.playTone(783.99, 0.12, 'sine', 0.10), 100);
  }

  playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.15), i * 120);
    });
  }

  playHover() {
    this.playTone(440, 0.05, 'sine', 0.06);
  }

  playTypingStart() {
    this.playTone(600, 0.04, 'sine', 0.05);
  }

  playNotification() {
    this.playTone(880, 0.12, 'sine', 0.12);
    setTimeout(() => this.playTone(1108.73, 0.15, 'sine', 0.10), 150);
  }

  playQuickAction() {
    this.playTone(440, 0.06, 'sine', 0.10);
    setTimeout(() => this.playTone(554.37, 0.08, 'sine', 0.08), 50);
  }

  playJump() {
    this.playTone(392, 0.06, 'sine', 0.12);
    setTimeout(() => this.playTone(587.33, 0.1, 'sine', 0.14), 90);
    setTimeout(() => this.playTone(783.99, 0.12, 'sine', 0.1), 180);
  }
}

const sound = new SoundEffects();

// Bot 3D Component
function Bot3D({ variant = "launcher", state = "idle", tilt = { x: 0, y: 0 }, wave = false, jump = false }) {
  const [imgFailed, setImgFailed] = useState(false);
  const rotY = Math.max(-16, Math.min(16, tilt.x * 2.4));
  const rotX = Math.max(-12, Math.min(12, -tilt.y * 2.4));
  const showHand = wave || jump;

  return (
    <div className={`bot3d-stage bot3d-stage--${variant}`}>
      <div
        className={`bot3d bot3d--${variant} bot3d--${state} ${wave ? "bot3d--wave" : ""} ${jump ? "bot3d--jump" : ""}`}
        style={{ transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)` }}
      >
        <span className="bot3d-glow" />
        {variant === "launcher" && <span className="bot3d-shadow" />}
        {imgFailed ? (
          <span className="bot3d-fallback" aria-label="AI Assistant">
            <FiCpu />
          </span>
        ) : (
          <img
            src={botImage}
            alt="AI Assistant"
            className="bot3d-image"
            draggable="false"
            onError={() => setImgFailed(true)}
          />
        )}
        {showHand && (
          <span className="bot3d-wave-hand" role="img" aria-label="waving hand">
            👋
          </span>
        )}
        <span className="bot3d-shine" />
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "👋 Welcome to UK Academy! I'm here to help you with NEET & JEE coaching, scholarships, counselling and campus details. What would you like to know?" }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [botWave, setBotWave] = useState(false);
  const [botJump, setBotJump] = useState(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [ttsSupported, setTtsSupported] = useState(true);

  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const greetingHideTimer = useRef(null);
  const currentSpeakingText = useRef('');

  const navigate = useNavigate();
  const location = useLocation();
  const { openForm } = useFormModal();

  // Check if API key is configured
  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (apiKey && apiKey.length > 10) {
      setIsAIEnabled(true);
    } else {
      console.warn('OpenRouter API key not configured. AI will use fallback responses.');
    }
  }, []);

  // Check TTS support
  useEffect(() => {
    const supported = 'speechSynthesis' in window;
    setTtsSupported(supported);
    if (supported) {
      tts.init('en-US');
      
      // Set TTS callbacks
      tts.onStart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      tts.onEnd = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        currentSpeakingText.current = '';
      };
      tts.onPause = () => {
        setIsPaused(true);
      };
      tts.onResume = () => {
        setIsPaused(false);
      };
      tts.onError = (error) => {
        console.warn('TTS Error:', error);
        setIsSpeaking(false);
        setIsPaused(false);
      };
    }
  }, []);

  // Enable audio on any user interaction
  const enableAudio = useCallback(() => {
    sound.enable();
  }, []);

  useEffect(() => {
    const initSound = () => {
      sound.enable();
      document.removeEventListener('click', initSound);
      document.removeEventListener('touchstart', initSound);
    };
    document.addEventListener('click', initSound);
    document.addEventListener('touchstart', initSound);
    return () => {
      document.removeEventListener('click', initSound);
      document.removeEventListener('touchstart', initSound);
    };
  }, []);

  // Greeting bubble timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) return;
      setBotJump(true);
      setShowGreetingBubble(true);
      setShowBadge(true);
      if (soundEnabled) {
        sound.enable();
        sound.playJump();
      }
      setTimeout(() => setBotJump(false), 900);
      greetingHideTimer.current = setTimeout(() => {
        setShowGreetingBubble(false);
      }, GREETING_VISIBLE_MS);
    }, GREETING_DELAY_MS);

    return () => {
      clearTimeout(timer);
      if (greetingHideTimer.current) clearTimeout(greetingHideTimer.current);
    };
  }, [isOpen, soundEnabled]);

  // Notification pulse
  useEffect(() => {
    const delay = 9000 + Math.random() * 6000;
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowPulse(true);
        setShowBadge(true);
        if (soundEnabled) {
          sound.enable();
          sound.playNotification();
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [isOpen, soundEnabled]);

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 350);
    }
  }, [isOpen]);

  // Play receive sound on new bot message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'bot' && soundEnabled) {
      sound.enable();
      sound.playReceive();
      
      // Auto-speak the bot message
      if (ttsEnabled && ttsSupported) {
        speakMessage(lastMessage.text);
      }
    }
  }, [messages, soundEnabled, ttsEnabled, ttsSupported]);

  // Mouse tracking
  const handleMouseMove = useCallback((e) => {
    if (!launcherRef.current || isOpen) return;
    const rect = launcherRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width * 6;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height * 6;
    setMousePosition({ x, y });
  }, [isOpen]);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 });
  }, []);

  const handleLauncherHover = useCallback(() => {
    if (soundEnabled && !isOpen) {
      sound.enable();
      sound.playHover();
    }
  }, [soundEnabled, isOpen]);

  // TTS Functions
  const speakMessage = useCallback((text) => {
    if (!ttsSupported || !ttsEnabled) return;
    
    // Stop any current speech
    tts.stop();
    
    // Clean text for speech (remove emojis and markdown)
    const cleanText = text
      .replace(/[^\w\s.,!?()\-']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (cleanText.length > 0) {
      currentSpeakingText.current = cleanText;
      tts.speak(cleanText);
    }
  }, [ttsSupported, ttsEnabled]);

  const toggleTTS = useCallback(() => {
    enableAudio();
    const newState = !ttsEnabled;
    setTtsEnabled(newState);
    
    if (!newState) {
      // Stop speaking when disabled
      tts.stop();
      setIsSpeaking(false);
      setIsPaused(false);
    } else {
      // Speak the last bot message if any
      const lastBotMessage = [...messages].reverse().find(m => m.sender === 'bot');
      if (lastBotMessage) {
        speakMessage(lastBotMessage.text);
      }
    }
  }, [ttsEnabled, enableAudio, messages, speakMessage]);

  const togglePlayPause = useCallback(() => {
    if (!ttsSupported || !ttsEnabled) return;
    
    if (isSpeaking) {
      if (isPaused) {
        tts.resume();
        setIsPaused(false);
      } else {
        tts.pause();
        setIsPaused(true);
      }
    } else {
      // If not speaking, speak the last bot message
      const lastBotMessage = [...messages].reverse().find(m => m.sender === 'bot');
      if (lastBotMessage) {
        speakMessage(lastBotMessage.text);
      }
    }
  }, [isSpeaking, isPaused, ttsSupported, ttsEnabled, messages, speakMessage]);

  // Stop TTS on component unmount
  useEffect(() => {
    return () => {
      tts.stop();
    };
  }, []);

  // Scroll to section
  const goToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET + 1;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET + 1;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  // Toggle chat
  const handleToggle = useCallback(() => {
    enableAudio();
    sound.enable();

    setShowPulse(false);
    setShowBadge(false);
    setShowGreetingBubble(false);
    if (greetingHideTimer.current) clearTimeout(greetingHideTimer.current);

    if (isOpen) {
      if (soundEnabled) sound.playChatClose();
      tts.stop();
      setIsSpeaking(false);
      setIsPaused(false);
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 250);
    } else {
      if (soundEnabled) sound.playChatOpen();
      setIsOpen(true);
      setBotWave(true);
      setTimeout(() => setBotWave(false), 900);
      setAiError(null);
    }
  }, [isOpen, soundEnabled, enableAudio]);

  // Send message to AI
  const sendMessageToAIHandler = async (userMessage) => {
    setIsThinking(true);
    
    // Show typing indicator
    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);
      if (soundEnabled) sound.playTypingStart();
    }, 500);

    try {
      // Try to use AI if enabled
      if (isAIEnabled) {
        const response = await sendMessageToAI(userMessage, conversationHistory);
        
        setIsTyping(false);
        
        if (response.success) {
          // Add AI response
          const botMessage = { sender: "bot", text: response.message };
          setMessages((prev) => [...prev, botMessage]);
          // Update conversation history
          setConversationHistory((prev) => [
            ...prev,
            { role: "user", content: userMessage },
            { role: "assistant", content: response.message }
          ]);
        } else {
          // AI failed, use fallback
          const fallbackResponse = getFallbackResponse(userMessage);
          setMessages((prev) => [...prev, { sender: "bot", text: fallbackResponse }]);
          if (response.error === 'auth_error') {
            setAiError('AI service is not configured properly. Using basic responses.');
          }
        }
      } else {
        // Use fallback responses
        const fallbackResponse = getFallbackResponse(userMessage);
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "bot", text: fallbackResponse }]);
      }
    } catch (error) {
      console.error('Error in AI handler:', error);
      setIsTyping(false);
      const fallbackResponse = getFallbackResponse(userMessage);
      setMessages((prev) => [...prev, { sender: "bot", text: fallbackResponse }]);
    }
  };

  // Handle quick action
  const handleQuickAction = useCallback((action) => {
    enableAudio();
    sound.enable();
    if (soundEnabled) sound.playQuickAction();

    // Add user message
    const userMessage = { sender: "user", text: action.label };
    setMessages((prev) => [...prev, userMessage]);

    // Get quick response
    const quickResponse = getQuickResponse(action.id, action.label);
    
    if (quickResponse) {
      // Simulate thinking
      setIsThinking(true);
      if (soundEnabled) sound.playTypingStart();
      
      setTimeout(() => {
        setIsThinking(false);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const botMessage = { sender: "bot", text: quickResponse };
          setMessages((prev) => [...prev, botMessage]);
        }, 800);
      }, 600);
    } else {
      // Use AI or fallback
      sendMessageToAIHandler(action.label);
    }

    // Handle navigation
    switch (action.id) {
      case "neet":
      case "jee":
        setTimeout(() => navigate("/"), 800);
        break;
      case "scholarship":
        setTimeout(() => goToSection("scholarship"), 800);
        break;
      case "counselling":
        setTimeout(() => {
          openForm("Book Free Counselling");
          setTimeout(() => {
            showSuccessNotification("✓ Counselling booked successfully! Our team will contact you shortly.");
          }, 400);
        }, 800);
        break;
      case "campus":
        setTimeout(() => goToSection("contact"), 800);
        break;
      default:
        break;
    }
  }, [enableAudio, soundEnabled, navigate, openForm]);

  // Handle manual send
  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    enableAudio();
    sound.enable();
    if (soundEnabled) sound.playSend();

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInputValue("");

    // Check if it's a quick action
    const matchedAction = QUICK_ACTIONS.find(a => text.toLowerCase().includes(a.id));
    if (matchedAction) {
      handleQuickAction(matchedAction);
      return;
    }

    // Send to AI
    await sendMessageToAIHandler(text);
  }, [inputValue, soundEnabled, enableAudio, handleQuickAction]);

  // Fallback response
  const getFallbackResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('neet')) {
      return "UK Academy's NEET program offers comprehensive preparation with expert faculty, NCERT-focused learning, and regular mock tests. It's a 2-year program for Class 11-12 students and droppers. For more details contact us. Would you like to book a free counselling session to learn more?";
    } else if (lowerMsg.includes('jee')) {
      return "UK Academy's JEE program provides complete preparation for JEE Main & Advanced with concept building, daily practice, and doubt sessions. Duration: 1-2 years. Interested in joining?";
    } else if (lowerMsg.includes('scholarship') || lowerMsg.includes('test')) {
      return "UK Academy offers scholarship tests with up to 100% tuition waiver. Tiers: 95%+ = 100%, 90-94.9% = 75%, 80-89.9% = 50%, 70-79.9% = 25%. Register now for the next test!";
    } else if (lowerMsg.includes('counsel') || lowerMsg.includes('book') || lowerMsg.includes('help')) {
      return "Great! I can help you book a free counselling session. Our experts will guide you through course selection, career paths, and scholarship opportunities. Shall I open the booking form for you?";
    } else if (lowerMsg.includes('campus') || lowerMsg.includes('address') || lowerMsg.includes('location')) {
      return "UK Academy is at 696/5, NSP Towers, Hosur-Bagalur Main Road, Ngo Colony, Hosur - 635109. We're open Mon-Sat 8:30 AM - 8:30 PM. You can call us at +91 9944316004 for directions.";
    } else if (lowerMsg.includes('faculty') || lowerMsg.includes('teacher') || lowerMsg.includes('training')) {
      return "UK Academy offers various Faculty Certification Programs including Nursery Teacher Training, Primary Teacher Training, PG Diploma in Montessori, STEAM Trainer, and Abacus Teacher Training. All programs are 3 months with a fee of ₹30,000. Which program interests you?";
    } else {
      return "Thank you for reaching out! I'm here to help you with information about UK Academy's courses, admissions, scholarships, and faculty programs. Could you tell me what you're specifically looking for? I can help with NEET, JEE, Foundation courses, or our teacher training programs.";
    }
  };

  // Show success notification
  const showSuccessNotification = (message) => {
    if (soundEnabled) {
      sound.enable();
      sound.playSuccess();
    }
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const toggleSound = useCallback(() => {
    enableAudio();
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      sound.enable();
      sound.playNotification();
    }
  }, [soundEnabled, enableAudio]);

  // Render particles
  const renderParticles = () => {
    const colors = ['#e8b430', '#4a90e2', '#4CAF50'];
    const particles = [];
    for (let i = 0; i < 10; i++) {
      particles.push(
        <div
          key={i}
          className="ai-particle"
          style={{
            width: 3 + Math.random() * 5 + 'px',
            height: 3 + Math.random() * 5 + 'px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 8 + 's',
            animationDuration: 6 + Math.random() * 4 + 's',
          }}
        />
      );
    }
    return particles;
  };

  // Render confetti
  const renderConfetti = () => {
    const colors = ['#e8b430', '#4CAF50', '#2196F3', '#FF5722', '#9C27B0', '#FF6B6B', '#4ECDC4', '#FFD93D'];
    const pieces = [];
    for (let i = 0; i < 50; i++) {
      pieces.push(
        <div
          key={i}
          className="ai-confetti-piece"
          style={{
            left: Math.random() * 100 + '%',
            top: '-5%',
            width: 5 + Math.random() * 7 + 'px',
            height: 4 + Math.random() * 5 + 'px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: Math.random() * 1.5 + 's',
            animationDuration: 4 + Math.random() * 2 + 's',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      );
    }
    return pieces;
  };

  const botState = isThinking ? "thinking" : isTyping ? "talking" : "idle";

  // Handle greeting bubble click
  const handleGreetingClick = useCallback(() => {
    enableAudio();
    handleToggle();
  }, [enableAudio, handleToggle]);

  return (
    <div className="ai-assistant-root">
      {showSuccess && (
        <div className="ai-success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="ai-success-card" onClick={(e) => e.stopPropagation()}>
            <div className="ai-success-check">
              <FiCheck />
            </div>
            <h3 className="ai-success-title">Success!</h3>
            <p className="ai-success-message">{successMessage}</p>
          </div>
          <div className="ai-success-container">
            {renderConfetti()}
          </div>
        </div>
      )}

      {isOpen && (
        <div className={`ai-chat-window ${isClosing ? 'closing' : ''}`} role="dialog">
          <div className="ai-particles">
            {renderParticles()}
          </div>

          <div className="ai-chat-header">
            <div className="ai-chat-header-title">
              <span className="ai-chat-avatar">
                <Bot3D variant="header" state={botState} wave={botWave} />
              </span>
              <span>UK Academy AI</span>
              {isAIEnabled && (
                <span className="ai-status-dot online" title="AI powered by OpenRouter">
                  <span className="ai-status-dot-inner"></span>
                </span>
              )}
            </div>
            <div className="ai-header-actions">
              {/* TTS Controls */}
              {ttsSupported && (
                <>
                  <button
                    className={`ai-tts-toggle ${ttsEnabled ? 'active' : ''}`}
                    onClick={toggleTTS}
                    title={ttsEnabled ? "Voice On" : "Voice Off"}
                  >
                    {ttsEnabled ? <FiVolume2 /> : <FiVolumeX />}
                  </button>
                  {ttsEnabled && (
                    <button
                      className={`ai-tts-playpause ${isSpeaking ? 'active' : ''}`}
                      onClick={togglePlayPause}
                      title={isPaused ? "Resume" : isSpeaking ? "Pause" : "Speak"}
                    >
                      {isPaused ? <FiPlay /> : isSpeaking ? <FiPause /> : <FiVolume2 />}
                    </button>
                  )}
                </>
              )}
              {aiError && (
                <span className="ai-error-indicator" title={aiError}>
                  <FiAlertCircle />
                </span>
              )}
              <button
                className="ai-sound-toggle"
                onClick={toggleSound}
                title={soundEnabled ? "Sound On" : "Sound Off"}
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
              <button
                className="ai-chat-close"
                onClick={handleToggle}
                aria-label="Close chat"
              >
                <FiX />
              </button>
            </div>
          </div>

          <div className="ai-chat-body" ref={bodyRef}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`ai-chat-bubble ${msg.sender === "user" ? "ai-bubble-user" : "ai-bubble-bot"}`}
              >
                {msg.text}
                {msg.sender === "bot" && ttsEnabled && (
                  <button
                    className="ai-speak-btn"
                    onClick={() => speakMessage(msg.text)}
                    title="Speak this message"
                  >
                    <FiVolume2 size={12} />
                  </button>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="ai-thinking">
                <span className="ai-thinking-emoji">🤖</span>
                <div className="ai-thinking-orbits">
                  <span className="ai-thinking-orbit"></span>
                  <span className="ai-thinking-orbit"></span>
                  <span className="ai-thinking-orbit"></span>
                </div>
              </div>
            )}

            {isTyping && (
              <div className="ai-typing-indicator">
                <span className="ai-typing-dot"></span>
                <span className="ai-typing-dot"></span>
                <span className="ai-typing-dot"></span>
              </div>
            )}

            <div className="ai-quick-actions">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className="ai-quick-action-btn"
                    onClick={() => handleQuickAction(action)}
                  >
                    <Icon />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form className="ai-chat-input-row" onSubmit={handleSend}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-label="Type your question"
            />
            <button type="submit" aria-label="Send message" disabled={!inputValue.trim()}>
              <FiSend />
            </button>
          </form>
        </div>
      )}

      {!isOpen && showGreetingBubble && (
        <div
          className="ai-greeting-bubble"
          onClick={handleGreetingClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleGreetingClick(); }}
          role="button"
          tabIndex={0}
        >
          {GREETING_TEXT}
          <span className="ai-greeting-bubble-tail" />
        </div>
      )}

      <button
        ref={launcherRef}
        className={`ai-launcher-btn ${isOpen ? "ai-launcher-open" : ""} ${mousePosition.x !== 0 ? "magnetic" : ""}`}
        onClick={handleToggle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleLauncherHover}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        style={{
          transform: isOpen
            ? 'none'
            : `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      >
        {showPulse && !isOpen && <span className="ai-pulse-ring" />}
        {showBadge && !isOpen && <span className="ai-notification-badge">1</span>}
        <span className="ai-launcher-orb">
          {isOpen ? (
            <FiX className="ai-launcher-close-icon" />
          ) : (
            <Bot3D variant="launcher" state="idle" tilt={mousePosition} jump={botJump} />
          )}
        </span>
      </button>
    </div>
  );
}