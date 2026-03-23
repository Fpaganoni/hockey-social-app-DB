import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      "http://localhost:3000", // Next.js frontend
      "http://localhost:3001", // Alternative port
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
  console.log("Server running on http://localhost:4000/graphql");
}
bootstrap();
