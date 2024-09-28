let fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

/**
 * @param {} gdrive 
 * @returns {}
 */
async function getGdriveData(gdrive) {
    let url = "https://docs.google.com/get_video_info?docid="+gdrive;
    let response = await fetch(url)
    let data = await response.text()
    //make sense of the whole mash
    data = data.split("&")
    let finalData = {}
    for (let index = 0; index < data.length; index++) {
        let item = data[index].split("=")
        finalData[item[0]] = item[1]
    }
    let streams = finalData.fmt_stream_map.split("%2C")
    let res = {}
    for (let index = 0; index < streams.length; index++) {
        let qul = streams[index].split("%7C")
        "".repl
        qul[1] = qul[1].replace(/%3A/g,":")
        qul[1] = qul[1].replace(/%2F/g,"/")
        qul[1] = qul[1].replace(/%3D/g,"=")
        qul[1] = qul[1].replace(/%3F/g,"?")
        qul[1] = qul[1].replace(/%26/g,"&")
        qul[1] = qul[1].replace(/%25/g,"%")
        qul[1] = qul[1].replace(/%2C/g,",")
        
        const fmt_list = {
            '37': "1080",
            '22': "720",
            '59': "480",
            '18': "360",
        }

        let qual = fmt_list[qul[0]]
        res[qual] = {
            'file': qul[1], 'quality': qual, 'type': 'video/mp4', 'size': 0
        }
    }
    return {
        data:{
            sources:res
        }
    }
}

//console.log(getGdriveData("1SQXVglMVCEkxEuYJ6VxCPmeZGSc5gx3l"))

module.exports = getGdriveData