import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeData, TemplateType } from "@/types/resume";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { SummarySection } from "./sections/SummarySection";
import { EducationSection } from "./sections/EducationSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { AchievementsSection } from "./sections/AchievementsSection";
import { User, FileText, GraduationCap, Briefcase, Code, Award, Trophy, Lightbulb } from "lucide-react";

interface ResumeFormPanelProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  templateType: TemplateType;
}

export function ResumeFormPanel({ resumeData, setResumeData, templateType }: ResumeFormPanelProps) {
  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle>Resume Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-1">
            <TabsTrigger value="personal" className="text-xs">
              <User className="w-3 h-3 mr-1" />
              Info
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="education" className="text-xs">
              <GraduationCap className="w-3 h-3 mr-1" />
              Education
            </TabsTrigger>
            <TabsTrigger value="experience" className="text-xs">
              <Briefcase className="w-3 h-3 mr-1" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs">
              <Code className="w-3 h-3 mr-1" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs">
              <Lightbulb className="w-3 h-3 mr-1" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="certifications" className="text-xs">
              <Award className="w-3 h-3 mr-1" />
              Certs
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs">
              <Trophy className="w-3 h-3 mr-1" />
              Achievements
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            <TabsContent value="personal">
              <PersonalInfoSection resumeData={resumeData} setResumeData={setResumeData} />
            </TabsContent>
            
            <TabsContent value="summary">
              <SummarySection resumeData={resumeData} setResumeData={setResumeData} />
            </TabsContent>
            
            <TabsContent value="education">
              <EducationSection resumeData={resumeData} setResumeData={setResumeData} />
            </TabsContent>
            
            <TabsContent value="experience">
              <ExperienceSection resumeData={resumeData} setResumeData={setResumeData} />
            </TabsContent>
            
            <TabsContent value="projects">
              <ProjectsSection resumeData={resumeData} setResumeData={setResumeData} />
            </TabsContent>
            
            <TabsContent value="skills">
              <SkillsSection resumeData={resumeData} setResumeData={setResumeData} />
            </TabsContent>
            
            <TabsContent value="certifications">
              <CertificationsSection resumeData={resumeData} setResumeData={setResumeData} />
            </TabsContent>
            
            <TabsContent value="achievements">
              <AchievementsSection resumeData={resumeData} setResumeData={setResumeData} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
