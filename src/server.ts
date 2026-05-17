import { Server } from "socket.io";
import{Server as Engine} from "@socket.io/bun-engine";
import { SERVER_CONFIG } from "./config/server-config";
import { bandsService } from "./services/bands.service";

export const creareServer = () => {

  const io = new Server();

  const engine = new Engine({ path: SERVER_CONFIG.path });

  io.bind(engine);

  io.on("connection", (socket) => {
    console.log(`Cliente conectado (socket.id): ${socket.id}`);
socket.emit("saludo", "Hola desde el servidor");
socket.on("chat", (msg)=> io.emit("chat", msg))

socket.emit("BANDS_LIST", bandsService.obtinereBands());

socket.on("ADD_BAND",(payload: { nomen:string})=>{
if (payload.nomen.trim().length === 0) return;

const band = bandsService.addereBand(payload.nomen);
io.emit("BANDS_LIST", bandsService.obtinereBands());
});

socket.on("VOTE_BAND",(payload:{id:string})=>{
  const band = bandsService.addereVotumBand(payload.id);

  if (band){
    io.emit("BAND_LIST", bandsService.obtinereBands());
  }
});

socket.on("DELETE_BAND", (payload:{id:string}) => {
  const band = bandsService.delereBand(payload.id);

  if(band){
    io.emit("BANDS_LIST", bandsService.obtinereBands());
  }
});

socket.on("DELETE_BAND", (payload: {id:string})=>{
  const band = bandsService.delereBand(payload.id);
  io.emit("BANDS_LIST", bandsService.obtinereBands());
});


})


   io.on("disconnect", ()=> {
    console.log('Cliente desconectado: ${socket.id}');
   }); 




  const { fetch: engineFetch, websocket } = engine.handler();

  const server = Bun.serve({
    port: SERVER_CONFIG.port,
    idleTimeout: SERVER_CONFIG.idleTimeout,
    websocket,
    fetch(req: Request, server: Parameters<typeof engineFetch>[1]) {
      const url = new URL(req.url);

      if (url.pathname.startsWith(SERVER_CONFIG.path)) {
        return engineFetch(req, server);
      }

    //  return new Response(
      //  `<html><body><h1>Hola Mundo!!!</h1></body></html>`,
        //{
          //headers: { "Content-Type": "text/html; charset=utf-8" },
        //}
      //);

      return new Response(Bun.file("./public/index.html"),{
        headers: {"Content-Type":"text/html; charset=utf-8"}
      });

    }
  });

  return server;
 
}