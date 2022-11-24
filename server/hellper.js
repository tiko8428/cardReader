const fs = require('fs')

function readJsonFile(leng) {
    const data = fs.readFileSync(`./src/json/data/${leng}.json`, 'utf8')
    if (!data) {
        return {}
    }
    const obj = JSON.parse(data) || {}
    return obj
}
function saveJson(lang, data) {
    fs.writeFileSync(`./src/json/data/${lang}.json`, JSON.stringify(data), 'utf8', err => {
        if (err) {
            console.log(`Error writing file: ${err}`)
        } else {
            console.log(`File is written successfully!`)
        }
    })
}

module.exports = {
    readJsonFile,
    saveJson
}