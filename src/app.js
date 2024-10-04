const cluster = require('cluster')
const os = require('os')
const express = require('express')
const expressApp = require('./hls_server/server')
const path = require('path')
//const { webSocketServer } = require("./routes/websocket")

const cpus = os.availableParallelism();

if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);
    if (cpus > 0) {
        os.cpus().forEach((cpu)=>{
            cluster.fork()
        })
    }   
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} died. Restarting...`);
        cluster.fork();
      });
}
else {
    expressApp.use(express.static(path.join(__dirname,'template')))
    expressApp.use(express.static(path.join(__dirname,'utils')))
    expressApp.use(express.static(path.join(__dirname,'uploads')))

    const apiRoutes = require('./routes/Apiroutes');
    expressApp.use('/api',apiRoutes);

    const PORT = 3450

    expressApp.listen(PORT,()=>{
        console.log("listening on port",PORT)
    })
  }