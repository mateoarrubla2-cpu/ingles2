# English Learning Platform - Vanilla JavaScript Version

## Descripción

Esta es una versión completamente reescrita de la plataforma de aprendizaje de inglés usando **vanilla JavaScript** (sin frameworks como React o Node.js). 

**Características principales:**
- ✅ Sin dependencias externas (excepto el navegador)
- ✅ Datos persistentes usando localStorage del navegador
- ✅ Totalmente local - no requiere servidor
- ✅ Interfaz responsiva y moderna
- ✅ Todas las funcionalidades de la versión original

## 🚀 Cómo usar

### 1. Abrir la aplicación
Simplemente abre el archivo `index.html` en tu navegador:
```
Abre c:\Users\Mateo\Downloads\proyecto ingles\b_JiI58HSwi84\index.html
```

**O** puedes hacer clic derecho en el archivo y seleccionar "Abrir con" > "Navegador"

### 2. Tu primer acceso
La aplicación te llevará a la página de login. Debes registrarte primero:

1. Haz clic en "Registrarse"
2. Llena los datos:
   - Nombre
   - Email
   - Contraseña
   - Tipo de usuario (Estudiante o Profesor)
3. ¡Listo! Ahora estás dentro

### 3. Características disponibles

#### Dashboard
- Vista general de clases y comunidades
- Estadísticas rápidas
- Acceso rápido a tus espacios

#### Clases (Classrooms)
- **Crear clase** (solo profesores): Set nombre, descripción y nivel
- **Unirse a clase**: Usa el código de invitación
- **Código único**: Cada clase tiene un código para compartir (ej: ABC123)
- **Gestión de miembros**: Ver estudiantes en la clase
- **Remover estudiantes**: Los profesores pueden remover estudiantes

#### Comunidades
- **Crear comunidad**: Nombre, descripción y código único
- **Unirse a comunidad**: Usa el código
- **Posts**: Crea y comparte posts
- **Respuestas**: Comenta en posts de otros
- **Likes**: Da likes a posts

#### Sistema de Posts
- Crear posts en comunidades
- Responder a posts
- Ver likes en posts
- Eliminar tus propios posts y respuestas

## 💾 Datos

Todos los datos se guardan en **localStorage** del navegador:
- Los datos persisten entre sesiones
- Si limpias el caché del navegador, perderás los datos
- Para resetear: Abre la consola (F12) y escribe: `localStorage.clear()`, luego recarga

## 🧑‍💻 Estructura de datos

Los datos se organizan en 8 tablas internas:
- **profiles**: Usuarios (nombre, email, rol, etc)
- **classrooms**: Clases creadas
- **classroom_members**: Estudiantes en clases
- **communities**: Comunidades
- **community_members**: Miembros de comunidades
- **community_posts**: Posts en comunidades
- **post_replies**: Respuestas a posts
- **post_likes**: Likes en posts

## 🔑 Funciones principales

| Acción | Usuarios |
|--------|----------|
| Crear clase | Solo profesores |
| Crear comunidad | Todos los usuarios |
| Unirse a clase/comunidad | Todos los usuarios |
| Crear posts | Miembros de comunidad |
| Responder posts | Miembros de comunidad |
| Dar like a posts | Miembros de comunidad |
| Remover estudiantes | Profesor de la clase |
| Salir de clase/comunidad | Todos los usuarios |

## 🎨 Personalización

Para cambiar el diseño:
1. Abre `index.html` en un editor de texto
2. Busca la sección `<style>`
3. Modifica los colores y estilos

**Colores principales:**
- Azul primario: `#3498db`
- Gris/oscuro: `#2c3e50`
- Verde: `#27ae60`
- Rojo/peligro: `#e74c3c`

## 🐛 Solución de problemas

### No puedo logearme
- Verifica que tu email y contraseña sean correctas
- La contraseña es sensible a mayúsculas/minúsculas

### Perdí mis datos
- Los datos se guardan en localStorage
- Si limpias el caché o usas incógnito, se pierden
- Prueba en una ventana normal (no incógnito)

### La interfaz se ve extraña
- Intenta refrescar la página (F5)
- Limpia el caché (Ctrl+Shift+Delete) pero haz backup de tus datos primero

### ¿Cómo reseteo todo?
Abre la consola (F12) y ejecuta:
```javascript
localStorage.clear()
location.reload()
```

## 📝 Cambios de la versión anterior

### ❌ Removido
- Next.js y React
- Dependencias de npm
- Supabase
- Server-side rendering

### ✅ Agregado
- Vanilla JavaScript puro
- localStorage para persistencia
- Interfaz SPA (Single Page Application)
- Cero dependencias externas
- Totalmente local

## 🚀 Próximos pasos (opcional)

Si en el futuro quieres:
- **Agregar servidor**: Puedes usar Python, PHP o Node.js para guardar datos en un servidor
- **Agregar más funciones**: Edita el archivo `index.html`
- **Exportar datos**: Usa `JSON.stringify(localStorage.getItem('app_db'))` en consola

## 📞 Notas

- La aplicación funciona sin internet después de cargarla
- No hay sincronización entre dispositivos (los datos son locales)
- Para compartir datos, copia el contenido de localStorage manualmente

¡Disfruta la plataforma! 🎓

