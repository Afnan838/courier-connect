import { Link, useLocation } from "react-router-dom";
import { Package, LayoutDashboard, PlusCircle, Truck, Users, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  role: "customer" | "admin";
  onLogout?: () => void;
}

const AppSidebar = ({ role, onLogout }: AppSidebarProps) => {
  const location = useLocation();

  const customerLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/shipments/new", label: "New Shipment", icon: PlusCircle },
    { to: "/shipments", label: "My Shipments", icon: Package },
  ];

  const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/shipments", label: "All Shipments", icon: Package },
    { to: "/admin/users", label: "Users", icon: Users },
  ];

  const links = role === "admin" ? adminLinks : customerLinks;

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-sidebar-primary/20">
          <Truck className="h-6 w-6 text-sidebar-primary" />
        </div>
        <span className="text-lg font-bold">CourierFlow</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full">
          <Settings className="h-5 w-5" />
          Settings
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
