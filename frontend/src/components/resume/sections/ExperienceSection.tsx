import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ResumeData, Experience } from "@/types/resume";
import { PlusCircle, Trash2 } from "lucide-react";

interface ExperienceSectionProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

const generateId = () => `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function ExperienceSection({ resumeData, setResumeData }: ExperienceSectionProps) {
  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: []
    };
    setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {resumeData.experience.map((exp, index) => (
        <div key={exp.id} className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Experience #{index + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="Google"
              />
            </div>
            <div className="space-y-2">
              <Label>Position *</Label>
              <Input
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={exp.location}
              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
              placeholder="Bangalore, India"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                placeholder="Jun 2022"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                placeholder="Present"
                disabled={exp.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-${exp.id}`}
              checked={exp.current}
              onCheckedChange={(checked) => {
                updateExperience(exp.id, 'current', !!checked);
                if (checked) updateExperience(exp.id, 'endDate', 'Present');
              }}
            />
            <Label htmlFor={`current-${exp.id}`} className="text-sm cursor-pointer">
              I currently work here
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Responsibilities (one per line)</Label>
            <Textarea
              value={exp.responsibilities.join('\n')}
              onChange={(e) =>
                updateExperience(exp.id, 'responsibilities',
                  e.target.value.split('\n').filter((line: string) => line.trim() !== '' || e.target.value.endsWith('\n'))
                )
              }
              placeholder={"Developed REST APIs serving 1M+ daily requests\nLed a team of 5 engineers on microservices migration\nImproved system latency by 40% through caching strategies"}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Tip: Start each line with an action verb and include measurable results
            </p>
          </div>
        </div>
      ))}

      <Button onClick={addExperience} variant="outline" className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
}
