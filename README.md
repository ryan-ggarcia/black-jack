# jack dos cria — Blackjack Multiplayer

Solução fullstack para uma plataforma de jogo multiplayer de **21 (Blackjack)**, com **Next/React** no frontend e **Node/Express** no backend.

O usuário cria uma conta e, com ela, pode criar uma sala de jogo ou entrar em salas já existentes. Quando o usuário se torna participante de uma sala, o jogo pode ser iniciado.

## Sumário

- [Banco de dados](#banco-de-dados)
- [Competências funcionais](#competências-funcionais)
- [Competências tecnológicas](#competências-tecnológicas)
- [Como o jogo funciona](#como-o-jogo-funciona)
- [Regras do jogo](#regras-do-jogo)
- [Baralho (Deck of Cards API)](#baralho-deck-of-cards-api)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar](#como-executar)

## Banco de dados

Todo o sistema deve funcionar com o modelo de banco de dados definido em [`banco.sql`](banco.sql) (MySQL).

| Tabela            | Descrição                                                        |
| ----------------- | ---------------------------------------------------------------- |
| `tb_usuario`      | Usuários cadastrados na plataforma                               |
| `tb_sala`         | Salas de jogo e o usuário que as criou                           |
| `tb_participante` | Participação de um usuário em uma sala (ordem, saldo, entrada/saída) |
| `tb_rodada`       | Rodadas de uma sala, com o código do baralho utilizado          |
| `tb_aposta`       | Aposta de um participante em uma rodada                          |
| `tb_turno`        | Turno de um participante na rodada (soma das cartas e status)    |
| `tb_carta`        | Cartas compradas em uma rodada                                   |

> As cartas e o turno do **dealer** são representados com `par_id = NULL` nas tabelas `tb_carta` e `tb_turno`.

## Competências funcionais

A plataforma é dividida em duas partes: **área pública** e **área restrita**.

### Área pública

- Registro de um novo usuário
- Autenticação (login)
- Página institucional sobre a plataforma FIPP21

### Área restrita

- Criação de uma nova sala de jogo
- Exibição das salas do usuário
- Entrada em uma sala através do código
- Implementação das regras do jogo 21 ([detalhadas abaixo](#regras-do-jogo))
- Saída da sala

## Competências tecnológicas

### Backend

- Node/Express (API RESTful)
- Swagger
- Middleware para validar as requisições (JWT)
- WebSocket (para os eventos que acontecem no jogo)

### Frontend

- Next/React
- Middleware para validar a navegação entre páginas
- Context API para personalizar o acesso do usuário logado
- WebSocket (para os eventos que acontecem no jogo)

## Como o jogo funciona

- Quando algum participante entra na sala, o jogo é iniciado.
- Todos os participantes começam o jogo com saldo de **1000**.
- Se um participante entrar na sala com um jogo em andamento, ele só jogará a partir da próxima rodada.
- Apenas participantes com saldo **maior que 10** podem jogar.
- Cada jogo é composto por _N_ rodadas, e cada rodada segue as regras do 21.

## Regras do jogo

O objetivo do 21 é obter uma pontuação maior que a do dealer (crupiê) **sem ultrapassar 21 pontos**. Cada jogador compete individualmente contra o dealer, e não contra os outros jogadores.

### Valores das cartas

| Carta                     | Valor                                          |
| ------------------------- | ---------------------------------------------- |
| 2 a 10                    | Valor nominal                                  |
| Valete, Dama, Rei         | 10 pontos                                      |
| Ás                        | 1 ou 11 pontos, o que for mais vantajoso para o jogador |

### Mecânica do jogo

#### 1. Início da rodada

Cada jogador faz sua aposta individual antes de as cartas serem distribuídas. Os valores das apostas podem variar entre os participantes da mesma mesa.

#### 2. Distribuição inicial

- Cada jogador recebe duas cartas viradas para cima (visíveis).
- O dealer recebe duas cartas: uma virada para cima (visível) e outra virada para baixo (oculta).

#### 3. Turno dos jogadores

Os jogadores decidem suas ações em ordem, um por vez:

- **Pedir carta (Hit):** solicita mais uma carta para aumentar a pontuação.
- **Parar (Stand):** mantém a pontuação atual e encerra o turno.

O jogador pode pedir quantas cartas quiser, mas, se a pontuação ultrapassar 21, ele **estoura** (_bust_) e perde automaticamente a aposta, independentemente do resultado do dealer.

#### 4. Turno do dealer

Após todos os jogadores finalizarem suas jogadas, o dealer revela a carta oculta e joga seguindo regras fixas:

- Pede carta (hit) obrigatoriamente com **16 pontos ou menos**.
- Para (stand) obrigatoriamente com **17 pontos ou mais**.

#### 5. Resolução e pagamentos

A pontuação final de cada jogador é comparada individualmente com a do dealer:

| Situação                                   | Resultado                                                         |
| ------------------------------------------ | ----------------------------------------------------------------- |
| Jogador com pontuação maior que o dealer (sem estourar) | Vence — recebe 1:1 (aposta 50 → recebe 100 no total) |
| Jogador com pontuação menor que o dealer   | Perde a aposta                                                    |
| Mesma pontuação (_push_)                   | Empate — recebe a aposta de volta                                 |
| Jogador estoura (passa de 21)              | Perde imediatamente, mesmo que o dealer também estoure depois     |
| Dealer estoura (passa de 21)               | Todos os jogadores que não estouraram vencem                      |
| **Blackjack natural** (Ás + carta de valor 10 nas duas cartas iniciais) | Recebe 3:2 (aposta 50 → recebe 125 no total) |

### Vantagem do dealer

A principal vantagem do dealer é que os jogadores jogam primeiro. Se um jogador estourar, perde a aposta imediatamente, mesmo que o dealer também estoure na sequência. Essa regra garante a vantagem matemática do cassino no longo prazo.

### Observações importantes

- Múltiplos jogadores podem vencer simultaneamente na mesma rodada.
- Cada jogador compete apenas contra o dealer, não contra os outros jogadores.
- As decisões de um jogador não afetam os resultados dos demais.
- O dealer não tem poder de decisão; apenas segue as regras automáticas.

## Baralho (Deck of Cards API)

Toda a parte do baralho deve ser feita com a [Deck of Cards API](https://deckofcardsapi.com/), que oferece endpoints para criar baralhos e comprar cartas. Cada rodada terá um **novo baralho** (coluna `rod_codigobaralho`), e as cartas jogadas na rodada são compradas desse baralho.

**Gerar um novo baralho embaralhado:**

```
GET https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
```

**Comprar cartas de um baralho:**

```
GET https://deckofcardsapi.com/api/deck/{codigoBaralho}/draw/?count=2
```

O parâmetro `count` indica a quantidade de cartas a comprar.

## Estrutura do projeto

```
.
├── client/          # Frontend inicial (index.html)
├── controllers/     # Controllers da API
├── entities/        # Entidades do domínio
├── repositories/    # Acesso ao banco de dados
├── routes/          # Rotas do Express
├── sockets/         # Eventos WebSocket (Socket.IO)
├── banco.sql        # Script do banco de dados (MySQL)
└── server.js        # Ponto de entrada do backend
```

## Como executar

Pré-requisitos: **Node.js** e **MySQL**.

```bash
# 1. Instalar as dependências
npm install

# 2. Criar o banco de dados executando o script banco.sql no MySQL

# 3. Iniciar o servidor
npm start
```

O backend sobe na porta **5000**.
