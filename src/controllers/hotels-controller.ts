import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';
import { Response } from 'express';
import httpStatus from 'http-status';

async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await hotelsService.getHotels(userId);

  res.status(httpStatus.OK).send(result);
}

async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  
  const response = await hotelsService.getHotelById(userId, Number(hotelId));
  res.status(httpStatus.OK).send(response);
}
export const hotelsController = { getHotels, getHotelById };
