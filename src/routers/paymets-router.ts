import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { paymentsController } from '@/controllers';
import { paymentSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', paymentsController.getPaymentsByUser)
  .post('/process', validateBody(paymentSchema), paymentsController.createPayment);

export { paymentsRouter };
