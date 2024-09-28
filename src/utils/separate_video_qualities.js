const fluentFfmpeg = require('fluent-ffmpeg')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const Ffmpeg = require('@ffmpeg-installer/ffmpeg')

fluentFfmpeg.setFfmpegPath(Ffmpeg.path)

let fileName = 'Alan_Walker_-_Faded' //variable data...

(()=>{})
/* fluentFfmpeg(`../hls_files/${fileName}.mp4`)
.outputOptions('-vf',"scale=1280:720")
.saveToFile(`../hls_files/${fileName}-1080p.mp4`) */

/* .output(`../hls_files/${fileName}-480p.mp4`)//upsize 480p
.videoCodec('libx264')
.size('640x480') */

/* .output(`../hls_files/${fileName}-720p.mp4`)//upsize 720p
.videoCodec('libx264')
.size('1280x720')

.output(`../hls_files/${fileName}-1080p.mp4`)//upsize 1080p
.videoCodec('libx264')
.size('1920x1080') */

/* .on('error', (err) => {
    console.log('an error occured processing the file.\n err:',err)
}).on('progress', (progress) => {
    console.log(`progress: ${progress.frames } frames`)
}).on('end', () => {
    console.log('processing completed')

}) */