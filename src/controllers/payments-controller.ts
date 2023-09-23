import { AuthenticatedRequest } from '@/middlewares';
import { TicketId } from '@/schemas/payments-schema';
import { paymentsService } from '@/services/payments-service';
import { Response } from 'express';
import httpStatus from 'http-status';

async function getPaymentsByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const { ticketId } = req.query;
  const result = await paymentsService.getPaymentsByTicket(Number(ticketId), userId);
  res.status(httpStatus.OK).send(result);
}

async function createPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const body = req.body as TicketId;

  const create = await paymentsService.createPayment(body, userId);
  res.status(httpStatus.OK).send(create);
}

export const paymentsController = { getPaymentsByUser, createPayment };
