import { TicketWithType } from '@/protocols';
import faker from '@faker-js/faker';
import { Booking, Room, TicketStatus } from '@prisma/client';

export function createBookingAndRoom() {
  return {
    id: Number(faker.random.numeric(1)),
    Room: {
      id: Number(faker.random.numeric(1)),
      name: faker.commerce.productName(),
      capacity: Number(faker.random.numeric(1)),
      hotelId: Number(faker.random.numeric(1)),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  };
}

export function createTicket(status: TicketStatus, isRemote: boolean, includesHotel: boolean): TicketWithType {
  return {
    id: Number(faker.random.numeric(1)),
    status: status,
    TicketType: {
      id: Number(faker.random.numeric(1)),
      name: faker.commerce.product(),
      price: Number(faker.finance.amount()),
      isRemote: isRemote,
      includesHotel: includesHotel,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  };
}

export function createRoom(roomId: number, capacity: number): Room {
  return {
    id: roomId,
    name: faker.commerce.product(),
    capacity: capacity,
    hotelId: Number(faker.random.numeric(1)),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
}

export function createBooking(roomId: number, userId: number): Booking {
  return {
    id: Number(faker.random.numeric(1)),
    userId,
    roomId,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
}
