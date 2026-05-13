import type { Alert, Pet, Product, ViewId } from "./types";

export const PETS: Pet[] = [
  { id: 1, name: "Zuzia", species: "Kot", breed: "Maine Coon", age: 3, weight: 5.2, owner: "Anna Kowalska", predispositions: ["Stawy", "Serce"], reports: 4, alerts: 2, lastReport: "12 kwi 2026" },
  { id: 2, name: "Max", species: "Pies", breed: "Golden Retriever", age: 7, weight: 32.5, owner: "Marek Wiśniewski", predispositions: ["Stawy", "Waga", "Serce"], reports: 8, alerts: 3, lastReport: "28 kwi 2026" },
  { id: 3, name: "Luna", species: "Kot", breed: "Ragdoll", age: 2, weight: 4.1, owner: "Karolina Nowak", predispositions: ["Sierść", "Serce"], reports: 2, alerts: 1, lastReport: "30 kwi 2026" },
  { id: 4, name: "Borys", species: "Pies", breed: "Border Collie", age: 5, weight: 19.0, owner: "Paweł Lewandowski", predispositions: ["Stawy", "Wzrok"], reports: 5, alerts: 0, lastReport: "02 maj 2026" },
  { id: 5, name: "Pchełka", species: "Pies", breed: "Yorkshire Terrier", age: 9, weight: 3.4, owner: "Maria Zielińska", predispositions: ["Zęby", "Serce", "Stawy"], reports: 11, alerts: 4, lastReport: "01 maj 2026" },
  { id: 6, name: "Mruczek", species: "Kot", breed: "Brytyjski Krótkowłosy", age: 6, weight: 6.8, owner: "Tomasz Dąbrowski", predispositions: ["Waga", "Układ pokarmowy"], reports: 3, alerts: 1, lastReport: "29 kwi 2026" },
];

export const PRODUCTS: Product[] = [
  { id: "p-001", name: "Suplement na stawy z glukozaminą — premium", slug: "suplement-stawy-premium", original: "GlucoVet Joint 60kaps - WHOLESALER SKU 88421", supplier: "Droplo / VetPharma PL", price: 189, stock: 47, status: "Active", is_premium_verified: true, vet: "dr Anna Kowalska", category: "Suplementy", category_id: null, species: "Pies", health: ["Stawy", "Senior"], updated: "2 godz temu", img: "Suplement\nstawy" },
  { id: "p-002", name: "Karma sucha — łosoś norweski dla seniora", slug: "karma-losos-norweski-senior", original: "Salmon Senior Dog Food 4kg PREMIUM", supplier: "BaseLinker / NordicPet", price: 249, stock: 12, status: "Active", is_premium_verified: true, vet: "dr Piotr Mazur", category: "Karma", category_id: null, species: "Pies", health: ["Sierść", "Stawy"], updated: "Wczoraj", img: "Karma\nłosoś" },
  { id: "p-003", name: "Probiotyk dla kota z wrażliwym żołądkiem", slug: "probiotyk-kot-wrazliwy-zoladek", original: "FelineGut Probiotic 30 sachets", supplier: "Droplo / FelineCare", price: 129, stock: 0, status: "Out of stock", is_premium_verified: true, vet: "dr Anna Kowalska", category: "Suplementy", category_id: null, species: "Kot", health: ["Układ pokarmowy"], updated: "3 dni temu", img: "Probiotyk" },
  { id: "p-004", name: "Akcesorium stomatologiczne — szczotka silikonowa", slug: "szczotka-stomatologiczna-silikon", original: "DentalCare Silicone Brush ECO", supplier: "BaseLinker / PetEssentials", price: 39, stock: 124, status: "Active", is_premium_verified: false, vet: null, category: "Akcesoria", category_id: null, species: "Pies/Kot", health: ["Zęby"], updated: "5 dni temu", img: "Szczotka" },
  { id: "p-005", name: "Karma mokra — kurczak z warzywami (kot)", slug: "karma-mokra-kurczak-warzywa-kot", original: "WetCat Chicken+Veggies 12x85g", supplier: "Droplo / FelineCare", price: 89, stock: 4, status: "Active", is_premium_verified: true, vet: "dr Anna Kowalska", category: "Karma", category_id: null, species: "Kot", health: ["Waga"], updated: "Dziś", img: "Karma\nmokra" },
];

export const ORDERS = [
  { id: "ZP-2847", customer: "Anna Kowalska", pet: "Zuzia", items: 2, status: "Paid", amount: 218, date: "5 maj, 14:22", method: "BLIK" },
  { id: "ZP-2846", customer: "Marek Wiśniewski", pet: "Max", items: 4, status: "Shipped", amount: 587, date: "5 maj, 11:08", method: "Karta" },
  { id: "ZP-2845", customer: "Karolina Nowak", pet: "Luna", items: 1, status: "Pending", amount: 79, date: "5 maj, 09:41", method: "BLIK" },
  { id: "ZP-2844", customer: "Paweł Lewandowski", pet: "Borys", items: 3, status: "Paid", amount: 342, date: "4 maj, 22:15", method: "Apple Pay" },
  { id: "ZP-2843", customer: "Maria Zielińska", pet: "Pchełka", items: 5, status: "Shipped", amount: 612, date: "4 maj, 17:30", method: "Karta" },
] as const;

export const ALERTS: Alert[] = [
  { id: 1, pet: "Zuzia", owner: "Anna K.", type: "Koniec suplementu", message: "Suplement na stawy kończy się za 5 dni. Czas zaproponować kolejną porcję troski.", priority: "high", scheduled: "Jutro 09:00" },
  { id: 2, pet: "Max", owner: "Marek W.", type: "Nowy etap życia", message: "Max wszedł w 7. rok — przejście na karmę dla seniora rekomendowane przez weterynarzy.", priority: "medium", scheduled: "Za 2 dni" },
  { id: 3, pet: "Pchełka", owner: "Maria Z.", type: "Ryzyko rasy", message: "Yorkshire Terrier po 9. roku — profilaktyka stomatologiczna i kontrola serca.", priority: "high", scheduled: "Za 4 dni" },
];

export const NAV: ReadonlyArray<{ id: ViewId; label: string; icon: string; group: "main" | "premium"; count?: number }> = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", group: "main" },
  { id: "products", label: "Produkty", icon: "products", group: "main", count: 142 },
  { id: "pets", label: "Profile pupili", icon: "pet", group: "main", count: 412 },
  { id: "orders", label: "Zamówienia", icon: "orders", group: "main", count: 18 },
  { id: "experts", label: "Kuratorzy", icon: "shield", group: "main" },
  { id: "certificates", label: "Certyfikaty", icon: "cert", group: "main" },
  { id: "categories", label: "Kategorie", icon: "filter", group: "main" },
  { id: "intelligence", label: "AI Intelligence", icon: "ai", group: "premium" },
  { id: "content", label: "Treść · zaufanie", icon: "content", group: "premium" },
];

export const ACCENTS = {
  terracotta: { primary: "#B8654A", primaryHover: "#9F5239", primarySoft: "rgba(184, 101, 74, 0.08)", primarySofter: "rgba(184, 101, 74, 0.04)", shadowSm: "0 4px 20px 0 rgba(184, 101, 74, 0.06)" },
  rust: { primary: "#9C5447", primaryHover: "#7E4137", primarySoft: "rgba(156, 84, 71, 0.08)", primarySofter: "rgba(156, 84, 71, 0.04)", shadowSm: "0 4px 20px 0 rgba(156, 84, 71, 0.06)" },
  amber: { primary: "#A87B5C", primaryHover: "#8B6244", primarySoft: "rgba(168, 123, 92, 0.10)", primarySofter: "rgba(168, 123, 92, 0.04)", shadowSm: "0 4px 20px 0 rgba(168, 123, 92, 0.06)" },
  moss: { primary: "#3D4F3D", primaryHover: "#2C3B2C", primarySoft: "rgba(61, 79, 61, 0.08)", primarySofter: "rgba(61, 79, 61, 0.04)", shadowSm: "0 4px 20px 0 rgba(61, 79, 61, 0.06)" },
} as const;
