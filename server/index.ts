import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createYoga } from "graphql-yoga";
import cors from "cors";
import { schema } from "./src/graphql/schema";
import dotenv from "dotenv";
import { prisma } from "./src/config/prisma";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

dotenv.config();

io.on("connection", (socket: any) => {
  console.log("a user connected");

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log("user joined room", roomId);
  });

  socket.on("leaveRoom", (roomId: string) => {
    socket.leave(roomId);
    console.log("user left room", roomId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const yoga = createYoga({
  schema,
  context: async ({ request }) => {
    let user = null;

    const authHeader = request.headers.get("Authorization");

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any;
        user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    return { io, request, user };
  },
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/graphql", yoga);

app.get("/", (req, res) => {
  res.send("server running");
});

server.listen(8080, () => {
  console.log("server running on http://localhost:8080");
});
