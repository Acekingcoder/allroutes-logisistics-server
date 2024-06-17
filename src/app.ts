
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import orderRouter from './routes/order';
import riderRouter from './routes/rider';
import transactionRouter from './routes/transaction';
import connectDB from './config/database';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/order', orderRouter);
app.use('/rider', riderRouter);
app.use('/transaction', transactionRouter);

// Handle 404 Not Found
app.use("/*", (req, res) => {
    return res.status(404).json("Endpoint not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Allroutes Logistics server running on port ${PORT}`)
});


// import config from "./config/index";
// import userRoutes from "./routes/userRoutes";
// import orderRoutes from "./routes/orderRoutes";
// import txRoutes from "./routes/txRoutes";
// import databaseConnection from "./loaders/mongodbLoader";
// import loadingExpressApp from "./loaders/indexLoader";
// import riderRoutes from "./routes/riderRoute"

// async function startServer() {
//   const app = express();

//   const { port } = config;

//   await databaseConnection({});
//   await loadingExpressApp({ app });

//   app.use("/api/users", userRoutes);
//   app.use("/api/order", orderRoutes);
//   app.use("/api/rider", riderRoutes);
//   app.use("/api/tx", riderRoutes);

//   app
//     .listen(port, () =>
//       console.log(`Allroutes Logistics server running on port ${port}`)
//     )
//     .on("error", (error) => {
//       console.log(error.message);
//       process.exit(1);
//     });
// }

// startServer();

