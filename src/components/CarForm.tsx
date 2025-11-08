import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import type { Car } from "@/pages/Index";

interface CarFormProps {
  onSubmit: (car: Omit<Car, "id" | "createdAt">) => void;
  initialData?: Car;
}

export const CarForm = ({ onSubmit, initialData }: CarFormProps) => {
  const [formData, setFormData] = useState({
    number: initialData?.number || "",
    model: initialData?.model || "",
    color: initialData?.color || "",
    year: initialData?.year || "",
    condition: initialData?.condition || "",
    set: initialData?.set || "",
    quantity: initialData?.quantity || 1,
    total: initialData?.total || undefined,
    photo: initialData?.photo || "",
    exhibited: initialData?.exhibited || false,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            placeholder="Ej: 001"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo *</Label>
          <Input
            id="model"
            placeholder="Ej: Ferrari F40"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color *</Label>
          <Input
            id="color"
            placeholder="Ej: Rojo"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Año *</Label>
          <Input
            id="year"
            placeholder="Ej: 2023"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Estado *</Label>
          <Select
            value={formData.condition}
            onValueChange={(value) => setFormData({ ...formData, condition: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mint">Mint (Perfecto)</SelectItem>
              <SelectItem value="excellent">Excelente</SelectItem>
              <SelectItem value="good">Bueno</SelectItem>
              <SelectItem value="fair">Regular</SelectItem>
              <SelectItem value="poor">Pobre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="set">Set / Colección</Label>
          <Select
            value={formData.set}
            onValueChange={(value) => setFormData({ ...formData, set: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Básico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Básico">Básico</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Red Line">Red Line</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad *</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="total">Total</Label>
          <Input
            id="total"
            type="number"
            min="0"
            placeholder="Precio total"
            value={formData.total || ""}
            onChange={(e) => setFormData({ ...formData, total: e.target.value ? parseInt(e.target.value) : undefined })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="exhibited" className="flex items-center gap-2 cursor-pointer">
          <input
            id="exhibited"
            type="checkbox"
            checked={formData.exhibited}
            onChange={(e) => setFormData({ ...formData, exhibited: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span>Exhibido</span>
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Foto del Carrito</Label>
        <div className="flex items-center gap-4">
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Label
            htmlFor="photo"
            className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted"
          >
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="Preview"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span className="text-sm">Haz clic para subir una foto</span>
              </div>
            )}
          </Label>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">
        {initialData ? "Actualizar Carrito" : "Agregar a Colección"}
      </Button>
    </form>
  );
};
