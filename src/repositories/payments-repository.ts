import { prisma } from '@/config';
import { CreatePayment } from '@/services/payments-service';

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

async function validateTicket(id: number) {
  const result = await prisma.ticket.findFirst({
    where: { id },
    include: { Enrollment: true, TicketType: true },
  });
  return result;
}

async function createPayment(body: CreatePayment) {
  const result = await prisma.payment.create({
    data: body,
  });
  return result;
}

async function updateTicketStatus(ticketId: number) {
  return await prisma.ticket.update({
    data: { status: 'PAID' },
    where: { id: ticketId },
  });
}

export const paymentsRepository = {
  validateTicketId,
  getPaymentsByTicket,
  validateTicket,
  createPayment,
  updateTicketStatus,
};
