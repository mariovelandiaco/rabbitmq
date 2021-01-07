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

    try {
        const conn = await amqp.connect(settingRabbit)
        console.log(`[+] Se ha creado la conexió correctamente`)

        const canal = await conn.createChannel()
        console.log(`[+] Se ha creado un canal correctamente`)

        const cola = await canal.assertQueue(NOMBRE_COLA_EMPLEADOS)
        console.log(`[+] Se ha creado la cola [${NOMBRE_COLA_EMPLEADOS}] correctamente`);

        await enviarMensajesCola(canal, NOMBRE_COLA_EMPLEADOS)

    } catch (error) {
        console.log(`Se produjo un error: ${error}`); 
    }
}

async function enviarMensajesCola(canal, nombreCola){

    let mensajes = [
        {name:"Mario Styven", lastname:"Velandia Ibarra"},
        {name:"Luis Alejandro", lastname:"Villegas Villamil"},
        {name:"Cristian Jhovanny", lastname:"Ospina Arroyo"},
        {name:"Victor Manuel", lastname:"Mejia Gallego"},
        {name:"Mateo", lastname:"Alzate Ospina"},
    ]

    await Promise.all(mensajes.map( async (mensaje)=>{
        await canal.sendToQueue(nombreCola, Buffer.from(JSON.stringify(mensaje)))
        console.log(`[SEND] Empleado ${mensaje.name} enviado ...`);
    })) 
}

conectar()