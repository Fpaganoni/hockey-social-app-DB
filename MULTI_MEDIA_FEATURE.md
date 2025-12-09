# 🎬 Multi-Media Support - Nueva Funcionalidad

## ✅ Implementado Exitosamente

Los posts ahora soportan **múltiples archivos multimedia** (imágenes y videos) en formato carrusel.

---

## 🆕 Cambios Realizados

### 1. **Nuevo Modelo** `PostMedia`

```prisma
model PostMedia {
  id        String    @id
  post      Post      @relation
  url       String    // URL de imagen o video
  type      MediaType // IMAGE o VIDEO
  order     Int       // Para orden en carrusel
}
```

### 2. **Post Actualizado**

- ❌ Eliminado: `imageUrl` (campo único)
- ✅ Agregado: `media` (array de `PostMedia`)

### 3. **GraphQL Schema**

Nuevos tipos:

```graphql
type PostMedia {
  id: ID!
  url: String!
  type: String! # "IMAGE" o "VIDEO"
  order: Int!
}

input MediaInput {
  url: String!
  type: String! # "IMAGE" o "VIDEO"
  order: Int # Opcional, se auto-asigna
}
```

---

## 📝 Ejemplos de Uso

### Crear Post con UNA imagen

```graphql
mutation {
  createPost(
    content: "¡Entrenamiento de hoy! 🏒"
    media: [
      {
        url: "https://images.unsplash.com/photo-1517649763962-0c623066013b"
        type: "IMAGE"
      }
    ]
    authorType: "USER"
    authorId: "TU-USER-ID"
  ) {
    id
    content
    media {
      id
      url
      type
      order
    }
  }
}
```

### Crear Post con MÚLTIPLES imágenes (Carrusel)

```graphql
mutation {
  createPost(
    content: "¡Galería del partido de ayer! 📸🏒"
    media: [
      {
        url: "https://images.unsplash.com/photo-1517649763962-0c623066013b"
        type: "IMAGE"
        order: 0
      }
      {
        url: "https://images.unsplash.com/photo-1546519638-68e109498ffc"
        type: "IMAGE"
        order: 1
      }
      {
        url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55"
        type: "IMAGE"
        order: 2
      }
    ]
    authorType: "USER"
    authorId: "TU-USER-ID"
  ) {
    id
    media {
      url
      type
      order
    }
  }
}
```

### Crear Post con VIDEO

```graphql
mutation {
  createPost(
    content: "¡Mira este golazo! ⚡🎥"
    media: [{ url: "https://www.youtube.com/watch?v=VIDEO_ID", type: "VIDEO" }]
    authorType: "USER"
    authorId: "TU-USER-ID"
  ) {
    id
    media {
      url
      type
    }
  }
}
```

### Crear Post MIXTO (imágenes + videos)

```graphql
mutation {
  createPost(
    content: "Resumen del entrenamiento 🏒🎬"
    media: [
      {
        url: "https://images.unsplash.com/photo-1.jpg"
        type: "IMAGE"
        order: 0
      }
      { url: "https://www.youtube.com/watch?v=VIDEO1", type: "VIDEO", order: 1 }
      {
        url: "https://images.unsplash.com/photo-2.jpg"
        type: "IMAGE"
        order: 2
      }
    ]
    authorType: "USER"
    authorId: "TU-USER-ID"
  ) {
    id
    media {
      url
      type
      order
    }
  }
}
```

### Ver Posts con Media

```graphql
query {
  posts(limit: 10) {
    id
    content
    authorType
    media {
      id
      url
      type
      order
    }
    author {
      username
    }
    likesCount
  }
}
```

### Actualizar Media de un Post

```graphql
mutation {
  updatePost(
    id: "POST-ID"
    media: [{ url: "https://images.unsplash.com/new-photo.jpg", type: "IMAGE" }]
  ) {
    id
    media {
      url
      type
    }
  }
}
```

---

## 🎯 Tipos de Media Soportados

### **IMAGE**

- JPG, PNG, GIF, WebP
- URLs de servicios: Cloudinary, Imgur, Unsplash, etc.
- Imágenes del propio servidor

### **VIDEO**

- MP4, MOV, AVI, WebM
- URLs de YouTube, Vimeo
- Videos de Cloudinary o propio servidor

---

## 📊 Orden en Carrusel

El campo `order` determina el orden de visualización:

- `order: 0` → Primera imagen/video
- `order: 1` → Segunda imagen/video
- etc.

Si no especificas `order`, se asigna automáticamente según el orden en el array.

---

## ⚠️ Cambios Breaking

### **Antes** (ya no funciona):

```graphql
mutation {
  createPost(
    content: "..."
    imageUrl: "https://..." # ❌ Este campo ya no existe
    authorType: "USER"
    authorId: "..."
  )
}
```

### **Ahora** (nuevo formato):

```graphql
mutation {
  createPost(
    content: "..."
    media: [{ url: "https://...", type: "IMAGE" }] # ✅ Ahora es array
    authorType: "USER"
    authorId: "..."
  )
}
```

---

## 🔄 Migración de Datos Existentes

> **IMPORTANTE:** Los posts antiguos con `imageUrl` fueron eliminados durante la migración.
>
> Si quieres recuperar datos, necesitas:
>
> 1. Ejecutar `pnpm prisma:reset` para recrear la DB
> 2. Ejecutar `pnpm prisma:seed` para poblar con datos de prueba

---

## 💡 Tips de Uso

1. **Mínimo un archivo:** Siempre debes enviar al menos un elemento en el array `media`
2. **Orden automático:** Si no especificas `order`, se usa el orden del array
3. **Mix permitido:** Puedes combinar imágenes y videos en el mismo post
4. **Actualizar:** Al actualizar `media`, se reemplazan TODOS los archivos anteriores

---

## 🚀 Próximos Pasos Sugeridos

¿Quieres mejorar aún más? Considera:

1. **Validación de URLs:** Verificar que las URLs sean válidas
2. **Límite de archivos:** Restringir a máximo 10 archivos por post
3. **Upload directo:** Integrar upload de archivos (no solo URLs)
4. **Thumbnails:** Generar miniaturas automáticas para videos
5. **Lazy loading:** Cargar media bajo demanda en el frontend

---

**¡El feature está listo para usar!** 🎉

Servidor corriendo en: `http://localhost:3000/graphql`
