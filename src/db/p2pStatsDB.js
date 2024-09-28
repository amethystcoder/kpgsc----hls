const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the p2p_stats database
//Feel free to include more as needed

const table = "p2p_stats";

const tableColumnNames = 'id,upload,download,peers,ipAddress,country,device,date';

/**
 * gets the number of items in the table
 * @argument {string} restOfQuery are the other conditions in the query to look for 
 */
let getCount = async (restOfQuery = '')=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let [result] = await dbInstance.query(`SELECT COUNT(*) FROM ${table} ${where} ${restOfQuery}`)
    return result;
}

/**
 * gets the items in the table
 * @argument {string} restOfQuery are the other conditions in the query to look for 
 */
let get = async (restOfQuery = '')=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let [result] = await dbInstance.query(`SELECT * FROM ${table} ${where} ${restOfQuery}`)
    return result;
}

let deletion = async (restOfQuery = '')=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let [result] = await dbInstance.query(`DELETE FROM ${table} ${where} ${restOfQuery}`)
    return result;
}

let update = async (set = '',restOfQuery = '')=>{
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let [result] = await dbInstance.query(`UPDATE ${table} ${set} ${where} ${restOfQuery}`)
    return result;
}

/**
 * gets all available p2p_stats
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAllp2p_stats = async (number=false)=>{
    if (number) return await getCount()
    return await get()
}

//
/**
 * gets p2p_stats by country
 * @argument {boolean} number determines whether to just send the number of items in storage 
 * @argument {string} country 
 */
let getp2p_statsByCountry = async (number=false,country)=>{
    if (number) return await getCount(`country = '${country}'`)
    return await get(`country = '${country}'`)
}


//
/**
 * gets p2p_stats by device
 * @argument {boolean} number determines whether to just send the number of items in storage
 * @argument {string} deviceName  
 */
let getp2p_statsByDevice = async (number=false,deviceName)=>{
    if (number) return await getCount(`device = '${deviceName}'`)
    return await get(`device = '${deviceName}'`)
}

/**
 * gets a distinct column from the table
 * @param {string} name the name of the column
 * @param {string} restOfQuery are the other conditions in the query to look for 
 */
let getDistinct = async (name,restOfQuery = '')=>{
    name = name ? name : "*"
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let [result] = await dbInstance.query(`SELECT ${name} FROM ${table} ${where} ${restOfQuery}`)
    return result;
}

/**
 * create a new p2p_stats in the database
 * @argument {Object} P2PData object containing p2p_stats data to be stored... properties include
 * upload,download,peers,ipAddress,country,device
 */
let createNewP2PData = async (P2PData)=>{
    if (typeof P2PData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    let date = new Date()
    let result = await dbInstance.query(`INSERT INTO ${table} (upload,download,peers,ipAddress,country,device,date) VALUES (?,?,?,?,?,?,?)`, [P2PData.upload,P2PData.download,P2PData.peers,P2PData.ipAddress,P2PData.country,P2PData.device,date.toISOString()])
    return result;
}

/**
 * @argument {string} id 
 * @argument {Array | string} column colunms to check. If it is an array, then the `value` argument must also be 
 * an array, same for when it is a string 
 * @argument {Array | string} value type and size must always correlate with `column` argument 
 */
let updateUsingId = async (id,column,value)=>{
    let updateColumnBlacklists = ["id"];//coulumns that cannot be updated
    let queryConditional = `id = '${id}'`
    let set = 'SET '
    if (Array.isArray(column) && Array.isArray(value)) {
        for (let index = 0; index < column.length; index++) {
            if (!updateColumnBlacklists.includes(column[index])) {
                set += `${column[index]} = '${value[index]}',`
            }
        }
        set = set.substring(0,set.length - 1)
        return await update(set,queryConditional)
    }
    if (typeof column == 'string' && typeof value == 'string'){
        if (!updateColumnBlacklists.includes(column)) {
            set += `${column} = '${value}'`;
            return await update(set,queryConditional)   
        }
    }
    throw TypeError("arguments are not of the right type "+ typeof column + typeof value)
}

/**
 * deletes a p2p_stats using its ID
 */
let deleteUsingId = async (id)=>{
    return await deletion(`id = '${id}'`);
}

/**
 * performs a custom delete on the db based on a number of conditions
 * @argument {Array | string} column colunms to check. If it is an array, then the `value` argument must also be 
 * an array, same for when it is a string 
 * @argument {Array | string} value type and size must always correlate with `column` argument 
 */
let customDelete = async (column,value)=>{
    let queryConditions = ""
    if (Array.isArray(column) && Array.isArray(value)) {
        queryConditions = `'${column[0]}' = '${value[0]}'`;
        for (let index = 1; index < column.length; index++) {
            queryConditions += `AND ${column[index]} = '${value[index]}'`;
        }
        return await deletion(queryConditions)
    }
    if (typeof column == 'string' && typeof value == 'string') {
        queryConditions = `${column} = '${value}'`;
        return await deletion(queryConditions)
    }
    throw TypeError("arguments are not of the right type "+ typeof column + typeof value)
}

module.exports = {
    getDistinct,
    getp2p_statsByCountry,
    createNewP2PData,
    getp2p_statsByDevice,
    getAllp2p_stats,
    updateUsingId,
    deleteUsingId,
    customDelete,
}