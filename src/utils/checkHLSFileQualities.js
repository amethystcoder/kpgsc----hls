const fs = require("fs")

/**
 * checks for all the available qualities of an hls file and returns them
 * @param {string} slug 
 */
const checkHLSFileQualities = (slug)=>{
    let files = fs.readdirSync(path.join(__dirname,`../uploads/videos/${slug}`))
    //check if the exensions match
    let qualities = files.filter((file)=>file.split(".")[0].endsWith("_0") || file.split(".")[0].endsWith("_1") || file.split(".")[0].endsWith("_2"))
    for (let index = 0; index < qualities.length; index++) {
        if (qualities[index].split(".")[0].endsWith("_0")) qualities[index] = "1080"
        if (qualities[index].split(".")[0].endsWith("_1")) qualities[index] = "720"
        if (qualities[index].split(".")[0].endsWith("_2")) qualities[index] = "480"
    }
    return qualities
}