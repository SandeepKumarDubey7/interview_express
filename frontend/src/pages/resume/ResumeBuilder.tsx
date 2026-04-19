
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { defaultResumeData, ResumeFormData, resumeTemplates } from "@/data/resumeTemplates";
import { analyzeResume } from "@/services/ai/resumeService";
import { 
  PlusCircle, 
  MinusCircle, 
  Download, 
  FileText, 
  Save, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { generateResumePDF } from "@/utils/pdfGenerator";

export default function ResumeBuilder() {
  const { currentUser } = useAuth();
  const { templateId } = useParams();
  const [formData, setFormData] = useState<ResumeFormData>(defaultResumeData);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    suggestions: string[];
    analysis: string;
  } | null>(null);
  
  const selectedTemplate = resumeTemplates.find(t => t.id === templateId);
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== "user") {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (!selectedTemplate) {
    return <Navigate to="/resume-builder" replace />;
  }
  
  // Update a specific field in a nested object
  const updateFormField = (
    section: keyof ResumeFormData,
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setFormData(prev => {
      const sectionData = [...(prev[section] as any[])] as any[];
      sectionData[index] = { ...sectionData[index], [field]: value };
      return { ...prev, [section]: sectionData };
    });
  };
  
  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };
  
  const addSectionItem = (section: keyof Omit<ResumeFormData, 'personalInfo'>) => {
    setFormData(prev => {
      const sectionArray = prev[section] as any[];
      const emptyItem = { ...sectionArray[0] };
      Object.keys(emptyItem).forEach(key => {
        if (typeof emptyItem[key as keyof typeof emptyItem] === 'string') {
          (emptyItem as any)[key] = '';
        } else if (typeof emptyItem[key as keyof typeof emptyItem] === 'boolean') {
          (emptyItem as any)[key] = false;
        } else if (Array.isArray(emptyItem[key as keyof typeof emptyItem])) {
          (emptyItem as any)[key] = [''];
        }
      });
      
      return {
        ...prev,
        [section]: [...sectionArray, emptyItem]
      };
    });
  };
  
  const removeSectionItem = (section: keyof Omit<ResumeFormData, 'personalInfo'>, index: number) => {
    if (index === 0 && (formData[section] as any[]).length === 1) {
      const sectionArray = formData[section] as any[];
      const emptyItem = { ...sectionArray[0] };
      Object.keys(emptyItem).forEach(key => {
        if (typeof emptyItem[key as keyof typeof emptyItem] === 'string') {
          (emptyItem as any)[key] = '';
        } else if (typeof emptyItem[key as keyof typeof emptyItem] === 'boolean') {
          (emptyItem as any)[key] = false;
        } else if (Array.isArray(emptyItem[key as keyof typeof emptyItem])) {
          (emptyItem as any)[key] = [''];
        }
      });
      
      setFormData(prev => ({
        ...prev,
        [section]: [emptyItem]
      }));
      
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index)
    }));
  };
  
  const updateSkill = (index: number, value: string) => {
    setFormData(prev => {
      const skills = [...prev.skills];
      skills[index] = value;
      return { ...prev, skills };
    });
  };
  
  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, ""]
    }));
  };
  
  const removeSkill = (index: number) => {
    if (index === 0 && formData.skills.length === 1) {
      setFormData(prev => ({
        ...prev,
        skills: [""]
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };
  
  const updateTechnology = (projectIndex: number, techIndex: number, value: string) => {
    setFormData(prev => {
      const projects = [...prev.projects];
      const technologies = [...projects[projectIndex].technologies];
      technologies[techIndex] = value;
      projects[projectIndex] = { ...projects[projectIndex], technologies };
      return { ...prev, projects };
    });
  };
  
  const addTechnology = (projectIndex: number) => {
    setFormData(prev => {
      const projects = [...prev.projects];
      projects[projectIndex] = { 
        ...projects[projectIndex], 
        technologies: [...projects[projectIndex].technologies, ""] 
      };
      return { ...prev, projects };
    });
  };
  
  const removeTechnology = (projectIndex: number, techIndex: number) => {
    if (techIndex === 0 && formData.projects[projectIndex].technologies.length === 1) {
      setFormData(prev => {
        const projects = [...prev.projects];
        projects[projectIndex] = { 
          ...projects[projectIndex], 
          technologies: [""] 
        };
        return { ...prev, projects };
      });
      return;
    }
    
    setFormData(prev => {
      const projects = [...prev.projects];
      const technologies = projects[projectIndex].technologies.filter((_, i) => i !== techIndex);
      projects[projectIndex] = { ...projects[projectIndex], technologies };
      return { ...prev, projects };
    });
  };
  
  const saveResume = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      localStorage.setItem('savedResume', JSON.stringify({
        templateId,
        formData
      }));
      
      setIsSaving(false);
      toast.success("Resume saved successfully!");
    }, 1000);
  };
  
  const generatePDF = async () => {
    setLoading(true);
    
    try {
      const pdfBlob = await generateResumePDF(templateId || "", formData);
      
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success("Resume PDF generated successfully! Check your downloads folder.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const analyzeResumeWithAI = async () => {
    setIsAnalyzing(true);
    
    try {
      const resumeText = `
Full Name: ${formData.personalInfo.fullName}
Email: ${formData.personalInfo.email}
Phone: ${formData.personalInfo.phone}
Address: ${formData.personalInfo.address}
LinkedIn: ${formData.personalInfo.linkedin}
GitHub: ${formData.personalInfo.github}
Website: ${formData.personalInfo.website}

Summary:
${formData.personalInfo.summary}

EDUCATION:
${formData.education.map(edu => `
${edu.institution} - ${edu.degree}, ${edu.fieldOfStudy}
${edu.startDate} - ${edu.endDate}
GPA: ${edu.gpa}
${edu.description}
`).join('\n')}

EXPERIENCE:
${formData.experience.map(exp => `
${exp.company} - ${exp.position}, ${exp.location}
${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
${exp.description}
`).join('\n')}

SKILLS:
${formData.skills.join(', ')}

PROJECTS:
${formData.projects.map(proj => `
${proj.title}
${proj.description}
Technologies: ${proj.technologies.join(', ')}
${proj.link ? `Link: ${proj.link}` : ''}
`).join('\n')}

CERTIFICATIONS:
${formData.certifications.map(cert => `
${cert.name} - ${cert.issuer}
Date: ${cert.date}
${cert.expiration ? `Expires: ${cert.expiration}` : ''}
`).join('\n')}
      `;
      
      const result = await analyzeResume(resumeText);
      // Map the AI service response to the component's expected shape
      setAnalysisResult({
        score: result.atsScore,
        suggestions: result.suggestions,
        analysis: result.analysis,
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error("Failed to analyze resume. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  useEffect(() => {
    const savedResume = localStorage.getItem('savedResume');
    if (savedResume) {
      try {
        const { templateId: savedTemplateId, formData: savedFormData } = JSON.parse(savedResume);
        if (savedTemplateId === templateId) {
          setFormData(savedFormData);
        }
      } catch (error) {
        console.error("Error loading saved resume:", error);
      }
    }
  }, [templateId]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to="/resume-builder">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <Heading 
                title="Resume Builder" 
                description={`Building ${selectedTemplate.name} template`}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveResume} disabled={isSaving}>
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            
            <Button onClick={generatePDF} disabled={loading}>
              {loading ? (
                <>Generating...</>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resume Details</CardTitle>
                <CardDescription>
                  Fill in your information to create your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid grid-cols-3 lg:grid-cols-6">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="certifications">Certifications</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            value={formData.personalInfo.fullName}
                            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                            placeholder="John Doe" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            value={formData.personalInfo.email}
                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                            placeholder="john@example.com" 
                            type="email" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            value={formData.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                            placeholder="(555) 123-4567" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Location</Label>
                          <Input 
                            id="address" 
                            value={formData.personalInfo.address}
                            onChange={(e) => updatePersonalInfo('address', e.target.value)}
                            placeholder="City, State" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn URL</Label>
                          <Input 
                            id="linkedin" 
                            value={formData.personalInfo.linkedin || ''}
                            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                            placeholder="linkedin.com/in/johndoe" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub URL</Label>
                          <Input 
                            id="github" 
                            value={formData.personalInfo.github || ''}
                            onChange={(e) => updatePersonalInfo('github', e.target.value)}
                            placeholder="github.com/johndoe" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">Portfolio / Website</Label>
                        <Input 
                          id="website" 
                          value={formData.personalInfo.website || ''}
                          onChange={(e) => updatePersonalInfo('website', e.target.value)}
                          placeholder="johndoe.com" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea 
                          id="summary" 
                          value={formData.personalInfo.summary}
                          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                          placeholder="A brief summary of your skills, experience, and career goals" 
                          rows={4}
                        />
                        <p className="text-xs text-muted-foreground">
                          Keep your summary concise, focused on your strengths, and tailored to the job you're applying for.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="education" className="pt-4">
                    <div className="space-y-6">
                      {formData.education.map((edu, index) => (
                        <div key={index} className="space-y-4 border p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                            {formData.education.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSectionItem('education', index)}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`institution-${index}`}>Institution</Label>
                              <Input 
                                id={`institution-${index}`} 
                                value={edu.institution}
                                onChange={(e) => updateFormField('education', index, 'institution', e.target.value)}
                                placeholder="University Name" 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`degree-${index}`}>Degree</Label>
                              <Input 
                                id={`degree-${index}`} 
                                value={edu.degree}
                                onChange={(e) => updateFormField('education', index, 'degree', e.target.value)}
                                placeholder="Bachelor of Science" 
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`field-${index}`}>Field of Study</Label>
                              <Input 
                                id={`field-${index}`} 
                                value={edu.fieldOfStudy}
                                onChange={(e) => updateFormField('education', index, 'fieldOfStudy', e.target.value)}
                                placeholder="Computer Science" 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`gpa-${index}`}>GPA (Optional)</Label>
                              <Input 
                                id={`gpa-${index}`} 
                                value={edu.gpa || ''}
                                onChange={(e) => updateFormField('education', index, 'gpa', e.target.value)}
                                placeholder="3.8/4.0" 
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                              <Input 
                                id={`edu-start-${index}`} 
                                value={edu.startDate}
                                onChange={(e) => updateFormField('education', index, 'startDate', e.target.value)}
                                placeholder="Sep 2018" 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                              <Input 
                                id={`edu-end-${index}`} 
                                value={edu.endDate}
                                onChange={(e) => updateFormField('education', index, 'endDate', e.target.value)}
                                placeholder="Jun 2022" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`edu-description-${index}`}>Description (Optional)</Label>
                            <Textarea 
                              id={`edu-description-${index}`} 
                              value={edu.description || ''}
                              onChange={(e) => updateFormField('education', index, 'description', e.target.value)}
                              placeholder="Relevant coursework, achievements, activities" 
                              rows={3}
                            />
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => addSectionItem('education')}
                        className="w-full"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Education
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="pt-4">
                    <div className="space-y-6">
                      {formData.experience.map((exp, index) => (
                        <div key={index} className="space-y-4 border p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
                            {formData.experience.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSectionItem('experience', index)}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`company-${index}`}>Company</Label>
                              <Input 
                                id={`company-${index}`} 
                                value={exp.company}
                                onChange={(e) => updateFormField('experience', index, 'company', e.target.value)}
                                placeholder="Company Name" 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`position-${index}`}>Position</Label>
                              <Input 
                                id={`position-${index}`} 
                                value={exp.position}
                                onChange={(e) => updateFormField('experience', index, 'position', e.target.value)}
                                placeholder="Software Engineer" 
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`location-${index}`}>Location</Label>
                              <Input 
                                id={`location-${index}`} 
                                value={exp.location}
                                onChange={(e) => updateFormField('experience', index, 'location', e.target.value)}
                                placeholder="City, State" 
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-2">
                                <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                                <Input 
                                  id={`exp-start-${index}`} 
                                  value={exp.startDate}
                                  onChange={(e) => updateFormField('experience', index, 'startDate', e.target.value)}
                                  placeholder="Jan 2020" 
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                                <div className="flex items-center space-x-2">
                                  {!exp.current && (
                                    <Input 
                                      id={`exp-end-${index}`} 
                                      value={exp.endDate}
                                      onChange={(e) => updateFormField('experience', index, 'endDate', e.target.value)}
                                      placeholder="Present" 
                                      disabled={exp.current}
                                    />
                                  )}
                                  <div className="flex items-center space-x-1">
                                    <input 
                                      type="checkbox" 
                                      id={`current-${index}`} 
                                      checked={exp.current}
                                      onChange={(e) => updateFormField('experience', index, 'current', e.target.checked)}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor={`current-${index}`} className="text-sm">
                                      Current
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`exp-description-${index}`}>Description</Label>
                            <Textarea 
                              id={`exp-description-${index}`} 
                              value={exp.description}
                              onChange={(e) => updateFormField('experience', index, 'description', e.target.value)}
                              placeholder="Describe your responsibilities and achievements" 
                              rows={4}
                            />
                            <p className="text-xs text-muted-foreground">
                              Use bullet points starting with action verbs. Quantify your achievements when possible.
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => addSectionItem('experience')}
                        className="w-full"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Experience
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="skills" className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Skills</Label>
                        <p className="text-sm text-muted-foreground">
                          Add your technical and soft skills relevant to the job you're applying for.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.skills.map((skill, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input 
                              value={skill}
                              onChange={(e) => updateSkill(index, e.target.value)}
                              placeholder="e.g. JavaScript, Project Management, Data Analysis" 
                            />
                            {formData.skills.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSkill(index)}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={addSkill}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Skill
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="projects" className="pt-4">
                    <div className="space-y-6">
                      {formData.projects.map((project, index) => (
                        <div key={index} className="space-y-4 border p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Project #{index + 1}</h3>
                            {formData.projects.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSectionItem('projects', index)}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                              <Input 
                                id={`project-title-${index}`} 
                                value={project.title}
                                onChange={(e) => updateFormField('projects', index, 'title', e.target.value)}
                                placeholder="Project Name" 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`project-link-${index}`}>Project Link (Optional)</Label>
                              <Input 
                                id={`project-link-${index}`} 
                                value={project.link || ''}
                                onChange={(e) => updateFormField('projects', index, 'link', e.target.value)}
                                placeholder="https://github.com/username/project" 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`project-desc-${index}`}>Description</Label>
                              <Textarea 
                                id={`project-desc-${index}`} 
                                value={project.description}
                                onChange={(e) => updateFormField('projects', index, 'description', e.target.value)}
                                placeholder="Describe the project, your role, and its impact" 
                                rows={3}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Technologies Used</Label>
                              <div className="space-y-3">
                                {project.technologies.map((tech, techIndex) => (
                                  <div key={techIndex} className="flex items-center space-x-2">
                                    <Input 
                                      value={tech}
                                      onChange={(e) => updateTechnology(index, techIndex, e.target.value)}
                                      placeholder="e.g. React, Node.js, MongoDB" 
                                    />
                                    {project.technologies.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeTechnology(index, techIndex)}
                                      >
                                        <MinusCircle className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addTechnology(index)}
                                >
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add Technology
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => addSectionItem('projects')}
                        className="w-full"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Project
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="certifications" className="pt-4">
                    <div className="space-y-6">
                      {formData.certifications.map((cert, index) => (
                        <div key={index} className="space-y-4 border p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Certification #{index + 1}</h3>
                            {formData.certifications.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSectionItem('certifications', index)}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`cert-name-${index}`}>Certification Name</Label>
                              <Input 
                                id={`cert-name-${index}`} 
                                value={cert.name}
                                onChange={(e) => updateFormField('certifications', index, 'name', e.target.value)}
                                placeholder="AWS Certified Solutions Architect" 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`cert-issuer-${index}`}>Issuing Organization</Label>
                              <Input 
                                id={`cert-issuer-${index}`} 
                                value={cert.issuer}
                                onChange={(e) => updateFormField('certifications', index, 'issuer', e.target.value)}
                                placeholder="Amazon Web Services" 
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`cert-date-${index}`}>Date Earned</Label>
                              <Input 
                                id={`cert-date-${index}`} 
                                value={cert.date}
                                onChange={(e) => updateFormField('certifications', index, 'date', e.target.value)}
                                placeholder="June 2022" 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`cert-expiration-${index}`}>Expiration Date (Optional)</Label>
                              <Input 
                                id={`cert-expiration-${index}`} 
                                value={cert.expiration || ''}
                                onChange={(e) => updateFormField('certifications', index, 'expiration', e.target.value)}
                                placeholder="June 2025" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => addSectionItem('certifications')}
                        className="w-full"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Certification
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={saveResume} disabled={isSaving}>
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                
                <Button onClick={generatePDF} disabled={loading}>
                  {loading ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Preview</CardTitle>
                  <CardDescription>
                    How your resume will look like
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="relative w-full aspect-[3/4] border rounded-md overflow-hidden">
                    <div className="absolute inset-0 bg-gray-50 flex flex-col">
                      {formData.personalInfo.fullName ? (
                        <div className="bg-primary text-white p-4 text-center">
                          <h2 className="text-xl font-bold">{formData.personalInfo.fullName}</h2>
                          <div className="text-sm mt-1 flex items-center justify-center flex-wrap gap-3">
                            {formData.personalInfo.email && (
                              <span>{formData.personalInfo.email}</span>
                            )}
                            {formData.personalInfo.phone && (
                              <span>{formData.personalInfo.phone}</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-primary/20 p-4 text-center">
                          <div className="h-6 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
                          <div className="h-4 bg-gray-200 rounded-md w-3/4 mx-auto mt-2"></div>
                        </div>
                      )}
                      
                      <div className="p-4 flex-1">
                        <div className="space-y-4">
                          {!formData.personalInfo.fullName && (
                            <>
                              <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                              <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                              <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                              <div className="h-3 bg-gray-200 rounded-md w-3/4"></div>
                              
                              <div className="h-4 bg-gray-200 rounded-md w-1/4 mt-6"></div>
                              <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                              <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                              
                              <div className="h-4 bg-gray-200 rounded-md w-1/4 mt-6"></div>
                              <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                              <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                            </>
                          )}
                          
                          {formData.personalInfo.fullName && (
                            <div className="text-sm space-y-3 opacity-60">
                              <p className="italic">
                                Enter your details in the form to see a preview of your resume.
                                Download the final PDF to see the complete formatted resume.
                              </p>
                              
                              {formData.personalInfo.summary && (
                                <>
                                  <h3 className="font-semibold text-base">SUMMARY</h3>
                                  <p>{formData.personalInfo.summary.substring(0, 100)}...</p>
                                </>
                              )}
                              
                              {formData.experience.some(e => e.company) && (
                                <>
                                  <h3 className="font-semibold text-base">EXPERIENCE</h3>
                                  <div>
                                    {formData.experience[0].company && (
                                      <p>
                                        {formData.experience[0].position} at {formData.experience[0].company}
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}
                              
                              {formData.education.some(e => e.institution) && (
                                <>
                                  <h3 className="font-semibold text-base">EDUCATION</h3>
                                  <div>
                                    {formData.education[0].institution && (
                                      <p>
                                        {formData.education[0].degree} in {formData.education[0].fieldOfStudy}
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Resume Assistant</CardTitle>
                  <CardDescription>
                    Get AI-powered feedback and suggestions for your resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!analysisResult ? (
                    <div className="text-center py-4">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Add your resume details, then analyze your resume for ATS compatibility and suggestions.
                      </p>
                      <Button 
                        onClick={analyzeResumeWithAI} 
                        disabled={isAnalyzing || !formData.personalInfo.fullName}
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>Analyze Resume</>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">ATS Compatibility Score</h3>
                          <span className="text-lg font-semibold">{analysisResult.score}%</span>
                        </div>
                        <Progress value={analysisResult.score} className="h-2" />
                        
                        <div className="mt-1 text-xs text-right">
                          {analysisResult.score >= 80 ? (
                            <span className="text-green-600">Excellent</span>
                          ) : analysisResult.score >= 60 ? (
                            <span className="text-yellow-600">Good</span>
                          ) : (
                            <span className="text-red-600">Needs Improvement</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Suggestions</h3>
                        <ul className="space-y-2">
                          {analysisResult.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex gap-2 text-sm">
                              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Analysis</h3>
                        <p className="text-sm">{analysisResult.analysis}</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={analyzeResumeWithAI}
                        disabled={isAnalyzing}
                        className="w-full"
                      >
                        {isAnalyzing ? (
                          <>Analyzing...</>
                        ) : (
                          <>Refresh Analysis</>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
