import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData, Education } from "@/types/resume";
import { PlusCircle, Trash2 } from "lucide-react";

interface EducationSectionProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

// Simple ID generator without external dependencies
const generateId = () => `edu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function EducationSection({ resumeData, setResumeData }: EducationSectionProps) {
  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      branch: '',
      cgpa: '',
      startDate: '',
      endDate: '',
      achievements: []
    };
    setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {resumeData.education.map((edu, index) => (
        <div key={edu.id} className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Education #{index + 1}</h4>
            {resumeData.education.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Institution *</Label>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                placeholder="IIT Bombay"
              />
            </div>
            <div className="space-y-2">
              <Label>Degree *</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder="B.Tech"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Branch/Major *</Label>
              <Input
                value={edu.branch}
                onChange={(e) => updateEducation(edu.id, 'branch', e.target.value)}
                placeholder="Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label>CGPA/Percentage</Label>
              <Input
                value={edu.cgpa}
                onChange={(e) => updateEducation(edu.id, 'cgpa', e.target.value)}
                placeholder="8.5/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                placeholder="Aug 2020"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                placeholder="May 2024"
              />
            </div>
          </div>
        </div>
      ))}

      <Button onClick={addEducation} variant="outline" className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}
