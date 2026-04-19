import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeData } from "@/types/resume";

interface PersonalInfoSectionProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

export function PersonalInfoSection({ resumeData, setResumeData }: PersonalInfoSectionProps) {
  const updateField = (field: keyof typeof resumeData.personalInfo, value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [field]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={resumeData.personalInfo.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="John Doe"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="john@example.com"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={resumeData.personalInfo.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Mumbai, Maharashtra"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={resumeData.personalInfo.linkedin || ''}
            onChange={(e) => updateField('linkedin', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            value={resumeData.personalInfo.github || ''}
            onChange={(e) => updateField('github', e.target.value)}
            placeholder="github.com/johndoe"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio/Website</Label>
        <Input
          id="portfolio"
          value={resumeData.personalInfo.portfolio || ''}
          onChange={(e) => updateField('portfolio', e.target.value)}
          placeholder="johndoe.com"
        />
      </div>
    </div>
  );
}
