import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return await prisma.room.create({
    data: {
      name: faker.random.word(),
      capacity: faker.datatype.number(),
      hotelId: hotelId,
    },
  });
}
