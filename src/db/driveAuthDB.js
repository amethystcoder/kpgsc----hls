const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the drive_auth database
//Feel free to include more as needed

const table = "drive_auth";

const tableColumnNames = 'id,client_id,client_secret,refresh_token,access_token,email,status,updated_at,created_at';

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
 * gets all available drive_auth
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAlldrive_auth = async (number=false)=>{
    if (number) return await getCount()
    return await get()
}

//
/**
 * gets all active drive_auth
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getActivedrive_auth = async (number=false)=>{
    if (number) return await getCount("status = true")
    return await get("status = true")
}



/**
 * @argument {string} id
 */
let getAuthUsingId = async (drive_authId)=>{
    return await get(`id = '${dbInstance.escape(drive_authId)}'`)
}

/**
 * @argument {string} Email
 */
let getAuthUsingEmail = async (Email)=>{
    return await get(`email = ${dbInstance.escape(Email)}`)
}

/**
 * @argument {string} client_id
 */
let getAuthUsingClientID = async (client_id)=>{
    return await get(`client_id = ${dbInstance.escape(client_id)}`)
}

/**
 * create a new drive_auth in the database
 * @argument {Object} drive_authData object containing drive_auth data to be stored... properties include
 * client_id,client_secret,refresh_token,access_token,email,status
 */
let createNewAuth = async (drive_authData)=>{
    if (typeof drive_authData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    let date = new Date()
    drive_authData.status = true
    let result = await dbInstance.query(`INSERT INTO ${table} (client_id,client_secret,refresh_token,updated_at,created_at,access_token,email,status) VALUES (?,?,?,?,?,?,?,?)`, 
    [drive_authData.client_id,drive_authData.client_secret,drive_authData.refresh_token,date.toISOString(),date.toISOString(),drive_authData.access_token,drive_authData.email,drive_authData.status])
    return result;
}

/**
 * @argument {string} id 
 * @argument {Array | string} column colunms to check. If it is an array, then the `value` argument must also be 
 * an array, same for when it is a string 
 * @argument {Array | string} value type and size must always correlate with `column` argument 
 */
let updateUsingId = async (id,column,value)=>{
    let updateColumnBlacklists = ["id","created_at","updated_at"];//coulumns that cannot be updated
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
 * deletes a drive_auth using its ID
 */
let deleteUsingId = async (id)=>{
    return await deletion(`id = '${id}'`);
}

/**
 * deletes a drive_auth using its Email
 */
let deleteUsingEmail = async (Email)=>{
    return await deletion(`email = '${Email}'`);
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
    getAuthUsingClientID,
    getDistinct,
    getActivedrive_auth,
    getAlldrive_auth,
    getAuthUsingId,
    getAuthUsingEmail,
    deleteUsingEmail,
    createNewAuth,
    updateUsingId,
    deleteUsingId,
    customDelete
}