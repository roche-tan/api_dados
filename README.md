# API Juego de Dados

Bienvenido al repositorio de la API para el Juego de Dados, un proyecto emocionante que se encuentra actualmente en pleno desarrollo.
Esta API está diseñada para proporcionar una experiencia de juego interactiva y dinámica, permitiendo a los usuarios jugar a un clásico juego de dados de manera virtual.

## Instalación y Uso

### Requisitos

Hace falta tener instalado Docker.

Para obtener una copia local en funcionamiento, sigue estos pasos:

1. Clona el repositorio.
2. Accede a la carpeta backend y lanza el comandp `docker-compose up -d`. El cual lanzará una instancia de Mongo en localhost:27017 y una instancia mysql en el puerto 3307.
3. Comprueba que las instancias están levantadas.
4. Instala las dependencias con `npm install`.
5. Ejecuta el entorno de desarrollo con `npm run dev`.
6. Accede a la carpeta de frontend y abre en el navegador el archivo index.html

## Características en Desarrollo

- **Juego de Dados**: Implementación de la lógica del juego para simular tiradas de dados.
- **Interfaz de Usuario**: Desarrollo de una interfaz de usuario intuitiva y atractiva para interactuar con la API.
- **Integración con Bases de Datos**: Configuración de una base de datos para almacenar resultados de juegos y estadísticas de los usuarios.

## Documentación API

### Endpoints Disponibles

1. Crear Jugador

   ```URL: /players
   Método: POST
   Cuerpo de la Petición:
   name: Nombre del jugador (tipo string).
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que contiene la información del jugador creado.

2. Actualizar Jugador

   ```URL: /players/{id}
   Método: PUT
   Parámetros:
   id: ID del jugador (tipo integer).
   Cuerpo de la Petición:
   name: Nuevo nombre del jugador (tipo string).
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que muestra la información actualizada del jugador.

3. Lista de Jugadores

   ```URL: /players
   Método: GET
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que lista todos los jugadores.

4. Jugar Partida

   ```URL: /games/{playerId}
   Método: POST
   Parámetros:
   playerId: ID del jugador (tipo integer).
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que contiene el resultado de la partida.

5. Obtener Partidas por ID de Jugador

   ```URL: /games/{playerId}
   Método: GET
   Parámetros:
   playerId: ID del jugador (tipo integer).
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que lista las partidas del jugador especificado.

6. Eliminar Partidas de un Jugador

   ```URL: /games/{playerId}
   Método: DELETE
   Parámetros:
   playerId: ID del jugador (tipo integer).
   Respuesta Esperada:
   Código de estado 200 OK con un mensaje confirmando la eliminación de las partidas.


7. Ranking General de Porcentaje de Victorias

   ```URL: /ranking
   Método: GET
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que muestra el porcentaje de victorias de todos los jugadores.

8. Jugador con Menor Porcentaje de Victorias

   ```URL: /ranking/loser
   Método: GET
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que muestra el jugador con el menor porcentaje de victorias.

9. Jugador con Mayor Porcentaje de Victorias
   ```URL: /ranking/winner
   Método: GET
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que muestra el jugador con el mayor porcentaje de victorias.

## Tecnologías Utilizadas

Este proyecto utiliza una variedad de tecnologías modernas para su desarrollo, incluyendo:

- **Node.js**: Como entorno de ejecución para JavaScript en el servidor.
- **TypeScript**: Para añadir tipado estático al código y mejorar la calidad del desarrollo.
- **Jest**: Para pruebas unitarias y asegurar la calidad del código.
- **Prettier**: Para mantener un estilo de código consistente.

## Licencia

Este proyecto está bajo la Licencia ISC - vea el archivo `LICENSE` para más detalles.

---

¡Mantente atento para más actualizaciones!
