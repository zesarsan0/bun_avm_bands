import { creareServer } from "./server";

const configServer = creareServer();
console.log(`Servidor inciado en el puerto ${configServer.port}`);