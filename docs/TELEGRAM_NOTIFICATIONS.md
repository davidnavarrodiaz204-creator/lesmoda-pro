# Notificaciones por Telegram

## 1. Introduccion

Lesmoda Pro utiliza dos canales de comunicacion con propositos claramente diferenciados:

- **WhatsApp** -- canal orientado al cliente. Cuando un cliente realiza un pedido, el frontend lo redirige a un mensaje prearmado en WhatsApp para que el vendedor y el cliente coordinen pago y entrega. Es el canal de ventas.
- **Telegram** -- canal interno de alertas para el administrador. Cada vez que se crea un pedido, el backend envia una notificacion con los detalles del mismo a un chat de Telegram. Esto permite al vendedor recibir una alerta instantanea sin depender de la interfaz web, especialmente util cuando no esta revisando el admin constantemente.

## 2. Prerrequisitos

- Una cuenta de Telegram (aplicacion movil o desktop).
- Acceso a [BotFather](https://t.me/botfather), el bot oficial de Telegram para crear y gestionar bots.

## 3. Crear el bot con BotFather

1. Abre Telegram y busca `@BotFather`.
2. Inicia una conversacion con BotFather y envia el comando:

   ```
   /newbot
   ```

3. BotFather te pedira un nombre para el bot. Puede ser cualquier nombre descriptivo, por ejemplo:

   ```
   Lesmoda Pro Notificaciones
   ```

4. Luego te pedira un username unico que termine en `bot`. Por ejemplo:

   ```
   lesmoda_pro_bot
   ```

5. Si el username esta disponible, BotFather respondera con un mensaje similar a este:

   ```
   Done! Congratulations on your new bot. You will find it at t.me/lesmoda_pro_bot.
   Use this token to access the HTTP API:
   1234567890:ABCdefGHIjklmNOPqrStuVWXyz
   ```

   **El token es secreto.** No lo compartas ni lo subas al repositorio. Se configurara como variable de entorno en produccion.

6. (Opcional) Puedes personalizar el bot con los comandos:

   ```
   /setdescription
   /setabouttext
   /setuserpic
   ```

## 4. Obtener el Chat ID

Para que el bot pueda enviar mensajes, necesita saber a que chat (conversacion o grupo) debe enviarlos.

1. Inicia una conversacion con tu bot. Buscalo por su username (`@lesmoda_pro_bot`) y envia cualquier mensaje, por ejemplo "Hola".

2. Abre en tu navegador la siguiente URL, reemplazando `TOKEN` por el token que te dio BotFather:

   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```

   Por ejemplo:

   ```
   https://api.telegram.org/bot1234567890:ABCdefGHIjklmNOPqrStuVWXyz/getUpdates
   ```

3. La respuesta sera un JSON similar a:

   ```json
   {
     "ok": true,
     "result": [
       {
         "update_id": 123456789,
         "message": {
           "message_id": 1,
           "from": {
             "id": 987654321,
             "is_bot": false,
             "first_name": "TuNombre",
             "username": "tunombre"
           },
           "chat": {
             "id": 987654321,
             "first_name": "TuNombre",
             "username": "tunombre",
             "type": "private"
           },
           "date": 1700000000,
           "text": "Hola"
         }
       }
     ]
   }
   ```

4. El valor de `result[0].message.chat.id` (en el ejemplo `987654321`) es tu **Chat ID**. Es un numero entero.

Si no ves resultados, asegurate de haber enviado al menos un mensaje al bot y repite la consulta.

## 5. Variables de Entorno

El sistema de notificaciones se configura mediante tres variables de entorno:

### `TELEGRAM_BOT_TOKEN`

Token del bot proporcionado por BotFather.

```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklmNOPqrStuVWXyz
```

### `TELEGRAM_CHAT_ID`

ID numerico del chat al que se enviaran las notificaciones.

```
TELEGRAM_CHAT_ID=987654321
```

### `TELEGRAM_NOTIFICATIONS_ENABLED`

Controla si las notificaciones estan activadas. Debe ser exactamente `true` (como cadena de texto) para habilitarlas. Cualquier otro valor o la ausencia de la variable las desactiva.

```
TELEGRAM_NOTIFICATIONS_ENABLED=true
```

### Ejemplo de configuracion completa

En un archivo `.env` del backend:

```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklmNOPqrStuVWXyz
TELEGRAM_CHAT_ID=987654321
TELEGRAM_NOTIFICATIONS_ENABLED=true
```

## 6. Funcionamiento Interno

Cuando el frontend realiza un `POST /api/orders`, el controlador `orderController.js` ejecuta los siguientes pasos:

1. Valida los datos de entrada (nombre, celular, items).
2. Persiste el pedido en MongoDB.
3. Construye un mensaje en formato HTML con los detalles del pedido.
4. Llama a `telegram.sendNotification(message)` de forma **no bloqueante** (sin `await`).
5. Retorna inmediatamente la respuesta HTTP `201` con el pedido creado.

El servicio `telegram.js`:

- Verifica que las tres variables de entorno esten configuradas correctamente.
- Si `TELEGRAM_NOTIFICATIONS_ENABLED` no es `true`, o si falta el token o el chat ID, registra un mensaje en consola y retorna `false` sin hacer nada.
- Si todo esta correcto, realiza una peticion HTTPS GET a `https://api.telegram.org/bot{TOKEN}/sendMessage` con los parametros `chat_id`, `text` (codificado), `parse_mode=HTML` y `disable_web_page_preview=true`.
- Procesa la respuesta de Telegram. Si la API responde con `ok: true`, registra exito. En caso contrario, registra el error.

## 7. Contenido del Mensaje

El mensaje enviado a Telegram tiene el siguiente formato HTML:

```
<b>Nuevo Pedido</b>

<b>Cliente:</b> Nombre del Cliente
<b>Celular:</b> +51 999 888 777
<b>Direccion:</b> Av. Principal 123, Lima
<b>Total:</b> S/ 150.00

<b>Productos:</b>
1. Producto A — T: M — C: Rojo x2 — S/ 80.00
2. Producto B — T: L — C: Azul x1 — S/ 70.00

Contactar por WhatsApp
```

El enlace "Contactar por WhatsApp" es un hipervinculo a `https://wa.me/{numero}` que permite al administrador hacer clic y abrir directamente el chat de WhatsApp con el cliente.

## 8. Manejo de Errores

La notificacion por Telegram esta disenada para **nunca interferir con la creacion del pedido**. El flujo es:

1. `telegram.sendNotification()` no tiene `await`, por lo que la respuesta HTTP se envia inmediatamente sin esperar a Telegram.
2. Si la peticion a Telegram falla (timeout, red caida, token invalido, etc.), el error se captura y se registra en la consola del servidor, pero la respuesta al cliente ya se envio exitosamente.
3. Si Telegram responde con un error (chat ID incorrecto, token revocado, etc.), se registra en consola pero el pedido ya fue guardado en la base de datos.

En ningun caso un error de Telegram impide que el pedido se cree o que el cliente sea redirigido a WhatsApp.

## 9. Pruebas Locales

1. Agrega las variables de entorno al archivo `.env` del backend:

   ```
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklmNOPqrStuVWXyz
   TELEGRAM_CHAT_ID=987654321
   TELEGRAM_NOTIFICATIONS_ENABLED=true
   ```

2. Inicia el servidor del backend:

   ```
   cd backend
   npm run dev
   ```

3. Realiza una peticion `POST /api/orders` con curl, Postman o desde el frontend:

   ```json
   {
     "customerName": "Prueba",
     "customerPhone": "+51 999 888 777",
     "customerAddress": "Av. Principal 123",
     "total": 99.99,
     "items": [
       {
         "name": "Polo Prueba",
         "size": "M",
         "color": "Negro",
         "quantity": 1,
         "price": 99.99
       }
     ]
   }
   ```

4. Verifica que el mensaje llegue al chat de Telegram.

5. Para probar el comportamiento con notificaciones desactivadas, omite las variables o establece `TELEGRAM_NOTIFICATIONS_ENABLED=false`. El pedido se creara igualmente y en la consola del servidor aparecera:

   ```
   [Telegram] Notificaciones desactivadas o mal configuradas
   ```

## 10. Consideraciones para Produccion

### Configuracion en Render

Si el backend esta desplegado en Render, configura las variables de entorno desde el Dashboard:

- Ir a tu servicio (Web Service).
- Seccion **Environment** > **Environment Variables**.
- Agregar:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
  - `TELEGRAM_NOTIFICATIONS_ENABLED=true`
- Guardar y hacer redeploy (Render aplica los cambios automaticamente).

### Seguridad del Token

- El token de BotFather es una credencial sensible. Cualquiera que tenga el token puede enviar mensajes como si fuera el bot.
- **Nunca** subas el token al repositorio. No esta en el codigo fuente.
- En desarrollo, usa un archivo `.env` incluido en `.gitignore`.
- En produccion, usa el panel de variables de entorno de Render.
- Si el token se ve comprometido, ve a BotFather y usa el comando `/revoke` para revocarlo y genera uno nuevo con `/token`.

## 11. Diagrama de Arquitectura

```
                          +------------------+
                          |    Cliente       |
                          |  (Navegador)     |
                          +--------+---------+
                                   |
                                   | POST /api/orders
                                   v
                          +------------------+
                          |   Backend        |
                          | (Express API)    |
                          +--------+---------+
                                   |
                    +--------------+--------------+
                    |                             |
                    v                             v
          +------------------+          +------------------+
          |   MongoDB        |          |  Telegram API    |
          | (persiste order) |          | (sendMessage)    |
          +------------------+          +--------+---------+
                                                 |
                                                 | Notificacion al admin
                                                 v
                                        +------------------+
                                        |  Admin           |
                                        | (Telegram app)   |
                                        +------------------+

          +------------------+
          |   Cliente        |
          | (WhatsApp app)   |
          +------------------+
                    ^
                    | Enlace wa.me
                    | (redireccion del frontend)
```

### Flujo resumido

1. El cliente completa el formulario de pedido en el frontend.
2. El frontend envia `POST /api/orders` al backend.
3. El backend guarda el pedido en MongoDB.
4. El backend envia una notificacion a Telegram con los detalles del pedido (al administrador).
5. El frontend redirige al cliente a WhatsApp con un mensaje prearmado (canal de ventas).
6. El administrador recibe la alerta en Telegram y puede abrir el chat de WhatsApp desde el enlace para coordinar con el cliente.

**WhatsApp** es el canal de ventas con el cliente. **Telegram** es el canal interno de alertas para el administrador.
