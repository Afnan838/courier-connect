import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import StatsCard from "@/components/StatsCard";
import ShipmentCard from "@/components/ShipmentCard";
import { Package, Truck, CheckCircle, Clock, PlusCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockShipments } from "@/data/mockData";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const shipments = mockShipments.slice(0, 4);

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === "in_transit").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
    pending: shipments.filter((s) => s.status === "pending").length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <AppSidebar role="customer" onLogout={() => navigate("/auth")} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <button className="lg:hidden p-2 -ml-2 mb-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back! Here's your shipping overview.</p>
            </div>
            <Button onClick={() => navigate("/shipments/new")} className="hidden sm:flex">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Shipment
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Shipments" value={stats.total} icon={Package} />
            <StatsCard title="In Transit" value={stats.inTransit} icon={Truck} trend="+2 this week" trendUp />
            <StatsCard title="Delivered" value={stats.delivered} icon={CheckCircle} />
            <StatsCard title="Pending" value={stats.pending} icon={Clock} />
          </div>

          {/* Recent Shipments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Shipments</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/shipments")}>
                View all
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shipments.map((shipment) => (
                <ShipmentCard key={shipment.id} shipment={shipment} />
              ))}
            </div>
          </div>

          {/* Mobile FAB */}
          <Button
            onClick={() => navigate("/shipments/new")}
            className="sm:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-30"
            size="icon"
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
