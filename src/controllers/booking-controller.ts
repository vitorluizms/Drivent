import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';

async function getBookingByUser(req: AuthenticatedRequest, res: Response) {}

async function createBooking(req: AuthenticatedRequest, res: Response) {}

export const bookingController = { getBookingByUser, createBooking };
