import { PrismaClient } from "@prisma/client";

//Criando a conexão do prisma com o banco de dados e fazendo um export para que possa ser usado em diversas áreas do código. 
export const prisma = new PrismaClient()