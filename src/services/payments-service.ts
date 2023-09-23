import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import { paymentsRepository } from '@/repositories/payments-repository';
import { TicketId } from '@/schemas/payments-schema';

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

async function createPayment(body: TicketId, userId: number) {
  const validateTicketId = await paymentsRepository.validateTicket(body.ticketId);
  if (!validateTicketId) {
    throw notFoundError();
  }
  if (validateTicketId.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  const lastDigits = body.cardData.number.toString().slice(-4);
  const data: CreatePayment = {
    ticketId: body.ticketId,
    cardIssuer: body.cardData.issuer,
    cardLastDigits: lastDigits,
    value: validateTicketId.TicketType.price,
  };

  const create = await paymentsRepository.createPayment(data);
  await paymentsRepository.updateTicketStatus(body.ticketId);
  return create;
}

export type CreatePayment = {
  ticketId: number;
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

export const paymentsService = { getPaymentsByTicket, createPayment };
