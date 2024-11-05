import { prisma } from "../libs/prisma";

// export const getOrCreateRoom = async (userId: number, adminId: number) => {
//   try {
//     console.log("Searching for existing room...");
//     const room = await prisma.room.findFirst({
//       where: {
//         AND: [
//           { users: { some: { id: userId } } },
//           { users: { some: { id: adminId } } },
//         ],
//       },
//       include: {
//         users: true,
//         messages: true,
//       },
//     });

//     if (room) {
//       console.log("Room found:", room);
//       return room;
//     }

//     console.log("Room not found, creating a new one...");
//     const newRoom = await prisma.room.create({
//       data: {
//         users: {
//           connect: [{ id: userId }, { id: adminId }],
//         },
//       },
//       include: {
//         users: true,
//         messages: true,
//       },
//     });

//     console.log("Room created:", newRoom);
//     return newRoom;
//   } catch (error) {
//     console.error("Error in getOrCreateRoom:", error);
//     throw error;
//   }
// };

export const sendMessage = async (
  userId: number,
  roomId: number,
  content: string
) => {
  const messages = await prisma.message.create({
    data: {
      senderId: userId,
      roomId,
      content,
    },
  });
  return messages;
};

export const getMessage = async (roomId: number) => {
  const messages = await prisma.message.findMany({
    where: {
      roomId,
    },
    include: {
      sender: true,
    }
  });
  return messages;
};
