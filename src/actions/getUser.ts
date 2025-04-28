import prismaDb from "../lib/prisma";

export const GetUser = async (email: string) => {
  const user = await prismaDb.user.findFirst({
    where: {
      email: email,
    },
  });
  return user;
};
export const GetUserByID = async (id: string) => {
  const user = await prismaDb.user.findFirst({
    where: {
      id: id,
    },
  });
  return user;
};
