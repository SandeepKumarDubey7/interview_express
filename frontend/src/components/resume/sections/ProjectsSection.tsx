import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ResumeData, Project } from "@/types/resume";
import { PlusCircle, Trash2, X } from "lucide-react";
import { useState } from "react";

interface ProjectsSectionProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

const generateId = () => `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function ProjectsSection({ resumeData, setResumeData }: ProjectsSectionProps) {
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});

  const addProject = () => {
    const newProj: Project = {
      id: generateId(),
      title: '',
      description: '',
      technologies: [],
      link: '',
      highlights: []
    };
    setResumeData({ ...resumeData, projects: [...resumeData.projects, newProj] });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    });
  };

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter(proj => proj.id !== id)
    });
  };

  const addTechnology = (projId: string) => {
    const tech = (techInputs[projId] || '').trim();
    if (!tech) return;
    const proj = resumeData.projects.find(p => p.id === projId);
    if (proj && !proj.technologies.includes(tech)) {
      updateProject(projId, 'technologies', [...proj.technologies, tech]);
    }
    setTechInputs({ ...techInputs, [projId]: '' });
  };

  const removeTechnology = (projId: string, tech: string) => {
    const proj = resumeData.projects.find(p => p.id === projId);
    if (proj) {
      updateProject(projId, 'technologies', proj.technologies.filter(t => t !== tech));
    }
  };

  return (
    <div className="space-y-6">
      {resumeData.projects.map((proj, index) => (
        <div key={proj.id} className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Project #{index + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => removeProject(proj.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={proj.title}
                onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                placeholder="E-Commerce Platform"
              />
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input
                value={proj.link || ''}
                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                placeholder="https://github.com/user/project"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={proj.description}
              onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
              placeholder="A full-stack e-commerce platform with real-time inventory management..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Technologies</Label>
            <div className="flex gap-2">
              <Input
                value={techInputs[proj.id] || ''}
                onChange={(e) => setTechInputs({ ...techInputs, [proj.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology(proj.id);
                  }
                }}
                placeholder="Type a technology and press Enter"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => addTechnology(proj.id)}>
                Add
              </Button>
            </div>
            {proj.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {proj.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                    <button
                      onClick={() => removeTechnology(proj.id, tech)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Highlights (one per line)</Label>
            <Textarea
              value={proj.highlights.join('\n')}
              onChange={(e) =>
                updateProject(proj.id, 'highlights',
                  e.target.value.split('\n').filter((line: string) => line.trim() !== '' || e.target.value.endsWith('\n'))
                )
              }
              placeholder={"Handled 10K+ concurrent users with WebSocket implementation\nImplemented CI/CD pipeline reducing deploy time by 60%"}
              rows={3}
            />
          </div>
        </div>
      ))}

      <Button onClick={addProject} variant="outline" className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
}
