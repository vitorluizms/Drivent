import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import { paymentsRepository } from '@/repositories/payments-repository';

async function getPaymentsByTicket(ticketId: number, userId: number) {
  if (!ticketId) {
    throw invalidDataError('TicketId is missing');
  }
  const validateTicketId = await paymentsRepository.validateTicketId(Number(ticketId));
  if (!validateTicketId) {
    throw notFoundError();
  }
  if (validateTicketId.userId !== userId) {
    throw unauthorizedError();
  }

  const result = await paymentsRepository.getPaymentsByTicket(ticketId);
  return result;
}

export const paymentsService = { getPaymentsByTicket };
