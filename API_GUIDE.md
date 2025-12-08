# 🏒 Guía de API GraphQL - Hockey Connect

## 📍 Endpoint GraphQL

Tu servidor GraphQL está corriendo en:

```
http://localhost:3000/graphql
```

## 🎮 GraphQL Playground

Para explorar y probar tus APIs, abre tu navegador y ve a:

```
http://localhost:3000/graphql
```

Aquí podrás ver toda la documentación automática de tu API, probar queries y mutations en tiempo real.

---

## 🔑 APIs Disponibles

### **1. USUARIOS (Users)**

#### Registrar un nuevo usuario

```graphql
mutation {
  register(
    email: "usuario@ejemplo.com"
    username: "jugador123"
    password: "miPassword123"
  )
}
```

**Retorna:** Un token JWT para autenticación

#### Login

```graphql
mutation {
  login(email: "usuario@ejemplo.com", password: "miPassword123")
}
```

**Retorna:** Un token JWT para autenticación

#### Obtener información del usuario

```graphql
query {
  me(id: "user-id-aqui") {
    id
    email
    username
    role
    createdAt
  }
}
```

#### Subir avatar

```graphql
mutation {
  uploadAvatar(userId: "user-id-aqui", base64: "data:image/png;base64,...")
}
```

---

### **2. CLUBES (Clubs)**

#### Listar todos los clubes

```graphql
query {
  clubs {
    id
    name
    location
  }
}
```

#### Crear un nuevo club

```graphql
mutation {
  createClub(name: "HC Barcelona", location: "Barcelona, España") {
    id
    name
    location
  }
}
```

#### Invitar un jugador a un club

```graphql
mutation {
  invitePlayerToClub(
    clubId: "club-id-aqui"
    userId: "user-id-aqui"
    invitedBy: "admin-id-aqui"
  ) {
    id
  }
}
```

#### Aceptar invitación a club

```graphql
mutation {
  acceptMembership(membershipId: "membership-id-aqui") {
    id
  }
}
```

---

### **3. EQUIPOS (Teams)**

#### Listar equipos de un club

```graphql
query {
  teamsByClub(clubId: "club-id-aqui") {
    id
    name
    category
  }
}
```

#### Crear un nuevo equipo

```graphql
mutation {
  createTeam(
    clubId: "club-id-aqui"
    name: "Sub-18 Masculino"
    category: "SUB18"
  ) {
    id
    name
    category
  }
}
```

---

### **4. MARKETPLACE**

#### Listar servicios

```graphql
query {
  services {
    id
    title
    description
    priceAmount
  }
}
```

#### Crear un servicio

```graphql
mutation {
  createService(
    title: "Entrenamiento Personal"
    description: "Sesiones de entrenamiento 1-1"
    providerId: "provider-id-aqui"
    priceAmount: 45.99
  ) {
    id
    title
    description
    priceAmount
  }
}
```

---

### **5. PAGOS (Payments)**

#### Crear intención de pago

```graphql
mutation {
  createPaymentIntent(amount: 99.99, currency: "eur") {
    id
    clientSecret
  }
}
```

---

## 🌐 Conectar con tu Frontend

### **Opción 1: Apollo Client (Recomendado para React)**

#### 1. Instala las dependencias:

```bash
npm install @apollo/client graphql
# o
pnpm add @apollo/client graphql
```

#### 2. Configura Apollo Client:

```typescript
// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
```

#### 3. Envuelve tu app con ApolloProvider:

```typescript
// App.tsx o layout.tsx
import { ApolloProvider } from "@apollo/client";
import client from "./lib/apolloClient";

function App() {
  return (
    <ApolloProvider client={client}>{/* Tu aplicación aquí */}</ApolloProvider>
  );
}
```

#### 4. Usa queries y mutations en tus componentes:

```typescript
// components/CreateClub.tsx
import { useMutation, gql } from "@apollo/client";

const CREATE_CLUB = gql`
  mutation CreateClub($name: String!, $location: String!) {
    createClub(name: $name, location: $location) {
      id
      name
      location
    }
  }
`;

function CreateClub() {
  const [createClub, { data, loading, error }] = useMutation(CREATE_CLUB);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createClub({
        variables: {
          name: "Mi Club",
          location: "Madrid",
        },
      });
      console.log("Club creado:", result.data.createClub);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Tu formulario aquí */}</form>;
}
```

#### 5. Ejemplo con Query:

```typescript
// components/ClubsList.tsx
import { useQuery, gql } from "@apollo/client";

const GET_CLUBS = gql`
  query GetClubs {
    clubs {
      id
      name
      location
    }
  }
`;

function ClubsList() {
  const { loading, error, data } = useQuery(GET_CLUBS);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.clubs.map((club) => (
        <li key={club.id}>
          {club.name} - {club.location}
        </li>
      ))}
    </ul>
  );
}
```

---

### **Opción 2: Fetch API (Vanilla JavaScript)**

```typescript
async function createClub(name: string, location: string) {
  const query = `
    mutation CreateClub($name: String!, $location: String!) {
      createClub(name: $name, location: $location) {
        id
        name
        location
      }
    }
  `;

  const response = await fetch("http://localhost:3000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      query,
      variables: { name, location },
    }),
  });

  const result = await response.json();
  return result.data.createClub;
}

// Uso
const newClub = await createClub("HC Madrid", "Madrid, España");
console.log(newClub);
```

---

### **Opción 3: URQL (Alternativa ligera a Apollo)**

```bash
pnpm add urql graphql
```

```typescript
import { createClient, Provider, useQuery, useMutation } from "urql";

const client = createClient({
  url: "http://localhost:3000/graphql",
  fetchOptions: () => {
    const token = localStorage.getItem("token");
    return {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    };
  },
});

function App() {
  return <Provider value={client}>{/* Tu app */}</Provider>;
}
```

---

## 🔐 Autenticación

1. **Registra o haz login** para obtener el token JWT
2. **Guarda el token** en `localStorage` o `sessionStorage`
3. **Incluye el token** en el header `Authorization: Bearer <token>` en todas las peticiones subsecuentes

```typescript
// Ejemplo de login y guardar token
const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const [login] = useMutation(LOGIN);

const handleLogin = async () => {
  const result = await login({
    variables: {
      email: "user@example.com",
      password: "password123",
    },
  });

  // Guardar el token
  localStorage.setItem("token", result.data.login);
};
```

---

## 📡 WebSockets (Notificaciones en Tiempo Real)

Tu proyecto tiene un gateway de WebSockets para notificaciones en tiempo real:

```typescript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Unirse a tu canal personal
socket.emit("join", { userId: "tu-user-id" });

// Escuchar notificaciones
socket.on("notification", (data) => {
  console.log("Nueva notificación:", data);
  // { type: 'INVITE', clubId: '...', message: '...' }
});
```

---

## 🛠️ Herramientas Útiles

- **GraphQL Playground**: http://localhost:3000/graphql
- **Apollo Client DevTools**: Extensión de Chrome para debugging
- **Prisma Studio**: `npx prisma studio` para ver tu base de datos

---

## 📝 Notas Importantes

1. **CORS**: Si tu frontend está en un dominio diferente (ej: `localhost:3001`), asegúrate de configurar CORS en NestJS
2. **Variables de Entorno**: Actualiza las URLs cuando despliegues a producción
3. **Schema Auto-generado**: El archivo `schema.graphql` se regenera automáticamente cuando cambias tus resolvers

---

## 🚀 Próximos Pasos

1. Abre GraphQL Playground: http://localhost:3000/graphql
2. Prueba crear un usuario con la mutation `register`
3. Usa el token retornado para autenticar otras peticiones
4. Integra Apollo Client en tu frontend
5. ¡Empieza a construir tu aplicación!

---

**¿Necesitas ayuda?** El schema GraphQL en `src/schema.graphql` contiene toda la documentación de tipos y operaciones disponibles.
