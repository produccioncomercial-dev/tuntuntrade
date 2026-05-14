# Cotizador Brainrot

Esta carpeta ya esta lista para subirla gratis a GitHub Pages.

## Archivos

- `index.html`: estructura de la pagina.
- `styles.css`: diseno visual.
- `script.js`: lee el CSV, aplica el codigo y los filtros.
- `Cotizador.csv`: datos de productos.
- `assets/`: imagenes usadas en la pantalla de carga.

## Como funciona la busqueda

La pagina valida el codigo recibido por el cliente y muestra las ofertas disponibles que correspondan.

## Tabla interna para crear codigos

La pagina usa el segundo y cuarto caracter del codigo. Cada caracter representa un valor:

```text
A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, J=10
K=11, L=12, M=13, N=14, O=15, P=16, Q=17, R=18
S=19, T=20, U=21, V=22, W=23, X=24, Y=25, Z=26
0=27, 1=28, 2=29, 3=30, 4=31, 5=32, 6=33, 7=34
8=35, 9=36
```

Ejemplo interno: si quieres un minimo de 11 y maximo de 13, usa `K` y `M` en esas posiciones.

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
   - carpeta `assets`
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
