import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeData, Certification } from "@/types/resume";
import { PlusCircle, Trash2 } from "lucide-react";

interface CertificationsSectionProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

const generateId = () => `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function CertificationsSection({ resumeData, setResumeData }: CertificationsSectionProps) {
  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
      link: ''
    };
    setResumeData({ ...resumeData, certifications: [...resumeData.certifications, newCert] });
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };

  const removeCertification = (id: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter(cert => cert.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {resumeData.certifications.map((cert, index) => (
        <div key={cert.id} className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Certification #{index + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => removeCertification(cert.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Certification Name *</Label>
              <Input
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                placeholder="AWS Solutions Architect"
              />
            </div>
            <div className="space-y-2">
              <Label>Issuing Organization *</Label>
              <Input
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                placeholder="Jan 2024"
              />
            </div>
            <div className="space-y-2">
              <Label>Credential ID</Label>
              <Input
                value={cert.credentialId || ''}
                onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                placeholder="ABC123XYZ"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Verification Link</Label>
            <Input
              value={cert.link || ''}
              onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
              placeholder="https://www.credly.com/badges/..."
            />
          </div>
        </div>
      ))}

      <Button onClick={addCertification} variant="outline" className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
}
