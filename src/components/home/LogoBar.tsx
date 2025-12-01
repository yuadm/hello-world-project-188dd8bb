import { Building2, Shield, Award, Users, BadgeCheck } from "lucide-react";

const partners = [
  { name: "Ofsted Registered", icon: Shield },
  { name: "ICO Compliant", icon: BadgeCheck },
  { name: "NCMA Partner", icon: Award },
  { name: "PACEY Approved", icon: Users },
  { name: "Local Authority", icon: Building2 },
];

const LogoBar = () => {
  return (
    <section className="py-12 border-y border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
          Trusted & Certified By Industry Leaders
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-muted-foreground/70 hover:text-foreground transition-colors duration-300 group"
            >
              <partner.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoBar;
