import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const seatCategories = [
  { label: "RECLINER", price: 380, status: "Almost Full" },
  { label: "PRIME", price: 210, status: "Filling Fast" },
  { label: "CLASSIC", price: 190, status: "Available" },
];

const SeatBookingModal = () => {
  const [open, setOpen] = useState(false);
  const [selectedQty, setSelectedQty] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState(seatCategories[0]);

  const totalPrice = selectedQty * selectedCategory.price;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Confirm</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How Many Seats?</DialogTitle>
          <DialogDescription>
            Select the number of tickets and seat category.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Seat Quantity Selector */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((qty) => (
              <Button
                key={qty}
                variant={qty === selectedQty ? "default" : "outline"}
                onClick={() => setSelectedQty(qty)}
                className="w-10"
              >
                {qty}
              </Button>
            ))}
          </div>

          {/* Seat Category Selector */}
          <RadioGroup
            defaultValue={selectedCategory.label}
            onValueChange={(val) => {
              const found = seatCategories.find((c) => c.label === val);
              if (found) setSelectedCategory(found);
            }}
          >
            {seatCategories.map((cat) => (
              <div
                key={cat.label}
                className={cn(
                  "flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-muted",
                  selectedCategory.label === cat.label && "bg-muted border-primary"
                )}
              >
                <RadioGroupItem value={cat.label} />
                <div className="ml-4 flex flex-col gap-1">
                  <span className="font-semibold">{cat.label}</span>
                  <span className="text-sm text-muted-foreground">Rs. {cat.price}</span>
                  <span className="text-xs italic text-yellow-600">{cat.status}</span>
                </div>
              </div>
            ))}
          </RadioGroup>

          {/* Total */}
          <div className="text-center mt-4">
            <p className="text-lg font-medium">
              Total Price: <span className="text-primary">Rs. {totalPrice}</span>
            </p>
          </div>

          <div className="text-center">
            <Button className="mt-2 w-full">Select Seats</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeatBookingModal;
