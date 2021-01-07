const amqp = require('amqplib')

const settingRabbit = {
    protocol: "amqp",
    hostname: "localhost",
    port: 5672,
    username:"guest",
    password:"guest",
    vhost: "/",
    authMechanism: ["PLAIN", "AMQPLAIN", "EXTERNAL"]
}

async function conectar()
{
    const NOMBRE_COLA_EMPLEADOS = "empleados"

    try 
    {
        const conn = await amqp.connect(settingRabbit)
        console.log(`[+] Se ha creado la conexió correctamente`)

        const canal = await conn.createChannel()
        console.log(`[+] Se ha creado un canal correctamente`)

        const cola = await canal.assertQueue(NOMBRE_COLA_EMPLEADOS)
        console.log(`[+] Se ha creado la cola [${NOMBRE_COLA_EMPLEADOS}] correctamente`);

        console.log(`Esperando mensajes del canal ${NOMBRE_COLA_EMPLEADOS}`);
        
        canal.consume(NOMBRE_COLA_EMPLEADOS, mensaje => {

            let empleado = JSON.parse(mensaje.content.toString())
            console.log(`Empleado ${empleado.name} recibido ...`)

            canal.ack(mensaje)
            console.log(`[-] Mensaje del empleado ${empleado.name} eliminado de la cola`);
        })
    } 
    catch (error) 
    {
        console.log(`Se produjo un error: ${error}`); 
    }
}

conectar()