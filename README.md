# Cotizador Brainrot

Esta carpeta ya esta lista para subirla gratis a GitHub Pages.

## Archivos

- `index.html`: estructura de la pagina.
- `404.html`: permite abrir links directos con codigo en GitHub Pages.
- `styles.css`: diseno visual.
- `script.js`: lee el CSV, aplica el codigo y los filtros.
- `Cotizador.csv`: datos de productos.
- `assets/`: imagenes usadas en la pantalla de carga.

## Como funciona la busqueda

La pagina valida el codigo recibido por el cliente y muestra las ofertas disponibles que correspondan.

## Tabla interna para crear codigos

El codigo tiene 8 caracteres. El primer y ultimo caracter son distractores. Los 3 caracteres despues del primero forman el minimo, y los 3 siguientes forman el maximo.

```text
A = 0
B = 1
C = 2
D = 3
E = 4
F = 5
G = 6
H = 7
I = 8
J = 9
O = .
```

Ejemplo interno: `3AOBBOA6` representa `0.1` a `1.0`.

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
   - `404.html`
   - `styles.css`
   - `script.js`
   - `Cotizador.csv`
   - `README.md`
   - carpeta `assets`
7. Presiona `Commit changes`.
8. Entra a `Settings`.
9. En el menu izquierdo entra a `Pages`.
10. En `Branch`, elige `main` y carpeta `/root`.
11. Presiona `Save`.
12. Espera 1 o 2 minutos. GitHub te mostrara el link publico de tu pagina.

## Links directos con codigo

Puedes compartir links asi:

```text
https://produccioncomercial-dev.github.io/tuntuntrade/PEOAFOB1
```

Cuando una persona abra ese link, la pagina saltara directo a la animacion de carga y luego mostrara las ofertas filtradas.

Tambien puedes agregar un nombre despues del codigo:

```text
https://produccioncomercial-dev.github.io/tuntuntrade/PEOAFOB1Fernando
```

La pagina usara `Fernando` en el encabezado del catalogo. Si no agregas nombre, usara `Anonimo`.

## Como actualizar datos en GitHub despues

1. Entra al repositorio en GitHub.
2. Haz clic en `Cotizador.csv`.
3. Presiona el icono del lapiz si quieres editarlo ahi mismo, o sube un nuevo archivo con `Add file` > `Upload files`.
4. Si subes uno nuevo, debe llamarse exactamente `Cotizador.csv`.
5. Presiona `Commit changes`.
6. Espera unos segundos y recarga tu pagina.
