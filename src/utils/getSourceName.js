/**
 * Gets the name of the video provider or hoster depending on the link
 * @argument {string} link the link to test
 * @returns {string} The source name. Possible values are `GoogleDrive`,`OkRu`,`Box`,`Yandex`, `Direct` 
 * or an empty string
 */
function getSource(link) {
    if (typeof link == 'string') {
        //get the structure of the links and how they look like
        //const linkSegments = link.split("/")
        //let url = new URL(link)
        if(link.includes("kpgsc")) return "Direct"
        if(link.includes("drive.google.com/file/d/")) return "GoogleDrive"
        if(link.includes("1drv.ms")) return "OneDrive"
        if(link.includes("daotu-my.sharepoint.com")) return "OneDrive"
        if(link.includes("yadi.sk")) return "Yandex"
        if(link.includes("my.sharepoint.com")) return "OneDrive"
        if(link.includes("ok.ru")) return "okru"
        if(link.includes("app.box.com")) return "BOX"
        if(link.includes("disk.yandex.ru")) return "Yandex"
        if(link.includes("disk.yandex")) return "Yandex"
        if(link.includes("disk.yandex.com")) return "Yandex"
        if(link.includes("photos.app.goo.gl")) return "GooglePhotos"

    }
    return 'Direct'
}

module.exports = getSource