import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import apiRouter from "./routes";
import errorHandler from "./middlewares/errorHandler";
import config from "./helpers/config";
import reviewRouter from "./routes/review.route";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './helpers/swagger_config';

const app = express();
const PORT = parseInt(process.env.PORT || "8080");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", reviewRouter);
// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        error: false,
        data: {
            app: 'dave-odyssey-backend',
            version: '1.0'
        },
        message: 'app is healthy',
        status: 200
    })

})

app.use(`${config.API_ROUTE}`, apiRouter);

// app.use("*", (req: Request, res: Response) => {
//     return res.status(404).send("NOT FOUND");
// });

app.use(errorHandler);

app.listen(PORT, async () => {
    // await conn;
    console.log(`Listening on ${PORT}`);
});
