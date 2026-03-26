import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Package, Shield, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">CourierFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Log In
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Package className="h-4 w-4" />
            Fast & Reliable Courier Management
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Ship smarter with{" "}
            <span className="text-primary">CourierFlow</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create, track, and manage courier deliveries in one clean dashboard.
            Real-time updates, role-based access, and a seamless shipping experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-base px-8">
              Start Shipping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")} className="text-base px-8">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">
            Everything you need to manage deliveries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: "Easy Booking",
                desc: "Create courier requests in seconds with our simple, intuitive form.",
              },
              {
                icon: Truck,
                title: "Real-Time Tracking",
                desc: "Monitor your shipments from pickup to delivery with live status updates.",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                desc: "Role-based access control with end-to-end visibility for every package.",
              },
            ].map((f) => (
              <div key={f.title} className="glass-card rounded-xl p-6 space-y-4">
                <div className="p-3 rounded-xl bg-primary/10 w-fit">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 CourierFlow. Built with Lovable.
        </p>
      </footer>
    </div>
  );
};

export default Index;
