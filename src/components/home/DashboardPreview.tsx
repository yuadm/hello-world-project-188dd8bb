import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ArrowRight, CheckCircle2, Users, Shield, FileText, Bell } from "lucide-react";

const DashboardPreview = () => {
  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-2 bg-secondary/10 rounded-full text-secondary font-semibold text-sm">
              Powerful Dashboard
            </span>
            <h2 className="text-4xl font-bold">
              Everything You Need,{" "}
              <span className="text-secondary">One Dashboard</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Monitor your entire agency at a glance. Track compliance, manage applications, 
              and stay on top of renewals with our intuitive admin dashboard.
            </p>

            <ul className="space-y-4">
              {[
                "Real-time compliance tracking",
                "Automated renewal reminders",
                "One-click document generation",
                "Instant application notifications",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <NavLink to="/join">
              <Button size="lg" className="group mt-4">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </NavLink>
          </div>

          {/* Right side - Dashboard mockup */}
          <div className="relative">
            {/* Browser frame */}
            <div className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
              {/* Browser header */}
              <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-secondary/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
                    app.childminderpro.com/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content mockup */}
              <div className="p-6 bg-background">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { icon: Users, label: "Active", value: "124", color: "text-primary" },
                    { icon: Shield, label: "Compliant", value: "98%", color: "text-accent" },
                    { icon: FileText, label: "Pending", value: "12", color: "text-secondary" },
                    { icon: Bell, label: "Alerts", value: "3", color: "text-destructive" },
                  ].map((stat, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-3 text-center">
                      <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Table mockup */}
                <div className="space-y-2">
                  <div className="h-8 bg-muted/50 rounded-md" />
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-10 bg-muted/30 rounded-md flex-1" />
                      <div className="h-10 bg-muted/30 rounded-md w-24" />
                      <div className="h-10 bg-accent/20 rounded-md w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating notification card */}
            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-lg shadow-lg border border-border animate-fade-in hidden md:block">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">DBS Renewal Due</div>
                  <div className="text-xs text-muted-foreground">Sarah M. - 7 days</div>
                </div>
              </div>
            </div>

            {/* Floating compliance card */}
            <div className="absolute -top-4 -right-4 bg-card p-4 rounded-lg shadow-lg border border-border animate-fade-in hidden md:block">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">All Checks Passed</div>
                  <div className="text-xs text-muted-foreground">John D. - Just now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
