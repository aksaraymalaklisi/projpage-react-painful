## Exemplos de uso da API (Autenticação e Ratings)

Como mencionado anteriormente, o endpoint para requisições está em `/api/`.

### 1. Registro de usuário

**POST** `/api/register/`

Body (JSON):

```json
{
  "username": "henrique",
  "email": "henrique@email.com",
  "password": "famosissima-senha-segura",
  "name": "Henrique Roberto",
  "phone": "11999999999",
  "cpf": "123.456.789-00"
}
```

### 2. Login (obter tokens JWT)

**POST** `/api/login/`

Body (JSON):

```json
{
  "username": "henrique",
  "password": "famosissima-senha-segura"
}
```

Resposta:

```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

### 3. Usando o token de acesso

Para acessar rotas protegidas, envie o header:

`Authorization: Bearer <access_token>`

No Postman, adicione em Headers:

- Key: `Authorization`
- Value: `Bearer <access_token>`

### 4. Refresh do token

**POST** `/api/token/refresh/`

Body (JSON):

```json
{
  "refresh": "<refresh_token>"
}
```

Resposta:

```json
{
  "access": "<novo_access_token>"
}
```

### 5. Consultar/editar perfil do usuário autenticado

**GET** `/api/users/me/`  
Headers: `Authorization: Bearer <access_token>`

**PATCH** `/api/users/me/`  
Headers: `Authorization: Bearer <access_token>`

Body (JSON):

```json
{
  "name": "Henrique 2.0",
  "phone": "11888888888"
}
```

### 6. Criar uma avaliação (rating) de uma trilha

**POST** `/api/ratings/`  
Headers: `Authorization: Bearer <access_token>`

Body (JSON):

```json
{
  "track": 1,
  "comment": "Trilha excelente!",
  "score": 5
}
```

### 7. Listar avaliações de uma trilha

**GET** `/api/ratings/?track=1`

### 8. Editar ou apagar sua avaliação

**PATCH** `/api/ratings/<id>/`  
Headers: `Authorization: Bearer <access_token>`

Body (JSON):

```json
{
  "comment": "Comentário atualizado"
}
```

**DELETE** `/api/ratings/<id>/`  
Headers: `Authorization: Bearer <access_token>`

### 9. Favoritar uma trilha

**POST** `/api/tracks/<id>/favorite/`  
Authorization: `Authorization: Bearer <access_token>`

Body (JSON):

```json
{
  "favorited": true,
  "favorites_count": 3
}
```

### 10. Alterar a foto de perfil

**PATCH** `/api/users/me/`  
Headers: `Authorization: Bearer <access_token>`

Body: Irá retornar o body do Profile, com a nova URL da foto em `picture`.

---

Se receber "Authentication credentials were not provided.", confira se está enviando o header.

---

## Chatbot e Websockets

Esse projeto possui uma segunda aplicação: `chatbot`. Atualmente, ele apenas checa informações de Tracks (que é inserida no banco de dados vetorial) e documentos adicionados manualmente por um administrador (Documents e KnowledgeBase).

---

### Como conectar

Para iniciar uma sessão, estabeleça uma conexão WebSocket no seguinte endpoint:

- **Protocolo:** `ws://` (Local) ou `wss://` (Produção/SSL)
- **URL Base:** `<seu-dominio-ou-ip>:8080` (também disponível em `https://painful.aksaraymalaklisi.net/`)
- **Endpoint:** `/ws/chat/<nome_da_sala>/`

**Exemplo de URL:**
`ws://localhost:8080/ws/chat/geral/` (localhost assume que você inseriu sua própria chave API do Gemini)

> **Sobre o `nome_da_sala`:** Pode ser qualquer string (ex: `usuario_123`, `suporte`, `geral`). O backend agrupa conexões na mesma sala. Para um chat privado com o bot, recomenda-se usar o ID ou Username do usuário logado como nome da sala.

---

### Autenticação

A conexão requer uma sessão Django válida (autenticação via Session/Cookies).

- Se o React estiver rodando na mesma origem que o Django (ou via proxy reverso como Nginx), o navegador enviará automaticamente o cookie `sessionid` durante o handshake.

OU  

- Se o front estiver em `localhost:3000` e o back em `localhost:8000`, certifique-se de que os cookies `SameSite` estão configurados corretamente e `credentials: include` está habilitado na origem.

**Falha na autenticação:**
Se o usuário não estiver logado, o servidor aceita a conexão, envia um JSON de erro e fecha o socket:

```json
{
    "error": "Authentication required"
}
```

### Comunicação

É realizado apenas com strings JSON.

Request do usuário:

```json
{
    "message": "Quais trilhas são fáceis?"
}
```

Response do servidor:

```json
{
    "message": "As trilhas fáceis são: Trilha da Pedra de Macaco...",
    "user": "chatbot"
}
```
`"user"` normalmente vai ser `"chatbot"`.
Note que o conteúdo do texto pode conter Markdown. É importante o componente da conversa do chatbot poder interpretar isso ou modificar o prompt para remover Markdown.