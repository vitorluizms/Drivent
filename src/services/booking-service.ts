import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import { bookingRepository } from '@/repositories/booking-repository';
import { Booking, Room, Ticket, TicketType } from '@prisma/client';

async function getBookingByUser(userId: number) {
  const result = await bookingRepository.getBookingAndRoomByUser(userId);
  if (!result) {
    throw notFoundError();
  }
  return result;
}

async function createBooking(userId: number, roomId: number) {
  const ticket = await bookingRepository.validateTicket(userId);
  validateTicketwithType(ticket);

  const room = await bookingRepository.validateRoom(roomId);
  const bookings = await bookingRepository.getBookings(roomId);
  validateRoomAndCapacity(room, bookings);

  const response = await bookingRepository.createBooking(userId, roomId);
  return response;
}

async function updateRoom(userId: number, roomId: number, bookingId: number) {
  const booking = await bookingRepository.getBookingAndRoomByUser(userId);
  if (!booking) {
    throw forbiddenError("You don't have a booking");
  }

  const room = await bookingRepository.validateRoom(roomId);
  const bookings = await bookingRepository.getBookings(roomId);
  validateRoomAndCapacity(room, bookings);

  const update = await bookingRepository.updateRoom(bookingId, roomId);
  return update;
}

function validateTicketwithType(ticket: Ticket & { TicketType: TicketType }) {
  if (!ticket) {
    throw notFoundError();
  } else if (ticket.status === 'RESERVED') {
    throw forbiddenError('Your ticket is not paid');
  } else if (ticket.TicketType.isRemote === true) {
    throw forbiddenError('Your ticket is remote');
  } else if (ticket.TicketType.includesHotel === false) {
    throw forbiddenError('Your ticket do not include hotel');
  }
}

function validateRoomAndCapacity(room: Room, bookings: Booking[]) {
  if (!room) {
    throw notFoundError();
  } else if (bookings.length === room.capacity) {
    throw forbiddenError('This room is full');
  }
}

export const bookingService = { getBookingByUser, createBooking, updateRoom };
