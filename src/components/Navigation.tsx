import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-primary">
            ChildMinder<span className="text-secondary">Pro</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-medium"
            >
              Home
            </NavLink>
            <NavLink 
              to="/features" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-medium"
            >
              Features
            </NavLink>
            <NavLink 
              to="/pricing" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-medium"
            >
              Pricing
            </NavLink>
            <NavLink 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-medium"
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-medium"
            >
              Contact
            </NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/apply">
              <Button variant="outline">Apply as Childminder</Button>
            </NavLink>
            <NavLink to="/join">
              <Button variant="default">Join as Agency</Button>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-4">
            <NavLink 
              to="/" 
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/features" 
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </NavLink>
            <NavLink 
              to="/pricing" 
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </NavLink>
            <NavLink 
              to="/about" 
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
            <div className="pt-4 space-y-3">
              <NavLink to="/apply" className="block">
                <Button variant="outline" className="w-full">Apply as Childminder</Button>
              </NavLink>
              <NavLink to="/join" className="block">
                <Button variant="default" className="w-full">Join as Agency</Button>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
