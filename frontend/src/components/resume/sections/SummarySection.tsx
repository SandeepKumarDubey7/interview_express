import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResumeData } from "@/types/resume";
import { actionVerbs } from "@/data/atsTemplates";
import { Badge } from "@/components/ui/badge";

interface SummarySectionProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

export function SummarySection({ resumeData, setResumeData }: SummarySectionProps) {
  const charCount = resumeData.summary.length;
  const recommended = charCount >= 100 && charCount <= 300;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Professional Summary</Label>
          <span className={`text-xs ${recommended ? 'text-green-600' : 'text-gray-500'}`}>
            {charCount} / 300 characters
          </span>
        </div>
        <Textarea
          id="summary"
          value={resumeData.summary}
          onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
          placeholder="Write a compelling summary highlighting your key skills, experience, and career goals..."
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          Tip: Start with action verbs and include measurable achievements
        </p>
      </div>
      
      <div>
        <Label className="text-xs">Suggested Action Verbs:</Label>
        <div className="flex flex-wrap gap-1 mt-2">
          {actionVerbs.slice(0, 12).map((verb) => (
            <Badge key={verb} variant="outline" className="text-xs cursor-pointer hover:bg-gray-100"
              onClick={() => setResumeData({ ...resumeData, summary: resumeData.summary + verb + ' ' })}>
              {verb}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
