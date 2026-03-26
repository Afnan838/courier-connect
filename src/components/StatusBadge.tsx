import { cn } from "@/lib/utils";

export type ShipmentStatus = "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled";

const statusConfig: Record<ShipmentStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/15 text-warning" },
  picked_up: { label: "Picked Up", className: "bg-info/15 text-info" },
  in_transit: { label: "In Transit", className: "bg-primary/15 text-primary" },
  out_for_delivery: { label: "Out for Delivery", className: "bg-secondary/15 text-secondary" },
  delivered: { label: "Delivered", className: "bg-success/15 text-success" },
  cancelled: { label: "Cancelled", className: "bg-destructive/15 text-destructive" },
};

interface StatusBadgeProps {
  status: ShipmentStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span className={cn("status-badge", config.className, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
