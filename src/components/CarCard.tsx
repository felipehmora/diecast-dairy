import { useState } from "react";
import { Car } from "@/pages/Index";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CarForm } from "./CarForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => void;
  onEdit: (car: Car) => void;
}

const conditionLabels: Record<string, string> = {
  mint: "Mint",
  excellent: "Excelente",
  good: "Bueno",
  fair: "Regular",
  poor: "Pobre",
};

const conditionColors: Record<string, string> = {
  mint: "bg-green-500/10 text-green-700 dark:text-green-400",
  excellent: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  good: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  fair: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  poor: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export const CarCard = ({ car, onDelete, onEdit }: CarCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (updatedData: Omit<Car, "id" | "createdAt">) => {
    onEdit({ ...car, ...updatedData });
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    onDelete(car.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {car.photo ? (
            <img
              src={car.photo}
              alt={car.model}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          {car.quantity > 1 && (
            <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground shadow-lg">
              x{car.quantity}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg truncate mb-1">{car.model}</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-medium">Color:</span> {car.color}
            </p>
            <p>
              <span className="font-medium">Año:</span> {car.year}
            </p>
            {car.set && (
              <p className="truncate">
                <span className="font-medium">Set:</span> {car.set}
              </p>
            )}
          </div>
          <Badge className={`mt-2 ${conditionColors[car.condition] || ""}`}>
            {conditionLabels[car.condition] || car.condition}
          </Badge>
        </CardContent>

        <CardFooter className="flex gap-2 border-t bg-muted/30 p-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Carrito</DialogTitle>
          </DialogHeader>
          <CarForm onSubmit={handleEdit} initialData={car} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente "{car.model}" de tu colección.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
