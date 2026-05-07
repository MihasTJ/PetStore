export type ViewId =
  | "dashboard"
  | "products"
  | "pets"
  | "orders"
  | "intelligence"
  | "content"
  | "experts"
  | "certificates";

export type ProductStatus = "Active" | "Draft" | "Out of stock";
export type OrderStatus = "Paid" | "Pending" | "Shipped" | "Cancelled";
export type Priority = "high" | "medium" | "low";

export type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  owner: string;
  predispositions: string[];
  reports: number;
  alerts: number;
  lastReport: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  original: string;
  supplier: string;
  price: number;
  stock: number;
  status: ProductStatus;
  is_premium_verified: boolean;
  vet: string | null;
  category: string;
  species: string;
  health: string[];
  updated: string;
  img: string;
};

export type Order = {
  id: string;
  customer: string;
  pet: string;
  items: number;
  status: OrderStatus;
  amount: number;
  date: string;
  method: string;
};

export type Alert = {
  id: number;
  pet: string;
  owner: string;
  type: string;
  message: string;
  priority: Priority;
  scheduled: string;
};
