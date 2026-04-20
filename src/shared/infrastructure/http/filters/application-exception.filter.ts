import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

@Catch()
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      response.status(status).json(body);
      return;
    }

    if (exception instanceof MongoServerError && exception.code === 11000) {
      const keyPattern =
        exception.keyPattern &&
        typeof exception.keyPattern === 'object' &&
        !Array.isArray(exception.keyPattern)
          ? (exception.keyPattern as Record<string, unknown>)
          : {};
      const duplicatedField = Object.keys(keyPattern)[0];

      response.status(HttpStatus.CONFLICT).json({
        message: duplicatedField
          ? `${duplicatedField.charAt(0).toUpperCase()}${duplicatedField.slice(1)} already exists!`
          : 'Duplicate key error',
        statusCode: HttpStatus.CONFLICT,
      });
      return;
    }

    if (exception instanceof mongoose.Error.ValidationError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        message: Object.values(exception.errors).map((error) => error.message),
        statusCode: HttpStatus.BAD_REQUEST,
      });
      return;
    }

    if (exception instanceof mongoose.Error.CastError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        message: exception.message,
        statusCode: HttpStatus.BAD_REQUEST,
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
