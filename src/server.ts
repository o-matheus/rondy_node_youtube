// Importando o dotenv
import 'dotenv/config'

// Importando o fastify 
import fastify from "fastify";
import fastifyCors from "@fastify/cors"
import fastifyJwt from "@fastify/jwt"

import loginRoutes from './routes/loginRoutes';
import userRoutes from './routes/userRoutes';

//Criando instância do fastify
const app = fastify();

app.register(fastifyCors, {
    origin: "*"
})
app.register(fastifyJwt, {
    secret: "nikoasd"
})

app.register(loginRoutes)
app.register(userRoutes)

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