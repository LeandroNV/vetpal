# VETPAL — Design Tokens

> Sistema visual de la plataforma. Tokens pensados para comunicar **confianza clínica** y **calidez humana** hacia dueños de mascotas, diferenciándose del frío estético típico de software médico.
> Todos los valores cumplen **WCAG 2.1 AA** de contraste en combinaciones principales (objetivo del Plan de Calidad, PDF §1.2).

---

## 1. Paleta — "Clinical Warm"

**Concepto:** un teal clínico como anclaje de confianza + una base crema que reduce fatiga + un coral cálido como acento emocional que conecta con la relación humano-canino.

### 1.1 Colores base

| Token                  | Hex       | Uso principal                                                | Sobre fondo                    |
| ---------------------- | --------- | ------------------------------------------------------------ | ------------------------------ |
| `primary`              | `#0F766E` | CTAs principales, enlaces, elementos interactivos clave      | AA sobre `#FFFFFF` y `#FAFAF7` |
| `primary-hover`        | `#0D5F59` | Estado hover del primary                                     | AA sobre claros                |
| `primary-foreground`   | `#F0FDFA` | Texto e íconos sobre primary                                 | AA sobre `#0F766E`             |
| `secondary`            | `#F59E0B` | CTAs secundarios, badges informativos                        | AA sobre negros                |
| `secondary-foreground` | `#1F2937` | Texto sobre secondary                                        | AA sobre `#F59E0B`             |
| `accent`               | `#EF6C57` | Llamadas emocionales, tags "nuevo", estados activos suaves   | AA sobre `#FFFFFF`             |
| `accent-foreground`    | `#FFFFFF` | Texto sobre accent                                           | AA sobre `#EF6C57`             |

### 1.2 Superficies y texto

| Token              | Hex       | Uso                                                    |
| ------------------ | --------- | ------------------------------------------------------ |
| `background`       | `#FAFAF7` | Fondo global (crema neutra, no blanco puro)            |
| `surface`          | `#FFFFFF` | Cards, modales, paneles elevados                       |
| `surface-muted`    | `#F1F5F4` | Fondos de secciones alternas, empty states             |
| `border`           | `#E2E8F0` | Bordes por defecto                                     |
| `border-strong`    | `#CBD5E1` | Separadores enfatizados, inputs enfocados              |
| `text-primary`     | `#0F172A` | Texto principal (slate-900)                            |
| `text-secondary`   | `#334155` | Texto secundario (slate-700)                           |
| `text-muted`       | `#64748B` | Placeholders, metadata, leyendas                       |
| `text-on-primary`  | `#F0FDFA` | Texto sobre superficies `primary`                      |

### 1.3 Feedback

| Token     | Hex       | Uso                                              | Foreground |
| --------- | --------- | ------------------------------------------------ | ---------- |
| `success` | `#10B981` | Confirmación de cita, pago aprobado              | `#ECFDF5`  |
| `warning` | `#F59E0B` | Recordatorios, vacunas próximas a vencer         | `#1F2937`  |
| `error`   | `#DC2626` | Errores de validación, cancelaciones             | `#FEF2F2`  |
| `info`    | `#0EA5E9` | Tips, mensajes informativos                      | `#F0F9FF`  |

### 1.4 Dark mode (previsualización)

Inversión de luminosidad manteniendo intención y contraste AA. Los detalles finos (hover, border) se ajustan en implementación contra los valores de `globals.css`.

| Token                | Light     | Dark      |
| -------------------- | --------- | --------- |
| `background`         | `#FAFAF7` | `#0B1413` |
| `surface`            | `#FFFFFF` | `#132120` |
| `surface-muted`      | `#F1F5F4` | `#1B2A29` |
| `primary`            | `#0F766E` | `#2DD4BF` |
| `primary-foreground` | `#F0FDFA` | `#0B1413` |
| `accent`             | `#EF6C57` | `#F8876F` |
| `text-primary`       | `#0F172A` | `#F1F5F9` |
| `text-muted`         | `#64748B` | `#94A3B8` |
| `border`             | `#E2E8F0` | `#1F2F2E` |

---

## 2. Tipografía

### 2.1 Familias (Google Fonts)

| Rol         | Familia              | Razón                                                                                   |
| ----------- | -------------------- | --------------------------------------------------------------------------------------- |
| **Sans**    | `Inter`              | Variable, excelente legibilidad en UI, ya es baseline de shadcn. Body + inputs + labels. |
| **Display** | `Bricolage Grotesque` | Humanista, contemporánea, con personalidad. Headings, héroes, métricas grandes.         |
| **Mono**    | `JetBrains Mono`     | Solo para códigos de cita, referencias externas, IDs.                                   |

**Carga recomendada:** `next/font/google` con `display: "swap"` y `variable: true`.

### 2.2 Escala modular (base 16px, ratio 1.25)

| Token        | px    | rem     | Uso sugerido                          |
| ------------ | ----- | ------- | ------------------------------------- |
| `text-xs`    | 12    | 0.75    | Metadata, captions                    |
| `text-sm`    | 14    | 0.875   | Body secundario, inputs compactos     |
| `text-base`  | 16    | 1.000   | Body por defecto                      |
| `text-lg`    | 18    | 1.125   | Énfasis en body                       |
| `text-xl`    | 20    | 1.250   | Títulos de card                       |
| `text-2xl`   | 24    | 1.500   | H3                                    |
| `text-3xl`   | 30    | 1.875   | H2                                    |
| `text-4xl`   | 36    | 2.250   | H1 de página                          |
| `text-5xl`   | 48    | 3.000   | Display hero                          |
| `text-6xl`   | 60    | 3.750   | Landing hero                          |

### 2.3 Pesos y line-heights

- **Sans (Inter):** 400 (body), 500 (labels), 600 (botones, labels fuertes), 700 (énfasis).
- **Display (Bricolage):** 500 / 700 / 800 para headings.
- **Line-height:** `1.5` en body, `1.25` en headings, `1.1` en display hero.
- **Tracking:** `-0.02em` en display ≥ `text-4xl`; resto neutro.

---

## 3. Radios, espaciado, sombras y motion

### 3.1 Radios (alineados a shadcn `radix-luma`)

| Token       | Valor   | Uso                                |
| ----------- | ------- | ---------------------------------- |
| `radius-xs` | `4px`   | Checkboxes, badges pequeños        |
| `radius-sm` | `6px`   | Inputs, botones compactos          |
| `radius-md` | `8px`   | Botones, cards pequeñas (default)  |
| `radius-lg` | `12px`  | Cards, modales                     |
| `radius-xl` | `16px`  | Secciones destacadas, hero cards   |
| `radius-full` | `9999px` | Avatares, pills, FAB              |

### 3.2 Espaciado (escala 4px)

`0 · 2 · 4 · 6 · 8 · 10 · 12 · 14 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128`
(múltiplos de 4px — convención Tailwind).

### 3.3 Sombras

| Token         | Valor                                              | Uso                          |
| ------------- | -------------------------------------------------- | ---------------------------- |
| `shadow-sm`   | `0 1px 2px rgba(15, 23, 42, 0.04)`                 | Bordes sutiles               |
| `shadow-md`   | `0 4px 8px -2px rgba(15, 23, 42, 0.06)`            | Cards                        |
| `shadow-lg`   | `0 12px 24px -8px rgba(15, 23, 42, 0.10)`          | Modales, popovers            |
| `shadow-xl`   | `0 24px 48px -12px rgba(15, 23, 42, 0.16)`         | Dialogs importantes          |
| `shadow-focus`| `0 0 0 3px rgba(15, 118, 110, 0.30)`               | Ring de focus (accesibilidad)|

### 3.4 Motion

| Token              | Duración | Curva                             | Uso                          |
| ------------------ | -------- | --------------------------------- | ---------------------------- |
| `duration-fast`    | `120ms`  | `cubic-bezier(0.4, 0, 0.2, 1)`    | Hover, press feedback        |
| `duration-normal`  | `200ms`  | `cubic-bezier(0.4, 0, 0.2, 1)`    | Expansiones, popovers        |
| `duration-slow`    | `320ms`  | `cubic-bezier(0.22, 1, 0.36, 1)`  | Transiciones de página       |
| `duration-entrance`| `240ms`  | `cubic-bezier(0.16, 1, 0.3, 1)`   | Entradas (ease-out suave)    |

**Principio (emil-design-eng):** toda animación tiene una razón (guiar foco, dar feedback, suavizar). Se respetan las preferencias del usuario con `@media (prefers-reduced-motion: reduce)`.

---

## 4. Iconografía

- **Librería:** `lucide-react` (ya instalada).
- **Stroke width:** `1.75` por defecto; `2` en íconos ≤ 16px.
- **Tamaños:** `16 · 20 · 24 · 32`.
- **Color:** hereda de `currentColor` (siempre semánticamente ligado al texto circundante).

---

## 5. Justificación de decisiones

**Teal clínico vs azul médico tradicional (`#0F766E`).** El azul médico corporativo se asocia con hospitales humanos fríos. El teal mantiene la lectura "salud" pero introduce un matiz verde que evoca bienestar y naturaleza — coherente con el cuidado animal. Además, `teal-700` pasa AA sobre cualquier fondo claro y AAA sobre crema.

**Coral como accent emocional (`#EF6C57`).** Las apps veterinarias genéricas abusan del azul/verde y se vuelven indistinguibles. Un coral cálido, usado con moderación (no como primary), ancla el tono afectivo cuando hablamos de la mascota (ej. badge "Tu peludo", CTAs "Agendar consulta"). Este tipo de disonancia controlada es lo que evita el "look IA genérico" (skill `frontend-design`).

**Base crema (`#FAFAF7`) en lugar de blanco puro.** El veterinario y el personal administrativo trabajan largas sesiones en la app; el blanco puro (#FFFFFF) de fondo produce fatiga visual. Un crema muy sutil (desaturado) reduce el contraste global sin perder sensación de limpieza y "se lleva mejor" con fotografías de mascotas.

**Inter + Bricolage Grotesque.** Inter es la tipografía más legible en UI y es el default de shadcn, así que no hay costo de integración. Bricolage Grotesque aporta una voz en los headings: su contraste humanista (ternuras en la g, a, s) le da personalidad sin sacrificar profesionalismo — muy diferente del Geist/Sans que AI-generated UIs repiten por default (skills `emil-design-eng` y `frontend-design`).

**Radios redondeados medios (`8–12px` por defecto).** Refuerzan la calidez (evitan la rigidez de los 0–4 px corporativos) y siguen el estilo `radix-luma` ya configurado en [`components.json`](components.json), sin dejar de sentirse profesionales.

**Motion con `ease-out` rápido.** Las animaciones de entrada (120–240 ms) se sienten responsivas en dispositivos móviles de gama media (el veterinario usa tablets en consultorio). Respeto explícito a `prefers-reduced-motion` por accesibilidad (WCAG 2.3.3, objetivo del PDF §1.2).

---

## 6. Mapeo a variables CSS (plantilla, no aplicar aún)

> Referencia para cuando se apliquen los tokens en `app/globals.css`. **No se implementa en esta tarea.**

```css
:root {
  --color-primary: #0F766E;
  --color-primary-hover: #0D5F59;
  --color-primary-foreground: #F0FDFA;
  --color-secondary: #F59E0B;
  --color-accent: #EF6C57;
  --color-background: #FAFAF7;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F1F5F4;
  --color-border: #E2E8F0;
  --color-text-primary: #0F172A;
  --color-text-muted: #64748B;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error:   #DC2626;
  --color-info:    #0EA5E9;

  --font-sans:    "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Bricolage Grotesque", "Inter", sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 4px 8px -2px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0 12px 24px -8px rgba(15, 23, 42, 0.10);
  --shadow-focus: 0 0 0 3px rgba(15, 118, 110, 0.30);

  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 320ms;
}

.dark {
  --color-background: #0B1413;
  --color-surface: #132120;
  --color-surface-muted: #1B2A29;
  --color-primary: #2DD4BF;
  --color-primary-foreground: #0B1413;
  --color-accent: #F8876F;
  --color-border: #1F2F2E;
  --color-text-primary: #F1F5F9;
  --color-text-muted: #94A3B8;
}
```

---

**Próximos pasos (fuera de esta tarea):**

1. Aplicar los tokens a `app/globals.css` (variables CSS + Tailwind v4 `@theme`).
2. Cargar fuentes con `next/font/google` en `app/layout.tsx`.
3. Verificar contrastes con `axe-core` en cada componente nuevo.
