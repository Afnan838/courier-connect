import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import ShipmentCard from "@/components/ShipmentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Menu, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { ShipmentStatus } from "@/components/StatusBadge";
import type { Shipment } from "@/components/ShipmentCard";

const statusFilters: { value: ShipmentStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
];

const Shipments = () => {
  const navigate = useNavigate();
  const { role, signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setShipments(
          data.map((s) => ({
            id: s.id,
            tracking_number: s.tracking_number,
            sender_name: s.sender_name,
            receiver_name: s.receiver_name,
            pickup_address: s.pickup_address,
            delivery_address: s.delivery_address,
            status: s.status as ShipmentStatus,
            created_at: s.created_at,
            package_description: s.description ?? undefined,
          }))
        );
      }
      setLoading(false);
    };
    fetchShipments();
  }, []);

  const filtered = shipments.filter((s) => {
    const matchesSearch =
      s.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
      s.receiver_name.toLowerCase().includes(search.toLowerCase()) ||
      s.sender_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <AppSidebar role={role === "admin" ? "admin" : "customer"} onLogout={async () => { await signOut(); navigate("/auth"); }} />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <div>
            <button className="lg:hidden p-2 -ml-2 mb-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">My Shipments</h1>
            <p className="text-muted-foreground mt-1">Track and manage all your deliveries</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking #, name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map((f) => (
                <Button
                  key={f.value}
                  variant={statusFilter === f.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">No shipments found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((shipment) => (
                <ShipmentCard key={shipment.id} shipment={shipment} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Shipments;
