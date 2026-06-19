import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ParchmentCard from "@/components/ParchmentCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

const COLOR_FAMILIES = [
  "Blue",
  "Teal",
  "Green",
  "Red",
  "Purple",
  "Brown",
  "Black",
  "Grey",
  "Pink",
  "Orange",
] as const;

const BASE_PROPERTIES = [
  "Standard",
  "Shimmer",
  "Sheen",
  "Shading",
  "Scented",
  "Document",
  "Iron Gall",
] as const;

const grimoireSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  lineName: z.string().min(1, "Line name is required"),
  colorName: z.string().min(1, "Color name is required"),
  releaseYear: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}$/.test(val), {
      message: "Year must be 4 digits",
    }),
  colorFamily: z.enum(COLOR_FAMILIES),
  baseProperty: z.enum(BASE_PROPERTIES),
  hex: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, { message: "Invalid hex color" }),
  sheen: z.number().min(0).max(100),
  shading: z.number().min(0).max(100),
  shimmer: z.number().min(0).max(100),
  saturation: z.number().min(0).max(100),
  flow: z.number().min(0).max(100),
  dryTime: z.number().min(0).max(100),
  notes: z.string(),
});

type GrimoireFormValues = z.infer<typeof grimoireSchema>;
type ColorFamily = GrimoireFormValues["colorFamily"];
type BaseProperty = GrimoireFormValues["baseProperty"];

interface GrimoireEntry extends GrimoireFormValues {
  id: string;
  createdAt: string;
}

const defaultValues: GrimoireFormValues = {
  brand: "",
  lineName: "",
  colorName: "",
  releaseYear: "",
  colorFamily: "Blue",
  baseProperty: "Standard",
  hex: "#000000",
  sheen: 50,
  shading: 50,
  shimmer: 50,
  saturation: 50,
  flow: 50,
  dryTime: 50,
  notes: "",
};

const initialEntries: GrimoireEntry[] = [
  {
    id: "e1",
    brand: "Sailor",
    lineName: "Manyo",
    colorName: "Haha",
    releaseYear: "2020",
    colorFamily: "Green",
    baseProperty: "Shading",
    hex: "#5b8c85",
    sheen: 35,
    shading: 60,
    shimmer: 45,
    saturation: 70,
    flow: 65,
    dryTime: 40,
    notes: "Beautiful teal-green with excellent shading on Tomoe River.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "e2",
    brand: "Diamine",
    lineName: "Standard",
    colorName: "Oxblood",
    releaseYear: "",
    colorFamily: "Red",
    baseProperty: "Sheen",
    hex: "#6b0f1a",
    sheen: 15,
    shading: 75,
    shimmer: 0,
    saturation: 92,
    flow: 55,
    dryTime: 30,
    notes: "Classic dark red with subtle sheen.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "e3",
    brand: "Pilot",
    lineName: "Iroshizuku",
    colorName: "Kon-peki",
    releaseYear: "2010",
    colorFamily: "Blue",
    baseProperty: "Standard",
    hex: "#0066cc",
    sheen: 20,
    shading: 55,
    shimmer: 0,
    saturation: 85,
    flow: 70,
    dryTime: 45,
    notes: "Vivid cerulean blue, flows well.",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

const sliderFields: { name: keyof GrimoireFormValues; label: string }[] = [
  { name: "sheen", label: "Sheen" },
  { name: "shading", label: "Shading" },
  { name: "shimmer", label: "Shimmer" },
  { name: "saturation", label: "Saturation" },
  { name: "flow", label: "Flow" },
  { name: "dryTime", label: "Dry Time" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const InkGrimoire = () => {
  const [entries, setEntries] = useState<GrimoireEntry[]>(initialEntries);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<GrimoireFormValues>({
    resolver: zodResolver(grimoireSchema),
    defaultValues,
  });

  const hexValue = watch("hex");

  const onSubmit = (data: GrimoireFormValues) => {
    const entry: GrimoireEntry = {
      ...data,
      id: `e-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
    toast.success("Entry saved to grimoire");
    reset(defaultValues);
  };

  const handleCancel = () => {
    reset(defaultValues);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-12">
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
          Ink Grimoire · Cataloguer&apos;s Desk
        </h2>
        <p className="text-sm text-muted-foreground font-label mb-6">
          Catalogue your inks with precision and care
        </p>

        <ParchmentCard>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Vitals */}
            <section>
              <h3 className="font-display text-lg text-foreground mb-3">Vitals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="brand" className="font-label">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    placeholder="e.g. Sailor"
                    {...register("brand")}
                  />
                  {errors.brand && (
                    <p className="text-xs text-destructive">{errors.brand.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lineName" className="font-label">
                    Line Name
                  </Label>
                  <Input
                    id="lineName"
                    placeholder="e.g. Manyo"
                    {...register("lineName")}
                  />
                  {errors.lineName && (
                    <p className="text-xs text-destructive">{errors.lineName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="colorName" className="font-label">
                    Color Name
                  </Label>
                  <Input
                    id="colorName"
                    placeholder="e.g. Haha"
                    {...register("colorName")}
                  />
                  {errors.colorName && (
                    <p className="text-xs text-destructive">{errors.colorName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="releaseYear" className="font-label">
                    Release Year
                  </Label>
                  <Input
                    id="releaseYear"
                    placeholder="e.g. 2020"
                    {...register("releaseYear")}
                  />
                  {errors.releaseYear && (
                    <p className="text-xs text-destructive">{errors.releaseYear.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Section 2: Ink Identity */}
            <section>
              <h3 className="font-display text-lg text-foreground mb-3">Ink Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-label">Color Family</Label>
                  <Controller
                    name="colorFamily"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color family" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLOR_FAMILIES.map((family) => (
                            <SelectItem key={family} value={family}>
                              {family}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.colorFamily && (
                    <p className="text-xs text-destructive">{errors.colorFamily.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="font-label">Base Properties</Label>
                  <Controller
                    name="baseProperty"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select base property" />
                        </SelectTrigger>
                        <SelectContent>
                          {BASE_PROPERTIES.map((prop) => (
                            <SelectItem key={prop} value={prop}>
                              {prop}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.baseProperty && (
                    <p className="text-xs text-destructive">{errors.baseProperty.message}</p>
                  )}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="hex" className="font-label">
                    Hex Color
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="hex"
                      placeholder="#000000"
                      {...register("hex")}
                      className="max-w-[180px] font-mono"
                    />
                    <Controller
                      name="hex"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="color"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-10 h-10 rounded-md border border-input cursor-pointer"
                          aria-label="Color picker"
                        />
                      )}
                    />
                    <div
                      className="w-12 h-12 rounded-full border border-border flex-shrink-0"
                      style={{ backgroundColor: hexValue }}
                      aria-label="Live color preview"
                    />
                  </div>
                  {errors.hex && (
                    <p className="text-xs text-destructive">{errors.hex.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Section 3: Performance Metrics */}
            <section>
              <h3 className="font-display text-lg text-foreground mb-3">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {sliderFields.map(({ name, label }) => (
                  <Controller
                    key={name}
                    name={name as keyof GrimoireFormValues}
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-label text-muted-foreground">
                          <span>{label}</span>
                          <span>{field.value}%</span>
                        </div>
                        <Slider
                          value={[field.value as number]}
                          onValueChange={(v) => field.onChange(v[0])}
                          max={100}
                          step={1}
                        />
                      </div>
                    )}
                  />
                ))}
              </div>
            </section>

            {/* Section 4: Grimoire Notes */}
            <section>
              <h3 className="font-display text-lg text-foreground mb-3">
                Grimoire Notes
              </h3>
              <Textarea
                placeholder="Your impressions…"
                rows={4}
                {...register("notes")}
              />
            </section>

            {/* Footer */}
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Save Entry</Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </ParchmentCard>

        {/* Recent Entries */}
        <div className="mt-10">
          <h3 className="font-display text-xl text-foreground mb-4">Recent Entries</h3>
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground font-label">
              No entries yet. Fill out the form above to add your first ink.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map((entry) => (
                <ParchmentCard key={entry.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full border border-border flex-shrink-0"
                      style={{ backgroundColor: entry.hex }}
                    />
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold text-foreground truncate">
                        {entry.brand} {entry.lineName}
                      </p>
                      <p className="text-xs text-muted-foreground font-label truncate">
                        {entry.colorName}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-label uppercase tracking-wider rounded-full bg-secondary text-antique-gold">
                      {entry.colorFamily}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-label uppercase tracking-wider rounded-full bg-secondary text-antique-gold">
                      {entry.baseProperty}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-label">
                    {formatDate(entry.createdAt)}
                  </p>
                </ParchmentCard>
              ))}
            </div>
          )}
        </div>
      </div>
  );
};

export default InkGrimoire;
