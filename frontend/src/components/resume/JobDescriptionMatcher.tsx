import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ResumeData, JobDescription, ATSAnalysis } from "@/types/resume";
import { extractKeywords } from "@/services/atsService";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface JobDescriptionMatcherProps {
  resumeData: ResumeData;
  jobDescription: JobDescription | null;
  setJobDescription: (jd: JobDescription | null) => void;
  analysis: ATSAnalysis | null;
}

export function JobDescriptionMatcher({ 
  resumeData, 
  jobDescription, 
  setJobDescription,
  analysis 
}: JobDescriptionMatcherProps) {
  const [jdText, setJdText] = useState('');

  const handleAnalyze = () => {
    if (!jdText.trim()) return;

    const keywords = extractKeywords(jdText);
    const jd: JobDescription = {
      title: 'Job Position',
      company: 'Company Name',
      description: jdText,
      requirements: [],
      keywords
    };
    setJobDescription(jd);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Job Description Matcher
          </CardTitle>
          <CardDescription>
            Paste a job description to see how well your resume matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the complete job description here..."
              rows={10}
            />
          </div>
          <Button onClick={handleAnalyze} className="w-full">
            Analyze Match
          </Button>
        </CardContent>
      </Card>

      {jobDescription && analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Match Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {analysis.score.keywordMatch}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Keyword Match with Job Description
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Matched Keywords ({analysis.matchedKeywords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedKeywords.map((keyword, idx) => (
                  <Badge key={idx} className="bg-green-100 text-green-800">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                Missing Keywords ({analysis.missingKeywords.length})
              </CardTitle>
              <CardDescription>
                Consider adding these keywords to improve your match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className="text-red-600 border-red-600">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
