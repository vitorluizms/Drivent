import { prisma } from '@/config';
import { Ticket } from '@prisma/client';

async function getTicketByUser(userId: number) {
  const result = await prisma.ticket.findMany({
    where: { Enrollment: { userId: userId } },
  });
  return result;
}

async function validateTicket(userId: number) {
  const result = await prisma.ticket.findFirst({
    where: {
      Enrollment: { userId: userId },
      status: 'PAID',
      TicketType: { includesHotel: true, isRemote: false },
    },
  });
  return result;
}

async function getHotels() {
  const result = await prisma.hotel.findMany({});
  return result;
}

async function getHotelById(hotelId: number) {
  const result = await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { Rooms: true },
  });
  return result;
}

export const hotelsRepository = { getTicketByUser, validateTicket, getHotels, getHotelById };
