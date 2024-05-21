import express from "express";
import config from "./config/index";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import databaseConnection from "./loaders/mongodbLoader";
import loadingExpressApp from "./loaders/indexLoader";
import riderRoutes from "./routes/riderRoute"

async function startServer() {
  const app = express();

  const { port } = config;

  await databaseConnection({});
  await loadingExpressApp({ app });

  app.use("/api/users", userRoutes);
  app.use("/api/order", orderRoutes);
  app.use("/api/rider", riderRoutes);

  app
    .listen(port, () =>
      console.log(`Allroutes Logistics server running on port ${port}`)
    )
    .on("error", (error) => {
      console.log(error.message);
      process.exit(1);
    });
}

startServer();
