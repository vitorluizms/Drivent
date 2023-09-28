import { prisma } from '@/config';
import { Ticket } from '@prisma/client';

async function getTicketByUser(userId: number) {
  const result = await prisma.ticket.findMany({
    where: { Enrollment: { userId: userId } },
  });
  return result;
}

async function validateTicket(userId: number): Promise<boolean> {
  const result = await prisma.ticket.findFirst({
    where: {
      AND: {
        Enrollment: { userId: userId },
        status: 'PAID',
        TicketType: { includesHotel: true, isRemote: false },
      },
    },
  });
  return result ? true : false;
}

async function getHotels() {
  const result = await prisma.hotel.findMany({});
  return result;
}

export const hotelsRepository = { getTicketByUser, validateTicket, getHotels };
