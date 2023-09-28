import faker from '@faker-js/faker';
import supertest from 'supertest';
import app, { init } from '@/app';
import { prisma } from '@/config';
import httpStatus from 'http-status';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { createHotel, createRoom } from '../factories/hotels-factory';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when given token is valid', () => {
    it('should respond with status 404 if user does not have an enrollment', async () => {
      const token = await generateValidToken();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if user does not have a ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    describe('when user has an enrollment and ticket', () => {
      it('should respond with status 402 if ticket is not paid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });

      it('should respond with status 402 if ticket does not includes hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });

      it('should respond with status 402 if ticket is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(true, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });

      it('should respond with status 404 if there is no hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it('should respond with status 200 and Hotel data', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        console.log(response.body);
        console.log(hotel);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveLength(1);
        expect(response.body).toEqual([
          {
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
          },
        ]);
      });
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when given token is valid', () => {
    it('should respond with status 404 if user does not have an enrollment', async () => {
      const token = await generateValidToken();
      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if user does not have a ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    describe('when user has an enrollment and ticket', () => {
      it('should respond with status 402 if ticket is not paid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });

      it('should respond with status 402 if ticket does not includes hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });

      it('should respond with status 402 if ticket is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(true, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      });

      it('should respond with status 404 if there is no hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it('should respond with status 200 and Hotel with Rooms data', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
          Rooms: [
            {
              id: room.id,
              name: room.name,
              capacity: room.capacity,
              hotelId: room.hotelId,
              createdAt: room.createdAt.toISOString(),
              updatedAt: room.updatedAt.toISOString(),
            },
          ],
        });
      });
    });
  });
});
