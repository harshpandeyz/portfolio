window.PORTFOLIO_DATA = window.PORTFOLIO_DATA || {};

window.PORTFOLIO_DATA.projects = [
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
    demo: {
      label: "Requires Hardware Setup",
      url: "",
      disabled: true,
      tooltip: "Requires Hardware Setup"
    },
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #7C3AED 48%, #F97316 100%)"
  },
  {
    id: "skillmatch-course-recommendation-engine",
    title: "SkillMatch - Course Recommendation Engine",
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
    demo: {
      label: "Backend API project",
      url: "",
      disabled: true,
      tooltip: "API Project"
    },
    gradient: "linear-gradient(135deg, #22C55E 0%, #0EA5E9 54%, #312E81 100%)"
  }
];
