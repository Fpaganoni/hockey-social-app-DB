# GraphQL Queries - Clubs

Esta documentación muestra las queries disponibles para obtener información de clubes en la API de GraphQL de Hockey Connect.

## URL de la API
**GraphQL Endpoint:** `http://localhost:4000/graphql`

---

## 1. Obtener todos los clubes (query `clubs`)

### Query
```graphql
query GetAllClubs {
  clubs {
    id
    name
    logo
    coverImage
    description
    bio
    city
    country
    league
    foundedYear
    email
    phone
    website
    isVerified
    benefits
    createdAt
    updatedAt
    admin {
      id
      name
      email
      username
      avatar
      role
    }
  }
}
```

### Respuesta esperada
```json
{
  "data": {
    "clubs": [
      {
        "id": "club-uuid-1",
        "name": "Club de Campo Villa de Madrid",
        "logo": "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796900/hockey-connect/clubs/ccvm_logo.png",
        "coverImage": "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796901/hockey-connect/clubs/ccvm_cover.jpg",
        "description": "One of the most prestigious field hockey clubs in Spain",
        "bio": "Excellence in field hockey since 1929",
        "city": "Madrid",
        "country": "🇪🇸 España",
        "league": "División de Honor",
        "foundedYear": 1929,
        "email": null,
        "phone": null,
        "website": null,
        "isVerified": true,
        "benefits": [
          "Professional Coaching",
          "International Tours",
          "Full Medical Support",
          "Sponsorship Opportunities"
        ],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "admin": {
          "id": "admin-uuid-1",
          "name": "Antonio López",
          "email": "admin.campomadrid@hockey-test.com",
          "username": "admin_campo_madrid",
          "avatar": "https://randomuser.me/api/portraits/men/50.jpg",
          "role": "CLUB_ADMIN"
        }
      },
      {
        "id": "club-uuid-2",
        "name": "RC Polo Barcelona",
        "logo": "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796902/hockey-connect/clubs/rcpolo_logo.png",
        "coverImage": "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796903/hockey-connect/clubs/rcpolo_cover.jpg",
        "description": "Historic Barcelona field hockey club with multiple championships",
        "bio": "Tradition and excellence in field hockey",
        "city": "Barcelona",
        "country": "🇪🇸 España",
        "league": "División de Honor",
        "foundedYear": 1897,
        "email": null,
        "phone": null,
        "website": null,
        "isVerified": true,
        "benefits": [
          "Elite Training Facilities",
          "Gym Access",
          "Player Networking",
          "High Performance Center"
        ],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "admin": {
          "id": "admin-uuid-2",
          "name": "Marta Soler",
          "email": "admin.polobarcelona@hockey-test.com",
          "username": "admin_polo_barcelona",
          "avatar": "https://randomuser.me/api/portraits/men/51.jpg",
          "role": "CLUB_ADMIN"
        }
      }
      // ... más clubes
    ]
  }
}
```

---

## 2. Obtener un club específico por ID (query `club`)

### Query
```graphql
query GetClubById($id: ID!) {
  club(id: $id) {
    id
    name
    logo
    coverImage
    description
    bio
    city
    country
    league
    foundedYear
    email
    phone
    website
    isVerified
    benefits
    createdAt
    updatedAt
    admin {
      id
      name
      email
      username
      avatar
      role
      bio
      yearsOfExperience
    }
    members {
      id
      role
      status
      joinedAt
      user {
        id
        name
        username
        avatar
        position
        role
      }
    }
  }
}
```

### Variables
```json
{
  "id": "club-uuid-1"
}
```

### Respuesta esperada
```json
{
  "data": {
    "club": {
      "id": "club-uuid-1",
      "name": "Club de Campo Villa de Madrid",
      "logo": "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796900/hockey-connect/clubs/ccvm_logo.png",
      "coverImage": "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796901/hockey-connect/clubs/ccvm_cover.jpg",
      "description": "One of the most prestigious field hockey clubs in Spain",
      "bio": "Excellence in field hockey since 1929",
      "city": "Madrid",
      "country": "🇪🇸 España",
      "league": "División de Honor",
      "foundedYear": 1929,
      "email": null,
      "phone": null,
      "website": null,
      "isVerified": true,
      "benefits": [
        "Professional Coaching",
        "International Tours",
        "Full Medical Support",
        "Sponsorship Opportunities"
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "admin": {
        "id": "admin-uuid-1",
        "name": "Antonio López",
        "email": "admin.campomadrid@hockey-test.com",
        "username": "admin_campo_madrid",
        "avatar": "https://randomuser.me/api/portraits/men/50.jpg",
        "role": "CLUB_ADMIN",
        "bio": "Club Administrator with passion for field hockey. Managing and growing the club every day! 🏑",
        "yearsOfExperience": null
      },
      "members": [
        {
          "id": "membership-uuid-1",
          "role": "PLAYER",
          "status": "ACTIVE",
          "joinedAt": "2024-01-15T10:30:00.000Z",
          "user": {
            "id": "player-uuid-1",
            "name": "Lucía Jiménez",
            "username": "lucia_jimenez",
            "avatar": "https://randomuser.me/api/portraits/women/0.jpg",
            "position": "Forward",
            "role": "PLAYER"
          }
        },
        {
          "id": "membership-uuid-2",
          "role": "PLAYER",
          "status": "INVITED",
          "joinedAt": null,
          "user": {
            "id": "player-uuid-2",
            "name": "Pablo Álvarez",
            "username": "pablo_alvarez",
            "avatar": "https://randomuser.me/api/portraits/men/1.jpg",
            "position": "Midfielder",
            "role": "PLAYER"
          }
        }
        // ... más miembros
      ]
    }
  }
}
```

---

## 3. Obtener clubes con miembros detallados

### Query
```graphql
query GetClubsWithMembers {
  clubs {
    id
    name
    logo
    city
    country
    isVerified
    members {
      id
      role
      status
      joinedAt
      user {
        id
        name
        username
        avatar
        position
        role
        isVerified
      }
      invitedBy {
        id
        name
        username
      }
    }
  }
}
```

### Uso
- Obtiene todos los clubes con información de sus miembros
- Incluye tanto miembros activos como invitaciones pendientes
- Muestra quién invitó a cada miembro (`invitedBy`)

---

## 4. Obtener clubes filtrados por país

### Query
```graphql
query GetClubsByCountry($country: String!) {
  clubs(where: { country: { contains: $country } }) {
    id
    name
    logo
    coverImage
    city
    country
    league
    foundedYear
    isVerified
  }
}
```

### Variables
```json
{
  "country": "España"
}
```

---

## 5. Obtener administradores de clubs

### Query
```graphql
query GetClubAdmins {
  clubAdmins {
    clubId
    clubName
    adminId
    adminName
    adminEmail
    adminUsername
    adminAvatar
  }
}
```

### Respuesta esperada
```json
{
  "data": {
    "clubAdmins": [
      {
        "clubId": "club-uuid-1",
        "clubName": "Club de Campo Villa de Madrid",
        "adminId": "admin-uuid-1",
        "adminName": "Antonio López",
        "adminEmail": "admin.campomadrid@hockey-test.com",
        "adminUsername": "admin_campo_madrid",
        "adminAvatar": "https://randomuser.me/api/portraits/men/50.jpg"
      },
      {
        "clubId": "club-uuid-2",
        "clubName": "RC Polo Barcelona",
        "adminId": "admin-uuid-2",
        "adminName": "Marta Soler",
        "adminEmail": "admin.polobarcelona@hockey-test.com",
        "adminUsername": "admin_polo_barcelona",
        "adminAvatar": "https://randomuser.me/api/portraits/men/51.jpg"
      }
      // ... más admins
    ]
  }
}
```

---

## 6. Información completa de clubs (incluyendo estadísticas)

### Query
```graphql
query GetClubsCompleteInfo {
  clubs {
    id
    name
    logo
    coverImage
    description
    bio
    city
    country
    league
    foundedYear
    email
    phone
    website
    isVerified
    benefits
    admin {
      id
      name
      username
      avatar
      yearsOfExperience
    }
    members {
      id
      role
      status
      user {
        id
        name
        position
        avatar
        isVerified
      }
    }
    createdAt
  }
}
```

---

## Campos disponibles en el modelo Club

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | ID! | Identificador único del club (UUID) |
| `name` | String! | Nombre del club |
| `logo` | String | URL del logo del club |
| `coverImage` | String | URL de la imagen de portada |
| `description` | String | Descripción detallada del club |
| `bio` | String | Biografía corta del club |
| `city` | String! | Ciudad donde está ubicado el club |
| `country` | String! | País (con emoji 🇪🇸, 🇦🇷, 🇳🇱, etc.) |
| `league` | String | Liga o división en la que participa |
| `foundedYear` | Int | Año de fundación |
| `email` | String | Email de contacto del club |
| `phone` | String | Teléfono de contacto |
| `website` | String | Sitio web oficial |
| `isVerified` | Boolean! | Si el club está verificado |
| `adminId` | String | ID del administrador del club |
| `benefits` | [String!] | Array de beneficios ofrecidos |
| `createdAt` | DateTime! | Fecha de creación del registro |
| `updatedAt` | DateTime! | Fecha de última actualización |
| `admin` | User | Relación con el usuario administrador |
| `members` | [ClubMember!] | Relación con los miembros del club |

---

## Clubes disponibles en el seed

### Clubes españoles
1. **Club de Campo Villa de Madrid** - Madrid (División de Honor)
2. **RC Polo Barcelona** - Barcelona (División de Honor)
3. **Real Club de Polo** - Barcelona (División de Honor)
4. **CD Terrassa HC** - Terrassa (División de Honor) 🔴⚪️
5. **Atlètic Terrassa HC** - Terrassa (División de Honor)

### Clubes argentinos
6. **Club Atlético San Isidro** - Buenos Aires (Metropolitano A)
7. **Club Atletico Belgrano** - Buenos Aires (Metropolitano A)
8. **Gimnasia y Esgrima Buenos Aires** - Buenos Aires (Metropolitano A)
9. **Club Italiano** - Buenos Aires (Metropolitano A)
10. **Lomas Athletic Club** - Lomas de Zamora (Metropolitano A)

### Clubes holandeses
11. **HC Rotterdam** - Rotterdam (Hoofdklasse)
12. **Amsterdam HC** - Amsterdam (Hoofdklasse)

---

## Imágenes de clubes

Todas las imágenes están almacenadas en Cloudinary CDN:

```
https://res.cloudinary.com/dlv9qzhzr/image/upload/v[VERSION]/hockey-connect/clubs/[CLUB_NAME]_logo.png
https://res.cloudinary.com/dlv9qzhzr/image/upload/v[VERSION]/hockey-connect/clubs/[CLUB_NAME]_cover.jpg
```

**Clubes con imágenes incluidas:**
- ccvm (Club de Campo Villa de Madrid)
- rcpolo (RC Polo Barcelona)
- realclubpolo (Real Club de Polo)
- cdterrassa (CD Terrassa HC)
- atleticterrassa (Atlètic Terrassa HC)
- sanisidro (Club Atlético San Isidro)
- belgrano (Club Atletico Belgrano)
- gimnasia (Gimnasia y Esgrima Buenos Aires)
- italiano (Club Italiano)
- lomas (Lomas Athletic Club)
- rotterdam (HC Rotterdam)
- amsterdam (Amsterdam HC)

---

## Notas importantes

1. **Autenticación**: Las queries públicas como `clubs` no requieren autenticación JWT
2. **Verificación**: Los campos `isVerified` indican clubs verificados en la plataforma
3. **Beneficios**: Cada club ofrece beneficios específicos listados en el array `benefits`
4. **Administrador**: Cada club tiene exactamente un administrador (`CLUB_ADMIN`)
5. **Miembros**: Los miembros pueden tener estados `ACTIVE`, `INVITED`, o `REJECTED`
6. **Imágenes**: Todas las imágenes están optimizadas en Cloudinary para mejor performance
