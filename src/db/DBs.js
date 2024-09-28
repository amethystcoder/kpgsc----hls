let adsDB = require("./adsDB")
let altLinksDB = require("./altLinksDB")
let backupsDB = require("./backupsDB")
let driveAuthDB = require("./driveAuthDB")
let hlsLinksDB = require("./hlsLinksDB")
let linksDB = require("./linksDB")
let p2pStatsDB = require("./p2pStatsDB")
let popupsDB = require("./popAdsDB")
let serversDB = require("./serversDB")
let settingsDB = require("./settingsDB")
let usersDB = require("./usersDB")
let proxyStore = require("./proxies")

module.exports = {
    adsDB,
    altLinksDB,
    backupsDB,
    driveAuthDB,
    hlsLinksDB,
    linksDB,
    p2pStatsDB,
    serversDB,
    settingsDB,
    usersDB,
    proxyStore,
    popupsDB
}