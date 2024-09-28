const fluentFfmpeg = require('fluent-ffmpeg')
const Ffmpeg = require('@ffmpeg-installer/ffmpeg')
const fs = require('fs')
const {webSocketServer,clients} = require("../routes/websocket")
const getVideoDuration = require("./getVideoDuration")
const {convertTimeStampToSeconds} = require("./timeStamps")
const generateUniqueId = require("./generateUniqueId")
const path = require("path")
const { settingsDB } = require('../db/DBs')
/* const createMasterPlayFile = require("./createMasterPlayFile") */


fluentFfmpeg.setFfmpegPath(Ffmpeg.path)

async function createHlsFiles(filePath,fileName,LinkTitle,persistenceId) {
    let result = ""
    try {
        if (!fs.existsSync(`./uploads/videos/${fileName}`)) {
            fs.mkdirSync(`./uploads/videos/${fileName}`)
        }
        //check if file exists in server
        if (!fs.existsSync(filePath)) throw Error("file could not be found")

        //get the total timemark of the video to create the percentage
        const VideoDurationInSeconds = await getVideoDuration(`${filePath}`)

        let partId = generateUniqueId(20)

        //get extension of both the segment and master files
        const SegmentFileExtension = (await settingsDB.getConfig("hlsSegmentName"))[0].var
        const MasterFileExtension = (await settingsDB.getConfig("m3u8Name"))[0].var

        //`-master_pl_name master.txt`,

        //attempt to convert file to m3u8
        fluentFfmpeg(`${filePath}`, {timeout: 43200}).complexFilter([
            '[0:v]split=3[v1][v2][v3]',
            '[v1]scale=w=1920:h=1080[v1out]',
            '[v2]scale=w=1280:h=720[v2out]',
            '[v3]scale=w=854:h=480[v3out]'
          ]).addOptions([
            '-map [v1out]', '-c:v:0 libx264', '-b:v:0 5000k', '-maxrate:v:0 5350k', '-bufsize:v:0 7500k',
            '-map [v2out]', '-c:v:1 libx264', '-b:v:1 2800k', '-maxrate:v:1 2996k', '-bufsize:v:1 4200k',
            '-map [v3out]', '-c:v:2 libx264', '-b:v:2 1400k', '-maxrate:v:2 1498k', '-bufsize:v:2 2100k',
            '-map a:0', '-c:a:0 aac', '-b:a:0 192k', '-ac 2',
            '-map a:0', '-c:a:1 aac', '-b:a:1 128k', '-ac 2',
            '-map a:0', '-c:a:2 aac', '-b:a:2 96k', '-ac 2',
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 20',
            '-hls_list_size 0',
            '-f hls',
            '-hls_playlist_type vod',
            '-hls_flags temp_file',
            `-hls_segment_filename ${path.join(__dirname,'../uploads/videos/'+fileName+'/'+fileName+'_%v_%03d.'+SegmentFileExtension)}`
        ]).addOption('-var_stream_map','v:0,a:0 v:1,a:1 v:2,a:2').output(`${path.join(__dirname,'../uploads/videos/'+fileName+'/'+fileName+'_%v.'+MasterFileExtension)}`)
        .on('error', (err, stdout, stderr) => {
            if (err) {
                webSocketServer.clients.forEach((client)=>{
                    let clientPersistentId = clients.get(client) ? clients.get(client).persistenceId : ""
                    if(client.readyState === 1 && clientPersistentId === persistenceId){
                        client.send(JSON.stringify({
                            progress:false,
                            message:'an error occured',
                            completed:true,
                            fileId:fileName,
                            name:LinkTitle,
                            persistenceId:persistenceId
                        }))
                    }
                })
                console.log(err.message);
                console.log("stderr:\n" + stderr);
            }
        }).on('progress', (progress) => {
            //convert the timeMark to seconds and calculate the percent if progress.percent is undefined
            const timeStampConvertedToSeconds = convertTimeStampToSeconds(progress.timemark)
            const progressInPercent = (timeStampConvertedToSeconds/VideoDurationInSeconds) * 100

            //send the progress back to the client (through websockets or another way)
            webSocketServer.clients.forEach((client)=>{
                let clientPersistentId = clients.get(client) ? clients.get(client).persistenceId : ""
                if(client.readyState === 1 &&  clientPersistentId === persistenceId){
                    client.send(JSON.stringify({
                        progress:progressInPercent,
                        message:`progress: ${progressInPercent}%`,
                        completed:false,
                        fileId:fileName,
                        name:LinkTitle,
                        persistenceId:persistenceId
                    }))
                }
            })
        }).on('end', () => {
/*             //create the master play file since ffmpeg cannnot for some reason
            createMasterPlayFile(fileName,'m3u8') */
            //send the progress back to the client (through websockets or another way)
            webSocketServer.clients.forEach((client)=>{
                let clientPersistentId = clients.get(client) ? clients.get(client).persistenceId : ""
                if(client.readyState === 1 && clientPersistentId === persistenceId){
                    client.send(JSON.stringify({
                        progress:100,
                        message:`progress: 100%`,
                        completed:true,
                        fileId:fileName,
                        name:LinkTitle,
                        persistenceId:persistenceId
                    }))
                }
            })
            result = "successful"
        }).run()   
    } catch (error) {
        console.log(error)
        result = error
    }

    return result
}

module.exports = {
    createHlsFiles
}