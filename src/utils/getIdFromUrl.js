/**
 * gets the id of a document from a link
 * @param {string} url the link to extract the file from
 * @param {string} linkSourceType the type of link i.e source of the link like `GoogleDrive`,`OkRu`,`Box`,`Yandex`, `Direct` 
 * @returns {string} the requested id
 * or an empty string
 */
function getIdFromUrl(url,linkSourceType) {
    switch (linkSourceType) {
        case "GoogleDrive":
            let splitUrl = url.split("/")
            return splitUrl[splitUrl.length - 2];
        case "OkRu":
            let OkRusplitUrl = url.split("/")
            return OkRusplitUrl[OkRusplitUrl.length - 1];
        case "Yandex":
            let YandexsplitUrl = url.split("/")
            return YandexsplitUrl[YandexsplitUrl.length - 1];
        case "BOX":
            let BOXsplitUrl = url.split("/")
            return BOXsplitUrl[BOXsplitUrl.length - 1];
        case "GooglePhotos":
            let GooglePhotossplitUrl = url.split("/")
            return GooglePhotossplitUrl[GooglePhotossplitUrl.length - 1];
        case "OneDrive":
            let OneDrivesplitUrl = url.split("/")
            const lastItem = OneDrivesplitUrl[OneDrivesplitUrl.length - 1];
            let ids = lastItem.split("?")
            const idSeperated = ids[0]
            const e = ids[1].split("=")[1]
            return JSON.stringify({idSeperated,e})
        
        default:
            return '';
    }
}



module.exports = getIdFromUrl