# 🧪 Ejemplos de Queries GraphQL - HockeyConnect

Abre **GraphQL Playground** en: `http://localhost:3000/graphql`

---

## 👥 USUARIOS

### Listar todos los usuarios

```graphql
query {
  users {
    id
    username
    email
    role
    isVerified
    isEmailVerified
    profile {
      displayName
      bio
      avatarUrl
    }
  }
}
```

### Solo jugadores

```graphql
query {
  players {
    id
    username
    role
    isVerified
    isEmailVerified
    profile {
      displayName
      avatarUrl
    }
  }
}
```

### Solo entrenadores

```graphql
query {
  coaches {
    id
    username
    role
    profile {
      displayName
      bio
    }
  }
}
```

### Usuario específico

```graphql
query {
  user(id: "PEGA-UN-ID-AQUI") {
    id
    username
    email
    role
    isVerified
    isEmailVerified
    profile {
      displayName
      bio
      avatarUrl
    }
  }
}
```

### Usuario con estadísticas y trayectoria

```graphql
query GetUserProfile($id: String!) {
  user(id: $id) {
    id
    name
    role
    position
    bio
    country
    city
    avatar

    # Estadísticas del jugador
    statistics {
      id
      season
      gamesPlayed
      goals
      assists
      points
      wins
      losses
      draws
      cleanSheets
      saves
      club {
        name
        city
      }
    }

    # Trayectoria profesional
    trajectories {
      id
      title
      organization
      period
      description
      startDate
      endDate
      isCurrent
      order
      club {
        id
        name
        logo
        city
        country
      }
    }
  }
}
```

**Variables:**

```json
{
  "id": "PEGA-USER-ID-AQUI"
}
```

---

## 📝 POSTS (Feed Social)

### Feed de posts (últimos 10)

```graphql
query {
  posts(limit: 10) {
    id
    content
    imageUrl
    authorType
    likesCount
    author {
      username
      profile {
        displayName
        avatarUrl
      }
    }
    clubAuthor {
      name
      isVerified
    }
    createdAt
  }
}
```

### Feed con comentarios y likes

```graphql
query {
  posts(limit: 5) {
    id
    content
    imageUrl
    authorType
    likesCount
    author {
      username
      isVerified
    }
    comments {
      id
      content
      author {
        username
        profile {
          displayName
        }
      }
      createdAt
    }
    likes {
      user {
        username
      }
    }
    createdAt
  }
}
```

### Posts de un usuario específico

```graphql
query {
  postsByUser(userId: "PEGA-USER-ID") {
    id
    content
    imageUrl
    likesCount
    createdAt
  }
}
```

### Posts de un club

```graphql
query {
  postsByClub(clubId: "PEGA-CLUB-ID") {
    id
    content
    imageUrl
    likesCount
    clubAuthor {
      name
      location
    }
    createdAt
  }
}
```

### Crear un post (por usuario)

```graphql
mutation {
  createPost(
    content: "¡Increíble entrenamiento hoy! 🏒💪"
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b"
    authorType: "USER"
    authorId: "PEGA-TU-USER-ID"
  ) {
    id
    content
    imageUrl
    createdAt
  }
}
```

### Crear un post (por club)

```graphql
mutation {
  createPost(
    content: "Nueva temporada 2025! Inscripciones abiertas 🎉"
    imageUrl: "https://logo.clearbit.com/hockey.com"
    authorType: "CLUB"
    authorId: "PEGA-CLUB-ID"
  ) {
    id
    content
    clubAuthor {
      name
    }
  }
}
```

---

## 💬 COMENTARIOS Y LIKES

### Ver comentarios de un post

```graphql
query {
  comments(postId: "PEGA-POST-ID") {
    id
    content
    author {
      username
      profile {
        displayName
        avatarUrl
      }
    }
    createdAt
  }
}
```

### Crear comentario

```graphql
mutation {
  createComment(
    postId: "PEGA-POST-ID"
    authorId: "PEGA-USER-ID"
    content: "¡Excelente! 🔥"
  ) {
    id
    content
    author {
      username
    }
  }
}
```

### Dar like a un post

```graphql
mutation {
  likePost(postId: "PEGA-POST-ID", userId: "PEGA-USER-ID") {
    id
    createdAt
  }
}
```

### Quitar like

```graphql
mutation {
  unlikePost(postId: "PEGA-POST-ID", userId: "PEGA-USER-ID")
}
```

---

## 👥 FOLLOW SYSTEM

### Ver seguidores de un usuario

```graphql
query {
  followers(entityType: "USER", entityId: "PEGA-USER-ID") {
    id
    followerType
    followerId
    createdAt
  }
}
```

### Contador de seguidores

```graphql
query {
  followersCount(entityType: "USER", entityId: "PEGA-USER-ID")
}
```

### Seguir a un usuario

```graphql
mutation {
  follow(
    followerType: "USER"
    followerId: "TU-USER-ID"
    followingType: "USER"
    followingId: "USER-A-SEGUIR-ID"
  ) {
    id
    createdAt
  }
}
```

### Seguir a un club

```graphql
mutation {
  follow(
    followerType: "USER"
    followerId: "TU-USER-ID"
    followingType: "CLUB"
    followingId: "CLUB-ID"
  ) {
    id
    createdAt
  }
}
```

### Dejar de seguir

```graphql
mutation {
  unfollow(
    followerType: "USER"
    followerId: "TU-USER-ID"
    followingType: "USER"
    followingId: "USER-ID"
  )
}
```

---

## 💼 JOB OPPORTUNITIES

### Listar todas las ofertas

```graphql
query {
  jobOpportunities {
    id
    title
    description
    positionType
    club {
      name
      city
      country
      isVerified
    }
    country
    city
    salary
    currency
    benefits
    status
    createdAt
  }
}
```

### Filtrar solo jugadores

```graphql
query {
  jobOpportunities(positionType: "PLAYER") {
    id
    title
    club {
      name
    }
    city
    salary
    currency
  }
}
```

### Filtrar por país

```graphql
query {
  jobOpportunities(country: "🇪🇸 España") {
    id
    title
    positionType
    club {
      name
      city
      country
    }
    city
    country
  }
}
```

### Crear oferta de trabajo

```graphql
mutation {
  createJobOpportunity(
    title: "Buscamos Delantero Sub-21"
    description: "Club de primera división busca delantero joven con potencial"
    positionType: "PLAYER"
    clubId: "PEGA-CLUB-ID"
    country: "España"
    city: "Madrid"
    salary: 35000
    currency: "EUR"
    benefits: "Seguro médico, alojamiento, equipamiento completo"
  ) {
    id
    title
    club {
      name
    }
  }
}
```

### Actualizar estado de oferta

```graphql
mutation {
  updateJobOpportunity(id: "JOB-ID", status: "FILLED") {
    id
    status
  }
}
```

---

## 💬 MESSAGING

### Mis conversaciones

```graphql
query {
  myConversations(userId: "TU-USER-ID") {
    id
    participants {
      username
      profile {
        displayName
        avatarUrl
      }
    }
    messages {
      content
      sender {
        username
      }
      createdAt
    }
    updatedAt
  }
}
```

### Ver mensajes de una conversación

```graphql
query {
  messages(conversationId: "CONVERSATION-ID") {
    id
    content
    sender {
      username
      profile {
        displayName
      }
    }
    isRead
    createdAt
  }
}
```

### Iniciar conversación

```graphql
mutation {
  startConversation(participantIds: ["USER-ID-1", "USER-ID-2"]) {
    id
    participants {
      username
    }
  }
}
```

### Enviar mensaje

```graphql
mutation {
  sendMessage(
    conversationId: "CONVERSATION-ID"
    senderId: "TU-USER-ID"
    content: "Hola! ¿Cómo estás?"
  ) {
    id
    content
    sender {
      username
    }
    createdAt
  }
}
```

---

## 🏒 CLUBES Y EQUIPOS

### Listar clubes

```graphql
query {
  clubs {
    id
    name
    location
    isVerified
  }
}
```

### Equipos de un club

```graphql
query {
  teamsByClub(clubId: "PEGA-CLUB-ID") {
    id
    name
    category
  }
}
```

---

## 🔐 AUTH (ya existentes)

### Registrarse

#### Como jugador (default)

```graphql
mutation {
  register(
    email: "nuevo@ejemplo.com"
    name: "Juan Pérez"
    username: "nuevo_jugador"
    password: "password123"
  )
}
```

#### Como entrenador

```graphql
mutation {
  register(
    email: "coach@ejemplo.com"
    name: "Ana García"
    username: "coach_ana"
    password: "password123"
    role: "COACH"
  )
}
```

#### Como administrador de club

```graphql
mutation {
  register(
    email: "admin@clubhockey.com"
    name: "Carlos Martínez"
    username: "admin_carlos"
    password: "password123"
    role: "CLUB_ADMIN"
  )
}
```

> **Nota:** El campo `role` es opcional. Si no se especifica, el usuario se registra como `PLAYER` por defecto. Los roles permitidos son: `PLAYER`, `COACH`, `CLUB_ADMIN`.

### Login

```graphql
mutation {
  login(email: "messi@hockey-test.com", password: "password123")
}
```

---

## 💡 TIPS

### 1. Obtener IDs para tus queries

Primero ejecuta esto para obtener IDs reales:

```graphql
query {
  users {
    id
    username
  }
  clubs {
    id
    name
  }
  posts(limit: 5) {
    id
    content
  }
}
```

Luego copia los IDs y úsalos en las otras queries.

### 2. Query completa de ejemplo

Aquí una query que combina múltiples datos:

```graphql
query CompleteFeed {
  posts(limit: 3) {
    id
    content
    imageUrl
    authorType
    author {
      username
      isVerified
      profile {
        displayName
        avatarUrl
      }
    }
    clubAuthor {
      name
      isVerified
    }
    likesCount
    comments {
      id
      content
      author {
        username
      }
    }
    createdAt
  }

  players {
    id
    username
    isVerified
  }

  jobOpportunities(positionType: "PLAYER", status: "OPEN") {
    id
    title
    club {
      name
    }
    city
    salary
  }
}
```

### 3. Variables en GraphQL

Puedes usar variables para hacer las queries más dinámicas:

```graphql
query GetUserPosts($userId: String!) {
  postsByUser(userId: $userId) {
    id
    content
    likesCount
  }
}
```

Variables (panel inferior en Playground):

```json
{
  "userId": "PEGA-USER-ID-AQUI"
}
```

---

## 🎯 Siguiente paso

1. Abre `http://localhost:3000/graphql`
2. Copia y pega cualquier query de arriba
3. Reemplaza los IDs de ejemplo con IDs reales de tu base de datos
4. ¡Ejecuta y experimenta!

**Todos los usuarios de prueba tienen password:** `password123`
