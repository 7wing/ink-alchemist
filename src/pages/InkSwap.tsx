import { useState } from "react";
import ParchmentCard from "@/components/ParchmentCard";
import WaxSealBadge from "@/components/WaxSealBadge";
import MatchmakerBanner from "@/components/MatchmakerBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import inkBlue from "@/assets/inkwell-blue.png";
import inkGreen from "@/assets/inkwell-green.png";
import inkRed from "@/assets/inkwell-red.png";
import inkGold from "@/assets/inkwell-gold.png";

type ListingStatus = "available" | "pending" | "swapped";

interface InkListing {
  id: string;
  image: string;
  name: string;
  seller: string;
  price: string;
  size: string;
  status: ListingStatus;
  tags: string[];
}

interface PendingSwap {
  id: string;
  image: string;
  name: string;
  seller: string;
  price: string;
  size: string;
  status: ListingStatus;
  tags: string[];
}

const initialListings: InkListing[] = [
  {
    id: "l1",
    image: inkBlue,
    name: "Sailor Manyo Haha",
    seller: "QuillMaster42",
    price: "$4.00",
    size: "2ml vial",
    status: "available",
    tags: ["Shimmer", "Sheen", "Tomoe River tested"],
  },
  {
    id: "l2",
    image: inkRed,
    name: "Diamine Oxblood",
    seller: "InkAlchemist",
    price: "$3.50",
    size: "2ml vial",
    status: "available",
    tags: ["Sheen", "Rhodia tested"],
  },
  {
    id: "l3",
    image: inkGreen,
    name: "Pilot Iroshizuku Chiku-rin",
    seller: "PenCollector9",
    price: "$5.00",
    size: "3ml sample",
    status: "available",
    tags: ["Shading", "Tomoe River tested"],
  },
  {
    id: "l4",
    image: inkGold,
    name: "Robert Oster Sedona Red",
    seller: "SwatchSage",
    price: "$4.50",
    size: "2ml vial",
    status: "available",
    tags: ["Shimmer", "Sheen"],
  },
  {
    id: "l5",
    image: inkBlue,
    name: "Organics Studio Nitrogen",
    seller: "InkWizard",
    price: "$6.00",
    size: "3ml vial",
    status: "available",
    tags: ["Sheen", "Shading", "Rhodia tested"],
  },
  {
    id: "l6",
    image: inkRed,
    name: "Noodler's Apache Sunset",
    seller: "FountainFanatic",
    price: "$3.00",
    size: "2ml vial",
    status: "available",
    tags: ["Shading", "Tomoe River tested"],
  },
];

const initialMyListings: InkListing[] = [
  {
    id: "m1",
    image: inkGreen,
    name: "Sailor Tokiwa-matsu",
    seller: "You",
    price: "$4.00 or swap",
    size: "2ml vial",
    status: "available",
    tags: ["Shading", "Sheen"],
  },
  {
    id: "m2",
    image: inkGold,
    name: "J. Herbin Emeraude de Chivor",
    seller: "You",
    price: "$6.00 or swap",
    size: "3ml vial",
    status: "available",
    tags: ["Shimmer", "Sheen", "Tomoe River tested"],
  },
];

const initialPendingSwaps: PendingSwap[] = [
  {
    id: "p1",
    image: inkBlue,
    name: "Pilot Iroshizuku Kon-peki",
    seller: "QuillMaster42",
    price: "$5.00",
    size: "2ml vial",
    status: "pending",
    tags: ["Shading", "Rhodia tested"],
  },
];

const statusVariantMap: Record<ListingStatus, "default" | "limited" | "discontinued"> = {
  available: "default",
  pending: "limited",
  swapped: "discontinued",
};

const InkSwap = () => {
  const [listings, setListings] = useState<InkListing[]>(initialListings);
  const [myListings, setMyListings] = useState<InkListing[]>(initialMyListings);
  const [pendingSwaps, setPendingSwaps] = useState<PendingSwap[]>(initialPendingSwaps);
  const [showMatchmaker, setShowMatchmaker] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newListingName, setNewListingName] = useState("");
  const [newListingPrice, setNewListingPrice] = useState("");
  const [newListingSize, setNewListingSize] = useState("2ml vial");

  const handleRequestSample = (id: string) => {
    const item = listings.find((l) => l.id === id);
    if (!item) return;
    setListings((prev) => prev.filter((l) => l.id !== id));
    setPendingSwaps((prev) => [
      ...prev,
      { ...item, status: "pending" },
    ]);
    toast.success(`Requested sample of ${item.name}`);
  };

  const handleProposeSwap = () => {
    toast.success("Swap proposal sent!");
  };

  const handleDismissMatchmaker = () => {
    setShowMatchmaker(false);
  };

  const handleAddListing = () => {
    if (!newListingName.trim() || !newListingPrice.trim()) return;
    const newListing: InkListing = {
      id: `m-${Date.now()}`,
      image: inkRed,
      name: newListingName.trim(),
      seller: "You",
      price: newListingPrice.trim(),
      size: newListingSize.trim() || "2ml vial",
      status: "available",
      tags: ["Shading"],
    };
    setMyListings((prev) => [...prev, newListing]);
    setNewListingName("");
    setNewListingPrice("");
    setNewListingSize("2ml vial");
    setDialogOpen(false);
    toast.success("Listing added to My Listings");
  };

  const renderListingCard = (
    item: InkListing | PendingSwap,
    action?: (id: string) => void,
    actionLabel?: string
  ) => (
    <ParchmentCard key={item.id} className="hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-4">
        <img src={item.image} alt="" className="w-14 h-14 object-contain flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-base font-semibold text-foreground">{item.name}</h3>
            <WaxSealBadge
              label={item.status}
              variant={statusVariantMap[item.status]}
            />
          </div>
          <p className="text-xs text-muted-foreground font-label">
            {item.size} · by {item.seller}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 text-[10px] font-label uppercase tracking-wider rounded-full bg-secondary text-antique-gold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
          <p className="font-display text-lg text-primary font-semibold">{item.price}</p>
          {action && actionLabel && (
            <Button size="sm" onClick={() => action(item.id)}>
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </ParchmentCard>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Ink Swap · Sample Economy</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>List an Ink</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">List an Ink</DialogTitle>
                <DialogDescription className="font-label">
                  Add a new sample vial to your listings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ink-name" className="font-label">Ink Name</Label>
                  <Input
                    id="ink-name"
                    placeholder="e.g. Sailor Manyo Haha"
                    value={newListingName}
                    onChange={(e) => setNewListingName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ink-price" className="font-label">Price or Swap Value</Label>
                  <Input
                    id="ink-price"
                    placeholder="e.g. $4.00 or swap"
                    value={newListingPrice}
                    onChange={(e) => setNewListingPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ink-size" className="font-label">Vial Size</Label>
                  <Input
                    id="ink-size"
                    placeholder="e.g. 2ml vial"
                    value={newListingSize}
                    onChange={(e) => setNewListingSize(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddListing}>Save Listing</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-muted-foreground font-label mb-6">
          Trade ink samples with fellow scribes
        </p>

        {showMatchmaker && (
          <div className="mb-6">
            <MatchmakerBanner
              userA={{ name: "You", ink: "Sailor Yama-dori", color: "#0f4c75" }}
              userB={{ name: "InkAlchemist", ink: "Diamine Majestic Blue", color: "#1e3a5f" }}
              onPropose={handleProposeSwap}
              onDismiss={handleDismissMatchmaker}
            />
          </div>
        )}

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="available" className="font-label">Available Samples</TabsTrigger>
            <TabsTrigger value="my-listings" className="font-label">My Listings</TabsTrigger>
            <TabsTrigger value="pending" className="font-label">Pending Swaps</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="space-y-3">
              {listings.map((item) =>
                renderListingCard(item, handleRequestSample, "Request Sample")
              )}
              {listings.length === 0 && (
                <p className="text-sm text-muted-foreground font-label text-center py-8">
                  No available samples right now.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-listings">
            <div className="space-y-3">
              {myListings.map((item) => renderListingCard(item))}
              {myListings.length === 0 && (
                <p className="text-sm text-muted-foreground font-label text-center py-8">
                  You have no listings yet. Click "List an Ink" to get started.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-3">
              {pendingSwaps.map((item) => renderListingCard(item))}
              {pendingSwaps.length === 0 && (
                <p className="text-sm text-muted-foreground font-label text-center py-8">
                  No pending swaps.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default InkSwap;
