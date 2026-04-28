# VETPAL 🐾

Plataforma digital moderna y premium para la atención canina. VETPAL facilita la gestión de historiales clínicos, agendamiento de citas, y administración general de servicios veterinarios, enfocada en brindar una experiencia de usuario excepcional ("Warm Editorial" aesthetic).

## 🚀 Tecnologías Principales

Este proyecto está construido con las tecnologías más modernas del ecosistema de React y desarrollo web:

- **Framework Core:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions, React Server Components).
- **Librería UI:** [React 19](https://react.dev/).
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/).
- **Base de Datos & Backend:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security - RLS, Autenticación).
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) y [Radix UI](https://www.radix-ui.com/) para componentes accesibles.
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/) para transiciones fluidas y micro-interacciones.
- **Formularios & Validación:** React Hook Form junto con Zod.
- **Iconografía:** Lucide React.
- **Notificaciones:** Sonner (Toasts interactivos).

## 📖 Guía de Uso y Flujo de la Aplicación

VETPAL está diseñada para ser intuitiva tanto para los dueños de mascotas como para el personal veterinario. A continuación, el flujo principal de la plataforma:

### 1. Landing Page
La primera interacción del usuario es la **Landing Page**. Aquí se presenta la propuesta de valor de VETPAL con un diseño moderno, animaciones fluidas (Framer Motion) y un modo estrictamente claro (Light Mode) para mantener la coherencia de marca. Desde aquí, los usuarios pueden iniciar sesión.

### 2. Autenticación (Login)
El acceso está protegido mediante **Supabase Auth**. Los usuarios deben autenticarse para poder ingresar a la gestión veterinaria. Las credenciales validan el acceso de forma segura usando tokens JWT.

### 3. Dashboard Principal
Una vez autenticado, el usuario ingresa al **Dashboard**. Este entorno cuenta con soporte total para Modo Oscuro/Claro (Dark/Light mode). Desde la barra lateral (Sidebar), se puede acceder a las siguientes entidades principales:

- **🐕 Caninos:** Registro y gestión de perfiles de perros. Aquí se guarda la información básica como raza, edad, peso y dueño.
- **📅 Citas:** Sistema de agendamiento. Permite programar nuevas consultas, visualizar el calendario y gestionar el estado de las citas (pendientes, completadas, canceladas).
- **📂 Historial Clínico:** El corazón médico de la plataforma. Guarda los registros de vacunas, diagnósticos, tratamientos y notas de cada consulta vinculada a un paciente (canino) específico.
- **🩺 Servicios:** Catálogo de servicios veterinarios ofrecidos (consultas generales, cirugías, peluquería, vacunas), incluyendo sus costos y descripciones.
- *(Internamente en la base de datos también existe un registro de **Pagos** asociados a los servicios).*

### 4. Seguridad de los Datos (RLS)
Cada interacción con la base de datos está protegida por **Row Level Security (RLS)** en Supabase. Esto garantiza que un usuario solo pueda ver y modificar la información (caninos, citas, historiales) a la que tiene permisos, asegurando la privacidad total de los datos médicos.

## 💻 Instalación y Desarrollo Local

Sigue estos pasos para correr VETPAL en tu entorno local:

### Requisitos Previos
- Node.js (v18 o superior recomendado)
- Una cuenta en [Supabase](https://supabase.com/) (con un proyecto creado)

### Paso a paso

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/LeandroNV/vetpal.git
   cd vetpal
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o yarn install / pnpm install
   ```

3. **Configurar Variables de Entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto tomando como referencia las credenciales de tu proyecto en Supabase (Settings > API):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```
   *Nota: Es 100% seguro exponer `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el frontend, ya que la seguridad real recae en las políticas RLS de PostgreSQL.*

4. **Levantar el Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el Navegador:**
   Visita [http://localhost:3000](http://localhost:3000) y verás la Landing Page de VETPAL en funcionamiento.

## 🚀 Despliegue en Vercel

Este proyecto está optimizado para desplegarse fácilmente en Vercel.

1. Conecta tu repositorio de GitHub a Vercel.
2. Al momento de importar el proyecto, **asegúrate de agregar las variables de entorno** (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en la configuración de Vercel.
3. Haz clic en **Deploy**. El proyecto construirá (build) y te generará una URL pública.
