export interface InitiatePaymentResponse {
  paymentId: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  orderId: string;
}

export interface InitiatePaymentRequest {
  orderId: string;
}