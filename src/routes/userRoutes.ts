
import { FastifyInstance } from "fastify"
// importando a ligação do prisma com o banco de dados para ser usado aqui 
import { prisma } from '../lib/prisma'
import bcrypt from "bcrypt"
import z from "zod"

export default function useRoutes(app: FastifyInstance) {

    app.addHook('preHandler', async (req) => {
        await req.jwtVerify();
    })


    // Listar todos os usuários - pegar informações
    app.get('/user', async (req, res) => {

        const dataUser = await prisma.user.findMany()

        res.status(200).send(dataUser)

    })

    // Criar usuário - pegar informações
    app.post('/user', async (req, res) => {

        const schema = z.object({
            name: z.string().trim().min(6, { message: 'O nome é obrigatório' }),
            email: z.email().trim().min(10, { message: 'O email é obrigatório' }),
            password: z.string().trim().min(6, { message: 'A senha precisa de no mínimo 6 caracteres' })
        })

        const { name, email, password } = schema.parse(req.body)

        //Criptografando a senha.
        const passwordHashed = await bcrypt.hash(password, 10)

        const User = await prisma.user.create({
            data: {
                name,
                email,
                // campo de dados e variável possui nomes diferentes então fizemos aqui a mudança.
                password: passwordHashed
            }
        });

        res.status(201).send({ message: 'Usuário criado com sucesso!' })
    })

    // Atualizar usuário - mudar informações
    app.put('/user/:id', async (req, res) => {

        const schema = z.object({
            name: z.string().trim().min(6, { message: 'O nome é obrigatório' }),
            email: z.email().trim().min(10, { message: 'O email é obrigatório' }),
            password: z.string().trim().min(6, { message: 'A senha precisa de no mínimo 6 caracteres' })
        })
        const { id } = req.params
        const { name, email, password } = schema.parse(req.body)

        const passwordHashed = await bcrypt.hash(password, 10)

        const User = await prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                email,
                password: passwordHashed
            }
        })

        res.status(200).send({ message: 'Usuário atualizado com sucesso!' })

    })

    // Deletar usuário - apagar informações
    app.delete('/user/:id', async (req, res) => {

        const { id } = req.params

        const User = await prisma.user.delete({

            where: {
                id
            }
        })

        res.status(200).send({ message: 'Usuário deletado!' })
    })
}