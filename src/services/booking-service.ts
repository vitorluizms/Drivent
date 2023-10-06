async function getBookingByUser(userId: number) {}

async function createBooking(userId: number, roomId: number) {}

async function updateRoom(userId: number, roomId: number, bookingId: number) {}

export const bookingService = { getBookingByUser, createBooking, updateRoom };
