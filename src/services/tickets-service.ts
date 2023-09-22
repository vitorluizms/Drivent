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

export const ticketsService = { getTypes, getTicketsByUser };
