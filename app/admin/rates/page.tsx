"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/component/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/component/ui/dialog";
import { ApiResponse } from "@/types/admin";
import { PricingRate, PricingRange } from "@/types/rates";
import toast from "react-hot-toast";
import { Plus, Trash2, Save } from "lucide-react";

const CAR_CATEGORIES = [
  "ECONOMY",
  "BUSINESS_SEDAN",
  "ECONOMY_VAN",
  "BUSINESS_VAN",
  "MINIBUS_12",
  "MINIBUS_16",
] as const;

const DEFAULT_PRICING_STRUCTURE: PricingRange[] = [
  { min: 0, max: 3, type: "fixed", price: 10 },
  { min: 3, max: 5, type: "fixed", price: 12 },
  { min: 5, max: 10, type: "per_km", price: 2 },
  { min: 10, max: 15, type: "per_km", price: 4 },
  { min: 15, max: 20, type: "per_km", price: 6 },
  { min: 20, max: 25, type: "per_km", price: 8 },
  { min: 25, max: 30, type: "per_km", price: 10 },
  { min: 30, max: 35, type: "per_km", price: 12 },
  { min: 35, max: 40, type: "per_km", price: 14 },
  { min: 40, max: 45, type: "per_km", price: 16 },
  { min: 45, max: 50, type: "per_km", price: 18 },
  { min: 50, max: 55, type: "per_km", price: 20 },
  { min: 55, max: 60, type: "per_km", price: 22 },
  { min: 60, max: 65, type: "per_km", price: 24 },
  { min: 65, max: 70, type: "per_km", price: 26 },
  { min: 70, max: 75, type: "per_km", price: 28 },
  { min: 75, max: 80, type: "per_km", price: 30 },
  { min: 80, max: 85, type: "per_km", price: 32 },
  { min: 85, max: 90, type: "per_km", price: 34 },
  { min: 90, max: 95, type: "per_km", price: 36 },
  { min: 95, max: 100, type: "per_km", price: 38 },
  { min: 100, max: Infinity, type: "per_km", price: 40 },
];

export default function RatesPage() {
  const [rates, setRates] = useState<Record<string, PricingRate>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(CAR_CATEGORIES[0]);
  const [editingRates, setEditingRates] = useState<
    Record<string, PricingRange[]>
  >({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<Record<string, boolean>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ category: string; index: number } | null>(null);
  const [savingCategory, setSavingCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/rates");
      const result: ApiResponse<PricingRate[]> = await response.json();

      if (result.success && result.data) {
        const ratesMap: Record<string, PricingRate> = {};
        result.data.forEach((rate) => {
          // Ensure category is stored exactly as it appears in the database
          ratesMap[rate.category] = rate;
        });
        setRates(ratesMap);
        console.log("Fetched rates:", Object.keys(ratesMap)); // Debug log

        // Initialize editing rates
        const editingMap: Record<string, PricingRange[]> = {};
        const unsavedMap: Record<string, boolean> = {};
        CAR_CATEGORIES.forEach((category) => {
          if (ratesMap[category]) {
            // Convert null max values to Infinity for display
            editingMap[category] = (ratesMap[category].pricing_structure as PricingRange[]).map(range => ({
              ...range,
              max: range.max === null ? Infinity : range.max
            }));
          } else {
            editingMap[category] = [...DEFAULT_PRICING_STRUCTURE];
          }
          unsavedMap[category] = false;
        });
        setEditingRates(editingMap);
        setHasUnsavedChanges(unsavedMap);
      } else {
        toast.error(result.error || "Failed to load rates");
      }
    } catch (error) {
      console.error("Rates error:", error);
      toast.error("An error occurred while loading rates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRange = (
    category: string,
    index: number,
    field: keyof PricingRange,
    value: number | string
  ) => {
    setEditingRates((prev) => {
      const updated = [...(prev[category] || [])];
      updated[index] = { ...updated[index], [field]: value };
      
      // Auto-adjust next range's min if we're updating max
      if (field === "max" && index < updated.length - 1) {
        const nextRange = updated[index + 1];
        const newMax = value === null || value === Infinity ? null : (typeof value === "number" ? value : parseFloat(value as string));
        if (nextRange && nextRange.min !== newMax) {
          updated[index + 1] = { ...nextRange, min: newMax || 0 };
        }
      }
      
      // Auto-adjust previous range's max if we're updating min
      if (field === "min" && index > 0) {
        const prevRange = updated[index - 1];
        const newMin = typeof value === "number" ? value : parseFloat(value as string);
        if (prevRange && (prevRange.max === null || prevRange.max === Infinity || prevRange.max !== newMin)) {
          updated[index - 1] = { ...prevRange, max: newMin };
        }
      }
      
      return { ...prev, [category]: updated };
    });
    
    // Mark as having unsaved changes
    setHasUnsavedChanges((prev) => ({ ...prev, [category]: true }));
  };

  const handleAddRange = (category: string) => {
    setEditingRates((prev) => {
      const current = prev[category] || [];
      const lastRange = current[current.length - 1];
      const lastMax = lastRange?.max === null || lastRange?.max === Infinity ? 100 : (lastRange.max as number);
      const newRange: PricingRange = {
        min: lastMax,
        max: lastMax + 5,
        type: "per_km",
        price: lastRange ? lastRange.price + 2 : 2,
      };
      return {
        ...prev,
        [category]: [...current, newRange],
      };
    });
    setHasUnsavedChanges((prev) => ({ ...prev, [category]: true }));
  };




  const handleRemoveRange = (category: string, index: number) => {
    setDeleteConfirm({ category, index });
  };

  const confirmDeleteRange = () => {
    if (!deleteConfirm) return;
    
    const { category, index } = deleteConfirm;
    setEditingRates((prev) => {
      const updated = [...(prev[category] || [])];
      updated.splice(index, 1);
      return { ...prev, [category]: updated };
    });
    setHasUnsavedChanges((prev) => ({ ...prev, [category]: true }));
    setDeleteConfirm(null);
    toast.success("Pricing range deleted successfully");
  };

  const handleSave = async (category: string) => {
    setSavingCategory(category);
    try {
      const pricingStructure = editingRates[category];
      if (!pricingStructure || pricingStructure.length === 0) {
        toast.error("Please add at least one pricing range");
        return;
      }

      // Validate and convert Infinity to null for database storage
      const pricingStructureForDB = pricingStructure.map((range, idx) => {
        const min = typeof range.min === 'number' && !isNaN(range.min) ? range.min : 0;
        const max = range.max === Infinity || range.max === null 
          ? null 
          : (typeof range.max === 'number' && !isNaN(range.max) ? range.max : null);
        const price = typeof range.price === 'number' && !isNaN(range.price) ? range.price : 0;
        const type = range.type === "fixed" || range.type === "per_km" ? range.type : "per_km";
        
        // Validation checks
        if (min < 0) {
          toast.error(`Range ${idx + 1}: Min distance cannot be negative`);
          throw new Error("Validation failed");
        }
        if (max !== null && max <= min) {
          toast.error(`Range ${idx + 1}: Max distance must be greater than min distance`);
          throw new Error("Validation failed");
        }
        if (price < 0) {
          toast.error(`Range ${idx + 1}: Price cannot be negative`);
          throw new Error("Validation failed");
        }
        
        return {
          min,
          max,
          type,
          price,
        };
      });

      // Check if rate exists in our state, then decide to update or create
      const rateExists = rates[category] !== undefined;
      const encodedCategory = encodeURIComponent(category);
      
      console.log("Saving category:", category, "Exists:", rateExists); // Debug log

      if (rateExists) {
        // Update existing rate
        const updateResponse = await fetch(`/api/admin/rates/${encodedCategory}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pricing_structure: pricingStructureForDB,
          }),
        });

        const updateResult: ApiResponse = await updateResponse.json();

        if (updateResult.success) {
          toast.success(`Pricing rates for ${category.replace(/_/g, " ")} updated successfully!`, {
            duration: 3000,
            icon: "✅",
          });
          setHasUnsavedChanges((prev) => ({ ...prev, [category]: false }));
          fetchRates();
        } else {
          console.error("Update rate error:", updateResult);
          toast.error(updateResult.error || "Failed to update rates");
        }
      } else {
        // Create new rate
        const createResponse = await fetch("/api/admin/rates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category,
            pricing_structure: pricingStructureForDB,
          }),
        });

        const createResult: ApiResponse = await createResponse.json();

        if (createResult.success) {
          toast.success(`Pricing rates for ${category.replace(/_/g, " ")} created successfully!`, {
            duration: 3000,
            icon: "✅",
          });
          setHasUnsavedChanges((prev) => ({ ...prev, [category]: false }));
          fetchRates();
        } else {
          // If create fails because it already exists, try to update instead
          if (createResult.error?.includes("already exists")) {
            const updateResponse = await fetch(`/api/admin/rates/${encodedCategory}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pricing_structure: pricingStructureForDB,
              }),
            });

            const updateResult: ApiResponse = await updateResponse.json();

            if (updateResult.success) {
              toast.success(`Pricing rates for ${category.replace(/_/g, " ")} updated successfully!`, {
                duration: 3000,
                icon: "✅",
              });
              setHasUnsavedChanges((prev) => ({ ...prev, [category]: false }));
              fetchRates();
            } else {
              console.error("Update rate error after create failed:", updateResult);
              toast.error(updateResult.error || "Failed to update rates");
            }
          } else {
            console.error("Create rate error:", createResult);
            toast.error(createResult.error || "Failed to create rates");
          }
        }
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving rates");
    } finally {
      setSavingCategory(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pricing Rates Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure pricing rates per kilometer for each car category
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {CAR_CATEGORIES.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs lg:text-sm">
              {category.replace(/_/g, " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        {CAR_CATEGORIES.map((category) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle>{category.replace(/_/g, " ")} Pricing</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button 
                      onClick={() => handleSave(category)}
                      isLoading={savingCategory === category}
                      className={hasUnsavedChanges[category] ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {hasUnsavedChanges[category] ? "Save Changes" : "Save Rates"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {editingRates[category]?.map((range, index) => (
                    <div
                      key={index}
                      className="flex items-end gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <Label>Min Distance (km)</Label>
                        <Input
                          type="number"
                          value={range.min}
                          onChange={(e) =>
                            handleUpdateRange(
                              category,
                              index,
                              "min",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          min={0}
                          className="bg-background"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Max Distance (km)</Label>
                        <Input
                          type="number"
                          value={range.max === Infinity || range.max === null ? "" : range.max}
                          onChange={(e) =>
                            handleUpdateRange(
                              category,
                              index,
                              "max",
                              e.target.value === "" ? (null as any) : parseFloat(e.target.value) || 0
                            )
                          }
                          min={range.min}
                          placeholder="∞ (Infinity)"
                          className="bg-background"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Type</Label>
                        <Select
                          value={range.type}
                          onValueChange={(value) =>
                            handleUpdateRange(category, index, "type", value)
                          }
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Price</SelectItem>
                            <SelectItem value="per_km">Per Kilometer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Label>
                          {range.type === "fixed" ? "Price (€)" : "Price per km (€)"}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={range.price}
                          onChange={(e) =>
                            handleUpdateRange(
                              category,
                              index,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          min={0}
                          className="bg-background font-semibold"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRange(category, index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                        disabled={editingRates[category]?.length === 1}
                        title="Remove this range"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => handleAddRange(category)}
                    className="w-full cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Range
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pricing Range</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this pricing range? This action cannot be undone.
              {deleteConfirm && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>Range:</strong> {deleteConfirm.index + 1}
                  {editingRates[deleteConfirm.category]?.[deleteConfirm.index] && (
                    <>
                      <br />
                      <span>
                        {editingRates[deleteConfirm.category][deleteConfirm.index].min} -{" "}
                        {editingRates[deleteConfirm.category][deleteConfirm.index].max === Infinity ||
                        editingRates[deleteConfirm.category][deleteConfirm.index].max === null
                          ? "∞"
                          : editingRates[deleteConfirm.category][deleteConfirm.index].max}{" "}
                        km
                      </span>
                    </>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteRange}
              className="cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

