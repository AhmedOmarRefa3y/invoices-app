import prismaDb from "./prisma";

export const GetUser = async (userName: string) => {
    const user = await prismaDb.user.findFirst({
        where: {
            userName: userName,
        },
    });

    return user;
};
