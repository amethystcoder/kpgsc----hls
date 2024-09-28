const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the servers database
//Feel free to include more as needed

const table = "servers";

const tableColumnNames = 'name,domain,type,playbacks,is_broken,status,is_deleted';

let queryQuestionCreate = (columns) =>{
    let listOfColumns = columns.split(",")
    let result = ""
    for (let index = 0; index < listOfColumns.length - 1; index++) {
        result += "?,"
    }
    return result + "?"
}

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
 * gets all available servers
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAllservers = async (number=false)=>{
    if (number) return await getCount()
    return await get()
}

//
/**
 * gets all active servers
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getActiveservers = async (number=false)=>{
    if (number) return await getCount("status = true")
    return await get("status = true")
}



/**
 * @argument {string} id
 */
let getServerUsingId = async (Id)=>{
    return await get(`id = ${dbInstance.escape(Id)}`)
}

/**
 * @argument {string} type
 */
let getServerUsingType = async (type)=>{
    return await get(`type = ${dbInstance.escape(type)}`)
}

/**
 * @argument {string} name
 */
let getServerUsingName = async (name)=>{
    return await get(`name = ${dbInstance.escape(name)}`)
}

/**
 * @argument {string} domain
 */
let getServerUsingDomain = async (domain)=>{
    return await get(`domain = ${dbInstance.escape(domain)}`)
}

/**
 *
 */
let getBrokenServer = async (number=false)=>{
    if (number) return getCount("is_broken = true")
    return await get("is_broken = true")
}

/**
 *
 */
let getDeletedServer = async (number=false)=>{
    if (number) return getCount("is_deleted = true")
    return await get("is_deleted = true")
}

/**
 * create a new servers in the database
 * @argument {Object} serversData object containing servers data to be stored... properties include
 * name,domain,type,playbacks,is_broken,status,is_deleted
 */
let createNewServer = async (serverData)=>{
    if (typeof serverData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    serverData.status = true
    let [results] = await dbInstance.query(`INSERT INTO ${table} (name,domain,type) VALUES (?,?,?)`, 
    [serverData.name,serverData.domain,serverData.type])
    return results;
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
 * deletes a servers using its ID
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
    getServerUsingId,
    getDeletedServer,
    createNewServer,
    getBrokenServer,
    getServerUsingType,
    getServerUsingName,
    getServerUsingDomain,
    getActiveservers,
    getAllservers,
    updateUsingId,
    deleteUsingId,
    customDelete,
}