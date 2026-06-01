# Quantum Algorithm Library API

Backend da plataforma Quantum Algorithm Library, responsável por gerenciar algoritmos quânticos, tipos de problema, referências e usuários administrativos.

A API foi desenvolvida com Node.js, Express, TypeScript, Prisma ORM, MongoDB Atlas e autenticação JWT.

Observação: este backend não utiliza serviços de inteligência artificial. Não há chaves de API de IA ou integrações ativas com modelos de IA no código atual.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- MongoDB Atlas
- JWT
- bcrypt
- CORS
- dotenv
- tsx

## Requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js 20 ou superior
- npm
- Git, caso o projeto seja clonado de um repositório remoto
- Conta ou cluster configurado no MongoDB Atlas

Para conferir as versões:

```bash
node -v
npm -v
git --version
Instalação
Clone o repositório ou extraia o arquivo compactado do backend.

Entre na pasta do projeto:

cd quantum-algorithm-library-api-main
Instale as dependências:

npm install
Caso exista um package-lock.json e seja desejada uma instalação reproduzível, use:

npm ci
Gere o client do Prisma:

npm run prisma:generate
Variáveis de Ambiente
Crie um arquivo .env na raiz do backend com as seguintes variáveis:

DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority"
JWT_SECRET="uma_chave_secreta_segura"
PORT=3000
Descrição das Variáveis
DATABASE_URL

String de conexão com o MongoDB Atlas. Essa variável é usada pelo Prisma para acessar o banco de dados.

JWT_SECRET

Chave secreta usada para assinar e validar os tokens JWT da autenticação.

PORT

Porta em que a API será executada. Caso não seja definida, a aplicação usa 3000.

Execução em Desenvolvimento
Para iniciar a API em ambiente local:

npm run dev
A API ficará disponível em:

http://localhost:3000
Para verificar se a API está funcionando:

GET http://localhost:3000/health
Resposta esperada:

{
  "status": "ok"
}
Execução em Produção
Para iniciar a API em modo de produção:

npm run start
Scripts Disponíveis
npm run dev
Inicia a API em desenvolvimento usando tsx.

npm run start
Inicia a API.

npm run prisma:generate
Gera o Prisma Client com base no arquivo prisma/schema.prisma.

npm run prisma:studio
Abre o Prisma Studio para visualizar e gerenciar os dados do banco.

Estrutura do Projeto
src/
  server.ts

  routes/
    algoritmos.ts
    auth.ts
    users.ts
    tipos-problema.ts
    referencias.ts

  middlewares/
    auth.ts

  lib/
    prisma.ts
    request.ts

prisma/
  schema.prisma
Banco de Dados
O backend utiliza MongoDB Atlas com Prisma ORM.

O schema do banco está localizado em:

prisma/schema.prisma
Modelos principais:

User
Algoritmo
TipoProblema
Referencia
Modelo Algoritmo
A entidade Algoritmo armazena informações como:

nome
slug
categoria
descrição curta
descrição completa
complexidade
speedup
implementações
nível de dificuldade
maturidade
status de publicação
aplicações
características
vantagens
limitações
tags
link de origem
tipo de problema
referências
usuário criador
usuário atualizador
Rotas Principais
Status da API
GET /
GET /health
Autenticação
POST /auth/login
Exemplo de corpo da requisição:

{
  "email": "admin@email.com",
  "senha": "senha_do_usuario"
}
Resposta esperada:

{
  "token": "token_jwt"
}
Autenticação JWT
A maior parte das rotas da API exige autenticação via JWT.

O token retornado no login deve ser enviado no cabeçalho Authorization:

Authorization: Bearer token_jwt
Rotas de criação, edição e exclusão exigem perfil admin.

Rotas de Usuários
POST   /users
GET    /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
Observação: a rota POST /users permite criar usuário. As demais rotas exigem autenticação, e algumas exigem perfil administrativo.

Exemplo de criação de usuário:

{
  "nome": "Administrador",
  "email": "admin@email.com",
  "senha": "senha_segura",
  "perfil": "admin"
}
Rotas de Algoritmos
GET    /algoritmos
GET    /algoritmos/:idOuSlug
POST   /algoritmos
PUT    /algoritmos/:id
DELETE /algoritmos/:id
As rotas de algoritmos usam autenticação JWT.

Filtros disponíveis em GET /algoritmos:

busca
status
tipoProblemaId
Exemplo:

GET /algoritmos?busca=grover&status=publicado
Exemplo de corpo para criação de algoritmo:

{
  "nome": "Grover's Algorithm",
  "slug": "grovers-algorithm",
  "categoria": "Search",
  "descricaoCurta": "Algoritmo quântico para busca não estruturada.",
  "descricaoCompleta": "O algoritmo de Grover oferece ganho quadrático para busca em bases não estruturadas.",
  "complexidade": "O(sqrt(N))",
  "speedup": "Quadrático",
  "implementacoes": ["Qiskit", "Cirq"],
  "nivelDificuldade": "Intermediário",
  "maturidade": "Consolidado",
  "statusPublicacao": "publicado",
  "aplicacoes": ["Busca", "Otimização"],
  "caracteristicas": ["Amplitude amplification"],
  "vantagens": ["Redução quadrática do número de consultas"],
  "limitacoes": ["Depende de oráculo adequado"],
  "tags": ["search", "grover", "quantum"],
  "linkOrigem": "https://example.com"
}
Rotas de Tipos de Problema
GET    /tipos-problema
GET    /tipos-problema/:id
POST   /tipos-problema
PUT    /tipos-problema/:id
DELETE /tipos-problema/:id
Exemplo de corpo para criação:

{
  "nome": "Busca",
  "descricao": "Problemas relacionados à busca e seleção de elementos."
}
Rotas de Referências
GET    /referencias
GET    /referencias/:id
POST   /referencias
PUT    /referencias/:id
DELETE /referencias/:id
Filtro disponível em GET /referencias:

algoritmoId
Exemplo:

GET /referencias?algoritmoId=ID_DO_ALGORITMO
Exemplo de corpo para criação:

{
  "titulo": "A fast quantum mechanical algorithm for database search",
  "autores": "Lov K. Grover",
  "ano": 1996,
  "tipoReferencia": "Artigo",
  "link": "https://arxiv.org/abs/quant-ph/9605043",
  "algoritmoId": "ID_DO_ALGORITMO"
}
Middleware de Autenticação
O backend possui middleware de autenticação em:

src/middlewares/auth.ts
Esse middleware:

verifica se o cabeçalho Authorization foi enviado;
valida o token JWT;
adiciona os dados do usuário autenticado em req.usuario;
permite restringir rotas por perfil usando exigirPerfil("admin").
Implantação no Render
Para publicar a API no Render, crie um novo Web Service apontando para o repositório do backend.

Configurações recomendadas:

Build Command:
npm install && npm run prisma:generate

Start Command:
npm run start
Configure as variáveis de ambiente no painel do Render:

DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority"
JWT_SECRET="uma_chave_secreta_segura"
O Render normalmente fornece a variável PORT automaticamente. Caso necessário, ela também pode ser configurada.

Depois do deploy, a API ficará disponível em uma URL semelhante a:

https://nome-do-servico.onrender.com
Para testar:

https://nome-do-servico.onrender.com/health
Resposta esperada:

{
  "status": "ok"
}
Integração com o Frontend
No frontend, configure a variável:

NEXT_PUBLIC_API_URL=https://nome-do-servico.onrender.com
Em ambiente local:

NEXT_PUBLIC_API_URL=http://localhost:3000
Essa variável permite que o frontend consuma os endpoints da API.

Observações Sobre Inteligência Artificial
Este backend não possui integração ativa com serviços de inteligência artificial.

Não é necessário configurar:

OPENAI_API_KEY
ANTHROPIC_API_KEY
GEMINI_API_KEY
ou qualquer outra chave relacionada a IA.

A documentação original da API menciona que a estrutura está preparada para futura integração com IA, mas essa integração não foi implementada no código atual.

Observações Finais
A API utiliza MongoDB Atlas como banco de dados.
O acesso ao banco é feito via Prisma ORM.
A autenticação usa JWT.
Senhas de usuários são criptografadas com bcrypt.
Rotas protegidas exigem o cabeçalho Authorization.
Rotas administrativas exigem perfil admin.
A aplicação pode rodar localmente ou ser publicada no Render.
Não há chaves de API de IA a configurar.
