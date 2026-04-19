import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData, TemplateType } from "@/types/resume";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface LivePreviewPanelProps {
  resumeData: ResumeData;
  templateType: TemplateType;
}

export function LivePreviewPanel({ resumeData, templateType }: LivePreviewPanelProps) {
  const wordCount = JSON.stringify(resumeData).split(/\s+/).length;

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Live Preview
          </CardTitle>
          <Badge variant="outline">{wordCount} words</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg p-8 shadow-sm min-h-[800px]">
          {/* Resume Preview */}
          <div className="space-y-6">
            {/* Header */}
            {resumeData.personalInfo.fullName && (
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {resumeData.personalInfo.fullName}
                </h1>
                <div className="text-sm text-gray-600 mt-2 space-x-2">
                  {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                </div>
                {(resumeData.personalInfo.linkedin || resumeData.personalInfo.github) && (
                  <div className="text-sm text-gray-600 mt-1">
                    {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                    {resumeData.personalInfo.github && <span> • {resumeData.personalInfo.github}</span>}
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {resumeData.summary && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
                  PROFESSIONAL SUMMARY
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
                  EDUCATION
                </h2>
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                        <p className="text-sm text-gray-700">
                          {edu.degree} {edu.branch && `in ${edu.branch}`}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        {edu.cgpa && <div>CGPA: {edu.cgpa}</div>}
                        {edu.startDate && edu.endDate && (
                          <div>{edu.startDate} - {edu.endDate}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
                  TECHNICAL SKILLS
                </h2>
                {resumeData.skills.map((skillCat) => (
                  <div key={skillCat.category} className="mb-2">
                    <span className="font-semibold text-gray-900">{skillCat.category}: </span>
                    <span className="text-sm text-gray-700">{skillCat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            )}

            {!resumeData.personalInfo.fullName && (
              <div className="text-center text-gray-400 py-20">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Start filling in your information to see the preview</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
