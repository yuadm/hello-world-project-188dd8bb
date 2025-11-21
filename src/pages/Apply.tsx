import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

const Apply = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    
    // Living Situation
    householdMembers: "",
    nonFamilyAdults: "",
    expectedNewMembers: "",
    
    // DBS & Criminal Checks
    dbsNumber: "",
    dbsConsent: false,
    
    // Experience & Qualifications
    previousExperience: "",
    qualifications: "",
    references: "",
    firstAidCert: false,
    
    // Health & Safety
    suitableSpace: "",
    knownRisks: "",
    publicLiabilityInsurance: "",
    premisesType: "",
    
    // Availability
    availableDays: [] as string[],
    availableHours: "",
    maxChildren: "",
    
    // Declarations
    futureDisclosure: false,
    healthDeclaration: false,
    dataConsent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application submitted successfully! We'll review your application and be in touch soon.");
    console.log("Application submitted:", formData);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
              Personal Information
            </h3>
            
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="Your full legal name"
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="07XXX XXXXXX"
              />
            </div>

            <div>
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Your complete address including postcode"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
              Living Situation
            </h3>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> Ofsted requires DBS checks for all adults (16+) living in or working at your home during childcare hours.
              </p>
            </div>

            <div>
              <Label htmlFor="householdMembers">Who lives in your home? *</Label>
              <Textarea
                id="householdMembers"
                required
                value={formData.householdMembers}
                onChange={(e) => setFormData({...formData, householdMembers: e.target.value})}
                placeholder="List all people aged 16 or over: names, relationships, ages/DOB"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="nonFamilyAdults">Non-family adults during childcare hours *</Label>
              <Textarea
                id="nonFamilyAdults"
                required
                value={formData.nonFamilyAdults}
                onChange={(e) => setFormData({...formData, nonFamilyAdults: e.target.value})}
                placeholder="Do any non-family adults (e.g., cleaners, assistants) live in or work in your home during childcare hours? Provide details or write 'None'"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="expectedNewMembers">Expected new household members *</Label>
              <Textarea
                id="expectedNewMembers"
                required
                value={formData.expectedNewMembers}
                onChange={(e) => setFormData({...formData, expectedNewMembers: e.target.value})}
                placeholder="Are there any new people (16+) expected to move in? Provide details or write 'None'"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
              DBS & Compliance Checks
            </h3>

            <div>
              <Label htmlFor="dbsNumber">DBS Certificate Number</Label>
              <Input
                id="dbsNumber"
                value={formData.dbsNumber}
                onChange={(e) => setFormData({...formData, dbsNumber: e.target.value})}
                placeholder="Enter your DBS number or leave blank if not yet obtained"
              />
              <p className="text-sm text-muted-foreground mt-1">
                If you don't have a DBS certificate yet, we'll help you apply
              </p>
            </div>

            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <Label>Document Uploads</Label>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload DBS Certificate (if available)
                </Button>
                <Button variant="outline" className="w-full justify-start" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Identity Proof (Passport/Driving License)
                </Button>
                <Button variant="outline" className="w-full justify-start" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Address Proof
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
              <Checkbox
                id="dbsConsent"
                checked={formData.dbsConsent}
                onCheckedChange={(checked) => setFormData({...formData, dbsConsent: checked as boolean})}
              />
              <div className="space-y-1 leading-none">
                <label htmlFor="dbsConsent" className="text-sm font-medium cursor-pointer">
                  DBS Check Consent *
                </label>
                <p className="text-sm text-muted-foreground">
                  I consent to enhanced DBS checks being carried out on myself and all household members aged 16+
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
              Experience & Qualifications
            </h3>

            <div>
              <Label htmlFor="previousExperience">Previous Childcare Experience *</Label>
              <Textarea
                id="previousExperience"
                required
                value={formData.previousExperience}
                onChange={(e) => setFormData({...formData, previousExperience: e.target.value})}
                placeholder="Describe your childcare experience, including years and types of settings"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="qualifications">Childcare Qualifications *</Label>
              <Textarea
                id="qualifications"
                required
                value={formData.qualifications}
                onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                placeholder="List all relevant qualifications (e.g., NVQ Level 3, Cache Diploma)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="references">References *</Label>
              <Textarea
                id="references"
                required
                value={formData.references}
                onChange={(e) => setFormData({...formData, references: e.target.value})}
                placeholder="Provide 2 professional references: names, relationship, contact details"
                rows={4}
              />
            </div>

            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <Label>Qualification Documents</Label>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload First Aid Certificate *
                </Button>
                <Button variant="outline" className="w-full justify-start" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Childcare Qualifications
                </Button>
                <Button variant="outline" className="w-full justify-start" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Health Declaration Form
                </Button>
              </div>
            </div>

            <div>
              <Label>Premises Type *</Label>
              <RadioGroup 
                value={formData.premisesType}
                onValueChange={(value) => setFormData({...formData, premisesType: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="domestic" id="domestic" />
                  <Label htmlFor="domestic" className="font-normal cursor-pointer">
                    Domestic premises (my home)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-domestic" id="non-domestic" />
                  <Label htmlFor="non-domestic" className="font-normal cursor-pointer">
                    Non-domestic premises (separate facility)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="suitableSpace">Property Suitability *</Label>
              <Textarea
                id="suitableSpace"
                required
                value={formData.suitableSpace}
                onChange={(e) => setFormData({...formData, suitableSpace: e.target.value})}
                placeholder="Describe suitable spaces for childcare, outdoor access, safety features"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="knownRisks">Known Risks or Hazards *</Label>
              <Textarea
                id="knownRisks"
                required
                value={formData.knownRisks}
                onChange={(e) => setFormData({...formData, knownRisks: e.target.value})}
                placeholder="List any risks (stairs, animals, ponds, etc.) or write 'None'"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="publicLiabilityInsurance">Public Liability Insurance *</Label>
              <Select 
                value={formData.publicLiabilityInsurance}
                onValueChange={(value) => setFormData({...formData, publicLiabilityInsurance: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Do you have public liability insurance?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, I have insurance</SelectItem>
                  <SelectItem value="no">No, I need to arrange this</SelectItem>
                  <SelectItem value="pending">Application pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">5</div>
              Availability & Declarations
            </h3>

            <div>
              <Label>Available Days *</Label>
              <div className="space-y-2 mt-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.availableDays.includes(day)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({...formData, availableDays: [...formData.availableDays, day]});
                        } else {
                          setFormData({...formData, availableDays: formData.availableDays.filter(d => d !== day)});
                        }
                      }}
                    />
                    <Label htmlFor={day} className="font-normal cursor-pointer">{day}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="availableHours">Available Hours *</Label>
              <Input
                id="availableHours"
                required
                value={formData.availableHours}
                onChange={(e) => setFormData({...formData, availableHours: e.target.value})}
                placeholder="e.g., 7:30 AM - 6:00 PM"
              />
            </div>

            <div>
              <Label htmlFor="maxChildren">Maximum Children You Can Care For *</Label>
              <Select 
                value={formData.maxChildren}
                onValueChange={(value) => setFormData({...formData, maxChildren: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">1-2 children</SelectItem>
                  <SelectItem value="3-4">3-4 children</SelectItem>
                  <SelectItem value="5-6">5-6 children</SelectItem>
                  <SelectItem value="6+">6+ children</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="font-semibold">Final Declarations</h4>
              
              <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                <Checkbox
                  id="futureDisclosure"
                  checked={formData.futureDisclosure}
                  onCheckedChange={(checked) => setFormData({...formData, futureDisclosure: checked as boolean})}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="futureDisclosure" className="text-sm font-medium cursor-pointer">
                    Future Disclosure Agreement *
                  </label>
                  <p className="text-sm text-muted-foreground">
                    I confirm I will disclose any new household members aged 16 or over in future
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                <Checkbox
                  id="healthDeclaration"
                  checked={formData.healthDeclaration}
                  onCheckedChange={(checked) => setFormData({...formData, healthDeclaration: checked as boolean})}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="healthDeclaration" className="text-sm font-medium cursor-pointer">
                    Health Declaration *
                  </label>
                  <p className="text-sm text-muted-foreground">
                    I confirm I am in good health and fit to care for children (doctor's declaration may be required)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                <Checkbox
                  id="dataConsent"
                  checked={formData.dataConsent}
                  onCheckedChange={(checked) => setFormData({...formData, dataConsent: checked as boolean})}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="dataConsent" className="text-sm font-medium cursor-pointer">
                    Data & Privacy Consent *
                  </label>
                  <p className="text-sm text-muted-foreground">
                    I consent to my information being shared with the agency and agree to GDPR terms
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Apply to Become a <span className="text-primary">Childminder</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Join our professional network of registered childminders
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex-1 flex items-center">
                    <div className={`h-2 flex-1 ${step <= currentStep ? 'bg-primary' : 'bg-muted'} ${step === 1 ? 'rounded-l-full' : ''} ${step === 5 ? 'rounded-r-full' : ''}`} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Personal Info</span>
                <span>Living Situation</span>
                <span>DBS Checks</span>
                <span>Experience</span>
                <span>Availability</span>
              </div>
            </div>

            {/* Form Card */}
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Step {currentStep} of {totalSteps}
                </CardTitle>
                <CardDescription>
                  Please provide accurate information. All fields marked with * are required.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit}>
                  {renderStepContent()}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </Button>
                    
                    {currentStep < totalSteps ? (
                      <Button type="button" onClick={nextStep}>
                        Next Step
                      </Button>
                    ) : (
                      <Button 
                        type="submit"
                        disabled={!formData.futureDisclosure || !formData.healthDeclaration || !formData.dataConsent}
                      >
                        Submit Application
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="mt-8 p-6 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-4">
                <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    If you have questions about the application process or need assistance with any section, please contact us:
                  </p>
                  <p className="text-sm">
                    Email: <a href="mailto:applications@childminderpro.com" className="text-primary hover:underline">applications@childminderpro.com</a>
                  </p>
                  <p className="text-sm">
                    Phone: <a href="tel:08001234567" className="text-primary hover:underline">0800 123 4567</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Apply;
