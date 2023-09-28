import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';
import { Response } from 'express';
import httpStatus from 'http-status';

async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await hotelsService.getHotels(userId);

  res.status(httpStatus.OK).send(result);
}

export const hotelsController = { getHotels };
