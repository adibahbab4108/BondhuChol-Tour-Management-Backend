//workflow: Route matching-> cotroller-> service-> model->MongoDB
//Mysteps: interface->model->controller->service-> Route creation

import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

// Global error handler
app.use(globalErrorHandler);

app.use(notFound);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to BondhuChol Tour Management System!");
});

export default app;
