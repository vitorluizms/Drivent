import { prisma } from '@/config';

async function getBookingAndRoomByUser(userId: number) {
  const result = await prisma.booking.findFirst({
    where: { userId },
    select: { id: true, Room: true },
  });

  return result;
}

async function validateTicket(userId: number) {
  const result = await prisma.ticket.findFirst({
    where: { Enrollment: { userId } },
    include: { TicketType: true },
  });
  return result;
}

async function validateRoom(roomId: number) {
  const result = await prisma.room.findFirst({
    where: { id: roomId },
  });
  return result;
}

async function getBookings(roomId: number) {
  const result = await prisma.booking.findMany({
    where: { roomId },
  });
  return result;
}

async function createBooking(userId: number, roomId: number) {
  const result = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: { id: true },
  });
  return { bookingId: result.id };
}

async function updateRoom(bookingId: number, roomId: number) {}

export const bookingRepository = {
  getBookingAndRoomByUser,
  createBooking,
  validateTicket,
  validateRoom,
  getBookings,
  updateRoom,
};
