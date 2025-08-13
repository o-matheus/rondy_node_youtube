// Importando o dotenv
import 'dotenv/config'

// Importando o fastify 
import fastify from "fastify";

// importando a ligação do prisma com o banco de dados para ser usado aqui 
import { prisma } from "./lib/prisma"

//Criando instância do fastify
const app = fastify();

// Listar todos os usuários - pegar informações
app.get('/user', async () => {

    const dataUser = await prisma.user.findMany()

    return dataUser

})

// Criar usuário - pegar informações
app.post('/user', async (req, res) => {
    
    const dataUser = req.body;

    const User = await prisma.user.create({
        data: dataUser
    });

    return 'Usuário criado com sucesso!'
})

// Atualizar usuário - mudar informações
app.put('/user', () => {
    return 'Alterar usuário'
})

// Deletar usuário - apagar informações
app.delete('/user', () => {
    return 'Deletar usuário'
})

const HOST = process.env.HOST;
const PORT = process.env.PORT;

// Por padrão todas as variáveis do sistema são lidas como string, por isso temos que fazer essa conversão.
app.listen({
    //Fazendo uma validação - Operador ternário
    host: typeof HOST === 'string' ? HOST : '0.0.0.0',
    port: typeof PORT === 'string' ? Number(PORT) : 3333
}).then(() => {
    // Concatenação no JS usa `${variável}`
    console.log(`Server is running on http://${HOST}:${PORT}`)
})