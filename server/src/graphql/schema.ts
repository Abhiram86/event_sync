import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";
import { prisma } from "../config/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// UserType
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    joinedEvents: {
      type: new GraphQLList(EventType),
      resolve: async (parent) => {
        const userEvents = await prisma.userEvent.findMany({
          where: { userId: parent.id },
          include: { event: true },
        });
        return userEvents.map((ue) => ue.event);
      },
    },
  }),
}) as any;

// EventType
const EventType = new GraphQLObjectType({
  name: "Event",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    startTime: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (parent) => parent.startTime.toISOString(),
    },
    attendees: {
      type: new GraphQLList(UserType),
      resolve: async (parent) => {
        const userEvents = await prisma.userEvent.findMany({
          where: { eventId: parent.id },
          include: { user: true },
        });
        return userEvents.map((ue) => ue.user);
      },
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (parent) => parent.createdAt.toISOString(),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (parent) => parent.updatedAt.toISOString(),
    },
  }),
});

const AuthPayload = new GraphQLObjectType({
  name: "AuthPayload",
  fields: () => ({
    token: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: new GraphQLNonNull(UserType) },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    events: {
      type: new GraphQLList(EventType),
      resolve: (_parent, _args, context) => {
        if (!context.user) throw new Error("Not authenticated");
        return prisma.event.findMany();
      },
    },
    event: {
      type: EventType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_parent, args, context) => {
        if (!context.user) throw new Error("Not authenticated");
        return prisma.event.findUnique({ where: { id: args.id } });
      },
    },
    me: {
      type: UserType,
      resolve: (_parent, _args, context) => context.user,
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: () => prisma.user.findMany(),
    },
  },
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: AuthPayload,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_parent, args) => {
        const existingUser = await prisma.user.findUnique({
          where: { email: args.email },
        });
        if (existingUser) {
          throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = await prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
          },
        });
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY!, {
          expiresIn: "1h",
        });
        return { token, user };
      },
    },
    login: {
      type: AuthPayload,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_parent, args) => {
        const user = await prisma.user.findUnique({
          where: { email: args.email },
        });
        if (!user) {
          throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(
          args.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY!, {
          expiresIn: "1h",
        });
        return { token, user };
      },
    },
    joinEvent: {
      type: EventType,
      args: {
        eventId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_parent, args, context) => {
        const user = context.user as any;
        if (!user) throw new Error("Not authenticated");

        // Prevent duplicate join
        const existing = await prisma.userEvent.findFirst({
          where: { userId: user.id, eventId: args.eventId },
        });
        if (!existing) {
          await prisma.userEvent.create({
            data: {
              userId: user.id,
              eventId: args.eventId,
            },
          });

          context.io?.to(args.eventId).emit("userJoined", {
            id: user.id,
            name: user.name,
          });
        }
        const updatedEvent = await prisma.event.findUnique({
          where: { id: args.eventId },
        });

        console.log("user joining...");

        return updatedEvent;
      },
    },
    leaveEvent: {
      type: EventType,
      args: {
        eventId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_parent, args, context) => {
        const user = context.user as any;
        if (!user) throw new Error("Not authenticated");
        const existingUserEvent = await prisma.userEvent.findFirst({
          where: { userId: user.id, eventId: args.eventId },
        });
        if (existingUserEvent) {
          await prisma.userEvent.delete({
            where: { id: existingUserEvent.id },
          });
          context.io?.to(args.eventId).emit("userLeft", user.id);
        }
        const updatedEvent = await prisma.event.findUnique({
          where: { id: args.eventId },
        });
        return updatedEvent;
      },
    },
  },
});

// Export schema
export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
