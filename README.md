# BrangCol - Front

Aplicacion web de BrangCol en React 19, Vite y Tailwind 4.

## Desarrollo

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:5173, /api va al backend en el puerto 8080
npm run build
npm run lint
```

## Estructura

- `src/api/cliente.js`: peticiones al backend con la cookie de sesion. Los errores llegan como `ErrorApi` con `estado`, `message` y `traceId`.
- `src/config/`: menu, Sentry.
- `src/components/layout/`: barra superior y menu lateral.
- `src/components/ui/`: componentes comunes.
- `src/modulos/<modulo>/`: pantallas de cada modulo.

## Reglas de interfaz

- Sin bordes redondeados (los `rounded` de Tailwind estan desactivados).
- Sin degradados ni emojis.
- Iconos con Bootstrap Icons por CDN (`<i className="bi bi-..." />`).

## Variables

| Variable | Uso |
|---|---|
| `VITE_SENTRY_DSN` | Errores en Sentry (vacio lo desactiva) |
| `VITE_ENTORNO` | Nombre del entorno en Sentry |
