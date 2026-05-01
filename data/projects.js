window.PORTFOLIO_DATA = window.PORTFOLIO_DATA || {};

window.PORTFOLIO_DATA.projects = [
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    subtitle: "Responsive Personal Portfolio",
    category: "web-frontend",
    categoryLabel: "Web / Frontend",
    description: "A responsive personal portfolio with polished sections, animated interactions, certificates, project archives, and a clean developer brand system.",
    features: [
      "Responsive single-page layout with smooth section navigation",
      "Dynamic skills, projects, and certificate data rendering",
      "Accessible navigation, contact, and project archive flows",
      "Animated reveal states and mobile-friendly hamburger menu"
    ],
    techStack: ["HTML", "CSS", "JavaScript", "Responsive UI", "Accessibility"],
    github: "https://github.com/debugHARSH/portfolio.git",
    liveDemo: null,
    gradient: "linear-gradient(135deg, #38BDF8 0%, #2563EB 48%, #F97316 100%)"
  },
  {
    id: "brainmatch-game",
    title: "Brainmatch Game",
    subtitle: "SwiftUI Memory Game",
    category: "mobile-ios",
    categoryLabel: "Mobile / iOS",
    description: "A SwiftUI memory game where players match card pairs through a clean mobile-first interface and lightweight game logic.",
    features: [
      "Card matching game loop with simple state management",
      "SwiftUI-based mobile interface",
      "Replayable memory challenge interaction",
      "Public source code for learning and iteration"
    ],
    techStack: ["SwiftUI", "iOS", "Game Logic", "Mobile UI"],
    github: "https://github.com/debugHARSH/brainmatch-game.git",
    liveDemo: null,
    gradient: "linear-gradient(135deg, #F97316 0%, #EC4899 48%, #6366F1 100%)"
  },
  {
    id: "intelligent-mob-surveillance-system",
    title: "Intelligent Mob Surveillance System",
    subtitle: "AI + Blockchain CCTV Security Platform",
    category: "ai-blockchain-computer-vision",
    categoryLabel: "AI / Blockchain / Computer Vision",
    description: "An AI-powered CCTV surveillance platform that automatically detects suspicious mob activity and criminal behaviour in real-time using computer vision, then stores tamper-proof digital evidence on the Ethereum blockchain.",
    features: [
      "Real-time CCTV monitoring with YOLOv8 object detection",
      "Suspicious activity triggers automatic video clip extraction",
      "AES-256 encryption of all captured evidence",
      "SHA-256 hash generation + Ethereum blockchain logging for immutability",
      "Tamper-proof evidence verification dashboard",
      "JWT-secured FastAPI backend with MongoDB event logging",
      "MediaPipe integration for posture & gesture analysis"
    ],
    techStack: ["Python", "FastAPI", "YOLOv8", "OpenCV", "MediaPipe", "MongoDB", "JWT", "React", "Solidity", "Ethereum", "Web3.py", "AES-256"],
    github: "https://github.com/harshpandeyz/Intelligent-Mob-Surveillance-System",
    liveDemo: null,
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #7C3AED 48%, #F97316 100%)"
  },
  {
    id: "skillmatch-course-recommendation-engine",
    title: "SkillMatch — Course Recommendation Engine",
    subtitle: "Personalized Learning Path Generator",
    category: "backend-api-database",
    categoryLabel: "Backend / API / Database",
    description: "A backend recommendation engine that delivers personalized course suggestions based on user behaviour tracking, built with a normalized relational schema, JWT-secured REST APIs, and query-optimized MySQL database.",
    features: [
      "Personalized course recommendations based on user interaction history",
      "Normalized relational schema for users, courses, and interaction tracking",
      "JWT-authenticated REST API endpoints",
      "Query performance optimized via indexed table design",
      "Scalable Express.js middleware architecture"
    ],
    techStack: ["Node.js", "Express.js", "MySQL", "REST APIs", "JWT", "Postman"],
    github: "https://github.com/harshpandeyz/SkillMatch",
    liveDemo: null,
    gradient: "linear-gradient(135deg, #22C55E 0%, #0EA5E9 54%, #312E81 100%)"
  }
];
