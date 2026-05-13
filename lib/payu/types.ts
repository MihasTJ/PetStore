export interface PayuProduct {
  name: string;
  unitPrice: string;
  quantity: string;
}

export interface PayuOrderRequest {
  notifyUrl: string;
  customerIp: string;
  merchantPosId: string;
  description: string;
  currencyCode: "PLN";
  totalAmount: string;
  extOrderId?: string;
  buyer: {
    email: string;
    firstName: string;
    lastName: string;
    language: "pl";
  };
  products: PayuProduct[];
  continueUrl: string;
}

export interface PayuOrderResponse {
  status: { statusCode: string; statusDesc?: string };
  redirectUri: string;
  orderId: string;
  extOrderId?: string;
}

export type PayuOrderStatus =
  | "PENDING"
  | "WAITING_FOR_CONFIRMATION"
  | "COMPLETED"
  | "CANCELED"
  | "REJECTED";

export interface PayuNotification {
  order?: {
    orderId: string;
    extOrderId?: string;
    orderCreateDate: string;
    notifyUrl: string;
    customerIp: string;
    merchantPosId: string;
    description: string;
    currencyCode: string;
    totalAmount: string;
    status: PayuOrderStatus;
    products: PayuProduct[];
  };
  // Refund notifications have a different top-level shape — no `order` key
  orderId?: string;
  extOrderId?: string;
  refund?: {
    refundId: string;
    amount: string;
    currencyCode: string;
    status: "FINALIZED" | "CANCELED";
    statusDateTime?: string;
    reason?: string;
    reasonDescription?: string;
    refundDate?: string;
  };
  localReceiptDateTime?: string;
  properties?: Array<{ name: string; value: string }>;
}
