# Chemes Mobile

Aplicación móvil offline-first para vendedores — scaffolding inicial.

Comandos rápidos:

```bash
npm install
npm run dev
```

Instalación web (versión PWA):

1. Instalar dependencias:

```bash
npm install
```

2. Levantar servidor de desarrollo:

```bash
npm run dev
# Abrir http://localhost:5173
```

3. Generar build producción:

```bash
npm run build
npm run preview -- --port 5174
# Abrir http://localhost:5174
```

Notas:
- La versión web usa `localStorage` para persistencia.
- Para pruebas automatizadas se incluye `scripts/e2e.js` y `scripts/generate-sample-xlsx.js`.
- El ZIP de entrega excluye `node_modules` por tamaño.

