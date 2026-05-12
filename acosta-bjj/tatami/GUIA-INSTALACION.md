# TATAMI — Guía de instalación en Windows
## Cómo tener el servidor funcionando en tu PC

---

## PASO 1 — Instalar Node.js

1. Abrí el navegador y andá a: **https://nodejs.org**
2. Hacé clic en el botón verde grande que dice **"LTS"** (la versión estable)
3. Descargá el instalador (.msi) y ejecutalo
4. Siguiente → Siguiente → Instalar (todo por defecto)
5. Al terminar, **reiniciá la computadora**

### Verificar que se instaló bien:
1. Apretá **Windows + R**, escribí `cmd` y Enter
2. En la ventana negra que aparece, escribí:
   ```
   node --version
   ```
3. Si ves algo como `v20.11.0`, ¡está instalado!

---

## PASO 2 — Copiar los archivos del proyecto

1. Creá una carpeta en tu escritorio llamada **`tatami`**
2. Dentro de esa carpeta, copiá todos estos archivos:
   ```
   tatami/
   ├── server.js
   ├── database.js
   ├── package.json
   ├── middleware/
   │   └── auth.js
   ├── routes/
   │   ├── auth.js
   │   ├── videos.js
   │   └── usuarios.js
   └── public/
       ├── index.html        ← la landing page
       ├── clases.html       ← vista del alumno
       └── admin.html        ← panel de admin
   ```

> **Nota:** Los archivos HTML que hicimos antes van dentro de la carpeta `public/`
> con esos nombres exactos.

---

## PASO 3 — Instalar las dependencias

1. Abrí la carpeta `tatami` en el Explorador de archivos
2. En la barra de dirección de la carpeta, hacé clic y escribí `cmd`, luego Enter
   - Esto abre la consola **dentro** de esa carpeta
3. Escribí este comando y esperá que termine (puede tardar 1-2 minutos):
   ```
   npm install
   ```
4. Vas a ver que se crea una carpeta llamada `node_modules` — es normal

---

## PASO 4 — Iniciar el servidor

1. En la misma consola (o abrí una nueva en la carpeta), escribí:
   ```
   node server.js
   ```
2. Deberías ver esto:
   ```
   ╔════════════════════════════════════════╗
   ║      TATAMI — Servidor iniciado        ║
   ║   http://localhost:3000               ║
   ╚════════════════════════════════════════╝
   ```
3. Abrí el navegador y andá a: **http://localhost:3000**

¡La página debería aparecer!

---

## USUARIOS QUE SE CREAN AUTOMÁTICAMENTE

La primera vez que iniciás el servidor, se crean dos usuarios de prueba:

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| **Admin** (vos) | `admin` | `admin123` |
| **Alumno** de prueba | `marcos_r` | `alumno123` |

> ⚠️ **Importante:** Cambiá la contraseña del admin después de tu primera entrada.

---

## CÓMO USAR EL SISTEMA

### Para vos (admin):
1. Entrá a **http://localhost:3000/admin**
2. Login con `admin` / `admin123`
3. Desde ahí podés:
   - Agregar y editar videos (título, descripción, ID de Vimeo)
   - Crear alumnos con su usuario y contraseña
   - Activar o desactivar el acceso de un alumno

### Para un alumno:
1. Entrá a **http://localhost:3000**
2. Clic en "Acceder"
3. Login con el usuario y contraseña que vos le diste

---

## CÓMO AGREGAR UN VIDEO CON VIMEO

1. Subí el video a **Vimeo** (vimeo.com)
2. Una vez subido, fijate en la URL: `https://vimeo.com/123456789`
   → El número `123456789` es el **ID del video**
3. En el panel admin → Videos → Editar → pegá ese número en el campo "ID de Vimeo"
4. En Vimeo, configurá el video como:
   - **Privacy:** "Only people with the link" o "Hide from Vimeo"
   - **Domain-level privacy:** solo tu dominio (cuando tengas hosting)

---

## PARA PUBLICARLO EN INTERNET (más adelante)

Cuando quieras que cualquier persona pueda acceder desde su celular o computadora:

1. Creá una cuenta en **Railway.app** (https://railway.app)
2. Subí la carpeta del proyecto
3. Te dan una URL pública como `https://tatami-academia.up.railway.app`
4. Compartís esa URL con tus alumnos

---

## SOLUCIÓN DE PROBLEMAS COMUNES

**"node no se reconoce como comando"**
→ Reiniciá la computadora después de instalar Node.js

**"Puerto 3000 en uso"**
→ Abrí el Task Manager, buscá procesos de Node y terminalos

**La página no carga**
→ Verificá que en la consola diga "Servidor iniciado" y no haya errores en rojo

**Olvidé la contraseña del admin**
→ Borrá el archivo `tatami.db` y reiniciá el servidor. Se recrean los usuarios iniciales.

---

## AYUDA

Si algo no funciona, escribime con:
1. El mensaje de error que aparece en la consola (la ventana negra)
2. En qué paso te trabaste
