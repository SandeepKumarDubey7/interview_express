
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "A clean, contemporary design with a sidebar for contact information",
    previewImage: "/resume-templates/modern-template.png"
  },
  {
    id: "professional",
    name: "Professional",
    description: "A traditional layout focused on experience and achievements",
    previewImage: "/resume-templates/professional-template.png"
  },
  {
    id: "creative",
    name: "Creative",
    description: "A bold design that showcases creativity and personality",
    previewImage: "/resume-templates/creative-template.png"
  }
];

export interface ResumeFormData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    github?: string;
    website?: string;
    summary: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    description?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiration?: string;
  }>;
}

export const defaultResumeData: ResumeFormData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    website: "",
    summary: ""
  },
  education: [
    {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: ""
    }
  ],
  experience: [
    {
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    }
  ],
  skills: [""],
  projects: [
    {
      title: "",
      description: "",
      technologies: [""],
      link: ""
    }
  ],
  certifications: [
    {
      name: "",
      issuer: "",
      date: "",
      expiration: ""
    }
  ]
};
