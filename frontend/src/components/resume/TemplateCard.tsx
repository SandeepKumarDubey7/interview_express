
import { ResumeTemplate } from '@/data/resumeTemplates';
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TemplateCardProps {
  template: ResumeTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden card-hover transition-all duration-300 group">
      <div className="aspect-[4/5] relative">
        <img 
          src={template.previewImage} 
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="p-4 text-white">
            <h3 className="text-xl font-semibold">{template.name}</h3>
            <p className="text-sm text-white/80">{template.description}</p>
          </div>
        </div>
      </div>
      <CardFooter className="p-4">
        <Link to={`/resume-builder/${template.id}`} className="w-full">
          <Button className="w-full">
            Select Template
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
