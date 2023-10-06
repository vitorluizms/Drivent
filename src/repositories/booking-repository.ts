async function getBookingAndRoomByUser(userId: number) {}

async function validateTicket(userId: number) {}

async function validateRoom(roomId: number) {}

async function getBookings(roomId: number) {}

async function createBooking(userId: number, roomId: number) {}

async function updateRoom(bookingId: number, roomId: number) {}

export const bookingRepository = {
  getBookingAndRoomByUser,
  createBooking,
  validateTicket,
  validateRoom,
  getBookings,
  updateRoom
};
