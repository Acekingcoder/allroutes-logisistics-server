import express from "express";
import config from "./config/index";
import userRoutes from "./routes/userRoutes";
import databaseConnection from "./loaders/mongodbLoader";
import loadingExpressApp from "./loaders/indexLoader";

async function startServer() {
  const app = express();

  const { port } = config;

  await databaseConnection({});
  await loadingExpressApp({ app });

  app.use("/api", userRoutes);

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
