import merge from "lodash.merge";
import dotenv from "dotenv";
dotenv.config();

if (dotenv.config().error) {
  throw new Error("Couldn't find .env file");
}

const stage: string = process.env.NODE_ENV!;

console.log(`${stage} mode`.toUpperCase());

let config;

if (stage === "production") {
    config = require("./prod").default;
} else if (stage === "development") {
  config = require("./dev").default;
} else {
  config = null;
}

export default merge(
  {
    stage,
  },
  config
);
