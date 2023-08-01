**sky-challenge**
==
**sky-airlines-rabbit-micro-service**
--

**Descripción**

Este es el microservicio que se encarga de crear la cola en RabbitMQ.

**Variables de entorno**

Están son las variables de entorno, tienen valores por defecto pero se pueden agregar a un archivo .env en la raiz del proyecto.


```javascript
    port: process.env.PORT || 3001,
    rabbitConfig: {
        config: {
            timeOut: process.env.RABBIT_TIME_OUT || 5000,
            uri: process.env.RABBIT_URI || 'amqp://guest:guest@localhost:5672'
        },
        queues: process.env.RABBIT_QUEUES || 'users-requested',
        exchange: {
            name: process.env.RABBIT_EXCHANGE || 'users'
        }
    }
```


**instalación**

Ejecutar el siguiente comando para instalar todas las dependecias:

```bash
$ npm install
```


**Ejecutando la aplicación**

Ejecutar los siguientes comandos para ejecutar la aplicacón:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

**Ejemplo**

Al ejecutar la aplicación se mostrará en consola todos mensajes enviados a la cola con el pattern ``save-queue ``. En este caso se muestran los usarios con id par:

![image](https://github.com/lumen1296/sky-challenge/assets/21350667/84d4df48-5053-4baa-8030-3a446d145c22)





**sky-airlines-service**
--
Este es el servicio que se encarga de obtener los datos de los usuarios desde una API retornarlos ordenados de forma inversa y luego enviar solo los usarios con id par a la cola de RabbitMQ.

**Variables de entorno**

Están son las variables de entorno, tienen valores por defecto pero se pueden agregar a un archivo **.env** en la raiz del proyecto.


```javascript
port: process.env.PORT || 3000,
    axios: {
        timeOut: process.env.AXIOS_TIME_OUT || 5000
    },
    rabbitConfig: {
        config: {
            timeOut: process.env.RABBIT_TIME_OUT || 5000,
            uri: process.env.RABBIT_URI || 'amqp://guest:guest@localhost:5672'
        },
        queues: process.env.RABBIT_QUEUES || 'users-requested',
        exchange: {
            name: process.env.RABBIT_EXCHANGE || 'users'
        }
    }

```


**instalación**

Ejecutar el siguiente comando para instalar todas las dependecias:

```bash
$ npm install
```


**Ejecutando la aplicación**

Ejecutar los siguientes comandos para ejecutar la aplicacón:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

**Ejemplo**

Al ejecutar la aplicación se levantara el servicio y estará listo para hacer peticiones. En este caso se hace una solicitud desde postman y devuelve los usuarios ordenados descendentemente y envía los usuarios con id par a la cola.

```bash
# curl
$ curl --location --request GET 'http://localhost:3000/test/users'

```


![image](https://github.com/lumen1296/sky-challenge/assets/21350667/0bf60347-e4bc-4ad5-82eb-5019b968601b)


## Aclaraciones

- Se debe ejecutar el mircoservicio para crear la cola en rabbit. La cola será creada de la siguiente forma:

![image](https://github.com/lumen1296/sky-challenge/assets/21350667/f00594eb-5d9f-428d-8613-60c642dcdb0d)

- Si se quiere ver los mensajes desde la cola en la instancia de rabbit se debe parar el microservicio (después de haber creado la cola con el mismo) ya que el microservicio actua como un **consumer** y los mensajes se verán de la siguiente forma:

![image](https://github.com/lumen1296/sky-challenge/assets/21350667/e3d89c49-0d1c-4838-a02d-3415bb99138b)







