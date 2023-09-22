import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services/tickets-service';
import { Response } from 'express';

async function getTypes(req: AuthenticatedRequest, res: Response) {
  const result = await ticketsService.getTypes();
  res.status(200).send(result);
}

async function getTicketsByUser(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const result = await ticketsService.getTicketsByUser(userId);
  res.status(200).send(result);
}

export const ticketsController = { getTypes, getTicketsByUser };
