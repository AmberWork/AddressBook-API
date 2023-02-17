const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

/**
 * @description Compiles html and data to create a temple to send, using handlebars
 * @param {string} html This is the name of the html file to compile
 * @param {Object} data This is the data that will be used to substitute values in the html file using handlebars delimmiters
 * @returns {string} Compiled html
 */
function compileHtml(html, data){
    const filepath = path.resolve(__dirname,"../emails/", `${html}.html`);
    const source = fs.readFileSync(filepath, "utf8").toString();
    const template = handlebars.compile(source);
    
    return  htmlToSend = template(data);

}


module.exports = { compileHtml }