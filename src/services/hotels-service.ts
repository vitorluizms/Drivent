import { invalidDataError, notFoundError } from '@/errors';
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

async function getHotelById(userId: number, hotelId: number) {
  if (isNaN(hotelId)) {
    throw invalidDataError('Hotel Id is not a number');
  }

  const getTicket = await hotelsRepository.getTicketByUser(userId);
  if (getTicket.length === 0) {
    throw notFoundError();
  }

  const validate = await hotelsRepository.validateTicket(userId);
  if (!validate) {
    throw paymentRequired();
  }

  const hotelData = await hotelsRepository.getHotelById(hotelId);
  if (!hotelData) {
    throw notFoundError();
  }

  return hotelData;
}

export const hotelsService = { getHotels, getHotelById };
