const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the settings database
//Feel free to add more as needed

const table = "settings";

const tableColumnNames = 'config,var';

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
 * gets all available settings
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAllsettings = async (number=false)=>{
    if (number) return await getCount()
    return await get()
}

/**
 * gets a particular configuation or setting
 * @argument {string} setting The configuration to look for 
 */
let getConfig = async (setting)=>{
    return await get(`config='${setting}'`)
}

/**
 * @argument {Array | string} column colunms to check. If it is an array, then the `value` argument must also be 
 * an array, same for when it is a string 
 * @argument {Array | string} value type and size must always correlate with `column` argument 
 */
let updateSettings = async (column,value)=>{
    let queryConditional = ``
    let set = 'SET '
    if (Array.isArray(column) && Array.isArray(value)) {
        for (let index = 0; index < column.length; index++) {
            set += `var = '${value[index]}'`
            queryConditional = `config = '${column[index]}'`
            await update(set,queryConditional)
            queryConditional = ``
            set = 'SET '
        }
    }
    if (typeof column == 'string' && typeof value == 'string'){
        set += `var = '${value}'`;
        queryConditional = `config = '${column}'`
        return await update(set,queryConditional)   
    }
    throw TypeError("arguments are not of the right type "+ typeof column + typeof value)
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
    getAllsettings,
    updateSettings,
    getConfig,
    customDelete
}