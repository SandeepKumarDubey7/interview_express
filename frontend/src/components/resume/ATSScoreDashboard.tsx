import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ATSAnalysis, ResumeData } from "@/types/resume";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, TrendingUp, Lightbulb } from "lucide-react";

interface ATSScoreDashboardProps {
  analysis: ATSAnalysis | null;
  resumeData: ResumeData;
}

export function ATSScoreDashboard({ analysis, resumeData }: ATSScoreDashboardProps) {
  if (!analysis) {
    return (
      <Card>
        <CardContent className="py-20 text-center text-muted-foreground">
          <p>Fill in your resume to see ATS analysis</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall ATS Score</CardTitle>
          <CardDescription>How well your resume will perform with Applicant Tracking Systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - analysis.score.overall / 100)}`}
                  className={getScoreBg(analysis.score.overall)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${getScoreColor(analysis.score.overall)}`}>
                  {analysis.score.overall}
                </span>
                <span className="text-sm text-muted-foreground">out of 100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Keyword Match', score: analysis.score.keywordMatch, weight: '40%' },
            { label: 'Skills Relevance', score: analysis.score.skillsRelevance, weight: '20%' },
            { label: 'Section Completeness', score: analysis.score.sectionCompleteness, weight: '15%' },
            { label: 'Action Verbs', score: analysis.score.actionVerbs, weight: '10%' },
            { label: 'Formatting', score: analysis.score.formatting, weight: '10%' },
            { label: 'Length Optimization', score: analysis.score.lengthOptimization, weight: '5%' }
          ].map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{metric.weight}</Badge>
                  <span className={getScoreColor(metric.score)}>{metric.score}%</span>
                </div>
              </div>
              <Progress value={metric.score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strong Points */}
      {analysis.strongPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Strong Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strongPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Weak Sections */}
      {analysis.weakSections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="w-5 h-5" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.weakSections.map((section, idx) => (
                <Badge key={idx} variant="outline" className="text-yellow-600 border-yellow-600">
                  {section}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Missing Keywords */}
      {analysis.missingKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Missing Keywords</CardTitle>
            <CardDescription>Add these keywords to improve your match with the job description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((keyword, idx) => (
                <Badge key={idx} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
