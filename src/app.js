const cluster = require('cluster')
const os = require('os')
const express = require('express')
const expressApp = require('./hls_server/server')
const path = require('path')
const { webSocketServer } = require("./routes/websocket")

const cpus = os.availableParallelism();

if (cluster.default.isPrimary) {
    if (cpus > 0) {
        cluster.default.fork()
    }   
}

console.log(webSocketServer.address())

expressApp.use(express.static(path.join(__dirname,'template')))
expressApp.use(express.static(path.join(__dirname,'utils')))
expressApp.use(express.static(path.join(__dirname,'uploads')))

const apiRoutes = require('./routes/Apiroutes');
expressApp.use('/api',apiRoutes);

const PORT = 3450

expressApp.listen(PORT,()=>{
    console.log("listening on port",PORT)
})