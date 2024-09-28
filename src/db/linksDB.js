const dbInstance = require('../db/configs/dbConfig')

//A list of common functions for CRUD on the links database
//Feel free to add more as needed

const table = "links";

const tableColumnNames = 'acc_id,title,main_link,alt_link,preview_img,data,type,subtitles,views,downloads,is_alt,slug,status,updated_at,created_at,deleted';

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
 * gets all available links
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getAllLinks = async (number=false)=>{
    if (number) return await getCount()
    return await get()
}

//
/**
 * gets all active links
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getActiveLinks = async (number=false)=>{
    if (number) return await getCount("status = 'active'")
    return await get("status = 'active'")
}

//
/**
 * gets all broken links
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getBrokenLinks = async (number=false)=>{
    if (number) return await getCount("status = 'broken'")
    return await get("status = 'broken'")
}

/**
 * gets all broken links
 * @argument {boolean} number determines whether to just send the number of items in storage 
 */
let getPausedLinks = async (number=false)=>{
    if (number) return await getCount("status = 'broken'")
    return await get("status = 'paused'")
}

/**
 * @argument {string} id
 */
let getLinkUsingId = async (linkId)=>{
    return await get(`id = ${dbInstance.escape(linkId)}`)
}

/**
 * @argument {string} slug
 */
let getLinkUsingSlug = async (slug)=>{
    return await get(`slug = ${dbInstance.escape(slug)}`)
}

/**
 * create a new link in the database
 * @argument {Object} linkData object containing link data to be stored... properties include
 * acc_id,title,main_link,alt_link,preview_img,data,type,subtitles,views,downloads,is_alt,slug
 */
let createNewLink = async (linkData)=>{
    if (typeof linkData != 'object') throw TypeError("argument type is not correct, it should be an object")
    //TODO some other checks here to be strict with the type of data coming in
    let date = new Date()
    linkData.status = "active"
    linkData.deleted = false
    let result = await dbInstance.query(`INSERT INTO ${table} (acc_id,title,main_link,alt_link,preview_img,data,type,slug,subtitles,status,updated_at,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, 
    [linkData.acc_id,linkData.title,linkData.main_link,linkData.alt_link,linkData.preview_img,linkData.data,linkData.type,linkData.slug,linkData.subtitles,linkData.status,date.toISOString(),date.toISOString()])
    return result;
}

/**
 * @argument {string} id 
 * @argument {Array | string} column colunms to check. If it is an array, then the `value` argument must also be 
 * an array, same for when it is a string 
 * @argument {Array | string} value type and size must always correlate with `column` argument 
 */
let updateUsingId = async (id,column,value)=>{
    let updateColumnBlacklists = ["id","acc_id","created_at","updated_at","slug"];//coulumns that cannot be updated
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
 * deletes a link using its ID
 */
let deleteUsingId = async (id)=>{
    return await deletion(`id = '${id}'`);
}


/**
 * deletes all broken links
 */
let deleteBrokenLinks = async ()=>{
    return await deletion('status = "broken"')
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
    getActiveLinks,
    getAllLinks,
    getLinkUsingId,
    createNewLink,
    updateUsingId,
    deleteBrokenLinks,
    deleteUsingId,
    customDelete,
    getBrokenLinks,
    getPausedLinks,
    getLinkUsingSlug
}