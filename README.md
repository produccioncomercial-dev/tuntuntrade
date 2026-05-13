# Cotizador Brainrot

Esta carpeta ya esta lista para subirla gratis a GitHub Pages.

## Archivos

- `index.html`: estructura de la pagina.
- `styles.css`: diseno visual.
- `script.js`: lee el CSV, aplica el codigo y los filtros.
- `Cotizador.csv`: datos de productos.

## Como funciona la busqueda

La pagina valida el codigo recibido por el cliente y muestra las ofertas disponibles que correspondan.

## Como actualizar el CSV

1. Abre tu Excel o Google Sheets.
2. Mantén estas columnas:
   - `Nombre Brainrot`
   - `Mutación`
   - `Dinero por segundo`
   - `Filtro`
   - `Disponibilidad`
   - `Fotografía`
3. En `Fotografía`, pega el link directo de Imgur, por ejemplo `https://i.imgur.com/archivo.jpeg`.
4. Guarda o descarga el archivo como CSV separado por comas.
5. El archivo debe llamarse exactamente `Cotizador.csv`.
6. Reemplaza el `Cotizador.csv` viejo por el nuevo en la carpeta del sitio.

## Como subirlo gratis a GitHub Pages

1. Crea una cuenta en GitHub si aun no tienes una.
2. Entra a GitHub y presiona `New repository`.
3. Ponle un nombre, por ejemplo `cotizador-brainrot`.
4. Dejalo publico y crea el repositorio.
5. Dentro del repositorio, presiona `Add file` y luego `Upload files`.
6. Arrastra estos archivos:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `Cotizador.csv`
   - `README.md`
7. Presiona `Commit changes`.
8. Entra a `Settings`.
9. En el menu izquierdo entra a `Pages`.
10. En `Branch`, elige `main` y carpeta `/root`.
11. Presiona `Save`.
12. Espera 1 o 2 minutos. GitHub te mostrara el link publico de tu pagina.

## Como actualizar datos en GitHub despues

1. Entra al repositorio en GitHub.
2. Haz clic en `Cotizador.csv`.
3. Presiona el icono del lapiz si quieres editarlo ahi mismo, o sube un nuevo archivo con `Add file` > `Upload files`.
4. Si subes uno nuevo, debe llamarse exactamente `Cotizador.csv`.
5. Presiona `Commit changes`.
6. Espera unos segundos y recarga tu pagina.
