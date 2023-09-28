import { notFoundError } from '@/errors';
import { paymentRequired } from '@/errors/payment-required';
import { hotelsRepository } from '@/repositories/hotels-repository';

async function getHotels(userId: number) {
  const getTicket = await hotelsRepository.getTicketByUser(userId);
  if (getTicket.length === 0) {
    throw notFoundError();
  }

  const validate = await hotelsRepository.validateTicket(userId);
  if (!validate) {
    throw paymentRequired();
  }

  const result = await hotelsRepository.getHotels();
  if (result.length === 0) {
    throw notFoundError();
  }
  return result;
}

export const hotelsService = { getHotels };
