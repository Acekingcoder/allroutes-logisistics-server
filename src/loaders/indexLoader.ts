import expressLoader from "./expressLoader";
import type { Express } from "express";

export default async function ({ app }: { app: Express }) {
  await expressLoader({ app });
  console.log("Express Initialized Successfully!");
}
