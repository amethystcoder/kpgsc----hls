const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the backup_drives database
//Feel free to include more as needed

const table = "backup_drives";

const tableColumnNames = 'id,link_id,acc_id,file_id,status';

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
 * gets all available backup_drives
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAllbackup_drives = async (number=false)=>{
    if (number) return await getCount()
    return await get()
}

//
/**
 * gets all active backup_drives
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getActivebackup_drives = async (number=false)=>{
    if (number) return await getCount("status = true")
    return await get("status = true")
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
 * @argument {string} id
 */
let getBackupUsingId = async (Id)=>{
    return await get(`id = '${dbInstance.escape(Id)}'`)
}

/**
 * @argument {string} fileId
 */
let getBackupUsingFileId = async (fileId)=>{
    return await get(`file_id = '${dbInstance.escape(fileId)}'`)
}

/**
 * @argument {string} linkId
 */
let getBackupUsingLinkId = async (linkId)=>{
    return await get(`link_id = '${dbInstance.escape(linkId)}'`)
}


/**
 * create a new backup_drives in the database
 * @argument {Object} BackupData object containing backup_drives data to be stored... properties include
 * id,link_id,acc_id,file_id,status
 */
let createNewBackup = async (BackupData)=>{
    if (typeof BackupData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    BackupData.status = true
    let result = await dbInstance.query(`INSERT INTO ${table} (link_id,acc_id,file_id,status) VALUES (?,?,?,?)`, [
        BackupData.link_id,BackupData.acc_id,BackupData.file_id,BackupData.status])
    return result;
}

/**
 * @argument {string} id 
 * @argument {Array | string} column colunms to check. If it is an array, then the `value` argument must also be 
 * an array, same for when it is a string 
 * @argument {Array | string} value type and size must always correlate with `column` argument 
 */
let updateUsingId = async (id,column,value)=>{
    let updateColumnBlacklists = ["id","link_id","acc_id"];//coulumns that cannot be updated
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
 * deletes a backup_drives using its ID
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
    getActivebackup_drives,
    getAllbackup_drives,
    createNewBackup,
    getBackupUsingLinkId,
    getBackupUsingFileId,
    getBackupUsingId,
    updateUsingId,
    deleteUsingId,
    customDelete,
}