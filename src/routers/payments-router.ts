import { paymentsController } from '@/controllers/payments-controller';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { GetPayment, paymentsSchema } from '@/schemas/payments-schema';
import { Router } from 'express';

const paymentsRouter = Router();

paymentsRouter.get('', authenticateToken, paymentsController.getPaymentsByUser);

export { paymentsRouter };
