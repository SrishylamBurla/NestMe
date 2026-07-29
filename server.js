
// import { createServer } from "http";
// import next from "next";
// import { initSocket } from "./src/lib/socket.js";

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer((req, res) => {
//     handle(req, res);
//   });

//   // Initialize Socket.IO (only once)
//   initSocket(server);


// // console.log("global.io:", !!global.io);

//   server.listen(3000, "0.0.0.0", () => {
//     console.log("🚀 Server running on http://localhost:3000");
//   });
// });

import { createServer } from "http";
import next from "next";
import { initSocket } from "./src/lib/socket.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

console.log("🚀 server.js started");

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // Initialize Socket.IO
  const io = initSocket(server);

  // Make it globally available
  global.io = io;

  console.log("global.io exists:", !!global.io);

  server.listen(3000, "0.0.0.0", () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});