import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge, { type ShipmentStatus } from "@/components/StatusBadge";
import { MapPin, Calendar } from "lucide-react";

export interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  pickup_address: string;
  delivery_address: string;
  status: ShipmentStatus;
  created_at: string;
  estimated_delivery?: string;
  package_description?: string;
}

interface ShipmentCardProps {
  shipment: Shipment;
  onClick?: () => void;
}

const ShipmentCard = ({ shipment, onClick }: ShipmentCardProps) => {
  const navigate = useNavigate();
  return (
    <Card
      className="glass-card cursor-pointer hover:shadow-md transition-all hover:border-primary/20"
      onClick={onClick ?? (() => navigate(`/shipments/${shipment.id}`))}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {shipment.tracking_number}
            </p>
            <p className="text-sm font-semibold text-foreground mt-1">
              {shipment.package_description || "Package"}
            </p>
          </div>
          <StatusBadge status={shipment.status} />
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary border-2 border-primary/30" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-sm text-foreground">{shipment.sender_name}</p>
              <p className="text-xs text-muted-foreground">{shipment.pickup_address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary border-2 border-secondary/30" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">To</p>
              <p className="text-sm text-foreground">{shipment.receiver_name}</p>
              <p className="text-xs text-muted-foreground">{shipment.delivery_address}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(shipment.created_at).toLocaleDateString()}
          </div>
          {shipment.estimated_delivery && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              ETA: {new Date(shipment.estimated_delivery).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentCard;
