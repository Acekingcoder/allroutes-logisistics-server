import dotenv from "dotenv";

dotenv.config();

const { DEV_PORT, MORGAN, DEV_MONGO_URI } = process.env;

export default {
  port: DEV_PORT,
  logs: {
    morgan: MORGAN!,
  },
  mongoURI: DEV_MONGO_URI!,
};
