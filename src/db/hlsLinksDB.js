const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the hls_links database
//Feel free to include more as needed

const table = "hls_links";

const tableColumnNames = 'id,link_id,server_id,file_id,file_size,status';

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
let get = async (restOfQuery = '',joinMainLink = false)=>{
    let joiner = ""
    if (joinMainLink) joiner = "JOIN links ON hls_links.link_id = links.id"
    let where = restOfQuery && restOfQuery != '' ? 'WHERE' : ''
    let [result] = await dbInstance.query(`SELECT * FROM ${table} ${joiner} ${where} ${restOfQuery}`)
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
 * gets all available hls_links
 * @param {boolean} number determines whether to just send the number of items in storage 
 * @param {boolean} joinMainLink determines whether to attach the link data from which the hls was created
 */
let getAllhls_links = async (number=false,joinMainLink = false)=>{
    if (number) return await getCount()
    return await get('',joinMainLink)
}

//
/**
 * gets all active hls_links
 * @argument {boolean} number determines whether to just send the number of items in storage
 * @param {boolean} joinMainLink determines whether to attach the link data from which the hls was created
 */
let getActivehls_links = async (number=false,joinMainLink = false)=>{
    if (number) return await getCount("status = true")
    return await get("status = true",joinMainLink)
}

//
/**
 * gets all failed hls_links
 * @argument {boolean} number determines whether to just send the number of items in storage 
 * @param {boolean} joinMainLink determines whether to attach the link data from which the hls was created
 */
let getFailedhls_links = async (number=false,joinMainLink = false)=>{
    if (number) return await getCount("status = false")
    return await get("status = false",joinMainLink)
}

/**
 * @argument {string} id
 */
let getHlsLinkUsingId = async (Id)=>{
    return await get(`id = ${dbInstance.escape(Id)}`)
}

/**
 * @argument {string} linkId
 */
let getHlsLinkUsinglinkId = async (linkId)=>{
    return await get(`link_id = ${dbInstance.escape(linkId)}`)
}

/**
 * @argument {string} linkId
 */
let getHlsLinkUsingServerId = async (serverId)=>{
    return await get(`server_id = ${dbInstance.escape(serverId)}`)
}


/**
 * create a new hls_links in the database
 * @argument {Object} hls_linksData object containing hls_links data to be stored... properties include
 * link_id,server_id,file_id,file_size,status
 */
let createNewHlsLink = async (hls_linkData)=>{
    if (typeof hls_linkData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    let date = new Date()
    hls_linkData.status = true
    let result = await dbInstance.query(`INSERT INTO ${table} (link_id,server_id,file_id,file_size,status) VALUES (?,?,?,?,?)`, 
    [hls_linkData.link_id,hls_linkData.server_id,hls_linkData.file_id,hls_linkData.file_size,hls_linkData.status])
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
 * deletes a hls_links using its ID
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
    getActivehls_links,
    getFailedhls_links,
    getAllhls_links,
    createNewHlsLink,
    getHlsLinkUsingServerId,
    getHlsLinkUsingId,
    getHlsLinkUsinglinkId,
    updateUsingId,
    deleteUsingId,
    customDelete,
}