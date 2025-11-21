import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";

const Join = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    numberOfChildminders: "",
    plan: "",
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    // For now, just show success message
    // Backend will be implemented later
    toast.success("Application submitted! We'll be in touch shortly.");
    console.log("Form submitted:", formData);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Join Our <span className="text-primary">Agency Network</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Start your free 14-day trial and transform your childminding agency
              </p>
            </div>

            {/* Form Card */}
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Agency Registration</CardTitle>
                <CardDescription>
                  Fill in your details below to get started with ChildMinderPro
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Company Information</h3>
                    
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        required
                        value={formData.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        placeholder="Your Childminding Agency Ltd"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Business Address *</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="123 High Street, London"
                      />
                    </div>

                    <div>
                      <Label htmlFor="numberOfChildminders">Current Number of Childminders *</Label>
                      <Select 
                        value={formData.numberOfChildminders}
                        onValueChange={(value) => handleChange("numberOfChildminders", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-10">0-10</SelectItem>
                          <SelectItem value="11-25">11-25</SelectItem>
                          <SelectItem value="26-50">26-50</SelectItem>
                          <SelectItem value="51-100">51-100</SelectItem>
                          <SelectItem value="100+">100+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Primary Contact</h3>
                    
                    <div>
                      <Label htmlFor="contactName">Full Name *</Label>
                      <Input
                        id="contactName"
                        required
                        value={formData.contactName}
                        onChange={(e) => handleChange("contactName", e.target.value)}
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="john@yourcompany.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="07XXX XXXXXX"
                      />
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Choose Your Plan</h3>
                    
                    <div>
                      <Label htmlFor="plan">Select Plan *</Label>
                      <Select 
                        value={formData.plan}
                        onValueChange={(value) => handleChange("plan", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="starter">Starter - £99/month</SelectItem>
                          <SelectItem value="professional">Professional - £249/month</SelectItem>
                          <SelectItem value="enterprise">Enterprise - Custom Pricing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleChange("agreeToTerms", checked as boolean)}
                    />
                    <div className="space-y-1 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-relaxed cursor-pointer"
                      >
                        I agree to the Terms of Service and Privacy Policy *
                      </label>
                      <p className="text-sm text-muted-foreground">
                        By signing up, you agree to our terms and privacy policy. No credit card required for trial.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full">
                    Start Your Free Trial
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    14-day free trial • No credit card required • Cancel anytime
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Questions? Contact us at{" "}
                <a href="mailto:info@childminderpro.com" className="text-primary hover:underline">
                  info@childminderpro.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Join;
