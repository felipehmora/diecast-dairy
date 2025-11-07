import { Car } from "lucide-react";

interface CollectionHeaderProps {
  totalCars: number;
}

export const CollectionHeader = ({ totalCars }: CollectionHeaderProps) => {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Colección de Carritos
            </h1>
            <p className="text-sm text-muted-foreground">
              {totalCars} {totalCars === 1 ? "carrito" : "carritos"} en tu colección
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
