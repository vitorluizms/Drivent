import { bookingRepository } from '@/repositories/booking-repository';
import { bookingService } from '@/services/booking-service';
import faker from '@faker-js/faker';
import { Booking, Room, Ticket } from '@prisma/client';
import {
  createBooking,
  createBookingAndRoom,
  createBookingAndRoomForUser,
  createRoom,
  createTicket,
} from '../factories/booking-factory';

beforeEach(() => {
  jest.clearAllMocks();
});

describe(' GET /booking ', () => {
  it('should respond with notFoundError if user does not have a booking', async () => {
    const userId: number = Number(faker.random.numeric(1));
    jest.spyOn(bookingRepository, 'getBookingAndRoomByUser').mockImplementationOnce((): any => {
      return undefined;
    });

    const response = bookingService.getBookingByUser(userId);

    expect(bookingRepository.getBookingAndRoomByUser).toBeCalledTimes(1);
    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  type Booking = {
    id: Number;
    Room: Room;
  };

  it('should respond with booking data', async () => {
    const userId: number = Number(faker.random.numeric(1));
    const booking: Booking = createBookingAndRoom();

    jest.spyOn(bookingRepository, 'getBookingAndRoomByUser').mockImplementationOnce((): any => {
      return booking;
    });

    const response = await bookingService.getBookingByUser(userId);
    expect(bookingRepository.getBookingAndRoomByUser).toBeCalledTimes(1);
    expect(response).toEqual(booking);
  });
});

describe('POST /booking', () => {
  it('should respond with not found error if user does not have a ticket', async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'validateTicket').mockImplementationOnce((): any => {
      return {};
    });

    const response = bookingService.createBooking(userId, roomId);
    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it("should respond with forbidden error if user's ticket is not paid", async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'validateTicket').mockImplementationOnce((): any => {
      return createTicket('RESERVED', false, true);
    });

    const response = bookingService.createBooking(userId, roomId);
    expect(response).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Your ticket is not paid',
    });
  });

  it("should respond with forbidden error if user's ticket is remote", async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'validateTicket').mockImplementationOnce((): any => {
      return createTicket('PAID', true, false);
    });

    const response = bookingService.createBooking(userId, roomId);
    expect(response).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Your ticket is remote',
    });
  });

  it("should respond with forbidden error if user's ticket does not include hotel", async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'validateTicket').mockImplementationOnce((): any => {
      return createTicket('PAID', false, false);
    });

    const response = bookingService.createBooking(userId, roomId);
    expect(response).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'Your ticket is remote',
    });
  });

  it('should respond with not found error if room does not exists', async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'validateTicket').mockImplementationOnce((): any => {
      return createTicket('PAID', false, true);
    });

    jest.spyOn(bookingRepository, 'validateRoom').mockImplementationOnce((): any => {
      return {};
    });

    const response = bookingService.createBooking(userId, roomId);
    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should respond with forbidden error if room is full', async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'validateTicket').mockImplementationOnce((): any => {
      return createTicket('PAID', false, true);
    });

    jest.spyOn(bookingRepository, 'validateRoom').mockImplementationOnce((): any => {
      return createRoom(roomId, 1);
    });

    jest.spyOn(bookingRepository, 'getBookings').mockImplementationOnce((): any => {
      return [createBooking(roomId, Number(faker.random.numeric(1)))];
    });

    const response = bookingService.createBooking(userId, roomId);
    expect(response).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'This room is full',
    });
  });

  it('should create with success and respond with bookingId', async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'validateTicket').mockImplementationOnce((): any => {
      return createTicket('PAID', false, true);
    });

    jest.spyOn(bookingRepository, 'validateRoom').mockImplementationOnce((): any => {
      return createRoom(roomId, 1);
    });

    jest.spyOn(bookingRepository, 'getBookings').mockImplementationOnce((): any => {
      return [];
    });

    const booking = jest.spyOn(bookingRepository, 'createBooking').mockImplementationOnce((): any => {
      return {
        bookingId: Number(faker.random.numeric(1)),
      };
    });

    const response = await bookingService.createBooking(userId, roomId);
    expect(bookingRepository.createBooking).toBeCalledTimes(1);
    expect(response).toEqual(booking);
  });
});

describe('POST /booking/:bookingId', () => {
  it('should respond with forbidden if user does not have a booking', async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));
    const bookingId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'getBookingAndRoomByUser').mockImplementationOnce((): any => {
      return {};
    });

    const response = bookingService.updateRoom(userId, roomId, bookingId);
    expect(response).rejects.toEqual({
      name: 'ForbiddenError',
      message: "You don't have a booking",
    });
  });

  it('should respond with not found error if room does not exists', async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));
    const bookingId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'getBookingAndRoomByUser').mockImplementationOnce((): any => {
      return createBookingAndRoom();
    });

    jest.spyOn(bookingRepository, 'validateRoom').mockImplementationOnce((): any => {
      return {};
    });

    const response = bookingService.updateRoom(userId, roomId, bookingId);
    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should respond with forbidden error if room is full', async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));
    const bookingId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'getBookingAndRoomByUser').mockImplementationOnce((): any => {
      return createBookingAndRoom();
    });

    jest.spyOn(bookingRepository, 'validateRoom').mockImplementationOnce((): any => {
      return createRoom(roomId, 1);
    });

    jest.spyOn(bookingRepository, 'getBookings').mockImplementationOnce((): any => {
      return [createBooking(roomId, Number(faker.random.numeric(1)))];
    });

    const response = bookingService.updateRoom(userId, roomId, bookingId);
    expect(response).rejects.toEqual({
      name: 'ConflictError',
      message: 'The room is full',
    });
  });

  it('should update with success and respond with bookingId', async () => {
    const userId: number = Number(faker.random.numeric(1));
    const roomId: number = Number(faker.random.numeric(1));
    const bookingId: number = Number(faker.random.numeric(1));

    jest.spyOn(bookingRepository, 'getBookingAndRoomByUser').mockImplementationOnce((): any => {
      return createBookingAndRoom();
    });

    jest.spyOn(bookingRepository, 'validateRoom').mockImplementationOnce((): any => {
      return createRoom(roomId, 1);
    });

    jest.spyOn(bookingRepository, 'getBookings').mockImplementationOnce((): any => {
      return [];
    });

    jest.spyOn(bookingRepository, 'updateRoom').mockImplementationOnce((): any => {
      return {
        bookingId,
      };
    });

    const response = await bookingService.updateRoom(userId, roomId, bookingId);
    expect(bookingRepository.updateRoom).toBeCalledTimes(1);
    expect(response).toEqual({
      bookingId,
    });
  });
});
