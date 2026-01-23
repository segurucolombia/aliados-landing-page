# Seguru - Landing Page de Seguros

Landing page moderna para plataforma de seguros, desarrollada con Astro, Vue 3 y Tailwind CSS.

## 🚀 Características

- ✅ Diseño moderno y responsivo con colores azul y blanco
- ✅ Navbar con logo de Seguru y navegación fluida
- ✅ Hero section con imagen de fondo personalizada
- ✅ Sección de productos en cuadrícula
- ✅ Componentes Vue 3 con TypeScript
- ✅ Estructura de servicios lista para consumir endpoints
- ✅ Tailwind CSS para estilos personalizables
- ✅ Optimizada para SEO

## 📦 Estructura del Proyecto

```
/
├── public/
│   └── img/
│       ├── logo-seguru.png           # Logo de Seguru
│       └── header-background.jpg      # Imagen del hero
├── src/
│   ├── components/      # Componentes Vue
│   │   ├── Navbar.vue              # Barra de navegación
│   │   ├── Hero.vue                # Hero con imagen de fondo
│   │   ├── Features.vue            # Características del servicio
│   │   ├── Products.vue            # Cuadrícula de productos
│   │   ├── CTA.vue                 # Call to action
│   │   └── Footer.vue              # Pie de página
│   ├── layouts/
│   │   └── Layout.astro            # Layout principal
│   ├── pages/
│   │   └── index.astro             # Página principal
│   ├── services/                   # Servicios para API
│   │   ├── api.config.ts           # Configuración de Axios
│   │   ├── seguros.service.ts      # Servicio de seguros
│   │   └── productos.service.ts    # Servicio de productos
│   └── types/                      # Definiciones TypeScript
│       ├── seguros.ts
│       └── productos.ts
└── package.json
```

## 🛠️ Comandos

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la build
npm run preview
```

## 🎨 Colores

El proyecto utiliza una paleta de colores profesional para seguros:

- **Primario (Azul):** `#3b82f6` (#2563eb, #1d4ed8) - Confianza y seguridad
- **Secundario (Grises):** Para textos y fondos
- **Blanco:** Para contraste y claridad

Configurados en [tailwind.config.mjs](tailwind.config.mjs)

## 🖼️ Recursos Visuales

### Logo
- Ubicación: `/public/img/logo-seguru.png`
- Uso: Navbar y footer

### Imagen Hero
- Ubicación: `/public/img/header-background.jpg`
- Uso: Fondo del hero section con overlay azul

## 📦 Productos

La sección de productos muestra una cuadrícula de 3 columnas (responsive) con:
- **Nombre del producto**
- **Descripción**
- **Imagen** (preparada para cuando esté disponible)
- **Categoría**
- **Botones de acción** (Cotizar y Más Info)

### Productos de ejemplo incluidos:
1. Seguro de Vida
2. Seguro de Auto
3. Seguro de Hogar
4. Seguro de Salud
5. Seguro de Viaje
6. Seguro Empresarial

## 🔌 Integración con API

La estructura de servicios está preparada para consumir endpoints. Para configurar:

1. Copiar `.env.example` a `.env`
2. Configurar `PUBLIC_API_URL` con la URL de tu API
3. Los servicios están listos para usar

### Servicios Disponibles

**Seguros:**
- `getTiposSeguros()` - Obtener tipos de seguros
- `getSeguroDetalle(id)` - Detalle de un seguro
- `solicitarCotizacion(data)` - Solicitar cotización
- `getCoberturas(tipo)` - Obtener coberturas

**Productos:**
- `getProductos()` - Obtener todos los productos
- `getProductoDetalle(id)` - Detalle de un producto
- `getProductosPorCategoria(categoria)` - Productos por categoría
- `getCategorias()` - Obtener categorías

## 🎯 Secciones de la Landing Page

1. **Navbar** - Navegación con logo de Seguru
2. **Hero** - Imagen de fondo con call to action
3. **Features** - 3 características principales
4. **Products** - Cuadrícula de productos (3 columnas)
5. **CTA** - Llamado a la acción final
6. **Footer** - Información de contacto y enlaces

## 🔧 Tecnologías

- [Astro](https://astro.build) - Framework web
- [Vue 3](https://vuejs.org) - Framework de componentes
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [TypeScript](https://www.typescriptlang.org) - Tipado estático
- [Axios](https://axios-http.com) - Cliente HTTP

## 📄 Licencia

Proyecto privado - Seguru 2026
