import { AuthenticatedRequest } from '@/middlewares';
import { GetPayment } from '@/schemas/payments-schema';
import { paymentsService } from '@/services/payments-service';
import { Response } from 'express';
import httpStatus from 'http-status';

async function getPaymentsByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const { ticketId } = req.query;
  const result = await paymentsService.getPaymentsByTicket(Number(ticketId), userId);
  res.status(httpStatus.OK).send(result);
}

export const paymentsController = { getPaymentsByUser };
