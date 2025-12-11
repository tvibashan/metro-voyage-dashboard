"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import shadcn Select components
import { PREDEFINED_PARTICIPANT_TYPES } from "./items";


interface PricingTier {
  participant_type: { name: string; min_age: number; max_age: number };
  min_participants: number;
  max_participants: number;
  price: number;
}

interface PricingTiersModalProps {
  pricing_tiers: PricingTier[];
  onPricingTiersChange: (pricing_tiers: PricingTier[]) => void;
  onNext: () => void;
}

export default function PricingTiersModal({
  pricing_tiers = [],
  onPricingTiersChange,
}: PricingTiersModalProps) {
  const [newPricingTier, setNewPricingTier] = useState<PricingTier>({
    participant_type: { name: "", min_age: 0, max_age: 0 },
    min_participants: 1,
    max_participants: 1,
    price: 0,
  });

  const handleParticipantTypeChange = (value: string) => {
    const selectedType = PREDEFINED_PARTICIPANT_TYPES.find(
      (type) => type.name === value
    );
    if (selectedType) {
      setNewPricingTier({
        ...newPricingTier,
        participant_type: {
          name: selectedType.name,
          min_age: selectedType.min_age,
          max_age: selectedType.max_age,
        },
      });
    }
  };

  const addPricingTier = () => {
    const { participant_type, min_participants, max_participants, price } =
      newPricingTier;

    // Validation
    if (!participant_type.name) {
      toast.error("Please select a participant type.");
      return;
    }
    if (participant_type.min_age < 0 || participant_type.max_age < 0) {
      toast.error("Age values must be greater than or equal to 0.");
      return;
    }
    if (participant_type.min_age > participant_type.max_age) {
      toast.error("Minimum age cannot be greater than maximum age.");
      return;
    }
    if (min_participants < 1 || max_participants < 1) {
      toast.error("Minimum and maximum participants must be at least 1.");
      return;
    }
    if (min_participants > max_participants) {
      toast.error("Minimum participants cannot be greater than maximum participants.");
      return;
    }
    if (price < 0) {  // Changed from <= 0 to < 0 to allow 0 price
      toast.error("Price cannot be negative.");
      return;
    }

    // Add the new pricing tier
    onPricingTiersChange([...pricing_tiers, newPricingTier]);
    toast.success("Pricing tier added successfully!");

    // Reset the form
    setNewPricingTier({
      participant_type: { name: "", min_age: 0, max_age: 0 },
      min_participants: 1,
      max_participants: 1,
      price: 0,
    });
  };

  const removeNewTemplate = () => {
    setNewPricingTier({
      participant_type: { name: "", min_age: 0, max_age: 0 },
      min_participants: 1,
      max_participants: 1,
      price: 0,
    });
    toast.success("Draft template removed.");
  };

  const removePricingTier = (index: number) => {
    const updatedTiers = pricing_tiers.filter((_, i) => i !== index);
    onPricingTiersChange(updatedTiers);
    toast.success("Pricing tier removed successfully.");
  };

  const updatePricingTier = (index: number, updatedTier: PricingTier) => {
    const updatedTiers = pricing_tiers.map((tier, i) =>
      i === index ? updatedTier : tier
    );
    onPricingTiersChange(updatedTiers);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Manage Pricing Tiers</h2>

      {/* List of Pricing Tiers */}
      <div className="space-y-4">
        {pricing_tiers.map((tier, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Pricing Tier {index + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePricingTier(index)}
                className="text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Participant Type <span className="text-sm text-red-500">*</span></Label>
                <Input
                  value={tier.participant_type.name}
                  onChange={(e) =>
                    updatePricingTier(index, {
                      ...tier,
                      participant_type: {
                        ...tier.participant_type,
                        name: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Min Age</Label>
                <Input
                  type="number"
                  value={tier.participant_type.min_age}
                  onChange={(e) =>
                    updatePricingTier(index, {
                      ...tier,
                      participant_type: {
                        ...tier.participant_type,
                        min_age: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Max Age</Label>
                <Input
                  type="number"
                  value={tier.participant_type.max_age}
                  onChange={(e) =>
                    updatePricingTier(index, {
                      ...tier,
                      participant_type: {
                        ...tier.participant_type,
                        max_age: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Min Participants</Label>
                <Input
                  type="number"
                  value={tier.min_participants}
                  onChange={(e) =>
                    updatePricingTier(index, {
                      ...tier,
                      min_participants: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  value={tier.max_participants}
                  onChange={(e) =>
                    updatePricingTier(index, {
                      ...tier,
                      max_participants: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Price (€)</Label>
                <Input
                  type="number"
                  value={tier.price}
                  onChange={(e) =>
                    updatePricingTier(index, {
                      ...tier,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Pricing Tier Form */}
      <div className="mt-6 border p-4 rounded-lg shadow-sm">
        <h3 className="font-medium mb-4">Add New Pricing Tier</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Participant Type <span className="text-sm text-red-500">*</span></Label>
            <Select
              value={newPricingTier.participant_type.name}
              onValueChange={handleParticipantTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Participant Type" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_PARTICIPANT_TYPES.map((type, index) => (
                  <SelectItem key={index} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Min Age</Label>
            <Input
              type="number"
              value={newPricingTier.participant_type.min_age}
              onChange={(e) =>
                setNewPricingTier({
                  ...newPricingTier,
                  participant_type: {
                    ...newPricingTier.participant_type,
                    min_age: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Max Age</Label>
            <Input
              type="number"
              value={newPricingTier.participant_type.max_age}
              onChange={(e) =>
                setNewPricingTier({
                  ...newPricingTier,
                  participant_type: {
                    ...newPricingTier.participant_type,
                    max_age: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>
          <div>
            <Label>Min Participants</Label>
            <Input
              type="number"
              value={newPricingTier.min_participants}
              onChange={(e) =>
                setNewPricingTier({
                  ...newPricingTier,
                  min_participants: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label>Max Participants</Label>
            <Input
              type="number"
              value={newPricingTier.max_participants}
              onChange={(e) =>
                setNewPricingTier({
                  ...newPricingTier,
                  max_participants: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label>Price <span className="text-sm text-red-500">*</span></Label>
            <Input
              type="number"
              value={newPricingTier.price}
              onChange={(e) =>
                setNewPricingTier({
                  ...newPricingTier,
                  price: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={addPricingTier} className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Pricing Tier
          </Button>
          <Button
            onClick={removeNewTemplate}
            variant="ghost"
            size={"sm"}
            className="flex-1 w-fit"
          >
            <X className="h-4 w-4 mr-2 " />
          </Button>
        </div>
      </div>
    </div>
  );
}