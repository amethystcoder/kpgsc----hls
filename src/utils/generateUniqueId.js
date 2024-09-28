/**
 * @param {number} amount the number of characters to be in the id
 * @returns {string} A unique id
 */
function generateId(amount) {
    //We might need to generate a way to make the id more random
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let result = ``
    for (let index = 0; index < amount; index++) {
       result += characters[Math.floor(Math.random() * (characters.length - 1))] 
    }
    return result
}

module.exports = generateId