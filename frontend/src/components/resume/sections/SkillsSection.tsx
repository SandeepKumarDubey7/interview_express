import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ResumeData, SkillCategory } from "@/types/resume";
import { PlusCircle, Trash2, X } from "lucide-react";
import { useState } from "react";

interface SkillsSectionProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

const SUGGESTED_CATEGORIES = [
  "Programming Languages",
  "Frameworks & Libraries",
  "Databases",
  "Tools & Platforms",
  "Soft Skills",
  "Cloud & DevOps",
];

export function SkillsSection({ resumeData, setResumeData }: SkillsSectionProps) {
  const [skillInputs, setSkillInputs] = useState<Record<number, string>>({});

  const addCategory = (categoryName?: string) => {
    const newCategory: SkillCategory = {
      category: categoryName || '',
      skills: []
    };
    setResumeData({ ...resumeData, skills: [...resumeData.skills, newCategory] });
  };

  const updateCategoryName = (index: number, name: string) => {
    const updated = [...resumeData.skills];
    updated[index] = { ...updated[index], category: name };
    setResumeData({ ...resumeData, skills: updated });
  };

  const removeCategory = (index: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index)
    });
  };

  const addSkill = (catIndex: number) => {
    const skill = (skillInputs[catIndex] || '').trim();
    if (!skill) return;
    const updated = [...resumeData.skills];
    if (!updated[catIndex].skills.includes(skill)) {
      updated[catIndex] = {
        ...updated[catIndex],
        skills: [...updated[catIndex].skills, skill]
      };
      setResumeData({ ...resumeData, skills: updated });
    }
    setSkillInputs({ ...skillInputs, [catIndex]: '' });
  };

  const removeSkill = (catIndex: number, skill: string) => {
    const updated = [...resumeData.skills];
    updated[catIndex] = {
      ...updated[catIndex],
      skills: updated[catIndex].skills.filter(s => s !== skill)
    };
    setResumeData({ ...resumeData, skills: updated });
  };

  // Get categories that haven't been added yet
  const availableSuggestions = SUGGESTED_CATEGORIES.filter(
    cat => !resumeData.skills.some(s => s.category.toLowerCase() === cat.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Quick-add suggestions */}
      {availableSuggestions.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Quick Add Categories:</Label>
          <div className="flex flex-wrap gap-1">
            {availableSuggestions.map(cat => (
              <Badge
                key={cat}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-accent"
                onClick={() => addCategory(cat)}
              >
                + {cat}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {resumeData.skills.map((cat, catIndex) => (
        <div key={catIndex} className="border p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center gap-2">
            <Input
              value={cat.category}
              onChange={(e) => updateCategoryName(catIndex, e.target.value)}
              placeholder="Category name (e.g. Programming Languages)"
              className="font-medium"
            />
            <Button variant="ghost" size="sm" onClick={() => removeCategory(catIndex)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              value={skillInputs[catIndex] || ''}
              onChange={(e) => setSkillInputs({ ...skillInputs, [catIndex]: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill(catIndex);
                }
              }}
              placeholder="Type a skill and press Enter"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => addSkill(catIndex)}>
              Add
            </Button>
          </div>

          {cat.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {cat.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                  <button
                    onClick={() => removeSkill(catIndex, skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button onClick={() => addCategory()} variant="outline" className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Skill Category
      </Button>
    </div>
  );
}
