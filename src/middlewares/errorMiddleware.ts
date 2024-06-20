import { Request, Response } from "express";
import { MongoError } from "mongodb";

export const errorHandler = (error: Error, res: Response) => {
  console.error(error);

  let statusCode = 500;
  let errorMessage = "Internal Server Error";

  if (error instanceof SyntaxError) {
    statusCode = 400;
    errorMessage = "Bad Request";
  } else if (error.name === "ValidationError") {
    statusCode = 422;
    errorMessage = error.message;
  } else if (error instanceof MongoError) {
    switch (error.code) {
      case 11000:
        statusCode = 409;
        errorMessage = "Duplicate key error";
        break;
      default:
        statusCode = 500;
        errorMessage = "Database Error";
        break;
    }
  }
  console.log(error);
  res.status(statusCode).json({ message: errorMessage });
};
