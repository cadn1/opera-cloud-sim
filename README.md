# OPERA Cloud — Simulador de práctica

Proyecto educativo, no oficial, para practicar el flujo operativo de un PMS
hotelero (inspirado en Oracle OPERA Cloud): **Reservas → Front Desk →
Housekeeping → Cajero/Folio**.

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Zustand**.

## 1. Instalación local (VS Code)

```bash
# Descomprimir el zip y abrir la carpeta en VS Code
cd opera-cloud-sim
npm install
npm run dev
```

Abrir http://localhost:3000 — la app arranca en el módulo de Reservas.

## 2. Estructura del proyecto

```
opera-cloud-sim/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Layout raíz (TopBar + TabNav)
│   │   ├── page.tsx             # Redirige a /reservations
│   │   ├── globals.css          # Estilos base tipo Opera Cloud
│   │   ├── reservations/        # Módulo Reservas
│   │   ├── front-desk/          # Módulo Check-In / Check-Out
│   │   ├── housekeeping/        # Módulo estado de habitaciones
│   │   └── cashiering/          # Módulo Cajero / Folio
│   ├── components/
│   │   ├── TopBar.tsx
│   │   ├── TabNav.tsx
│   │   └── StatusPill.tsx
│   └── lib/
│       ├── types.ts             # Tipos del dominio (Reservation, Room, etc.)
│       └── store.ts             # Estado global + lógica de negocio (Zustand)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

Toda la lógica de negocio (crear reserva, check-in, check-out, folios,
housekeeping) vive en `src/lib/store.ts`. Es el mejor archivo para estudiar
cómo se relacionan los módulos entre sí — igual que en Opera Cloud, una
acción en Front Desk (check-in) dispara cambios en Housekeeping (habitación
pasa a Ocupada) y en Cajero (se postea el cargo de la primera noche).

El estado se guarda en el `localStorage` del navegador (vía
`zustand/middleware persist`), así que si cerrás la pestaña no perdés tus
datos de práctica.

## 3. Flujo sugerido para practicar

1. **Reservas** — crear una reserva (nombre, fechas, tipo de habitación, tarifa)
2. **Front Desk** — asignar una habitación libre del tipo correspondiente y hacé Check-In
3. **Housekeeping** — verificar que la habitación pasó a "Ocupada"
4. **Cajero** — agregar cargos extra (room service, minibar) o pagos
5. Vuelve a **Front Desk** y hacer Check-Out — mira cómo la habitación pasa a "Vacía Sucia" en Housekeeping
6. En Housekeeping, marca la habitación como limpia para que vuelva a estar disponible
7. Usa el botón **"Avanzar día (Night Audit)"** en la barra superior para simular el cierre de día

## 4. Ideas para ampliar (y seguir practicando conceptos reales de PMS)

- Agregar **overbooking** / lista de espera cuando no hay habitaciones libres del tipo pedido
- Agregar **grupos de reservas** (varias habitaciones bajo un mismo bloque)
- Agregar **rate shopping** / temporadas con tarifas variables por fecha
- Agregar **reportes** (ocupación %, ADR, RevPAR) calculados desde `reservations` y `folios`
- Conectar una base de datos real (Postgres + Prisma) en vez de `localStorage`
