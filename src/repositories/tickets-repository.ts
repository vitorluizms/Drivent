import { prisma } from '@/config';
import { Enrollment, Ticket, TicketType } from '@prisma/client';

async function getTypes(): Promise<TicketType[]> {
  const result = await prisma.ticketType.findMany();
  return result;
}

async function getEnrollmentsByUser(userId: number): Promise<Enrollment[]> {
  const result = await prisma.enrollment.findMany({
    where: { userId },
  });
  return result;
}

async function getTicketsByUser(userId: number): Promise<(Ticket & { TicketType: TicketType })[]> {
  const result = await prisma.ticket.findMany({
    where: { Enrollment: { userId: userId } },
    include: { TicketType: true },
  });
  return result;
}

async function postTicketByUser(
  ticketTypeId: number,
  enrollmentId: number,
): Promise<Ticket & { TicketType: TicketType }> {
  const result = await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: 'RESERVED',
    },
    include: { TicketType: true },
  });

  return result;
}

export const ticketsRepository = { getTypes, getTicketsByUser, getEnrollmentsByUser, postTicketByUser };
