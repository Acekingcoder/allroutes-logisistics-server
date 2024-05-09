import express from "express";
import config from "./config";
import userRoutes from "./routes/userRoutes";

async function startServer() {
  const app = express();

  (await import("./loaders/mongodbLoader")).default({ app });

  (await import("./loaders/expressLoader")).default({ app });

  app.use("/api", userRoutes);

  app
    .listen(config.port, () =>
      console.log(`Allroutes Logistics server running on port ${config.port}`)
    )
    .on("error", (error) => {
      console.log(error.message);
      process.exit(1);
    });
}

startServer();
