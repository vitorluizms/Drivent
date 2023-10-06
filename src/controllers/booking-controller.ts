import { invalidDataError } from '@/errors';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services/booking-service';
import { Response } from 'express';
import httpStatus from 'http-status';

async function getBookingByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await bookingService.getBookingByUser(userId);
  res.status(httpStatus.OK).send(result);
}

async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  const result = await bookingService.createBooking(userId, roomId);
  res.status(200).send(result);
}

async function updateRoomId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { bookingId } = req.params;
  const { roomId } = req.body;

  if (isNaN(Number(bookingId))) {
    throw invalidDataError('bookingId invalid');
  }

  const result = await bookingService.updateRoom(userId, roomId, Number(bookingId));
  res.status(200).send(result);
}

export const bookingController = { getBookingByUser, createBooking, updateRoomId };
