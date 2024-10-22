const bcrypt = require('bcryptjs')
const fs = require('fs/promises')
const generateUniqueId = require('./generateUniqueId')
const path = require("path")

const createAPIKey = async (username,email) =>{
    let uniqueId = generateUniqueId(30)
    let uniqueIdSalted = await bcrypt.hash(uniqueId,10)
    let data = {
        username,email,key:uniqueIdSalted
    }
    data = JSON.stringify(data)
    data = btoa(data)
    data = data + ';'
    //add to plex file
    fs.readFile(path.join(__dirname,'../db/configs/apis.plex'),(err,dt)=>{
        if (err) throw err
        let convertedData = dt.toString('utf-8')
        convertedData += data
        fs.writeFile(path.join(__dirname,'../db/configs/apis.plex'),convertedData,(err)=>{
            if (err) throw err
        })
        
    })
    return uniqueId
}

const deleteAPIKey = async (username) =>{
    try {
        let data = await fs.readFile('../db/configs/apis.plex','utf-8')
        let convertedData = data.toString('utf-8')
        let convertedDataArr = convertedData.split(";")
        for (let index = 0; index < convertedDataArr.length; index++) {
            let dataToObject = JSON.parse(atob(convertedDataArr[index]))
            if (dataToObject.username && dataToObject.username == username) {
                convertedDataArr.splice(index)
            }
        }
        fs.writeFile(path.join(__dirname,'../db/configs/apis.plex'),convertedDataArr.join(';'),(err)=>{
            if (err) throw err
        })
        return true
    } catch (error) {
        console.log(error)
    }
}

const compareAPIKey = async (apikey,username) =>{
    try {
        let comparison = false
        let data = await fs.readFile(path.join(__dirname,'../db/configs/apis.plex'),'utf-8')
        let convertedData = data.toString('utf-8')
        let convertedDataArr = convertedData.split(";")
        convertedDataArr = convertedDataArr.filter((item)=>item != '')
        for (let index = 0; index < convertedDataArr.length; index++) {
            let convertedFromB64 = atob(convertedDataArr[index])
            let dataToObject = JSON.parse(convertedFromB64)
            if (dataToObject.username && dataToObject.username == username) {
                comparison = await bcrypt.compare(apikey,dataToObject.key)
                if (comparison) break
            }
        }
        return comparison
    } catch (error) {
        console.log(error)
    }
}



    //console.log(compareAPIKey('j1yyP9d8XGp4JvpwJAAH3DJ81AodZN','Joshua1'))
    //console.log(createAPIKey('Joshua1','collinsohiajoshua5@gmail.com').then(data => console.log(data)))
    //console.log(deleteAPIKey('Joshua1').then(data => console.log(data)))


module.exports = {compareAPIKey,createAPIKey,deleteAPIKey}