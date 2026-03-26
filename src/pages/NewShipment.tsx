import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewShipment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Connect to Supabase
    setTimeout(() => {
      toast({ title: "Shipment Created", description: "Your courier request has been submitted successfully." });
      setIsLoading(false);
      navigate("/shipments");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <AppSidebar role="customer" onLogout={() => navigate("/auth")} />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">New Shipment</h1>
              <p className="text-muted-foreground">Fill in the details to create a courier request</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sender Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Sender Information</CardTitle>
                <CardDescription>Who is sending this package?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input id="senderName" name="senderName" placeholder="Full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderPhone">Phone Number</Label>
                    <Input id="senderPhone" name="senderPhone" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupAddress">Pickup Address</Label>
                  <Input id="pickupAddress" name="pickupAddress" placeholder="Full address" required />
                </div>
              </CardContent>
            </Card>

            {/* Receiver Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Receiver Information</CardTitle>
                <CardDescription>Where should the package be delivered?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiverName">Receiver Name</Label>
                    <Input id="receiverName" name="receiverName" placeholder="Full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiverPhone">Phone Number</Label>
                    <Input id="receiverPhone" name="receiverPhone" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Input id="deliveryAddress" name="deliveryAddress" placeholder="Full address" required />
                </div>
              </CardContent>
            </Card>

            {/* Package Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Package Details</CardTitle>
                <CardDescription>Describe the package being shipped</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Package Description</Label>
                  <Textarea id="description" name="description" placeholder="e.g. Electronics, Documents, Fragile items..." rows={3} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" name="weight" type="number" placeholder="0.0" step="0.1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      name="priority"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                      <option value="overnight">Overnight</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Create Shipment"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewShipment;
