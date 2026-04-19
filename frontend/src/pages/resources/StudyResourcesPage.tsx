
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { studyResources } from "@/data/studyResources";
import { ExternalLink, BookOpen, Video, FileText, Code } from "lucide-react";

export default function StudyResourcesPage() {
  const { currentUser } = useAuth();
  
  // Redirect if no user
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Group resources by category
  const resourcesByCategory = studyResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof studyResources>);
  
  const categories = Object.keys(resourcesByCategory);

  const getIconForResourceType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'documentation':
        return <BookOpen className="h-5 w-5" />;
      case 'interactive':
        return <Code className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Resources</h1>
          <p className="text-muted-foreground">
            Curated learning materials to help you prepare for interviews and improve your skills
          </p>
        </div>
        
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="w-full flex-wrap justify-start">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {resourcesByCategory[category].map((resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {getIconForResourceType(resource.type)}
                          <span className="ml-2">{resource.title}</span>
                        </CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </div>
                      <Badge>{resource.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{resource.description}</p>
                    <div className="flex items-center space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <a href={resource.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Resource
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
