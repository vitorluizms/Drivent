import { notFoundError } from '@/errors';
import { ticketsRepository } from '@/repositories/tickets-repository';
import { Ticket, TicketType } from '@prisma/client';

async function getTypes(): Promise<TicketType[]> {
  const result = await ticketsRepository.getTypes();
  return result;
}

async function getTicketsByUser(userId: number): Promise<Ticket & { TicketType: TicketType }> {
  const validate = await ticketsRepository.getEnrollmentsByUser(userId);
  if (!validate) {
    throw notFoundError();
  }

  const result = await ticketsRepository.getTicketsByUser(userId);
  if (!result) {
    throw notFoundError();
  }
  return result;
}

async function postTicketByUser(userId: number, ticketTypeId: number) {
  const validate = await ticketsRepository.getEnrollmentsByUser(userId);
  if (!validate) {
    throw notFoundError();
  }

  const result = await ticketsRepository.postTicketByUser(ticketTypeId, validate.id);
  return result;
}

export type CreateTicket = { ticketTypeId: number };

export const ticketsService = { getTypes, getTicketsByUser, postTicketByUser };
