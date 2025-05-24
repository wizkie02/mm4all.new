// Import blog images
import blogImg1 from "../assets/blog-meditation-beginners.jpg";
import blogImg2 from "../assets/blog-breathing-techniques.jpg";
import blogImg3 from "../assets/blog-evening-rituals.jpg";
import blogImg4 from "../assets/blog-workplace-mindfulness.jpg";

// Placeholder images for other categories if needed, or reuse blog images
const guideImg1 = blogImg3; // Example: reusing blogImg3 for a guide
const guideImg2 = blogImg1; // Example: reusing blogImg1 for a guide
const guideImg3 = blogImg2; // Example: reusing blogImg2 for a guide

const researchImg1 = blogImg1; // Example: reusing blogImg1 for research
const researchImg2 = blogImg3; // Example: reusing blogImg3 for research

export const resources = {
  blogs: [
    {
      id: "blog-1",
      title: "Meditation for Beginners: How to Start Your Practice",
      category: "Beginners",
      date: "May 10, 2025",
      image: blogImg1,
      excerpt:
        "Starting a meditation practice can feel overwhelming. In this guide, we break down the basics into simple, manageable steps...",
      fullContent:
        'This is the full content for "Meditation for Beginners". It would contain detailed steps, tips, and common pitfalls to avoid. Meditation is a practice where an individual uses a technique – such as mindfulness, or focusing the mind on a particular object, thought, or activity – to train attention and awareness, and achieve a mentally clear and emotionally calm and stable state. Scholars have found meditation elusive to define, as practices vary both between traditions and within them.',
    },
    {
      id: "blog-2",
      title: "Creating an Evening Ritual for Better Sleep",
      category: "Sleep",
      date: "April 28, 2025",
      image: blogImg3,
      excerpt:
        "The way you spend your evening has a profound impact on your sleep quality. Discover how to create a calming ritual that prepares your body and mind...",
      fullContent:
        'Detailed guide on "Creating an Evening Ritual". This would cover aspects like limiting screen time, gentle stretching, reading, journaling, and creating a sleep-conducive environment. Consistent evening rituals signal to your body that it\'s time to wind down.',
    },
    {
      id: "blog-3",
      title: "Mindfulness at Work: Staying Focused in a Busy Environment",
      category: "Workplace",
      date: "April 15, 2025",
      image: blogImg4,
      excerpt:
        "Maintaining focus and calm amid workplace distractions is challenging. Learn practical mindfulness techniques designed for busy professionals...",
      fullContent:
        'Comprehensive advice on "Mindfulness at Work". This would include tips for mindful communication, managing emails, taking short mindfulness breaks, and dealing with workplace stress. Practicing mindfulness can improve productivity and job satisfaction.',
    },
  ],
  guides: [
    {
      id: "guide-1",
      title: "7-Day Mindfulness Challenge",
      category: "Practice",
      image: guideImg1,
      excerpt:
        "A step-by-step guide to building a consistent mindfulness practice in just one week.",
      fullContent:
        'This is the full content for the "7-Day Mindfulness Challenge". Each day would have a specific focus and exercises. For example, Day 1: Mindful Breathing, Day 2: Body Scan, etc. The guide would provide instructions and reflection prompts.',
    },
    {
      id: "guide-2",
      title: "The Complete Guide to Meditation Postures",
      category: "Techniques",
      image: guideImg2,
      excerpt:
        "Find the most comfortable and effective position for your meditation practice with this illustrated guide.",
      fullContent:
        'Full content for "Meditation Postures". This guide would illustrate various postures like sitting on a cushion, chair, or lying down, discussing the pros and cons of each and how to maintain comfort and alertness.',
    },
    // ... more guides with fullContent
  ],
  research: [
    {
      id: "research-1",
      title: "The Science Behind Mindfulness Meditation",
      category: "Neuroscience",
      date: "March 2025",
      image: researchImg1,
      excerpt:
        "A summary of recent scientific findings on how meditation affects the brain and nervous system.",
      fullContent:
        "This research paper delves into the neurological changes observed in individuals who regularly practice mindfulness meditation. It discusses studies on brain plasticity, emotional regulation, and attention control, citing various peer-reviewed journals.",
    },
    // ... more research articles with fullContent
  ],
};
