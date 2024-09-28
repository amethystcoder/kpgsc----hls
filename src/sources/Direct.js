const fs = require("fs")
const axios = require("axios")
const path = require("path")
const { promisify } = require('util')
const stream = require('stream')


/**
 * 
 * @param {string} url 
 * @param {*} res 
 */
const downloadStream = async (url,res)=>{
    /* request = https.get(url,(response)=>{
        response.pipe(res)
    }) */
    const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream'
    })

    response.data.pipe(res)

    return new Promise((resolve, reject) => {
     response.data.on('end',()=>{
        resolve()
     })
     response.data.on('error',(err)=>{
        reject(err)
     })
    })
}

/**
 * 
 * @param {string} url 
 * @param {*} res 
 */
const downloadFile = async (url,destinationName)=>{
    //check if file already exists
    if (!fs.existsSync(`./uploads/${destinationName}.mp4`)) {
        let destination = fs.createWriteStream(`./uploads/${destinationName}.mp4`)
        const response = await axios({
            method: 'GET',
            url,
            responseType: 'stream'
        })
        const finished = promisify(stream.finished)
        response.data.pipe(destination)
        return finished(destination)
    }
    return "File already exists"
}


module.exports = {
    downloadStream,downloadFile
}