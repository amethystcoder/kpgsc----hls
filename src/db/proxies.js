const fs = require('fs').promises
const path = require('path')

const linkToProxies = ""
const linkToBrokenProxies = ""

const getProxies = async ()=>{
    return (await fs.readFile(path.join(__dirname+"/configs/proxy.txt"))).toString().split(",")
}

const getRandomProxies = async ()=>{
    let proxy = await getProxies()
    return proxy[Math.floor(Math.random() * (0 - proxy.length + 1))]
}

const getBrokenProxies = async ()=>{
    return (await fs.readFile(path.join(__dirname+"/configs/broken_proxy.txt"))).toString().split(",")
}

/**
 * 
 * @param {Array | string} proxy 
 */
const AddProxies = async (proxy)=>{
    if(Array.isArray(proxy)) return await fs.appendFile(path.join(__dirname+"/configs/proxy.txt"),proxy.join(",")+",")
    if(typeof proxy == "string") return await fs.appendFile(path.join(__dirname+"/configs/proxy.txt"),proxy+",")
}

/**
 * 
 * @param {Array | string} proxy 
 */
const AddBrokenProxies = async (proxy)=>{
    if(Array.isArray(proxy)) return await fs.appendFile(path.join(__dirname+"/configs/broken_proxy.txt"),proxy.join(",")+",")
    if(typeof proxy == "string") return await fs.appendFile(path.join(__dirname+"/configs/broken_proxy.txt"),proxy+",")
}

/**
 * 
 * @param {string} proxy 
 */
const removeProxies = async (proxy)=>{
    let proxies = (await fs.readFile(path.join(__dirname+"/configs/proxy.txt"))).toString().split(",")
    return await fs.writeFile(path.join(__dirname+"/configs/proxy.txt"),proxies.filter(prox => prox != proxy).join(",")+",")
}

/**
 * 
 * @param {string} proxy 
 */
const removeBrokenProxies = async (proxy)=>{
    let proxies = (await fs.readFile(path.join(__dirname+"/configs/broken_proxy.txt"))).toString().split(",")
    return await fs.writeFile(path.join(__dirname+"/configs/broken_proxy.txt"),proxies.filter(prox => prox != proxy).join(",")+",")
}

const clearAllBrokenProxies = async ()=>{
    return await fs.writeFile(path.join(__dirname+"/configs/broken_proxy.txt"),"")
}

const clearAllProxies = async ()=>{
    return await fs.writeFile(path.join(__dirname+"/configs/proxy.txt"),"")
}

module.exports = {
    getRandomProxies,
    getBrokenProxies,
    getProxies,
    AddProxies,
    AddBrokenProxies,
    removeProxies,
    removeBrokenProxies,
    clearAllBrokenProxies,
    clearAllProxies
}