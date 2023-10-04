import { bookingRepository } from '@/repositories/booking-repository';
import { bookingService } from '@/services/booking-service';
import faker from '@faker-js/faker';
import { Booking, Room } from '@prisma/client';

beforeEach(() => {
  jest.clearAllMocks();
});

describe(' GET /booking ', () => {
  it('should respond with notFoundError if user does not have a booking', async () => {
    jest.spyOn(bookingRepository, 'getBookingAndRoomByUser').mockImplementationOnce((): any => {
      return undefined;
    });

    const response = await bookingService.getBookingByUser(Number(faker.random.numeric(1)));

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

  it('should respond with status booking data', async () => {
    const userId = Number(faker.random.numeric());
    const booking: Booking = {
      id: Number(faker.random.numeric(1)),
      Room: {
        id: Number(faker.random.numeric(1)),
        name: faker.commerce.productName(),
        capacity: Number(faker.random.numeric(1)),
        hotelId: Number(faker.random.numeric(1)),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
    };

    jest.spyOn(bookingRepository, 'getBookingAndRoomByUser').mockImplementationOnce((): any => {
      return booking;
    });

    const response = await bookingService.getBookingByUser(userId);
    expect(bookingRepository.getBookingAndRoomByUser).toBeCalledTimes(1);
    expect(response).toEqual(booking);
  });
});
