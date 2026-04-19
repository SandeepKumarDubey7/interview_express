
export interface StudyResource {
  id: string;
  category: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'book';
  link: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export const studyResources: StudyResource[] = [
  // DSA Resources
  {
    id: "ds-algo-1",
    category: "Data Structures & Algorithms",
    title: "Introduction to Algorithms",
    description: "Comprehensive guide to algorithms with practical examples",
    type: "course",
    link: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/",
    difficulty: "intermediate",
    tags: ["algorithms", "data structures", "computer science"]
  },
  {
    id: "ds-algo-2",
    category: "Data Structures & Algorithms",
    title: "Master the Coding Interview: Data Structures + Algorithms",
    description: "Step by step guide to ace the coding interview",
    type: "course",
    link: "https://www.udemy.com/course/master-the-coding-interview-data-structures-algorithms/",
    difficulty: "intermediate",
    tags: ["interview preparation", "coding challenges", "problem solving"]
  },
  {
    id: "ds-algo-3",
    category: "Data Structures & Algorithms",
    title: "Grokking Algorithms",
    description: "An illustrated guide for programmers and other curious people",
    type: "book",
    link: "https://www.manning.com/books/grokking-algorithms",
    difficulty: "beginner",
    tags: ["algorithms", "explained simply", "visual learning"]
  },
  
  // Frontend Development
  {
    id: "frontend-1",
    category: "Frontend Development",
    title: "Complete React Developer in 2023",
    description: "Learn to build complete React applications from scratch",
    type: "course",
    link: "https://www.udemy.com/course/complete-react-developer-zero-to-mastery/",
    difficulty: "intermediate",
    tags: ["React", "JavaScript", "web development"]
  },
  {
    id: "frontend-2",
    category: "Frontend Development",
    title: "Frontend Masters",
    description: "Expert-led workshops on frontend development technologies",
    type: "course",
    link: "https://frontendmasters.com/",
    difficulty: "advanced",
    tags: ["JavaScript", "CSS", "HTML", "web development"]
  },
  {
    id: "frontend-3",
    category: "Frontend Development",
    title: "CSS Tricks",
    description: "Tricks and techniques for frontend development",
    type: "article",
    link: "https://css-tricks.com/",
    difficulty: "intermediate",
    tags: ["CSS", "HTML", "web design"]
  },
  
  // Backend Development
  {
    id: "backend-1",
    category: "Backend Development",
    title: "Node.js: The Complete Guide",
    description: "Master Node.js with practical projects",
    type: "course",
    link: "https://www.udemy.com/course/nodejs-the-complete-guide/",
    difficulty: "intermediate",
    tags: ["Node.js", "JavaScript", "server-side programming"]
  },
  {
    id: "backend-2",
    category: "Backend Development",
    title: "Spring & Hibernate for Beginners",
    description: "Learn Spring 5 Core, AOP, Spring MVC, Spring Security, and more",
    type: "course",
    link: "https://www.udemy.com/course/spring-hibernate-tutorial/",
    difficulty: "intermediate",
    tags: ["Java", "Spring", "Hibernate", "enterprise applications"]
  },
  {
    id: "backend-3",
    category: "Backend Development",
    title: "Django for Beginners",
    description: "Build websites with Python & Django",
    type: "book",
    link: "https://djangoforbeginners.com/",
    difficulty: "beginner",
    tags: ["Python", "Django", "web development"]
  },
  
  // System Design
  {
    id: "sysdes-1",
    category: "System Design",
    title: "System Design Interview",
    description: "An insider's guide to system design interviews",
    type: "book",
    link: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF/",
    difficulty: "advanced",
    tags: ["system design", "architecture", "scalability"]
  },
  {
    id: "sysdes-2",
    category: "System Design",
    title: "Grokking the System Design Interview",
    description: "Learn how to design large-scale distributed systems",
    type: "course",
    link: "https://www.educative.io/courses/grokking-the-system-design-interview",
    difficulty: "advanced",
    tags: ["system design", "interview preparation", "distributed systems"]
  },
  {
    id: "sysdes-3",
    category: "System Design",
    title: "System Design Primer",
    description: "Learn how to design large-scale systems",
    type: "article",
    link: "https://github.com/donnemartin/system-design-primer",
    difficulty: "intermediate",
    tags: ["system design", "scalability", "architecture"]
  },
  
  // Interview Preparation
  {
    id: "interview-1",
    category: "Interview Preparation",
    title: "Cracking the Coding Interview",
    description: "189 programming questions and solutions",
    type: "book",
    link: "https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850",
    difficulty: "intermediate",
    tags: ["interview preparation", "algorithms", "problem solving"]
  },
  {
    id: "interview-2",
    category: "Interview Preparation",
    title: "Tech Interview Handbook",
    description: "Materials to help you rock your next coding interview",
    type: "article",
    link: "https://techinterviewhandbook.org/",
    difficulty: "intermediate",
    tags: ["interview preparation", "algorithms", "behavioral interview"]
  },
  {
    id: "interview-3",
    category: "Interview Preparation",
    title: "The Complete JavaScript Course 2023",
    description: "Master JavaScript with the most comprehensive course",
    type: "course",
    link: "https://www.udemy.com/course/the-complete-javascript-course/",
    difficulty: "beginner",
    tags: ["JavaScript", "web development", "programming fundamentals"]
  }
];

export const getResourcesByCategory = (category: string): StudyResource[] => {
  return studyResources.filter(resource => resource.category === category);
};

export const getResourcesByTag = (tag: string): StudyResource[] => {
  return studyResources.filter(resource => resource.tags.includes(tag));
};

export const getResourcesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): StudyResource[] => {
  return studyResources.filter(resource => resource.difficulty === difficulty);
};

export const searchResources = (query: string): StudyResource[] => {
  const lowerQuery = query.toLowerCase();
  return studyResources.filter(resource => 
    resource.title.toLowerCase().includes(lowerQuery) ||
    resource.description.toLowerCase().includes(lowerQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    resource.category.toLowerCase().includes(lowerQuery)
  );
};

export const getRecommendedResources = (topics: string[]): StudyResource[] => {
  return topics.flatMap(topic => {
    return studyResources.filter(resource =>
      resource.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase())) ||
      resource.category.toLowerCase().includes(topic.toLowerCase())
    );
  }).filter((resource, index, self) => 
    index === self.findIndex((r) => r.id === resource.id)
  );
};
