# Backend NodeJS

## Menu
[Aula 1](#aula-1---preparando-o-ambiente-de-desenvolvimento)    
[Aula 2](#aula-2---persistência-de-dados)    


## Aula 1 - Preparando o ambiente de desenvolvimento
Primeiro passo fazer a instalação do nodeJS pelo site: https://nodejs.org/pt/download
Fazer o download da versão LTS é melhor porque garante um suporte de mais longo prazo. 

No terminal digite:  
`node -v` -> Ver versão do node  
`npm -v` -> Ver versão do gerenciador de pacotes  
`mkdir nome` -> Fazer nova pasta  
`cd destino` -> Pasta que quer chegar  
`cd ..` -> voltar para pasta anterior  
`code .` -> Abrir pasta no VScode

Para o projeto vamos criar uma pasta `aula` e dentro dessa pasta aula uma pasta `api`.

Depois de abrir a pasta dentro do Vscode vamos começar a fazer a estrutura do nosso ambiente de desenvolvimento.
Criação da pasta `src` para ficar armazenado os arquivos fonte do projeto.
Nela criamos um arquivo `server.js` para ver se o node está funcionando corretamente.

`node src/server.js` -> Para executar o arquivo no terminal.  
`npm i typescript tsc tsx -D` -> Instalando `tsc` o compilador que vai transformar arquivos `ts` e `tsx` em arquivos JavaScript. `tsx` Faz com que seja possível colocar o `JSX` dentro do TypeScript sem que de um erro e o `jsx` é como se fosse um HTML mais ou menos. 

Para criar uma api rest é necessário ter um servidor web para processar as requisições `express` e `fastify` são as duas principais soluções.

Para fazer a leitura correta do arquivo typescript um script no package.json chamado de `dev` que rodava o comando `tsx watch src/server.ts`, para rodar com o compilador do ts acompanhando as alterações que fiz no arquivo em tempo real, em vez de rodar com o node.

## Aula 2 - Persistência de dados
Armazenamento dos dados de forma estática para eles não se perderem. 
Vamos começar a trabalhar com banco de dados. 
Baixar a extensão prisma para ficar mais fácil trabalhar com ele no VsCode.  
`Prisma` -> ORM - Object relational map -> Mapeamento do objeto com o banco de dados relacional
Temos que baixar o prisma, depois o client  
`npm i prisma -D` -> Baixar o prisma  
`npm i @prisma/client` -> Baixando o client  
`npx prisma init --datasource-provider sqlite` -> Iniciar o prisma com sqLite.  
`npx prisma migrate dev` -> Criando banco de dados com o prisma.
`npx prisma studio` -> Ver o banco de dados na versão web.

```ts
app.listen({
    host: '0.0.0.0',
    port: 3333,
}).then(() => {
    console.log('Server is running http://localhost:3333')
}) 
```
Dessa forma que escrevemos temos que atualizar de forma manual os valores para adequar ao nosso ambiente de desenvolvimento.  
Vamos baixar o `dotenv` - `npm i dotenv` -> Para pegar essas variáveis globais que nosso computador possui e já sincronizar com nosso código.

Na hora de pegar essas variáveis globais do sistema tinha dado um erro porque o TypeScript não pega por padrão algumas coisas do nodeJS.  
`npm i -D @types/node` -> Usei esse comando para resolver o problema.

Temos que criar na raiz do projeto o arquivo `.env`pra trabalhar com essas variáveis globais aparentemente. 

Depois de configurar o prisma, e criar a tabela, vamos começar a trabalhar com os métodos http que criamos anteriormente para eles realmente fazerem algo, além de só mostrar uma mensagem quando eram chamados.

Temos que conectar o prisma com o banco de dados para dar certo.
Criamos a pasta `lib`, dentro de `src` e lá criamos o arquivo `prisma.ts`

```prisma
generator client {
  provider = "prisma-client-js"
  
}
```
No processo de instalação do prisma tinha dado um erro em relação a pasta destino que estava sendo utilizada no output - foi resolvido e com isso e depois de eu ter corrigido a escrita do endereço do servidor, voltou a funcionar no postman a comunicação com o servidor web local.

Na primeira vez que executamos a rota do `post`, não foi feito com sucesso porque não fizemos uma função assíncrona, ou seja, não esperamos que as informações fossem enviadas antes de fechar a chamada.


```ts
app.post('/user', async () => {
    const User = await prisma.user.create({
        data: {
        name: 'Suehtam',
        email: 'suehtam@teste.com',
        password: '654321'
        }
    });

return 'Usuário criado com sucesso!'
```
Da forma como estamos estruturando essa função, estamos colocando de forma estática no código as informações, não é algo bom para as boas práticas.
Adicionamos o `req` e o `res` como parametros do post, trabalhando com as informações do processo de requisição e resposta do servidor.
Para tirar essa estruturação de forma estática no código, escrevemos esse modelo de estrutura como um json raw no postman, que conseguimos ter o acesso por meio da const dataUser =`req.body`

/- Não sei se vamos fazer nessas aulas -/   
Então temos que preparar essas estrutura de uma forma que peguemos essas informações do front end e a utilizemos para adicionar as infos do usuário.

## Aula 3 - Organizando as outras rotas.
Nessa aula organizamos a rota do get(Pegar informações) e do put(Alterar informações).
No `get` usamos a função do prisma chamada de `findMany`, foi um processo bem rápido.
```ts
app.get('/user', async (req, res) => {

    const dataUser = await prisma.user.findMany()

    res.status(200).send(dataUser)

})
```

No `put` usamos a função `update`, tivemos que fazer alguns passos extras para definir qual registro nós iriamos fazer a modificação, atualizamos as informações do body pelo postman e além do `data:`, utilizamos o `where:` na função.

```ts
app.post('/user', async (req, res) => {
    
    const dataUser = req.body;

    const User = await prisma.user.create({
        data: dataUser
    });

    res.status(201).send('Usuário criado com sucesso!')
})
```

Também adicionamos o `req` e o `res` nelas. Fizemos uma forma de resposta diferente, definindo que quando determinada comunicação fosse feita, o retorno seria uma coisa especifica, por exemplo.

`res.status(200).send('Usuário atualizado com sucesso!')`


### A estudar
* Códigos de retorno HTTP