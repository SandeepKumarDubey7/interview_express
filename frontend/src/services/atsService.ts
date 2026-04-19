import { ResumeData, ATSScore, ATSAnalysis, JobDescription } from "@/types/resume";
import { actionVerbs } from "@/data/atsTemplates";

// Extract keywords from job description
export function extractKeywords(jobDescription: string): string[] {
  const text = jobDescription.toLowerCase();
  const words = text.match(/\b[a-z]{3,}\b/g) || [];
  
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one',
    'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old',
    'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too',
    'use', 'will', 'with', 'about', 'after', 'before', 'other', 'than', 'then', 'these',
    'they', 'this', 'that', 'what', 'when', 'where', 'which', 'while', 'would', 'there'
  ]);
  
  // Count word frequency
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    if (!stopWords.has(word) && word.length > 3) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  });
  
  // Sort by frequency and return top keywords
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
}

// Calculate keyword match score
export function calculateKeywordMatch(
  resumeData: ResumeData,
  jobKeywords: string[]
): { score: number; matched: string[]; missing: string[] } {
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  jobKeywords.forEach(keyword => {
    if (resumeText.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  const score = jobKeywords.length > 0 
    ? (matched.length / jobKeywords.length) * 100 
    : 0;
  
  return { score, matched, missing };
}

// Calculate skills relevance score
export function calculateSkillsRelevance(
  resumeData: ResumeData,
  jobKeywords: string[]
): number {
  const allSkills = resumeData.skills.flatMap(cat => cat.skills).map(s => s.toLowerCase());
  const relevantSkills = jobKeywords.filter(keyword => 
    allSkills.some(skill => skill.includes(keyword) || keyword.includes(skill))
  );
  
  return jobKeywords.length > 0 
    ? (relevantSkills.length / jobKeywords.length) * 100 
    : 50;
}

// Calculate section completeness
export function calculateSectionCompleteness(resumeData: ResumeData): number {
  let totalScore = 0;
  let maxScore = 0;
  
  // Personal Info (20 points)
  maxScore += 20;
  if (resumeData.personalInfo.fullName) totalScore += 5;
  if (resumeData.personalInfo.email) totalScore += 5;
  if (resumeData.personalInfo.phone) totalScore += 5;
  if (resumeData.personalInfo.location) totalScore += 5;
  
  // Summary (15 points)
  maxScore += 15;
  if (resumeData.summary && resumeData.summary.length > 50) totalScore += 15;
  else if (resumeData.summary) totalScore += 7;
  
  // Education (15 points)
  maxScore += 15;
  if (resumeData.education.length > 0) {
    const edu = resumeData.education[0];
    if (edu.institution && edu.degree) totalScore += 15;
    else totalScore += 7;
  }
  
  // Experience/Projects (25 points)
  maxScore += 25;
  if (resumeData.experience.length > 0) totalScore += 12;
  if (resumeData.projects.length > 0) totalScore += 13;
  
  // Skills (15 points)
  maxScore += 15;
  const totalSkills = resumeData.skills.flatMap(cat => cat.skills).length;
  if (totalSkills >= 10) totalScore += 15;
  else if (totalSkills >= 5) totalScore += 10;
  else if (totalSkills > 0) totalScore += 5;
  
  // Certifications (10 points)
  maxScore += 10;
  if (resumeData.certifications.length > 0) totalScore += 10;
  
  return (totalScore / maxScore) * 100;
}

// Calculate action verb usage
export function calculateActionVerbScore(resumeData: ResumeData): number {
  const allText = [
    ...resumeData.experience.flatMap(exp => exp.responsibilities),
    ...resumeData.projects.flatMap(proj => proj.highlights),
    resumeData.summary
  ].join(' ');
  
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;
  
  const actionVerbSet = new Set(actionVerbs.map(v => v.toLowerCase()));
  let verbCount = 0;
  
  sentences.forEach(sentence => {
    const words = sentence.trim().split(/\s+/);
    if (words.length > 0) {
      const firstWord = words[0].toLowerCase().replace(/[^a-z]/g, '');
      if (actionVerbSet.has(firstWord)) {
        verbCount++;
      }
    }
  });
  
  return (verbCount / sentences.length) * 100;
}

// Calculate formatting compliance
export function calculateFormattingScore(resumeData: ResumeData): number {
  let score = 100;
  
  // Check for overly long sections
  const summaryLength = resumeData.summary.length;
  if (summaryLength > 500) score -= 10;
  
  // Check for reasonable number of skills
  const totalSkills = resumeData.skills.flatMap(cat => cat.skills).length;
  if (totalSkills > 30) score -= 10;
  if (totalSkills < 5) score -= 15;
  
  // Check for bullet points in experience
  resumeData.experience.forEach(exp => {
    if (exp.responsibilities.length === 0) score -= 5;
    if (exp.responsibilities.length > 8) score -= 5;
  });
  
  return Math.max(0, score);
}

// Calculate length optimization
export function calculateLengthScore(resumeData: ResumeData): number {
  // Estimate page length based on content
  const contentLength = 
    resumeData.summary.length +
    resumeData.education.length * 150 +
    resumeData.experience.reduce((sum, exp) => 
      sum + exp.responsibilities.join(' ').length, 0) +
    resumeData.projects.reduce((sum, proj) => 
      sum + proj.highlights.join(' ').length, 0) +
    resumeData.skills.flatMap(cat => cat.skills).join(' ').length;
  
  // Optimal range: 2000-3500 characters for 1 page
  if (contentLength >= 2000 && contentLength <= 3500) return 100;
  if (contentLength < 2000) return (contentLength / 2000) * 100;
  if (contentLength > 3500) return Math.max(0, 100 - ((contentLength - 3500) / 50));
  
  return 50;
}

// Main ATS Analysis Function
export function analyzeResumeATS(
  resumeData: ResumeData,
  jobDescription?: JobDescription
): ATSAnalysis {
  const jobKeywords = jobDescription 
    ? extractKeywords(jobDescription.description + ' ' + jobDescription.requirements.join(' '))
    : [];
  
  // Calculate individual scores
  const keywordMatchResult = jobKeywords.length > 0 
    ? calculateKeywordMatch(resumeData, jobKeywords)
    : { score: 0, matched: [], missing: [] };
  
  const skillsRelevance = jobKeywords.length > 0
    ? calculateSkillsRelevance(resumeData, jobKeywords)
    : 0;
  
  const sectionCompleteness = calculateSectionCompleteness(resumeData);
  const actionVerbScore = calculateActionVerbScore(resumeData);
  const formattingScore = calculateFormattingScore(resumeData);
  const lengthScore = calculateLengthScore(resumeData);
  
  // Calculate weighted overall score
  const weights = {
    keywordMatch: 0.40,
    skillsRelevance: 0.20,
    sectionCompleteness: 0.15,
    actionVerbs: 0.10,
    formatting: 0.10,
    lengthOptimization: 0.05
  };
  
  const overall = jobKeywords.length > 0
    ? (
        keywordMatchResult.score * weights.keywordMatch +
        skillsRelevance * weights.skillsRelevance +
        sectionCompleteness * weights.sectionCompleteness +
        actionVerbScore * weights.actionVerbs +
        formattingScore * weights.formatting +
        lengthScore * weights.lengthOptimization
      )
    : (
        sectionCompleteness * 0.50 +
        actionVerbScore * 0.20 +
        formattingScore * 0.20 +
        lengthScore * 0.10
      );
  
  const score: ATSScore = {
    overall: Math.round(overall),
    keywordMatch: Math.round(keywordMatchResult.score),
    skillsRelevance: Math.round(skillsRelevance),
    sectionCompleteness: Math.round(sectionCompleteness),
    actionVerbs: Math.round(actionVerbScore),
    formatting: Math.round(formattingScore),
    lengthOptimization: Math.round(lengthScore)
  };
  
  // Generate suggestions
  const suggestions: string[] = [];
  const weakSections: string[] = [];
  const strongPoints: string[] = [];
  
  if (score.keywordMatch < 60 && jobKeywords.length > 0) {
    weakSections.push('Keyword Match');
    suggestions.push('Add more relevant keywords from the job description to your resume');
  } else if (score.keywordMatch >= 80) {
    strongPoints.push('Excellent keyword alignment with job description');
  }
  
  if (score.skillsRelevance < 50 && jobKeywords.length > 0) {
    weakSections.push('Skills Relevance');
    suggestions.push('Include more skills that match the job requirements');
  }
  
  if (score.sectionCompleteness < 70) {
    weakSections.push('Section Completeness');
    suggestions.push('Complete all resume sections with detailed information');
  } else if (score.sectionCompleteness >= 90) {
    strongPoints.push('Comprehensive resume with all sections filled');
  }
  
  if (score.actionVerbs < 50) {
    weakSections.push('Action Verbs');
    suggestions.push('Start bullet points with strong action verbs (Led, Developed, Achieved, etc.)');
  } else if (score.actionVerbs >= 70) {
    strongPoints.push('Good use of action verbs in descriptions');
  }
  
  if (score.formatting < 80) {
    weakSections.push('Formatting');
    suggestions.push('Optimize section lengths and bullet point counts for better readability');
  }
  
  if (score.lengthOptimization < 70) {
    weakSections.push('Length');
    if (score.lengthOptimization < 50) {
      suggestions.push('Add more content to fill out your resume (aim for 1 full page)');
    } else {
      suggestions.push('Consider condensing content to fit within 1 page');
    }
  }
  
  return {
    score,
    missingKeywords: keywordMatchResult.missing.slice(0, 10),
    matchedKeywords: keywordMatchResult.matched,
    weakSections,
    suggestions,
    strongPoints
  };
}

// Generate AI-powered suggestions for improvement
export function generateImprovementSuggestions(
  text: string,
  type: 'bullet' | 'summary' | 'objective'
): string[] {
  const suggestions: string[] = [];
  
  // Check for action verbs
  const startsWithActionVerb = actionVerbs.some(verb => 
    text.trim().toLowerCase().startsWith(verb.toLowerCase())
  );
  
  if (!startsWithActionVerb && type === 'bullet') {
    suggestions.push(`Start with an action verb: "${actionVerbs[Math.floor(Math.random() * 10)]} ${text}"`);
  }
  
  // Check for metrics
  const hasMetrics = /\d+%|\d+x|\$\d+|\d+ (users|customers|projects|hours|days)/.test(text);
  if (!hasMetrics && type === 'bullet') {
    suggestions.push('Add measurable metrics (e.g., "improved efficiency by 20%")');
  }
  
  // Check length
  if (text.length < 30 && type === 'bullet') {
    suggestions.push('Add more detail about your impact and responsibilities');
  }
  
  if (text.length > 150 && type === 'bullet') {
    suggestions.push('Consider breaking this into multiple bullet points');
  }
  
  // Check for passive voice
  const passiveIndicators = ['was', 'were', 'been', 'being'];
  const hasPassive = passiveIndicators.some(word => 
    text.toLowerCase().includes(` ${word} `)
  );
  
  if (hasPassive) {
    suggestions.push('Use active voice instead of passive voice');
  }
  
  return suggestions;
}
