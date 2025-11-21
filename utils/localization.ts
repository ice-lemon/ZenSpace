import { Language } from '../types';

export const translations = {
  en: {
    appTitle: "ZenSpace",
    appDesc: "Transform your messy rooms into peaceful sanctuaries with AI-powered organization advice.",
    analyzeButton: "Analyze Room",
    chatButton: "Chat Assistant",
    homeButton: "Home",
    // Analyzer
    analyzerTitle: "Room Analysis",
    analyzerSubtitle: "Upload a photo of your space to get a personalized decluttering plan.",
    uploadText: "Click to upload a photo",
    uploadSubtext: "JPG, PNG supported",
    analyzing: "Analyzing Space...",
    generatePlan: "Generate Plan",
    roomType: "Room Type",
    clutterLevel: "Clutter Level",
    vibe: "Vibe",
    quickWins: "Quick Wins",
    longTerm: "Long-term Solutions",
    observations: "Observations",
    impact: "Impact",
    errorImage: "Please upload an image file.",
    errorAnalysis: "Failed to analyze image. Please try again.",
    // Chat
    chatTitle: "Organization Assistant",
    chatSubtitle: "Online • Powered by Gemini",
    chatPlaceholder: "Ask for advice...",
    welcomeMessage: "Hello! I'm your personal organization assistant. Ask me anything about decluttering, storage solutions, or how to maintain a tidy home.",
    connectionError: "Sorry, I'm having trouble connecting right now. Please try again.",
    // Common
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    high: "High",
    low: "Low"
  },
  zh: {
    appTitle: "禅空间 (ZenSpace)",
    appDesc: "利用 AI 驱动的整理建议，将凌乱的房间变成宁静的避风港。",
    analyzeButton: "分析房间",
    chatButton: "智能助手",
    homeButton: "首页",
    // Analyzer
    analyzerTitle: "房间分析",
    analyzerSubtitle: "上传房间照片，获取个性化的整理方案。",
    uploadText: "点击上传照片",
    uploadSubtext: "支持 JPG, PNG",
    analyzing: "正在分析空间...",
    generatePlan: "生成方案",
    roomType: "房间类型",
    clutterLevel: "杂乱程度",
    vibe: "氛围",
    quickWins: "速效建议",
    longTerm: "长期方案",
    observations: "观察结果",
    impact: "影响",
    errorImage: "请上传图片文件。",
    errorAnalysis: "分析失败，请重试。",
    // Chat
    chatTitle: "整理助手",
    chatSubtitle: "在线 • 由 Gemini 驱动",
    chatPlaceholder: "寻求建议...",
    welcomeMessage: "你好！我是你的个人整理助手。关于断舍离、收纳方案或如何保持家中整洁，尽管问我。",
    connectionError: "抱歉，连接出现问题，请重试。",
     // Common
    easy: "简单",
    medium: "中等",
    hard: "困难",
    high: "高",
    low: "低"
  }
};

export const getTranslation = (lang: Language) => translations[lang];