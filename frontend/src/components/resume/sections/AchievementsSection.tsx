import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData, Achievement } from "@/types/resume";
import { PlusCircle, Trash2 } from "lucide-react";

interface AchievementsSectionProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

const generateId = () => `ach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function AchievementsSection({ resumeData, setResumeData }: AchievementsSectionProps) {
  const addAchievement = () => {
    const newAch: Achievement = {
      id: generateId(),
      title: '',
      description: '',
      date: ''
    };
    setResumeData({ ...resumeData, achievements: [...resumeData.achievements, newAch] });
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setResumeData({
      ...resumeData,
      achievements: resumeData.achievements.map(ach =>
        ach.id === id ? { ...ach, [field]: value } : ach
      )
    });
  };

  const removeAchievement = (id: string) => {
    setResumeData({
      ...resumeData,
      achievements: resumeData.achievements.filter(ach => ach.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {resumeData.achievements.map((ach, index) => (
        <div key={ach.id} className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Achievement #{index + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => removeAchievement(ach.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={ach.title}
                onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)}
                placeholder="Dean's List Award"
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                value={ach.date || ''}
                onChange={(e) => updateAchievement(ach.id, 'date', e.target.value)}
                placeholder="Mar 2024"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={ach.description}
              onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)}
              placeholder="Recognized for maintaining 9.5+ CGPA across 4 consecutive semesters..."
              rows={3}
            />
          </div>
        </div>
      ))}

      <Button onClick={addAchievement} variant="outline" className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Achievement
      </Button>
    </div>
  );
}
