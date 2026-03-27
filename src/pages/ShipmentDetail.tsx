import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import StatusBadge, { type ShipmentStatus } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Menu, MapPin, Phone, Package, Calendar, Loader2, CheckCircle2, Circle, Truck, ClipboardCheck, PackageCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const trackingSteps: { status: ShipmentStatus; label: string; icon: React.ElementType }[] = [
  { status: "pending", label: "Order Placed", icon: ClipboardCheck },
  { status: "picked_up", label: "Picked Up", icon: Package },
  { status: "in_transit", label: "In Transit", icon: Truck },
  { status: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { status: "delivered", label: "Delivered", icon: PackageCheck },
];

function getStepIndex(status: ShipmentStatus) {
  if (status === "cancelled") return -1;
  return trackingSteps.findIndex((s) => s.status === status);
}

interface ShipmentDetail {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_phone: string | null;
  receiver_name: string;
  receiver_phone: string | null;
  pickup_address: string;
  delivery_address: string;
  status: ShipmentStatus;
  description: string | null;
  weight: number | null;
  priority: string;
  created_at: string;
  updated_at: string;
}

const ShipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, signOut } = useAuth();
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("id", id!)
        .single();

      if (!error && data) {
        setShipment({ ...data, status: data.status as ShipmentStatus });
      }
      setLoading(false);
    };
    if (id) fetch();
  }, [id]);

  const currentStep = shipment ? getStepIndex(shipment.status) : -1;

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <AppSidebar role={role === "admin" ? "admin" : "customer"} onLogout={async () => { await signOut(); navigate("/auth"); }} />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Shipment Details</h1>
              {shipment && (
                <p className="text-muted-foreground font-mono text-sm">{shipment.tracking_number}</p>
              )}
            </div>
            {shipment && <StatusBadge status={shipment.status} className="ml-auto" />}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !shipment ? (
            <p className="text-center text-muted-foreground py-16">Shipment not found.</p>
          ) : (
            <div className="space-y-6">
              {/* Tracking Timeline */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base">Tracking Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {shipment.status === "cancelled" ? (
                    <p className="text-destructive font-medium">This shipment has been cancelled.</p>
                  ) : (
                    <div className="flex items-start justify-between relative">
                      {/* Progress line */}
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted mx-10" />
                      <div
                        className="absolute top-5 left-0 h-0.5 bg-primary mx-10 transition-all duration-500"
                        style={{ width: `${currentStep >= 0 ? (currentStep / (trackingSteps.length - 1)) * 100 : 0}%` }}
                      />

                      {trackingSteps.map((step, i) => {
                        const isCompleted = i <= currentStep;
                        const isCurrent = i === currentStep;
                        const StepIcon = step.icon;

                        return (
                          <div key={step.status} className="flex flex-col items-center z-10 flex-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isCurrent
                                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                  : isCompleted
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isCompleted && !isCurrent ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <StepIcon className="h-5 w-5" />
                              )}
                            </div>
                            <span
                              className={`text-xs mt-2 text-center font-medium ${
                                isCompleted ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-base">Sender</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{shipment.sender_name}</p>
                      {shipment.sender_phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Phone className="h-3.5 w-3.5" /> {shipment.sender_phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Pickup Address</p>
                      <p className="text-sm text-foreground flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {shipment.pickup_address}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-base">Receiver</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{shipment.receiver_name}</p>
                      {shipment.receiver_phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Phone className="h-3.5 w-3.5" /> {shipment.receiver_phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Delivery Address</p>
                      <p className="text-sm text-foreground flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {shipment.delivery_address}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Package Info */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base">Package Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm font-medium text-foreground">{shipment.description || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="text-sm font-medium text-foreground">{shipment.weight ? `${shipment.weight} kg` : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Priority</p>
                      <p className="text-sm font-medium text-foreground capitalize">{shipment.priority}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm font-medium text-foreground">{new Date(shipment.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShipmentDetail;
