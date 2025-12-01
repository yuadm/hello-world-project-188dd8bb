import { UserPlus, ClipboardCheck, Shield, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your agency account in minutes with our simple onboarding process",
    step: "01",
  },
  {
    icon: ClipboardCheck,
    title: "Add Childminders",
    description: "Invite childminders to apply through your branded recruitment portal",
    step: "02",
  },
  {
    icon: Shield,
    title: "Track Compliance",
    description: "Automated DBS checks, qualifications tracking, and Ofsted-ready documentation",
    step: "03",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Agency",
    description: "Scale confidently with real-time dashboards and automated workflows",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl font-bold mb-4">
            Get Started in{" "}
            <span className="text-primary">4 Easy Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From sign-up to fully managing your childminder network in no time
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                {/* Step number */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute inset-0 bg-primary/10 rounded-full scale-150 group-hover:scale-[1.7] transition-transform duration-500" />
                  <div className="relative h-16 w-16 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors duration-300 shadow-lg">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
