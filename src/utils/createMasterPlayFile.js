const fs = require("fs")
const path = require("path")

/**
 * 
 * @param {string} fileName 
 * @param {string} ext 
 */
function createMasterPlayFile(fileName,ext) {
    let txt = `#EXTM3U
#EXT-X-VERSION:3
#EXT-STREAM-INF:RESOLUTION=854x480,NAME="480"
${fileName}_2.${ext}
#EXT-STREAM-INF:RESOLUTION=1280x720,NAME="720"
${fileName}_1.${ext}
#EXT-STREAM-INF:RESOLUTION=1920x1080,NAME="1080"
${fileName}_0.${ext}
    `
    fs.writeFile(path.join(__dirname,'../uploads/videos/'+fileName+'/'+'master.'+ext),txt,(err)=>{
        if (err) console.log(err)
    })
}//BANDWIDTH=960434,BANDWIDTH=2289586,BANDWIDTH=4386738,

module.exports = createMasterPlayFile