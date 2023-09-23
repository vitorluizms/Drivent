import { paymentsController } from '@/controllers/payments-controller';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { TicketId, paymentSchema } from '@/schemas/payments-schema';
import { Router } from 'express';

const paymentsRouter = Router();

paymentsRouter.get('', authenticateToken, paymentsController.getPaymentsByUser);
paymentsRouter.post(
  '/process',
  authenticateToken,
  validateBody<TicketId>(paymentSchema),
  paymentsController.createPayment,
);

export { paymentsRouter };
