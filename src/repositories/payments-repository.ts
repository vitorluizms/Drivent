import { prisma } from '@/config';

async function getPaymentsByTicket(ticketId: number) {
  const result = await prisma.payment.findFirst({
    where: { ticketId },
  });
  return result;
}

async function validateTicketId(ticketId: number) {
  const result = await prisma.enrollment.findFirst({
    where: { Ticket: { id: ticketId } },
  });
  return result;
}

export const paymentsRepository = { validateTicketId, getPaymentsByTicket };
