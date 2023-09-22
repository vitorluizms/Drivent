import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services/tickets-service';
import { Response } from 'express';
import httpStatus from 'http-status';

async function getTypes(req: AuthenticatedRequest, res: Response) {
  const result = await ticketsService.getTypes();
  res.status(httpStatus.OK).send(result);
}

async function getTicketsByUser(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const result = await ticketsService.getTicketsByUser(userId);
  res.status(httpStatus.OK).send(result);
}

async function postTicketByUser(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { ticketTypeId } = req.body;

  const result = await ticketsService.postTicketByUser(userId, ticketTypeId);
  res.status(httpStatus.CREATED).send(result);
}

export const ticketsController = { getTypes, getTicketsByUser, postTicketByUser };
