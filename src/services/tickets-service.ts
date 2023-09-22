import { notFoundError } from '@/errors';
import { ticketsRepository } from '@/repositories/tickets-repository';
import { Ticket, TicketType } from '@prisma/client';

async function getTypes(): Promise<TicketType[]> {
  const result = await ticketsRepository.getTypes();
  return result;
}

async function getTicketsByUser(userId: number): Promise<Ticket & { TicketType: TicketType }> {
  const validate = await ticketsRepository.getEnrollmentsByUser(userId);
  if (validate.length === 0) {
    throw notFoundError();
  }

  const result = await ticketsRepository.getTicketsByUser(userId);
  if (result.length === 0) {
    throw notFoundError();
  }
  const body = result[0];
  return body;
}

async function postTicketByUser(userId: number, ticketTypeId: number) {
  const validate = await ticketsRepository.getEnrollmentsByUser(userId);
  if (validate.length === 0) {
    throw notFoundError();
  }

  const result = await ticketsRepository.postTicketByUser(ticketTypeId, validate[0].id);
  return result;
}

export type createTicket = { ticketTypeId: number };

export const ticketsService = { getTypes, getTicketsByUser, postTicketByUser };
