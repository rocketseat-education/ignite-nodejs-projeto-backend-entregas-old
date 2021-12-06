import { prisma } from "../../../../database/prismaClient";
import { hash } from "bcrypt";

interface ICreateClient {
  username: string;
  password: string;
}

export class CreateClientUseCase {
  async execute({ password, username }: ICreateClient) {
    // Validar se o client existe
    const clientExist = await prisma.clients.findFirst({
      where: {
        username: {
          mode: "insensitive",
        },
      },
    });

    if (clientExist) {
      throw new Error("Client already exists");
    }

    const hashPassword = await hash(password, 10);
    // Criptografar a senha

    // Salvar o client
    const client = await prisma.clients.create({
      data: {
        username,
        password: hashPassword,
      },
    });

    return client;
  }
}
