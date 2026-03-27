import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import StatsCard from "@/components/StatsCard";
import StatusBadge, { type ShipmentStatus } from "@/components/StatusBadge";
import { Package, Truck, CheckCircle, Clock, Menu, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const statusOptions: ShipmentStatus[] = ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "cancelled"];

interface AdminShipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  pickup_address: string;
  delivery_address: string;
  status: ShipmentStatus;
  created_at: string;
  description: string | null;
  priority: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [shipments, setShipments] = useState<AdminShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchShipments = async () => {
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setShipments(data.map((s) => ({ ...s, status: s.status as ShipmentStatus })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === "in_transit").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
    pending: shipments.filter((s) => s.status === "pending").length,
  };

  const handleStatusChange = async (id: string, newStatus: ShipmentStatus) => {
    const { error } = await supabase
      .from("shipments")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setShipments((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      toast({ title: "Status Updated", description: `Shipment status changed to ${newStatus.replace(/_/g, " ")}` });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <AppSidebar role="admin" onLogout={async () => { await signOut(); navigate("/auth"); }} />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
          <div>
            <button className="lg:hidden p-2 -ml-2 mb-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage all shipments and users</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Shipments" value={stats.total} icon={Package} />
            <StatsCard title="In Transit" value={stats.inTransit} icon={Truck} />
            <StatsCard title="Delivered" value={stats.delivered} icon={CheckCircle} />
            <StatsCard title="Pending" value={stats.pending} icon={Clock} />
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>All Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : shipments.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No shipments yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking #</TableHead>
                        <TableHead>Sender</TableHead>
                        <TableHead>Receiver</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Update Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-mono text-xs">{shipment.tracking_number}</TableCell>
                          <TableCell>{shipment.sender_name}</TableCell>
                          <TableCell>{shipment.receiver_name}</TableCell>
                          <TableCell>
                            <StatusBadge status={shipment.status} />
                          </TableCell>
                          <TableCell className="capitalize text-sm">{shipment.priority}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(shipment.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <select
                              value={shipment.status}
                              onChange={(e) => handleStatusChange(shipment.id, e.target.value as ShipmentStatus)}
                              className="text-xs border border-input rounded-md px-2 py-1.5 bg-background text-foreground capitalize"
                            >
                              {statusOptions.map((s) => (
                                <option key={s} value={s}>
                                  {s.replace(/_/g, " ")}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
