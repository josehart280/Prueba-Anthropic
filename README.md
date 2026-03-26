# UIGen 🤖✨

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![Anthropic](https://img.shields.io/badge/Anthropic-Claude-191919?logo=anthropic&logoColor=white)](https://anthropic.com)

> **Generador de componentes React con IA y preview en tiempo real.**
> > Describe lo que querés, la IA lo genera, y vos lo ves funcionar al instante.

[✨ Demo](#-demo) • [🚀 Instalación](#-instalación) • [🛠️ Stack](#️-stack-tecnológico) • [👤 Autor](#-autor)

</div>

---

## 📖 Descripción

**UIGen** es una aplicación web que permite generar componentes React usando inteligencia artificial. Simplemente describí el componente que querés crear en el chat, y la IA (Claude de Anthropic) generará el código React con preview en tiempo real. Ideal para prototipado rápido y exploración de ideas de UI.

> 💡 **Idea:** "Parte del curso de Anthropic, pero gratis y con tu propia API key."

---

## ✨ Características

### 🤖 Generación con IA
- **Chat interactivo** con Claude AI
- **Descripción en lenguaje natural** - no necesitás saber codear
- **Generación instantánea** de componentes React

### 👁️ Preview en Tiempo Real
- **Vista previa live** del componente generado
- **Hot reload** - los cambios se reflejan al instante
- **Vista de código** con editor Monaco (VS Code en el browser)

### 💾 Persistencia
- **Sistema de archivos virtual** - no se escribe nada en disco
- **Persistencia para usuarios registrados** - guardá tus componentes
- **Exportación** - descargá el código generado

### 🎨 Tecnología Moderna
- **Next.js 15** con App Router
- **React 19** - última versión
- **TypeScript** - tipado completo
- **Tailwind CSS v4** - estilos modernos

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Framework** | Next.js 15 (App Router) |
| **UI Library** | React 19 |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS v4 |
| **Database** | Prisma ORM + SQLite |
| **AI** | Anthropic Claude AI |
| **AI SDK** | Vercel AI SDK |
| **Editor** | Monaco Editor (VS Code) |
| **Testing** | Vitest |

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+
- npm o yarn
- API Key de Anthropic (opcional pero recomendado)

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/josehart280/Prueba-Anthropic.git
   cd Prueba-Anthropic
   ```

2. **Configurar variables de entorno:**
   ```bash
   # Opcional: Crear archivo .env.local
   echo "ANTHROPIC_API_KEY=tu-api-key-aqui" > .env.local
   ```

   > 💡 **Sin API Key:** La app funciona con código estático de ejemplo.

3. **Instalar dependencias y inicializar:**
   ```bash
   npm run setup
   ```

   Este comando:
   - Instala todas las dependencias
   - Genera el cliente Prisma
   - Ejecuta las migraciones de la base de datos

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

---

## 📱 Uso

### Flujo Básico

1. **Registrate** o usá el modo anónimo
2. **Escribí** en el chat qué componente querés crear
   - Ejemplo: *"Creame un botón con efecto hover azul y sombra"*
   - Ejemplo: *"Un formulario de login con email y password"*
3. **Mirá** el preview en tiempo real
4. **Editá** el código directamente si querés ajustes
5. **Iterá** según necesites

### Ejemplos de Prompts

```
"Un card de producto con imagen, título, precio y botón de compra"
"Un navbar responsive con menú hamburguesa para mobile"
"Un modal de confirmación con botones de aceptar y cancelar"
"Un slider de imágenes con flechas de navegación"
```

---

## 📁 Estructura del Proyecto

```
Prueba-Anthropic/
│
├── 📁 .claude/                  # Configuración Claude Code
├── 📁 .playwright-mcp/        # Tests Playwright
├── 📁 prisma/                 # Schema y migraciones
│   └── schema.prisma
│
├── 📁 src/
│   ├── 📁 app/               # Rutas Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── 📁 components/        # Componentes React
│   │   ├── chat/
│   │   ├── editor/
│   │   └── preview/
│   │
│   └── 📁 lib/               # Utilidades
│       ├── ai.ts            # Configuración AI
│       └── utils.ts
│
├── 📄 .env.local             # Variables locales (no versionar)
├── 📄 .eslintrc.json         # Configuración ESLint
├── 📄 next.config.ts         # Configuración Next.js
├── 📄 package.json           # Dependencias
├── 📄 tsconfig.json          # Configuración TypeScript
├── 📄 vitest.config.mts      # Configuración Vitest
└── 📄 README.md              # Este archivo
```

---

## 🛣️ Roadmap

- [ ] Integración con más modelos de IA (GPT-4, etc.)
- [ ] Templates de componentes predefinidos
- [ ] Compartir componentes públicamente
- [ ] Exportar a CodeSandbox/StackBlitz
- [ ] Historial de versiones
- [ ] Modo colaborativo

---

## 👤 Autor

**José Alonso Porras Ramírez**

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?logo=linkedin&logoColor=white)](https://linkedin.com/in/jose-porras-039202326)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?logo=vercel&logoColor=white)](https://jose-porras-portfolio.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)](https://github.com/josehart280)
[![Email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:josealonso.0186@gmail.com)

</div>

📧 josealonso.0186@gmail.com

---

*Basado en el curso de Anthropic | Desarrollado con ❤️ y 🤖 IA | 2026*
