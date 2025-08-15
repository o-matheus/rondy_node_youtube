import { FastifyInstance } from "fastify"
import { prisma } from '../lib/prisma'
import bcrypt from "bcrypt"
import z from "zod"

export default function loginRoutes(app: FastifyInstance) {

    app.post("/login", async (req, res) => {

        const schema = z.object({
            email: z.email().trim().min(10, { message: 'Email é obrigatório' }),
            password: z.string().trim().min(6, { message: 'Digite a senha' })
        })


        const { email, password } = schema.parse(req.body)

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })


        if (!user) {
            res.status(404).send({ message: 'Usuário ou senha inválidos!' })
        }

        const passwordChecked = await bcrypt.compare(password, user!.password)

        if (!passwordChecked) {
            res.status(404).send({ message: 'Usuário ou senha inválidos!' })
        }

        const newUser = {
            id: user!.id,
            name: user!.name,
            email: user!.email
        }

        const token = app.jwt.sign(newUser, { expiresIn: 86400 })

        res.status(200).send({ token })
    })

}