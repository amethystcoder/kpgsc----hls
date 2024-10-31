const fs = require('fs')
const crypto = require('crypto')
const Stream = require('stream')

/**
 * Encrypts a video stream using AES-256-CBC encryption.
 * 
 * @param {stream.Readable} readStream - Node.js ReadStream of the video file.
 * @param {string} encryptionKey - 32-byte encryption key.
 * @param {string} iv - 16-byte initialization vector.
 * @returns {Promise<Stream.Readable>} - Encrypted video data.
 */
const encryptVideoStream = (readStream, encryptionKey, iv) => {
    return new Promise((resolve, reject) => {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), Buffer.from(iv))
        const encryptedChunks = []

        readStream.on('data', (chunk) => {
            encryptedChunks.push(cipher.update(chunk))
        })

        readStream.on('end', () => {
            encryptedChunks.push(cipher.final())
            const encryptedData = Buffer.concat(encryptedChunks);
            const readable = new Stream.Readable()
            readable.push(encryptedData)
            readable.push(null) // Signals the end of the stream
            resolve(readable)
        });

        readStream.on('error', (err) => {
            reject(err)
        })
    })
}
/**
 * Encrypts a video stream using AES-256-CBC encryption.
 * 
 * @param {string} file - The data in the hls segment file
 * @param {string} encryptionKey - 32-byte encryption key.
 * @param {string} iv - 16-byte initialization vector.
 * @returns {Promise<Stream.Readable>} - Encrypted video data.
 */
const encryptHlsFile = (file, encryptionKey, iv) => {
    return new Promise((resolve, reject) => {
        try {
            //convert the string into a buffer
            let HlsBufferData = Buffer.from(file)
            const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), Buffer.from(iv))
            let finalHlsEncryptedData = cipher.update(HlsBufferData)
            //resolve with the buffer data converted to a string
            resolve(finalHlsEncryptedData.toString())
        } catch (error) {
            reject(error)
        }
    });
}



module.exports = {
    encryptVideoStream,encryptHlsFile
}