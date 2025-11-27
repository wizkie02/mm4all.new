// Resources data for the MM4All website - Enhanced for Admin Dashboard
export const categories = {
  "meditation-basics": {
    id: "meditation-basics",
    name: "Meditation Basics",
    description: "Fundamental meditation techniques and principles",
    color: "#7B68EE",
    icon: "meditation",
    order: 1
  },
  "mindfulness-practices": {
    id: "mindfulness-practices", 
    name: "Mindfulness Practices",
    description: "Daily mindfulness exercises and awareness techniques",
    color: "#9370DB",
    icon: "mindful",
    order: 2
  },
  "stress-management": {
    id: "stress-management",
    name: "Stress Management", 
    description: "Techniques for reducing and managing stress",
    color: "#20B2AA",
    icon: "stress-relief",
    order: 3
  },
  "sleep-relaxation": {
    id: "sleep-relaxation",
    name: "Sleep & Relaxation",
    description: "Resources for better sleep and deep relaxation",
    color: "#4682B4",
    icon: "sleep",
    order: 4
  },
  "focus-concentration": {
    id: "focus-concentration",
    name: "Focus & Concentration",
    description: "Improve mental clarity and concentration skills",
    color: "#FF6347",
    icon: "focus",
    order: 5
  },
  "emotional-wellness": {
    id: "emotional-wellness",
    name: "Emotional Wellness",
    description: "Building emotional resilience and well-being",
    color: "#32CD32",
    icon: "heart",
    order: 6
  },
  "spiritual-growth": {
    id: "spiritual-growth",
    name: "Spiritual Growth",
    description: "Deepening spiritual practice and inner development",
    color: "#9932CC",
    icon: "spiritual",
    order: 7
  }
};
export const tags = [
  "beginner", "intermediate", "advanced", "quick-start", "daily-practice",
  "breathing", "body-scan", "walking-meditation", "visualization", 
  "anxiety", "depression", "sleep-issues", "workplace", "relationships",
  "research-backed", "guided", "self-guided", "audio", "video", "pdf"
];
export const contentTypes = {
  "blog": "Blog Article",
  "guide": "Free Guide", 
  "research": "Research Paper",
  "video": "Video Tutorial",
  "audio": "Audio Meditation",
  "course": "Online Course",
  "worksheet": "Worksheet",
  "checklist": "Checklist"
};
export const difficultyLevels = {
  "beginner": { name: "Beginner", color: "#4CAF50", order: 1 },
  "intermediate": { name: "Intermediate", color: "#FF9800", order: 2 },
  "advanced": { name: "Advanced", color: "#F44336", order: 3 }
};
export const publishingStates = {
  "draft": { name: "Draft", color: "#9E9E9E" },
  "review": { name: "Under Review", color: "#FF9800" },
  "scheduled": { name: "Scheduled", color: "#2196F3" },
  "published": { name: "Published", color: "#4CAF50" },
  "archived": { name: "Archived", color: "#795548" }
};
export const resources = {
  blogs: [
    {
      id: "mindfulness-beginners-guide",
      title: "Mindfulness for Beginners: A Complete Guide",
      slug: "mindfulness-beginners-complete-guide",
      category: "mindfulness-practices",
      subcategory: null,
      excerpt: "Learn the fundamentals of mindfulness practice and how to incorporate it into your daily life with simple, effective techniques.",
      content: "Full article content would go here...",
      // Publishing & Admin
      status: "published",
      publishedAt: "2024-12-15T10:00:00Z",
      createdAt: "2024-12-10T14:30:00Z",
      updatedAt: "2024-12-15T09:45:00Z",
      authorId: "admin-1",
      author: "Sarah Johnson",
      // SEO & Metadata
      seo: {
        metaTitle: "Mindfulness for Beginners: Complete Guide | MM4All",
        metaDescription: "Discover mindfulness fundamentals with our comprehensive beginner's guide. Learn practical techniques to reduce stress and improve well-being.",
        keywords: ["mindfulness", "meditation", "beginners", "stress relief", "well-being"],
        slug: "mindfulness-beginners-complete-guide",
        canonicalUrl: "/resources/blogs/mindfulness-beginners-complete-guide",
        ogImage: "/src/assets/blog-meditation-beginners.jpg"
      },
      // Content Details
      readTime: "8 min read",
      difficulty: "beginner",
      tags: ["beginner", "mindfulness", "daily-practice", "stress-relief"],
      media: {
        featuredImage: "/src/assets/blog-meditation-beginners.jpg",
        gallery: [],
        audio: null,
        video: null
      },
      // Analytics & Engagement
      analytics: {
        views: 1247,
        likes: 89,
        shares: 23,
        comments: 12,
        avgRating: 4.7,
        completionRate: 0.85
      },
      // Content Structure
      sections: [
        { id: "intro", title: "Introduction to Mindfulness", order: 1 },
        { id: "benefits", title: "Benefits of Regular Practice", order: 2 },
        { id: "techniques", title: "Essential Techniques", order: 3 },
        { id: "getting-started", title: "Getting Started Today", order: 4 }
      ],
      relatedResources: ["breathing-techniques-stress", "meditation-starter-pack"],
      downloadableFiles: []
    },
    {
      id: "breathing-techniques-stress",
      title: "5 Breathing Techniques to Reduce Stress Instantly",
      slug: "5-breathing-techniques-reduce-stress-instantly",
      category: "stress-management",
      subcategory: null,
      excerpt: "Discover powerful breathing exercises that can help you manage stress and anxiety in just a few minutes.",
      content: "Full article content would go here...",
      status: "published",
      publishedAt: "2024-12-10T15:30:00Z",
      createdAt: "2024-12-08T11:20:00Z",
      updatedAt: "2024-12-10T15:25:00Z",
      authorId: "admin-2",
      author: "Dr. Michael Chen",
      seo: {
        metaTitle: "5 Breathing Techniques to Reduce Stress Instantly | MM4All",
        metaDescription: "Learn 5 powerful breathing exercises to instantly reduce stress and anxiety. Evidence-based techniques you can use anywhere.",
        keywords: ["breathing techniques", "stress relief", "anxiety", "instant calm", "relaxation"],
        slug: "5-breathing-techniques-reduce-stress-instantly",
        canonicalUrl: "/resources/blogs/5-breathing-techniques-reduce-stress-instantly",
        ogImage: "/src/assets/blog-breathing-techniques.jpg"
      },
      readTime: "6 min read",
      difficulty: "beginner",
      tags: ["breathing", "stress-relief", "anxiety", "quick-start", "workplace"],
      media: {
        featuredImage: "/src/assets/blog-breathing-techniques.jpg",
        gallery: [],
        audio: "/audio/breathing-guide.mp3",
        video: null
      },
      analytics: {
        views: 892,
        likes: 156,
        shares: 67,
        comments: 34,
        avgRating: 4.9,
        completionRate: 0.92
      },
      sections: [
        { id: "overview", title: "Why Breathing Matters", order: 1 },
        { id: "technique-1", title: "4-7-8 Breathing", order: 2 },
        { id: "technique-2", title: "Box Breathing", order: 3 },
        { id: "technique-3", title: "Belly Breathing", order: 4 },
        { id: "technique-4", title: "Alternate Nostril", order: 5 },
        { id: "technique-5", title: "Coherent Breathing", order: 6 }
      ],
      relatedResources: ["mindfulness-beginners-guide", "stress-relief-toolkit"],
      downloadableFiles: [
        {
          title: "Breathing Techniques Reference Card",
          url: "/downloads/breathing-reference.pdf",
          size: "1.2 MB",
          type: "PDF"
        }
      ]
    },
    {
      id: "evening-meditation-routine",
      title: "Creating the Perfect Evening Meditation Routine",
      slug: "creating-perfect-evening-meditation-routine",
      category: "sleep-relaxation",
      subcategory: null,
      excerpt: "Establish a calming evening practice that prepares your mind and body for restful sleep.",
      content: "Full article content would go here...",
      status: "published",
      publishedAt: "2024-12-05T18:00:00Z",
      createdAt: "2024-12-01T10:15:00Z",
      updatedAt: "2024-12-05T17:45:00Z",
      authorId: "admin-1",
      author: "Sarah Johnson",
      seo: {
        metaTitle: "Perfect Evening Meditation Routine for Better Sleep | MM4All",
        metaDescription: "Create an evening meditation routine that promotes deep relaxation and restful sleep. Step-by-step guide included.",
        keywords: ["evening meditation", "sleep routine", "bedtime relaxation", "insomnia help", "better sleep"],
        slug: "creating-perfect-evening-meditation-routine",
        canonicalUrl: "/resources/blogs/creating-perfect-evening-meditation-routine",
        ogImage: "/src/assets/blog-evening-rituals.jpg"
      },
      readTime: "7 min read",
      difficulty: "intermediate",
      tags: ["sleep", "evening-routine", "relaxation", "guided", "daily-practice"],
      media: {
        featuredImage: "/src/assets/blog-evening-rituals.jpg",
        gallery: ["/assets/evening-setup1.jpg", "/assets/evening-setup2.jpg"],
        audio: "/audio/evening-meditation.mp3",
        video: "/video/evening-routine-demo.mp4"
      },
      analytics: {
        views: 678,
        likes: 45,
        shares: 18,
        comments: 8,
        avgRating: 4.6,
        completionRate: 0.78
      },
      sections: [
        { id: "benefits", title: "Benefits of Evening Practice", order: 1 },
        { id: "setup", title: "Creating Your Space", order: 2 },
        { id: "routine", title: "Step-by-Step Routine", order: 3 },
        { id: "troubleshooting", title: "Common Challenges", order: 4 }
      ],
      relatedResources: ["sleep-meditation-guide", "mindfulness-beginners-guide"],
      downloadableFiles: [
        {
          title: "Evening Routine Checklist",
          url: "/downloads/evening-checklist.pdf",
          size: "800 KB",
          type: "PDF"
        }
      ]
    },
    {
      id: "workplace-mindfulness",
      title: "Bringing Mindfulness to Your Workplace",
      slug: "bringing-mindfulness-to-your-workplace",
      category: "focus-concentration",
      subcategory: null,
      excerpt: "Simple mindfulness practices you can do at work to reduce stress and improve focus throughout your day.",
      content: "Full article content would go here...",
      status: "published",
      publishedAt: "2024-11-28T09:00:00Z",
      createdAt: "2024-11-25T13:20:00Z",
      updatedAt: "2024-11-28T08:45:00Z",
      authorId: "admin-3",
      author: "Dr. Lisa Park",
      seo: {
        metaTitle: "Workplace Mindfulness: Reduce Stress & Boost Focus | MM4All",
        metaDescription: "Discover practical mindfulness techniques for the workplace. Reduce stress, improve focus, and boost productivity with simple exercises.",
        keywords: ["workplace mindfulness", "office meditation", "work stress", "productivity", "focus"],
        slug: "bringing-mindfulness-to-your-workplace",
        canonicalUrl: "/resources/blogs/bringing-mindfulness-to-your-workplace",
        ogImage: "/src/assets/blog-workplace-mindfulness.jpg"
      },
      readTime: "5 min read",
      difficulty: "beginner",
      tags: ["workplace", "stress-relief", "focus", "productivity", "quick-start"],
      media: {
        featuredImage: "/src/assets/blog-workplace-mindfulness.jpg",
        gallery: [],
        audio: null,
        video: null
      },
      analytics: {
        views: 1123,
        likes: 78,
        shares: 34,
        comments: 19,
        avgRating: 4.5,
        completionRate: 0.89
      },
      sections: [
        { id: "introduction", title: "Mindfulness at Work", order: 1 },
        { id: "desk-exercises", title: "Desk-Based Practices", order: 2 },
        { id: "meeting-mindfulness", title: "Mindful Meetings", order: 3 },
        { id: "stress-busters", title: "Quick Stress Relief", order: 4 }
      ],
      relatedResources: ["breathing-techniques-stress", "stress-relief-toolkit"],
      downloadableFiles: [
        {
          title: "Workplace Mindfulness Quick Reference",
          url: "/downloads/workplace-mindfulness.pdf",
          size: "1.5 MB",
          type: "PDF"
        }
      ]
    }
  ],
  guides: [
    {
      id: "meditation-starter-pack",
      title: "Meditation Starter Pack",
      slug: "meditation-starter-pack-free-download",
      category: "meditation-basics",
      subcategory: null,
      excerpt: "A comprehensive 20-page guide with meditation basics, techniques, and a 7-day practice plan for beginners.",
      content: "Complete beginner's guide to meditation with step-by-step instructions...",
      status: "published",
      publishedAt: "2024-11-20T12:00:00Z",
      createdAt: "2024-11-15T09:30:00Z",
      updatedAt: "2024-11-20T11:45:00Z",
      authorId: "admin-1",
      author: "Sarah Johnson",
      seo: {
        metaTitle: "Free Meditation Starter Pack - Complete Beginner's Guide | MM4All",
        metaDescription: "Download our free 20-page meditation starter pack with techniques, practice plans, and beginner-friendly guidance.",
        keywords: ["free meditation guide", "beginner meditation", "meditation starter pack", "how to meditate"],
        slug: "meditation-starter-pack-free-download",
        canonicalUrl: "/resources/guides/meditation-starter-pack-free-download",
        ogImage: "/src/assets/about-journey.jpg"
      },
      difficulty: "beginner",
      tags: ["beginner", "meditation", "free-download", "guided", "pdf"],
      media: {
        featuredImage: "/src/assets/about-journey.jpg",
        gallery: ["/assets/guide-preview1.jpg", "/assets/guide-preview2.jpg"],
        audio: "/audio/meditation-intro.mp3",
        video: null
      },
      // Guide-specific fields
      downloadUrl: "/downloads/meditation-starter-pack.pdf",
      fileSize: "2.5 MB",
      pages: "20 pages",
      format: "PDF",
      language: "English",
      analytics: {
        views: 2341,
        downloads: 1876,
        likes: 234,
        shares: 89,
        comments: 45,
        avgRating: 4.8,
        completionRate: 0.95
      },
      sections: [
        { id: "introduction", title: "What is Meditation?", order: 1 },
        { id: "benefits", title: "Science-Backed Benefits", order: 2 },
        { id: "techniques", title: "5 Essential Techniques", order: 3 },
        { id: "practice-plan", title: "7-Day Starter Plan", order: 4 },
        { id: "troubleshooting", title: "Common Questions", order: 5 }
      ],
      relatedResources: ["mindfulness-beginners-guide", "breathing-techniques-stress"],
      downloadableFiles: [
        {
          title: "Meditation Starter Pack (PDF)",
          url: "/downloads/meditation-starter-pack.pdf",
          size: "2.5 MB",
          type: "PDF"
        },
        {
          title: "Practice Log Template",
          url: "/downloads/practice-log.pdf",
          size: "500 KB",
          type: "PDF"
        },
        {
          title: "Quick Reference Card",
          url: "/downloads/meditation-reference.pdf",
          size: "300 KB",
          type: "PDF"
        }
      ]
    },
    {
      id: "stress-relief-toolkit",
      title: "Stress Relief Toolkit",
      slug: "stress-relief-toolkit-free-guide",
      category: "stress-management",
      subcategory: null,
      excerpt: "Essential tools and techniques for managing stress, including breathing exercises, quick meditations, and mindfulness practices.",
      content: "Comprehensive stress management strategies and techniques...",
      status: "published",
      publishedAt: "2024-11-10T14:00:00Z",
      createdAt: "2024-11-05T10:45:00Z",
      updatedAt: "2024-11-10T13:30:00Z",
      authorId: "admin-2",
      author: "Dr. Michael Chen",
      seo: {
        metaTitle: "Free Stress Relief Toolkit - Manage Stress Effectively | MM4All",
        metaDescription: "Download our free stress relief toolkit with proven techniques for managing stress, anxiety, and overwhelm.",
        keywords: ["stress relief", "stress management", "anxiety help", "free toolkit", "relaxation techniques"],
        slug: "stress-relief-toolkit-free-guide",
        canonicalUrl: "/resources/guides/stress-relief-toolkit-free-guide",
        ogImage: "/src/assets/about-purpose.jpg"
      },
      difficulty: "beginner",
      tags: ["stress-relief", "anxiety", "toolkit", "free-download", "workplace", "pdf"],
      media: {
        featuredImage: "/src/assets/about-purpose.jpg",
        gallery: [],
        audio: "/audio/stress-relief-meditation.mp3",
        video: "/video/stress-relief-techniques.mp4"
      },
      downloadUrl: "/downloads/stress-relief-toolkit.pdf",
      fileSize: "1.8 MB",
      pages: "15 pages",
      format: "PDF",
      language: "English",
      analytics: {
        views: 1789,
        downloads: 1456,
        likes: 167,
        shares: 78,
        comments: 32,
        avgRating: 4.7,
        completionRate: 0.91
      },
      sections: [
        { id: "understanding-stress", title: "Understanding Stress", order: 1 },
        { id: "breathing-techniques", title: "Breathing Techniques", order: 2 },
        { id: "quick-fixes", title: "5-Minute Stress Busters", order: 3 },
        { id: "long-term", title: "Long-term Strategies", order: 4 },
        { id: "emergency-kit", title: "Emergency Stress Kit", order: 5 }
      ],
      relatedResources: ["breathing-techniques-stress", "workplace-mindfulness"],
      downloadableFiles: [
        {
          title: "Stress Relief Toolkit (PDF)",
          url: "/downloads/stress-relief-toolkit.pdf",
          size: "1.8 MB",
          type: "PDF"
        },
        {
          title: "Stress Assessment Worksheet",
          url: "/downloads/stress-assessment.pdf",
          size: "400 KB",
          type: "PDF"
        }
      ]
    },
    {
      id: "sleep-meditation-guide",
      title: "Better Sleep Through Meditation",
      slug: "better-sleep-meditation-guide",
      category: "sleep-relaxation",
      subcategory: null,
      excerpt: "Learn how to use meditation and relaxation techniques to improve your sleep quality and establish healthy bedtime routines.",
      content: "Complete guide to using meditation for better sleep...",
      status: "published",
      publishedAt: "2024-10-25T16:00:00Z",
      createdAt: "2024-10-20T11:20:00Z",
      updatedAt: "2024-10-25T15:45:00Z",
      authorId: "admin-1",
      author: "Sarah Johnson",
      seo: {
        metaTitle: "Better Sleep Through Meditation - Free Guide | MM4All",
        metaDescription: "Improve your sleep quality with meditation. Free 25-page guide with techniques, routines, and expert tips for better rest.",
        keywords: ["sleep meditation", "insomnia help", "better sleep", "bedtime routine", "sleep problems"],
        slug: "better-sleep-meditation-guide",
        canonicalUrl: "/resources/guides/better-sleep-meditation-guide",
        ogImage: "/src/assets/sleepImg1.png"
      },
      difficulty: "intermediate",
      tags: ["sleep", "meditation", "insomnia", "relaxation", "bedtime", "pdf"],
      media: {
        featuredImage: "/src/assets/sleepImg1.png",
        gallery: ["/assets/sleep-setup.jpg", "/assets/bedroom-meditation.jpg"],
        audio: "/audio/sleep-meditation-30min.mp3",
        video: "/video/sleep-preparation.mp4"
      },
      downloadUrl: "/downloads/sleep-meditation-guide.pdf",
      fileSize: "3.2 MB",
      pages: "25 pages",
      format: "PDF",
      language: "English",
      analytics: {
        views: 1456,
        downloads: 1234,
        likes: 198,
        shares: 56,
        comments: 67,
        avgRating: 4.9,
        completionRate: 0.88
      },
      sections: [
        { id: "sleep-science", title: "Science of Sleep", order: 1 },
        { id: "meditation-sleep", title: "Meditation for Sleep", order: 2 },
        { id: "bedtime-routine", title: "Creating Your Routine", order: 3 },
        { id: "techniques", title: "Sleep Meditation Techniques", order: 4 },
        { id: "troubleshooting", title: "Common Sleep Issues", order: 5 },
        { id: "resources", title: "Additional Resources", order: 6 }
      ],
      relatedResources: ["evening-meditation-routine", "stress-relief-toolkit"],
      downloadableFiles: [
        {
          title: "Better Sleep Guide (PDF)",
          url: "/downloads/sleep-meditation-guide.pdf",
          size: "3.2 MB",
          type: "PDF"
        },
        {
          title: "Sleep Journal Template",
          url: "/downloads/sleep-journal.pdf",
          size: "600 KB",
          type: "PDF"
        },
        {
          title: "Bedtime Routine Checklist",
          url: "/downloads/bedtime-checklist.pdf",
          size: "400 KB",
          type: "PDF"
        }
      ]
    }
  ],
  research: [
    {
      id: "meditation-brain-study",
      title: "The Effects of Meditation on Brain Structure and Function",
      slug: "meditation-brain-structure-function-study",
      category: "meditation-basics",
      subcategory: "neuroscience",
      excerpt: "Recent neuroimaging studies show how regular meditation practice can physically change brain structure and improve cognitive function.",
      content: "Comprehensive review of neuroscientific research on meditation...",
      status: "published",
      publishedAt: "2024-11-15T08:00:00Z",
      createdAt: "2024-11-10T14:15:00Z",
      updatedAt: "2024-11-15T07:45:00Z",
      authorId: "researcher-1",
      author: "Dr. Sarah Chen, Dr. Michael Roberts",
      seo: {
        metaTitle: "Meditation's Effects on Brain Structure - Latest Research | MM4All",
        metaDescription: "Discover how meditation physically changes your brain. Latest neuroscience research on meditation's impact on brain structure and function.",
        keywords: ["meditation research", "brain changes", "neuroscience", "neuroplasticity", "meditation benefits"],
        slug: "meditation-brain-structure-function-study",
        canonicalUrl: "/resources/research/meditation-brain-structure-function-study",
        ogImage: "/src/assets/hero-background.jpg"
      },
      difficulty: "advanced",
      tags: ["research-backed", "neuroscience", "brain-health", "scientific-study", "advanced"],
      media: {
        featuredImage: "/src/assets/hero-background.jpg",
        gallery: ["/assets/brain-scan1.jpg", "/assets/brain-scan2.jpg"],
        audio: null,
        video: "/video/brain-meditation-explanation.mp4"
      },
      // Research-specific fields
      source: "Journal of Cognitive Neuroscience",
      authors: "Dr. Sarah Chen, Dr. Michael Roberts",
      publishedJournal: "Journal of Cognitive Neuroscience, Vol. 35, Issue 8",
      doi: "10.1162/jocn_a_01987",
      studyType: "Meta-analysis",
      sampleSize: "1,247 participants across 15 studies",
      studyDuration: "3-year longitudinal study",
      peerReviewed: true,
      analytics: {
        views: 892,
        citations: 45,
        likes: 67,
        shares: 28,
        comments: 15,
        avgRating: 4.8,
        completionRate: 0.72
      },
      sections: [
        { id: "abstract", title: "Abstract", order: 1 },
        { id: "introduction", title: "Introduction", order: 2 },
        { id: "methodology", title: "Methodology", order: 3 },
        { id: "results", title: "Key Findings", order: 4 },
        { id: "discussion", title: "Discussion", order: 5 },
        { id: "implications", title: "Clinical Implications", order: 6 },
        { id: "conclusion", title: "Conclusion", order: 7 },
        { id: "references", title: "References", order: 8 }
      ],
      relatedResources: ["mindfulness-beginners-guide", "meditation-starter-pack"],
      downloadableFiles: [
        {
          title: "Full Research Paper (PDF)",
          url: "/downloads/meditation-brain-study.pdf",
          size: "4.2 MB",
          type: "PDF"
        },
        {
          title: "Research Summary",
          url: "/downloads/brain-study-summary.pdf",
          size: "1.1 MB",
          type: "PDF"
        }
      ]
    },
    {
      id: "mindfulness-anxiety-research",
      title: "Mindfulness-Based Interventions for Anxiety Disorders",
      slug: "mindfulness-anxiety-disorders-research",
      category: "emotional-wellness",
      subcategory: "anxiety-treatment",
      excerpt: "Meta-analysis of 25 studies examining the effectiveness of mindfulness-based therapies in treating various anxiety disorders.",
      content: "Systematic review of mindfulness interventions for anxiety...",
      status: "published",
      publishedAt: "2024-10-22T10:30:00Z",
      createdAt: "2024-10-18T09:15:00Z",
      updatedAt: "2024-10-22T10:15:00Z",
      authorId: "researcher-2",
      author: "Dr. Jennifer Martinez, Dr. David Kim",
      seo: {
        metaTitle: "Mindfulness for Anxiety Disorders - Research Evidence | MM4All",
        metaDescription: "Meta-analysis of 25 studies shows mindfulness-based interventions effectively treat anxiety disorders. Evidence-based research review.",
        keywords: ["mindfulness anxiety", "anxiety treatment", "clinical research", "therapy effectiveness", "mental health"],
        slug: "mindfulness-anxiety-disorders-research",
        canonicalUrl: "/resources/research/mindfulness-anxiety-disorders-research",
        ogImage: "/src/assets/waveImg.jpg"
      },
      difficulty: "advanced",
      tags: ["research-backed", "anxiety", "clinical-study", "mental-health", "therapy"],
      media: {
        featuredImage: "/src/assets/waveImg.jpg",
        gallery: [],
        audio: null,
        video: null
      },
      source: "Clinical Psychology Review",
      authors: "Dr. Jennifer Martinez, Dr. David Kim",
      publishedJournal: "Clinical Psychology Review, Vol. 89, Article 102067",
      doi: "10.1016/j.cpr.2024.102067",
      studyType: "Systematic Review & Meta-analysis",
      sampleSize: "3,456 participants across 25 RCTs",
      studyDuration: "Studies spanning 2010-2024",
      peerReviewed: true,
      analytics: {
        views: 1123,
        citations: 78,
        likes: 89,
        shares: 34,
        comments: 23,
        avgRating: 4.9,
        completionRate: 0.68
      },
      sections: [
        { id: "abstract", title: "Abstract", order: 1 },
        { id: "background", title: "Background", order: 2 },
        { id: "methodology", title: "Review Methodology", order: 3 },
        { id: "study-selection", title: "Study Selection", order: 4 },
        { id: "results", title: "Meta-analysis Results", order: 5 },
        { id: "subgroup-analysis", title: "Subgroup Analysis", order: 6 },
        { id: "limitations", title: "Limitations", order: 7 },
        { id: "conclusions", title: "Clinical Conclusions", order: 8 }
      ],
      relatedResources: ["breathing-techniques-stress", "stress-relief-toolkit"],
      downloadableFiles: [
        {
          title: "Complete Meta-analysis (PDF)",
          url: "/downloads/mindfulness-anxiety-meta-analysis.pdf",
          size: "6.8 MB",
          type: "PDF"
        },
        {
          title: "Clinical Practice Guidelines",
          url: "/downloads/anxiety-treatment-guidelines.pdf",
          size: "2.3 MB",
          type: "PDF"
        }
      ]
    },
    {
      id: "workplace-meditation-productivity",
      title: "Workplace Meditation Programs and Employee Productivity",
      slug: "workplace-meditation-productivity-study",
      category: "focus-concentration",
      subcategory: "workplace-wellness",
      excerpt: "Longitudinal study tracking the impact of corporate mindfulness programs on employee well-being and performance metrics.",
      content: "Comprehensive analysis of workplace meditation program effectiveness...",
      status: "published",
      publishedAt: "2024-09-18T13:45:00Z",
      createdAt: "2024-09-15T08:30:00Z",
      updatedAt: "2024-09-18T13:30:00Z",
      authorId: "researcher-3",
      author: "Dr. Lisa Thompson, Dr. Robert Anderson",
      seo: {
        metaTitle: "Workplace Meditation Boosts Productivity - Research Study | MM4All",
        metaDescription: "Longitudinal study shows workplace meditation programs significantly improve employee productivity and well-being. Corporate wellness research.",
        keywords: ["workplace meditation", "employee productivity", "corporate wellness", "business benefits", "workplace stress"],
        slug: "workplace-meditation-productivity-study",
        canonicalUrl: "/resources/research/workplace-meditation-productivity-study",
        ogImage: "/src/assets/cafeImg.jpg"
      },
      difficulty: "intermediate",
      tags: ["workplace", "productivity", "corporate-wellness", "research-backed", "business"],
      media: {
        featuredImage: "/src/assets/cafeImg.jpg",
        gallery: ["/assets/office-meditation1.jpg", "/assets/workplace-wellness.jpg"],
        audio: null,
        video: "/video/workplace-meditation-case-study.mp4"
      },
      source: "Occupational Health Psychology",
      authors: "Dr. Lisa Thompson, Dr. Robert Anderson",
      publishedJournal: "Journal of Occupational Health Psychology, Vol. 29, No. 4",
      doi: "10.1037/ocp0000389",
      studyType: "Longitudinal Cohort Study",
      sampleSize: "2,847 employees across 15 companies",
      studyDuration: "18-month longitudinal study",
      peerReviewed: true,
      analytics: {
        views: 756,
        citations: 23,
        likes: 45,
        shares: 67,
        comments: 12,
        avgRating: 4.6,
        completionRate: 0.81
      },
      sections: [
        { id: "executive-summary", title: "Executive Summary", order: 1 },
        { id: "introduction", title: "Introduction", order: 2 },
        { id: "study-design", title: "Study Design", order: 3 },
        { id: "participants", title: "Participants & Methods", order: 4 },
        { id: "interventions", title: "Meditation Interventions", order: 5 },
        { id: "results", title: "Results & Metrics", order: 6 },
        { id: "roi-analysis", title: "ROI Analysis", order: 7 },
        { id: "recommendations", title: "Implementation Recommendations", order: 8 }
      ],
      relatedResources: ["workplace-mindfulness", "stress-relief-toolkit"],
      downloadableFiles: [
        {
          title: "Full Research Report (PDF)",
          url: "/downloads/workplace-meditation-study.pdf",
          size: "5.4 MB",
          type: "PDF"
        },
        {
          title: "Implementation Guide for Companies",
          url: "/downloads/workplace-implementation-guide.pdf",
          size: "3.1 MB",
          type: "PDF"
        },
        {
          title: "ROI Calculator Spreadsheet",
          url: "/downloads/meditation-roi-calculator.xlsx",
          size: "1.2 MB",
          type: "Excel"
        }
      ]
    }
  ]
};
// Admin Dashboard Helper Functions
export const getResourceById = (category, id) => {
  return resources[category]?.find(resource => resource.id === id);
};
export const getAllResources = () => {
  return Object.values(resources).flat();
};
export const searchResources = (query, category = null) => {
  const searchIn = category ? resources[category] : getAllResources();
  const lowerQuery = query.toLowerCase();
  return searchIn.filter(resource => 
    resource.title.toLowerCase().includes(lowerQuery) ||
    resource.category.toLowerCase().includes(lowerQuery) ||
    resource.excerpt.toLowerCase().includes(lowerQuery) ||
    resource.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    resource.author?.toLowerCase().includes(lowerQuery)
  );
};
export const filterResourcesByStatus = (status) => {
  return getAllResources().filter(resource => resource.status === status);
};
export const filterResourcesByCategory = (categoryId) => {
  return getAllResources().filter(resource => resource.category === categoryId);
};
export const filterResourcesByTags = (tags) => {
  return getAllResources().filter(resource => 
    tags.every(tag => resource.tags?.includes(tag))
  );
};
export const getResourceAnalytics = (resourceId) => {
  const resource = getAllResources().find(r => r.id === resourceId);
  return resource?.analytics || null;
};
export const getTopPerformingResources = (limit = 10) => {
  return getAllResources()
    .sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0))
    .slice(0, limit);
};
export const getResourcesByAuthor = (authorId) => {
  return getAllResources().filter(resource => resource.authorId === authorId);
};
export const getScheduledResources = () => {
  return getAllResources().filter(resource => resource.status === 'scheduled');
};
export const getDraftResources = () => {
  return getAllResources().filter(resource => resource.status === 'draft');
};
export const getResourcesAwaitingReview = () => {
  return getAllResources().filter(resource => resource.status === 'review');
};
// SEO Helper Functions
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
export const validateSEO = (resource) => {
  const issues = [];
  if (!resource.seo?.metaTitle || resource.seo.metaTitle.length < 30) {
    issues.push('Meta title too short (min 30 characters)');
  }
  if (resource.seo?.metaTitle && resource.seo.metaTitle.length > 60) {
    issues.push('Meta title too long (max 60 characters)');
  }
  if (!resource.seo?.metaDescription || resource.seo.metaDescription.length < 120) {
    issues.push('Meta description too short (min 120 characters)');
  }
  if (resource.seo?.metaDescription && resource.seo.metaDescription.length > 160) {
    issues.push('Meta description too long (max 160 characters)');
  }
  if (!resource.seo?.keywords || resource.seo.keywords.length < 3) {
    issues.push('Need at least 3 keywords');
  }
  return {
    score: Math.max(0, 100 - (issues.length * 20)),
    issues
  };
};
// Content Analytics Functions
export const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};
export const getPopularTags = (limit = 10) => {
  const tagCounts = {};
  getAllResources().forEach(resource => {
    resource.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
};
export const getCategoryStats = () => {
  const stats = {};
  Object.keys(categories).forEach(categoryId => {
    const categoryResources = filterResourcesByCategory(categoryId);
    stats[categoryId] = {
      total: categoryResources.length,
      published: categoryResources.filter(r => r.status === 'published').length,
      draft: categoryResources.filter(r => r.status === 'draft').length,
      totalViews: categoryResources.reduce((sum, r) => sum + (r.analytics?.views || 0), 0)
    };
  });
  return stats;
};
// Publishing Workflow Functions
export const updateResourceStatus = (resourceId, newStatus) => {
  // This would typically make an API call to update the resource
  return { success: true, message: `Resource status updated to ${newStatus}` };
};
export const scheduleResource = (resourceId, publishDate) => {
  // This would typically make an API call to schedule the resource
  return { success: true, message: `Resource scheduled for ${publishDate}` };
};
export const bulkUpdateResources = (resourceIds, updates) => {
  // This would typically make an API call for bulk updates
  return { success: true, message: `${resourceIds.length} resources updated successfully` };
};
// User Management (for admin features)
export const authors = {
  "admin-1": {
    id: "admin-1",
    name: "Sarah Johnson",
    email: "sarah@mm4all.com",
    role: "Content Manager",
    avatar: "/avatars/sarah.jpg",
    bio: "Sarah is a certified mindfulness instructor with over 10 years of experience...",
    specialties: ["mindfulness", "meditation", "sleep"]
  },
  "admin-2": {
    id: "admin-2", 
    name: "Dr. Michael Chen",
    email: "michael@mm4all.com",
    role: "Clinical Contributor",
    avatar: "/avatars/michael.jpg",
    bio: "Dr. Chen is a licensed psychologist specializing in stress management...",
    specialties: ["stress-management", "anxiety", "clinical-research"]
  },
  "admin-3": {
    id: "admin-3",
    name: "Dr. Lisa Park",
    email: "lisa@mm4all.com", 
    role: "Workplace Wellness Expert",
    avatar: "/avatars/lisa.jpg",
    bio: "Dr. Park helps organizations implement mindfulness programs...",
    specialties: ["workplace-wellness", "productivity", "focus"]
  },
  "researcher-1": {
    id: "researcher-1",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    role: "Research Contributor",
    avatar: "/avatars/chen.jpg",
    bio: "Neuroscientist studying meditation's effects on brain structure...",
    specialties: ["neuroscience", "brain-research", "meditation"]
  }
};
export const getAuthorById = (authorId) => {
  return authors[authorId] || null;
};
