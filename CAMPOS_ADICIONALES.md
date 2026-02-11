# Sistema de Campos Adicionales Dinámicos

## Descripción General

Este sistema permite agregar campos personalizados dinámicos a los planes de seguros. Los campos se configuran en el backend como parte de la versión del plan y se renderizan automáticamente en el formulario de registro.

## Estructura de Datos

### Configuración del Backend (JSON)

Los campos adicionales se configuran en el campo `campos_adicionales` de la tabla `versiones_planes`. La estructura es:

```json
{
  "secciones": [
    {
      "titulo": "Familia",
      "descripcion": "Información sobre familiares del asegurado",
      "campos": [
        {
          "tipo": "grupo_inputs",
          "nombre": "Familiares",
          "campos": [
            {
              "tipo": "input",
              "nombre": "Nombre",
              "tipoInput": "text"
            },
            {
              "tipo": "input",
              "nombre": "Telefono",
              "tipoInput": "tel"
            },
            {
              "tipo": "dropdown",
              "nombre": "Parentezco",
              "opciones": ["Padre/Madre", "Conyuge", "Hijo/Hija", "Hermano/Hermana", "Otro"]
            }
          ]
        },
        {
          "tipo": "input",
          "nombre": "Telefono secundario",
          "tipoInput": "tel"
        },
        {
          "tipo": "input",
          "nombre": "Valor de la casa",
          "tipoInput": "precio"
        }
      ]
    }
  ]
}
```

## Tipos de Campos Soportados

### 1. Input Simple

```json
{
  "tipo": "input",
  "nombre": "Nombre del campo",
  "tipoInput": "text", // text, number, email, date, tel, precio, plano
  "requerido": true // opcional, por defecto es true
}
```

**Tipos de input disponibles:**
- `text`: Texto simple
- `number`: Números
- `email`: Correo electrónico
- `date`: Fecha
- `tel`: Teléfono
- `precio`: Números con formato de precio
- `plano`: Números planos

### 2. Dropdown (Select)

```json
{
  "tipo": "dropdown",
  "nombre": "Seleccione una opción",
  "opciones": ["Opción 1", "Opción 2", "Opción 3"],
  "requerido": true
}
```

### 3. Multiselect

```json
{
  "tipo": "multiselect",
  "nombre": "Seleccione múltiples opciones",
  "opciones": ["Opción A", "Opción B", "Opción C"],
  "requerido": true
}
```

### 4. Autocomplete de Ciudades

```json
{
  "tipo": "autocomplete",
  "nombre": "Ciudad",
  "fuente": "ciudades",
  "requerido": true
}
```

### 5. Grupo de Inputs (Repetible)

Permite agregar múltiples registros del mismo tipo de información:

```json
{
  "tipo": "grupo_inputs",
  "nombre": "Familiares",
  "requerido": true,
  "campos": [
    {
      "tipo": "input",
      "nombre": "Nombre completo",
      "tipoInput": "text"
    },
    {
      "tipo": "input",
      "nombre": "Edad",
      "tipoInput": "number"
    },
    {
      "tipo": "dropdown",
      "nombre": "Parentezco",
      "opciones": ["Padre", "Madre", "Hijo", "Hija"]
    }
  ]
}
```

## Ejemplo Completo de Configuración

```json
{
  "secciones": [
    {
      "titulo": "Información Personal Adicional",
      "descripcion": "Complete la siguiente información personal",
      "campos": [
        {
          "tipo": "input",
          "nombre": "Ocupación",
          "tipoInput": "text",
          "requerido": true
        },
        {
          "tipo": "dropdown",
          "nombre": "Estado Civil",
          "opciones": ["Soltero/a", "Casado/a", "Unión Libre", "Divorciado/a", "Viudo/a"],
          "requerido": true
        },
        {
          "tipo": "input",
          "nombre": "Fecha de nacimiento",
          "tipoInput": "date",
          "requerido": true
        }
      ]
    },
    {
      "titulo": "Información de Contacto de Emergencia",
      "descripcion": "Proporcione al menos un contacto de emergencia",
      "campos": [
        {
          "tipo": "grupo_inputs",
          "nombre": "Contacto de Emergencia",
          "requerido": true,
          "campos": [
            {
              "tipo": "input",
              "nombre": "Nombre",
              "tipoInput": "text"
            },
            {
              "tipo": "input",
              "nombre": "Teléfono",
              "tipoInput": "tel"
            },
            {
              "tipo": "dropdown",
              "nombre": "Relación",
              "opciones": ["Familiar", "Amigo", "Vecino", "Compañero de trabajo"]
            }
          ]
        }
      ]
    },
    {
      "titulo": "Información de Vivienda",
      "campos": [
        {
          "tipo": "autocomplete",
          "nombre": "Ciudad de residencia",
          "fuente": "ciudades",
          "requerido": true
        },
        {
          "tipo": "input",
          "nombre": "Dirección completa",
          "tipoInput": "text",
          "requerido": true
        },
        {
          "tipo": "dropdown",
          "nombre": "Tipo de vivienda",
          "opciones": ["Casa propia", "Casa arrendada", "Apartamento propio", "Apartamento arrendado"],
          "requerido": true
        },
        {
          "tipo": "input",
          "nombre": "Valor aproximado de la vivienda",
          "tipoInput": "precio",
          "requerido": false
        }
      ]
    }
  ]
}
```

## Estructura de Datos Capturados

Cuando el usuario completa el formulario, los datos se capturan en el siguiente formato:

```json
{
  "secciones": [
    {
      "titulo": "Información Personal Adicional",
      "datos": {
        "Ocupación": "Ingeniero de Software",
        "Estado Civil": "Casado/a",
        "Fecha de nacimiento": "1990-05-15"
      }
    },
    {
      "titulo": "Información de Contacto de Emergencia",
      "datos": {
        "Contacto de Emergencia": [
          {
            "Nombre": "Juan Pérez",
            "Teléfono": "3001234567",
            "Relación": "Familiar"
          },
          {
            "Nombre": "María García",
            "Teléfono": "3009876543",
            "Relación": "Amigo"
          }
        ]
      }
    },
    {
      "titulo": "Información de Vivienda",
      "datos": {
        "Ciudad de residencia": "Bogotá",
        "Dirección completa": "Calle 123 #45-67",
        "Tipo de vivienda": "Apartamento propio",
        "Valor aproximado de la vivienda": "250000000"
      }
    }
  ]
}
```

## Envío al Backend

Los datos capturados se envían al backend como un **string JSON** en el campo `campos_adicionales` del DTO de creación de venta/preventa:

```typescript
const formData = {
  // ... otros campos de la venta
  campos_adicionales: JSON.stringify(datosCapturados)
};

await PreVentaService.crearPreVenta(formData);
```

## Validaciones

### Campos Obligatorios

Por defecto, todos los campos son **obligatorios** (`requerido: true`). Para hacer un campo opcional:

```json
{
  "tipo": "input",
  "nombre": "Campo opcional",
  "tipoInput": "text",
  "requerido": false
}
```

### Validaciones por Tipo de Campo

1. **Input**: No puede estar vacío
2. **Dropdown**: Debe seleccionar una opción
3. **Multiselect**: Debe seleccionar al menos 1 opción
4. **Autocomplete**: Debe seleccionar una ciudad válida
5. **Grupo de inputs**:
   - Debe tener al menos 1 entrada
   - Todos los campos de cada entrada deben estar completos

## Casos de Uso

### Caso 1: Información de Beneficiarios

```json
{
  "secciones": [
    {
      "titulo": "Beneficiarios",
      "descripcion": "Agregue los beneficiarios de esta póliza",
      "campos": [
        {
          "tipo": "grupo_inputs",
          "nombre": "Beneficiario",
          "campos": [
            {
              "tipo": "input",
              "nombre": "Nombre completo",
              "tipoInput": "text"
            },
            {
              "tipo": "input",
              "nombre": "Número de documento",
              "tipoInput": "text"
            },
            {
              "tipo": "dropdown",
              "nombre": "Tipo de documento",
              "opciones": ["CC", "CE", "PP", "TI"]
            },
            {
              "tipo": "input",
              "nombre": "Porcentaje",
              "tipoInput": "number"
            },
            {
              "tipo": "dropdown",
              "nombre": "Parentesco",
              "opciones": ["Conyuge", "Hijo/a", "Padre/Madre", "Hermano/a", "Otro"]
            }
          ]
        }
      ]
    }
  ]
}
```

### Caso 2: Datos Médicos Básicos

```json
{
  "secciones": [
    {
      "titulo": "Información Médica",
      "descripcion": "Información básica de salud",
      "campos": [
        {
          "tipo": "dropdown",
          "nombre": "Tipo de sangre",
          "opciones": ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
          "requerido": true
        },
        {
          "tipo": "multiselect",
          "nombre": "Enfermedades preexistentes",
          "opciones": ["Diabetes", "Hipertensión", "Asma", "Ninguna"],
          "requerido": true
        },
        {
          "tipo": "input",
          "nombre": "Nombre del médico de cabecera",
          "tipoInput": "text",
          "requerido": false
        },
        {
          "tipo": "input",
          "nombre": "Teléfono del médico",
          "tipoInput": "tel",
          "requerido": false
        }
      ]
    }
  ]
}
```

### Caso 3: Información de Vehículos (para seguros de auto)

```json
{
  "secciones": [
    {
      "titulo": "Vehículos Asegurados",
      "campos": [
        {
          "tipo": "grupo_inputs",
          "nombre": "Vehículo",
          "campos": [
            {
              "tipo": "input",
              "nombre": "Placa",
              "tipoInput": "text"
            },
            {
              "tipo": "input",
              "nombre": "Marca",
              "tipoInput": "text"
            },
            {
              "tipo": "input",
              "nombre": "Modelo",
              "tipoInput": "text"
            },
            {
              "tipo": "input",
              "nombre": "Año",
              "tipoInput": "number"
            },
            {
              "tipo": "dropdown",
              "nombre": "Tipo",
              "opciones": ["Automóvil", "Camioneta", "Motocicleta", "Otro"]
            },
            {
              "tipo": "input",
              "nombre": "Valor comercial",
              "tipoInput": "precio"
            }
          ]
        }
      ]
    }
  ]
}
```

## Consideraciones Técnicas

### Frontend

- **Componente**: `CamposAdicionales.vue`
- **Ubicación**: Se renderiza en el paso 2 (Alojamientos) del formulario de registro
- **Validación**: En tiempo real y al intentar avanzar al siguiente paso
- **Framework UI**: PrimeVue (Select, MultiSelect, AutoComplete)

### Backend

- **Campo**: `campos_adicionales` en tabla `versiones_planes`
- **Tipo de dato**: JSONB (PostgreSQL) o JSON (MySQL)
- **Validación**: El backend debe validar que el JSON recibido coincida con la estructura configurada

### Performance

- El componente de campos adicionales se carga de forma lazy (defineAsyncComponent)
- Solo se renderiza si el plan tiene campos adicionales configurados
- Las búsquedas de ciudades incluyen debounce para optimizar llamadas al API

## Troubleshooting

### El componente no se muestra

1. Verificar que el plan tenga `campos_adicionales` configurado
2. Verificar que `campos_adicionales.secciones` sea un array no vacío
3. Verificar en DevTools que los datos lleguen correctamente del backend

### Validaciones no funcionan

1. Verificar que los campos tengan `requerido: true` (o no especificado)
2. Revisar la consola del navegador para errores
3. Verificar que el componente emita correctamente los eventos `update:valid`

### Datos no se envían al backend

1. Verificar en Network tab que `campos_adicionales` esté presente en el payload
2. Confirmar que sea un string JSON válido
3. Verificar que el backend acepte el campo `campos_adicionales`

## Mejoras Futuras

- [ ] Validaciones personalizadas (regex, rangos, etc.)
- [ ] Campos condicionales (mostrar/ocultar según otros valores)
- [ ] Autocompletado de otros tipos de datos (ciudades, profesiones, etc.)
- [ ] Soporte para upload de archivos en campos adicionales
- [ ] Plantillas predefinidas de campos adicionales comunes
- [ ] Editor visual para configurar campos adicionales desde el admin

## Soporte

Para preguntas o problemas con el sistema de campos adicionales, contactar al equipo de desarrollo.
