import { ResumeData, TemplateType } from "@/types/resume";

export async function generateResumePDF(
  resumeData: ResumeData,
  templateType: TemplateType
): Promise<Blob> {
  // Simple text-based PDF generation for now
  // In production, use jsPDF or react-pdf for proper PDF generation
  
  let content = '';
  
  // Header
  content += `${resumeData.personalInfo.fullName}\n`;
  content += `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}\n`;
  if (resumeData.personalInfo.linkedin) content += `LinkedIn: ${resumeData.personalInfo.linkedin}\n`;
  if (resumeData.personalInfo.github) content += `GitHub: ${resumeData.personalInfo.github}\n`;
  content += `\n`;
  
  // Summary
  if (resumeData.summary) {
    content += `PROFESSIONAL SUMMARY\n`;
    content += `${resumeData.summary}\n\n`;
  }
  
  // Education
  if (resumeData.education.length > 0) {
    content += `EDUCATION\n`;
    resumeData.education.forEach(edu => {
      content += `${edu.institution}\n`;
      content += `${edu.degree} in ${edu.branch}\n`;
      if (edu.cgpa) content += `CGPA: ${edu.cgpa}\n`;
      content += `${edu.startDate} - ${edu.endDate}\n\n`;
    });
  }
  
  // Experience
  if (resumeData.experience.length > 0) {
    content += `EXPERIENCE\n`;
    resumeData.experience.forEach(exp => {
      content += `${exp.position} at ${exp.company}\n`;
      content += `${exp.location} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      exp.responsibilities.forEach(resp => {
        content += `• ${resp}\n`;
      });
      content += `\n`;
    });
  }
  
  // Projects
  if (resumeData.projects.length > 0) {
    content += `PROJECTS\n`;
    resumeData.projects.forEach(proj => {
      content += `${proj.title}\n`;
      content += `${proj.description}\n`;
      content += `Technologies: ${proj.technologies.join(', ')}\n`;
      proj.highlights.forEach(highlight => {
        content += `• ${highlight}\n`;
      });
      content += `\n`;
    });
  }
  
  // Skills
  if (resumeData.skills.length > 0) {
    content += `TECHNICAL SKILLS\n`;
    resumeData.skills.forEach(skillCat => {
      content += `${skillCat.category}: ${skillCat.skills.join(', ')}\n`;
    });
    content += `\n`;
  }
  
  // Certifications
  if (resumeData.certifications.length > 0) {
    content += `CERTIFICATIONS\n`;
    resumeData.certifications.forEach(cert => {
      content += `${cert.name} - ${cert.issuer} (${cert.date})\n`;
    });
    content += `\n`;
  }
  
  // Create a simple text file as PDF placeholder
  const blob = new Blob([content], { type: 'text/plain' });
  return blob;
}
