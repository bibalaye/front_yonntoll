import { z } from "zod";

export const AgripreneurSchema = z.object({
  id: z.coerce.number().optional(),
  userId: z.coerce.number(),
  farmName: z.string().min(1, { message: "Le nom de la ferme est requis!" }),
  description: z.string().optional(),
  averageRating: z.number().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type AgripreneurSchema = z.infer<typeof AgripreneurSchema>;

export const ProductSchema = z.object({
  id: z.coerce.number().optional(),
  agripreneurId: z.coerce.number({ required_error: "Ce champ est obligatoire" }).refine(value => value !== 0, { message: "Veillez sélectionner un agripreneur" }),
  name: z.string().min(1, { message: "Le nom du produit est requis!" }),
  description: z.string().optional(),
  categoryId: z.coerce.number({ required_error: "Ce champ est obligatoire" }).refine(value => value !== 0, { message: "Veillez sélectionner une catégorie" }),
  subcategoryId: z.coerce.number({ required_error: "Ce champ est obligatoire" }).refine(value => value !== 0, { message: "Veillez sélectionner une sous catégorie" }),
  price: z.number().min(0, { message: "Le prix doit être positif!" }),
  unit: z.string().optional(),
  stock: z.number().min(0, { message: "Le stock doit être positif!" }),
  isOrganic: z.boolean().default(false),
  harvestDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  averageRating: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
});

export type ProductSchema = z.infer<typeof ProductSchema>;

export const OrderSchema = z.object({
  id: z.coerce.number().optional(),
  clientId: z.coerce.number(),
  items: z.array(z.object({
    productId: z.coerce.number(),
    quantity: z.number().min(1, { message: "La quantité doit être au moins 1!" }),
    price: z.number().min(0, { message: "Le prix doit être positif!" }),
  })),
  totalAmount: z.number().min(0, { message: "Le montant total doit être positif!" }),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]),
  paymentMethod: z.string().optional(),
  deliveryStreet: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryState: z.string().optional(),
  deliveryPostalCode: z.string().optional(),
  deliveryCountry: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type OrderSchema = z.infer<typeof OrderSchema>;

export const ReviewSchema = z.object({
  id: z.coerce.number().optional(),
  userId: z.coerce.number(),
  productId: z.coerce.number().optional(),
  agripreneurId: z.coerce.number().optional(),
  rating: z.number().min(1).max(5, { message: "La note doit être entre 1 et 5!" }),
  comment: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type ReviewSchema = z.infer<typeof ReviewSchema>;

export const UserSchema = z.object({
  id: z.coerce.number().optional(),
  email: z.string().email({ message: "Adresse e-mail invalide!" }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  clerkId: z.string().optional(),
  imageUrl: z.string().optional(),
  userType: z.enum(["AGRIPRENEUR", "CLIENT", "ADMIN", "DELIVERY"]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type UserSchema = z.infer<typeof UserSchema>;

export const DeliverySchema = z.object({
  id: z.coerce.number().optional(),
  orderId: z.coerce.number(),
  deliveryPersonId: z.coerce.number(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  currentLatitude: z.number().optional(),
  currentLongitude: z.number().optional(),
  estimatedArrivalTime: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type DeliverySchema = z.infer<typeof DeliverySchema>;

export const TransactionSchema = z.object({
  id: z.coerce.number().optional(),
  orderId: z.coerce.number(),
  amount: z.number().min(0, { message: "Le montant doit être positif!" }),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  refundStatus: z.enum(["NOT_REFUNDED", "PARTIALLY_REFUNDED", "FULLY_REFUNDED"]).optional(),
});

export type TransactionSchema = z.infer<typeof TransactionSchema>;

export const NotificationSchema = z.object({
  id: z.coerce.number().optional(),
  userId: z.coerce.number(),
  type: z.string(),
  message: z.string(),
  isRead: z.boolean().default(false),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type NotificationSchema = z.infer<typeof NotificationSchema>;

export const MessageSchema = z.object({
  id: z.coerce.number().optional(),
  senderId: z.coerce.number(),
  receiverId: z.coerce.number(),
  content: z.string(),
  isRead: z.boolean().default(false),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type MessageSchema = z.infer<typeof MessageSchema>;

export const LandingPageStatsSchema = z.object({
  id: z.coerce.number().optional(),
  date: z.coerce.date(),
  visitors: z.number().min(0),
  signups: z.number().min(0),
  conversionRate: z.number().min(0).max(100),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type LandingPageStatsSchema = z.infer<typeof LandingPageStatsSchema>;

export const CategorySchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Le nom de la catégorie est requis!" }),
  imageUrl: z.instanceof(FileList).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type CategorySchema = z.infer<typeof CategorySchema>;
