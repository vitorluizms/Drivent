import { faker } from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType(remote?: boolean, hotel?: boolean) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.firstName(),
      price: faker.datatype.number(),
      isRemote: remote ? remote : faker.datatype.boolean(),
      includesHotel: hotel ? hotel : faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
