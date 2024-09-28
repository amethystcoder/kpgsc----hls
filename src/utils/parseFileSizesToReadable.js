/**
 * converts byte sizes to human readable sizes like `kb`,`mb`,`gb` and `tb`
 * @param {number} size 
 */
function parseFileSizeToReadable(size) {
    if (size < 1000) return `${size}B`
    if (size < 1000**2) return `${Math.round(size/1000)}kB`
    if (size < 1000**3) return `${Math.round(size/1000**2)}mB`
    if (size < 1000**4) return `${Math.round(size/1000**3)}GB`
    if (size < 1000**5) return `${Math.round(size/1000**4)}TB`
    if (size > 1000**5) return `${Math.round(size/1000**4)}TB`
    return `${size}B`
}

module.exports = parseFileSizeToReadable