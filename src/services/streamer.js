const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const sources = require("../sources/sources")
const getIdFromUrl = require("../utils/getIdFromUrl")


/**
 * 
 * @param {string} fileId 
 * @param {*} type 
 * @param {number} start 
 * @returns 
 */
const streamVideoFile = (fileId,type,start)=>{
    //parse the start argument if not done already
    const chunkSize = 1024 * 1000 //Take 1mb from the videofile
    const videoSize = fs.statSync(path.join(__dirname,`../uploads/${fileId}.mp4`)).size

    //start and end: ranges of the video file to cut out
    const end = Math.min(start + chunkSize, videoSize) 

    let videoStream = fs.createReadStream(path.join(__dirname,`../uploads/${fileId}.mp4`),{
        start:start,end:end
    })

    const contentLength = end-start
    const headers = {
        "Accept-Ranges":"bytes",
        "Content-Type":"video/mp4",
        "Content-Length":`${contentLength}`,
        "Content-Range":`bytes ${start}-${end}/${videoSize}`
    } 
    return {headers,videoStream}
}

/**
 * gets the hls files depending on the id and returns their data
 * @param {string} id - the id of the hls file or m3u8 file
 * @param {boolean} part - whether we are sending the main m3u8 file or the ts files
 * @param {string} extension - the extension of the file (ignored if part is set)
 */
const getHlsFileData = async (id,part = false,slugId)=>{

    //check if the file exists
    //if file exists move it to a new folder called video launchpad

    const listOfAcceptableMasterExtensions = ["m3u8","m38","txt","css"]
    const folderList = fs.readdirSync(path.join(__dirname,`../uploads/videos/${id}`))
    if (!part) {
        let fileName = ""
        for (let index = 0; index < folderList.length; index++) {
            let fileExt = folderList[index].split(".")[1]
            if(listOfAcceptableMasterExtensions.includes(fileExt) && folderList[index].includes(`${id}_0`)){
                fileName = folderList[index]
                break
            }
        }
        //read contents of the m3u8 file and return
        let fileContents = await fsPromises.readFile(path.join(__dirname,`../uploads/videos/${id}/${fileName}`))//change back when the ffmpeg is doing the master file properly
        fileContents = fileContents.toString("utf-8")
        return fileContents
    }
    //read contents of the ts file and return
    let folderName = ""
    for (let index = 0; index < folderList.length; index++) {
        if(slugId.includes(folderList[index])){
            folderName = folderList[index]
            break
        }
    }
    let fileContents = await fsPromises.readFile(path.join(__dirname,`../uploads/videos/${id}/${folderName}`))
    return fileContents
    
}

const getStream = (type,link) => {
    if (type == "") getIdFromUrl(link,type)
    sources.Direct.downloadStream()
    sources.GoogleDrive.downloadStreamFile()
    sources.Yandex.downloadStreamVid()
}

module.exports = {
    streamVideoFile,getHlsFileData,getStream
}