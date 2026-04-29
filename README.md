# 🌴 Guía Turística Multimedia de Costa Rica

## 📌 Descripción
Aplicación web interactiva que permite explorar las provincias de Costa Rica y sus destinos turísticos mediante mapas dinámicos, imágenes y contenido multimedia.

## Integrantes
- Umaña Guevara Alexander C27912
- Aguilar Alvarado Esteban C10098
- Rojas Zuñiga Bryan Alonso C16913


---

## 🗺️ Regiones incluidas
- Guanacaste
- Alajuela
- Heredia
- San José
- Cartago
- Limón
- Puntarenas

---

## 📍 Destinos
Se implementan 2 destinos por provincia.
---
## 🌐 Demo del proyecto

Podés ver la aplicación funcionando aquí:

👉 https://alexug0104.github.io/Proyecto_Final_Guia_Turistica/

---

## 🎨 Wireframes / Diseño

### Página principal
![Home](CapReadme/Principal.png)

### Página de provincia
![Provincia](CapReadme/GuancaProvincia.png)

### Página de destino
![Destino](CapReadme/Destino.png)

---

## 🧩 Web Components

### `<mapa-costa-rica>`
- Muestra el mapa interactivo
- Usa Shadow DOM
- Permite seleccionar provincia

### `<mapa-provincia>`
- Carga mapa de cantones
- Lee datos desde JSON
- Renderiza puntos turísticos

### `<destino-detalle>`
- Muestra información del destino
- Imagen, descripción y actividades

---

## 🎬 Storyboard

1. El usuario ingresa a la página principal.
2. Observa un mapa interactivo de Costa Rica.
3. Selecciona una provincia dando clic sobre el mapa.
4. La aplicación muestra el mapa de cantones de esa provincia.
5. El usuario selecciona uno de los puntos turísticos disponibles.
6. La aplicación muestra la vista de detalle del destino con imagen, descripción y actividades.

---
## 🧭 Guion de navegación

```text
{
Página principal
   ↓ clic en provincia
Página de provincia
   ↓ clic en punto turístico
Página de destino
   ↓ volver
Página de provincia / Página principal
}


## Estructura JSON

```json
{
  "id": "guanacaste-001",
  "nombre": "Tamarindo",
  "region": "Guanacaste",
  "descripcion": "Playa turística...",
  "imagen_portada": "assents/img/PuntoTamarindo.jpg",
  "actividades": ["Surf", "Playa"],
  "mapTop": 72,
  "mapLeft": 30
}