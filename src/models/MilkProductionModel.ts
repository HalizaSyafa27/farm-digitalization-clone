export interface MilkProduction {
    id: string;
    dateOfProduction: string;
    quantity: string; // Decimal value
    livestock_id: string; // Foreign key to Livestock
}
  