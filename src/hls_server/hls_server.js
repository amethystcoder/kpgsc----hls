const hls = require('hls-server')
const fs = require('fs')
const server = require('./server')

const HLSServer = new hls(server,{
    exists: (req,cb) => {
        let fileExtension = req.url.split('.')[req.url.length - 1]

        //should be tested adequately
        if (fileExtension == 'm3u8' || fileExtension == 'ts') {
            cb(null,fs.existsSync(__dirname + req.url))
        }
    },
    getManifestStream: (req,cb) => {
        const stream = fs.createReadStream(__dirname + req.url)
        cb(null,stream)
    },
    getSegmentStream: (req,cb) => {
        const stream = fs.createReadStream(__dirname + req.url)
        cb(null,stream)
    }
})