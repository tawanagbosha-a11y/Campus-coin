import { PaymentTransaction, PaymentMethod } from '../types';
import { StorageService } from '../db/storage';

export interface CreatePaymentRequest {
  userId: string;
  planId: 'monthly' | 'semester';
  amount: number;
  currency: string;
  provider: 'EcoCash' | 'Paynow' | 'Card' | 'Bank';
  phoneNumber?: string;
  email?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  reference: string;
  status: PaymentTransaction['status'];
  redirectUrl?: string;
  instructions?: string;
  message: string;
}

export const PaymentService = {
  // Simulates server-side /api/payments/create
  async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    const timestamp = Date.now();
    const reference = `${request.provider.toUpperCase().substring(0, 2)}-HIT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create record in storage
    const newPayment = StorageService.addPayment({
      userId: request.userId,
      planId: request.planId,
      amount: request.amount,
      currency: request.currency || 'USD',
      status: 'Pending',
      provider: request.provider,
      reference
    });

    StorageService.addAuditLog(
      'PAYMENT_INITIATED',
      `Payment ${newPayment.id} for $${request.amount.toFixed(2)} via ${request.provider} initiated (Ref: ${reference})`,
      request.email || 'student@hit.ac.zw'
    );

    let instructions = 'Processing transaction...';
    if (request.provider === 'EcoCash') {
      instructions = `Please check your phone (${request.phoneNumber || '+263 77 ...'}) for the EcoCash USSD prompt to approve $${request.amount.toFixed(2)}.`;
    } else if (request.provider === 'Paynow') {
      instructions = `Redirecting to Paynow Zimbabwe secure checkout portal for ref ${reference}...`;
    } else {
      instructions = 'Authorizing card payment with your bank...';
    }

    return {
      success: true,
      paymentId: newPayment.id,
      reference,
      status: 'Pending',
      instructions,
      message: 'Payment request registered successfully'
    };
  },

  // Simulates server-side /api/payments/status
  async checkPaymentStatus(paymentId: string): Promise<PaymentTransaction | null> {
    const payments = StorageService.getPayments();
    return payments.find(p => p.id === paymentId) || null;
  },

  // Simulates instant or simulated confirmation (e.g. EcoCash PIN entered or Paynow webhook callback)
  async simulatePaymentSuccess(paymentId: string): Promise<{ success: boolean; payment: PaymentTransaction | null }> {
    // Artificial small delay for realistic UX
    await new Promise(res => setTimeout(res, 1200));

    StorageService.updatePaymentStatus(paymentId, 'Successful');
    const payment = await PaymentService.checkPaymentStatus(paymentId);

    if (payment) {
      // Upgrade user profile
      const user = StorageService.getCurrentUser();
      if (user.id === payment.userId) {
        user.isPremium = true;
        user.subscriptionTier = 'plus';
        StorageService.setCurrentUser(user);
      }

      StorageService.addAuditLog(
        'PAYMENT_COMPLETED',
        `Payment ${paymentId} completed successfully via ${payment.provider}. Upgraded to Campus Coin Plus.`,
        user.email
      );

      StorageService.addNotification({
        userId: payment.userId,
        type: 'system',
        title: 'Campus Coin Plus Activated!',
        message: `Your subscription payment of $${payment.amount.toFixed(2)} was received. Welcome to Campus Coin Plus!`,
        read: false
      });
    }

    return { success: true, payment };
  }
};
