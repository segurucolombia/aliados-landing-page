# Campos adicionales, reglas de precio y cotización

Contrato del backend para el flujo de compra de la landing, y cómo está
implementado acá.

## Qué cambió

Una versión de plan ya no tiene un solo precio. Ciertas respuestas del cliente
pueden **encarecer** la compra o **impedirla**:

1. El formulario de campos adicionales se renderiza desde la configuración de la
   versión, que ahora incluye reglas de precio.
2. Antes de mostrar el botón de pagar hay que **cotizar** contra el backend y
   mostrarle al cliente el desglose de lo que se le va a cobrar.
3. Ciertas combinaciones **no se pueden vender**, y hay que decirle por qué.

**La landing nunca calcula el precio.** Aunque las reglas vengan en el JSON, el
total lo da el backend. Es la única forma de que lo que se muestra y lo que se
cobra no se separen nunca.

---

## 1. Leer la configuración de la versión

`GET /api-aliados/planes/:plan_id` devuelve el plan con su versión vigente. El
formulario sale de `version.campos_adicionales`:

```json
{ "secciones": [ { "titulo": "Datos del hogar", "campos": [ /* ... */ ] } ] }
```

Tres niveles: `secciones[] → campos[] → campos[]`. El tercero solo existe cuando
`tipo === "grupo_inputs"`, y ahí termina: un grupo no contiene otro grupo.

### Cómo se renderiza cada campo

| `tipo` | `tipoInput` | Control |
|---|---|---|
| `input` | `text` | texto de una línea |
| `input` | `textarea` | texto multilínea |
| `input` | `precio` | número con formato de moneda |
| `input` | `plano` | número sin formato |
| `input` | `fecha` | selector de fecha |
| `input` | `ciudad` | selector de ciudades (`GET /api-aliados/ciudades-colombia`) |
| `dropdown` | — | select de una opción |
| `multiselect` | — | selección múltiple |
| `edad` | — | selector de fecha de nacimiento (el backend calcula la edad) |
| `grupo_inputs` | — | lista repetible de subformularios |

Las claves de un campo **son exclusivas de su tipo**: un `dropdown` no trae
`tipoInput` ni `campos` ni `edadMinima`. No vienen en `null`, simplemente no
están.

`opciones` viene como objetos: se muestra `opcion.etiqueta` y se guarda
`opcion.clave` — es lo que se manda de vuelta. `requerido: true` marca el campo
como obligatorio; si la bandera no viene, el campo es opcional.

Los subcampos de un grupo usan **otro vocabulario** de tipos: `text`, `number`,
`fecha`, `dropdown` y **`edad`**. `transformarCamposAdicionalesBackend` los
normaliza al vocabulario de nivel 2, así el formulario renderiza un solo modelo.
Si el renderizador de subcampos no conoce un tipo, el campo desaparece del
formulario sin error: por eso el `v-if` de subcampos cubre los cinco.

### Grupos de inputs

Lista repetible: el cliente agrega hasta `cantidad_maxima_registros` registros.
Cada registro se numera desde **1**, y ese número va en las respuestas.

**Un registro existe desde que cualquiera de sus subcampos tiene valor**, y ahí
sus subcampos `requerido` pasan a ser obligatorios (poner la fecha sin el nombre
da `422`). Un registro en blanco no se manda y no consume número: los
`numero_registro` van 1..N corridos, sin huecos, y al eliminar uno del medio los
siguientes se renumeran solos (`numerosDeRegistro` en
`src/utils/respuestasCampos.ts`, que también resuelve contra qué registro se
marcan los rechazos).

### El campo `edad`

Aparece en los dos niveles, y dentro de un grupo es el caso más frecuente: el
grupo repite personas y el cobro depende de la edad de cada una.

Se renderiza **siempre como selector de fecha de nacimiento**
(`CampoEdadInput.vue`) y se manda `YYYY-MM-DD`, nunca la edad calculada: en la
renovación la venta se recotiza con las respuestas guardadas, y con la fecha la
edad se recalcula sola.

`edadMinima` / `edadMaxima` **no son topes duros del datepicker**. El límite
viene también como regla, y la regla es la que manda:

| Regla sobre el límite | Qué hace el control |
|---|---|
| `accion: "RECHAZAR"` | bloquea ese rango |
| `accion: "COBRAR"` | lo permite y muestra el recargo |
| sin regla sobre el límite | bloquea (es validación pura) |

Con `edadMaxima: 75` y una regla `RANGO_MAXIMO` que **cobra**, un familiar de 80
sí se puede asegurar pagando el adicional: si el datepicker usara `edadMaxima`
como tope, impediría una venta válida.

Los límites son **estrictos**: `RANGO_MAXIMO: 75` aplica desde **76**;
`RANGO_MINIMO: 5` bloquea hasta **4**, el de 5 pasa.

---

## 2. Los recargos se anticipan en el formulario

Cada campo puede traer `reglas`:

```json
"reglas": [
  { "tipo_regla": "OPCION", "opcion": "finca", "accion": "COBRAR",
    "valor_adicional": 50000, "tipo_valor": "FIJO",
    "concepto": "Vivienda tipo finca" },
  { "tipo_regla": "RANGO_MAXIMO", "dias_relativos": 90, "accion": "RECHAZAR",
    "mensaje_rechazo": "No emitimos pólizas con más de 90 días de anticipación" }
]
```

- `accion: "COBRAR"` suma `valor_adicional` al total (`tipo_valor: "PORCENTAJE"`
  es un % sobre el precio del plan).
- `accion: "RECHAZAR"`: con esa condición no se puede vender.
- `concepto` es el texto que ve el cliente en el detalle de cobro.

En la UI el recargo se muestra junto a la opción (`+ $50.000` al lado de
"Finca"), en el botón de agregar de un grupo (`Desde el 2º vehículo: +$15.000
c/u`) y, en un subcampo `edad`, dentro de cada registro al elegir la fecha:

```
Familiares asegurados #1
  Nombre completo *      [________________]
  Fecha de nacimiento *  [ 10/03/1945 ]   ⚠ Mayor de 75 años: + $32.500
```

Una regla de subcampo se evalúa en **cada registro**: con `por_registro: true`
se cobra por cada uno que cumpla, y con `false` una sola vez (el aviso lo
aclara). Las reglas que rechazan se muestran como error del propio campo apenas
se elige la fecha, sin esperar a cotizar.

Esto es **solo presentación**: un porcentaje se muestra como porcentaje, nunca
convertido a pesos por la landing.

---

## 3. Cotizar

`POST /api-aliados/ventas/cotizar` — no crea ni reserva nada, se llama en cada
cambio del formulario (con debounce de 500 ms).

```json
{
  "version_id": "uuid-de-la-version",
  "codigo_descuento": "BIENVENIDA",
  "debito_automatico": false,
  "respuestas": [
    { "campo_clave": "tipo_de_vivienda", "valor": "finca" },
    { "campo_clave": "coberturas_extra", "valor": ["temblor", "robo"] },
    { "campo_clave": "placa", "numero_registro": 1, "valor": "ABC123" }
  ]
}
```

Cómo se arman las `respuestas` (`src/utils/respuestasCampos.ts`):

- `campo_clave`: la `clave` del campo, **no el nombre**.
- `valor`: string o número; en un `multiselect`, un arreglo de claves de opción.
- En campos de selección se manda `opcion.clave`.
- `numero_registro`: **solo** en subcampos de un grupo, empezando en 1 y corrido,
  sin huecos.
- Los campos vacíos no se mandan.
- El campo `edad` se manda como fecha de nacimiento (`YYYY-MM-DD`).

La respuesta trae `valor_version`, `adicionales[]`, `valores_adicionales`,
`valor_descuento` y `valor_total`.

Con `debito_automatico: true` el cobro se hace sobre `valor_debito_automatico`
de la versión, así que el total puede diferir: el modal de medio de pago cotiza
las dos variantes para mostrar cada número correcto.

---

## 4. El desglose que ve el cliente antes de pagar

El cliente **no puede llegar al botón de pagar sin ver de dónde sale cada peso**
(`src/components/DesgloseCotizacion.vue`):

```
Plan Hogar Protegido                            $ 480.000   ← valor_version
Vivienda tipo finca                             $  50.000   ┐
Fecha fuera del rango estándar                  $  30.000   ├ adicionales[]
Vehículo adicional (2)                          $  15.000   ┘
Subtotal adicionales                            $  95.000   ← valores_adicionales
Cupón BIENVENIDA                               -$  20.000   ← valor_descuento
TOTAL A PAGAR                                   $ 555.000   ← valor_total
```

- Una línea por elemento de `adicionales[]`, con su `concepto` tal cual: ese
  texto lo escribió quien configuró el plan.
- Si `numero_registro` no es `null` se indica entre paréntesis.
- Si `adicionales` viene vacío no se muestra la sección; si `valor_descuento` es
  0 no se muestra la línea del cupón.
- `valor_total` es lo único que se cobra.

---

## 5. Cuando la venta no se puede hacer

`422` con `rechazos[]` (todos los motivos, no el primero):

```json
{ "success": false,
  "message": "La venta no se puede realizar con los datos ingresados",
  "rechazos": [ { "campo_clave": "fecha_viaje", "campo_nombre": "Fecha del viaje",
                  "mensaje": "No emitimos pólizas con más de 90 días de anticipación" } ] }
```

`campo_clave` marca el campo en el formulario y `mensaje` es el texto del error
(está escrito para el cliente). Con `422` el botón de pagar queda deshabilitado.

Otros códigos: `404` versión inexistente, `400` cupón inválido, inactivo o que no
aplica al plan.

---

## 6. Crear la venta

`POST /api-aliados/ventas` con las **mismas `respuestas`** que se cotizaron, más
los datos personales de siempre. **No se manda el total**: el backend recotiza y
usa su propio resultado; si algo cambió, responde el mismo `422` con `rechazos`.

`datos_adicionales` sigue viajando como snapshot crudo del formulario (indexado
por nombre de campo, legible), aparte de `respuestas`.

---

## Dónde está cada cosa

| Archivo | Rol |
|---|---|
| `src/types/planes.ts` | Campos, opciones (`clave`/`etiqueta`) y `reglas` |
| `src/types/cotizacion.ts` | `respuestas`, cotización y rechazos |
| `src/utils/transformCamposAdicionales.ts` | Normaliza la config del backend (preserva `clave` y `reglas`) |
| `src/utils/reglasCampos.ts` | Texto de los recargos, y límites/recargos de un campo `edad` |
| `src/components/register/components/CampoEdadInput.vue` | Fecha de nacimiento (nivel 2 y subcampo) con sus límites y avisos |
| `src/utils/respuestasCampos.ts` | Arma `respuestas[]` desde el estado del formulario |
| `src/services/ventas.service.ts` | `cotizar()`, `crear_venta()` y `extraerRechazos()` |
| `src/composables/cotizacion.ts` | Cotización con debounce, rechazos y `puedePagar` |
| `src/components/register/components/CamposAdicionales.vue` | Formulario dinámico |
| `src/components/DesgloseCotizacion.vue` | Detalle de cobro |
| `src/components/PlanCamposAdicionalesStep.vue` | Paso del wizard: formulario + desglose |
| `src/components/PlanPurchaseWizard.vue` | Dueño de la cotización del flujo de compra |

## Flujo

1. `GET /planes/:id` → se renderiza el formulario desde `version.campos_adicionales`.
2. Los recargos de `reglas` se muestran junto a cada opción, como anticipo.
3. En cada cambio (con debounce) → `POST /ventas/cotizar`.
4. `200` → se pinta el desglose y se habilita continuar al pago.
   `422` → se marcan los campos de `rechazos` y se deshabilita.
5. `POST /ventas` con las mismas `respuestas`.
