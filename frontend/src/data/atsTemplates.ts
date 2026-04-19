import { ResumeTemplate } from "@/types/resume";

export const atsTemplates: ResumeTemplate[] = [
  {
    id: 'chronological',
    name: 'Reverse Chronological',
    description: 'Traditional format highlighting work experience and internships',
    bestFor: 'Students with internships and relevant work experience',
    sections: [
      'Personal Info',
      'Professional Summary',
      'Education',
      'Experience/Internships',
      'Projects',
      'Technical Skills',
      'Certifications',
      'Achievements'
    ],
    atsCompliant: true
  },
  {
    id: 'functional',
    name: 'Functional (Skills-Based)',
    description: 'Emphasizes skills and projects over work history',
    bestFor: 'Freshers with no internship experience but strong projects',
    sections: [
      'Personal Info',
      'Career Objective',
      'Technical Skills',
      'Academic Projects',
      'Education',
      'Certifications',
      'Achievements'
    ],
    atsCompliant: true
  },
  {
    id: 'combination',
    name: 'Combination (Hybrid)',
    description: 'Balances skills, projects, and experience equally',
    bestFor: 'Students with both strong projects and internship experience',
    sections: [
      'Personal Info',
      'Professional Summary',
      'Technical Skills',
      'Experience/Internships',
      'Projects',
      'Education',
      'Certifications'
    ],
    atsCompliant: true
  },
  {
    id: 'minimal',
    name: 'One-Page Minimal ATS',
    description: 'Strict ATS compliance with maximum readability',
    bestFor: 'Maximum ATS compatibility and clean parsing',
    sections: [
      'Personal Info',
      'Summary',
      'Education',
      'Experience',
      'Skills',
      'Projects'
    ],
    atsCompliant: true
  }
];

export const actionVerbs = [
  // Leadership
  'Led', 'Managed', 'Directed', 'Coordinated', 'Supervised', 'Mentored', 'Guided',
  // Achievement
  'Achieved', 'Accomplished', 'Delivered', 'Exceeded', 'Improved', 'Increased', 'Reduced',
  // Technical
  'Developed', 'Designed', 'Implemented', 'Built', 'Created', 'Engineered', 'Programmed',
  'Architected', 'Deployed', 'Integrated', 'Optimized', 'Automated', 'Configured',
  // Analysis
  'Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Researched', 'Identified',
  // Communication
  'Presented', 'Communicated', 'Collaborated', 'Coordinated', 'Documented', 'Reported',
  // Problem Solving
  'Resolved', 'Troubleshot', 'Debugged', 'Fixed', 'Enhanced', 'Streamlined',
  // Innovation
  'Innovated', 'Pioneered', 'Initiated', 'Launched', 'Established', 'Introduced'
];

export const skillCategories = [
  'Programming Languages',
  'Web Technologies',
  'Frameworks & Libraries',
  'Databases',
  'Tools & Platforms',
  'Cloud & DevOps',
  'Soft Skills',
  'Other Technical Skills'
];

export const commonSkills = {
  'Programming Languages': [
    'Python', 'Java', 'JavaScript', 'C++', 'C', 'TypeScript', 'Go', 'Rust', 'Kotlin', 'Swift'
  ],
  'Web Technologies': [
    'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Next.js'
  ],
  'Frameworks & Libraries': [
    'Spring Boot', 'Django', 'Flask', 'FastAPI', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy'
  ],
  'Databases': [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Firebase'
  ],
  'Tools & Platforms': [
    'Git', 'GitHub', 'GitLab', 'Jira', 'VS Code', 'IntelliJ IDEA', 'Postman', 'Docker'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform'
  ],
  'Soft Skills': [
    'Problem Solving', 'Team Collaboration', 'Communication', 'Leadership', 'Time Management',
    'Critical Thinking', 'Adaptability', 'Project Management'
  ]
};

export const atsComplianceRules = {
  fonts: ['Arial', 'Calibri', 'Times New Roman', 'Georgia', 'Helvetica'],
  avoidElements: [
    'Tables',
    'Text boxes',
    'Headers/Footers',
    'Images',
    'Graphics',
    'Icons',
    'Columns (multi-column layout)',
    'Special characters',
    'Fancy fonts'
  ],
  standardHeadings: [
    'EDUCATION',
    'EXPERIENCE',
    'SKILLS',
    'PROJECTS',
    'CERTIFICATIONS',
    'ACHIEVEMENTS',
    'SUMMARY',
    'OBJECTIVE'
  ],
  fileFormats: ['PDF', 'DOCX'],
  maxPages: 1,
  minMargins: 0.5, // inches
  recommendedFontSize: {
    name: 16,
    headings: 12,
    body: 11
  }
};
