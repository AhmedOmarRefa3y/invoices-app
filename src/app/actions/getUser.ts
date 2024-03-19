import prismaDb from "../../lib/prisma";

export const GetUser = async (userName: string) => {
    // console.log(userName);
    const user = await prismaDb.user.findFirst({
        where: {
            userName: userName,
        },
    });
    // console.log(user);
    return user;
};
export const GetUserByID = async (id: string) => {
    // console.log(id);
    const user = await prismaDb.user.findFirst({
        where: {
            id: id,
        },
    });
    // console.log(user);
    return user;
};
