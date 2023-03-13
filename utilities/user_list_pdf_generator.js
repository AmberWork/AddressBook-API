const fs = require('fs');
const PDF = require("pdfkit-table");
const path = require("path");

// The document that will be generated


/**
 * 
 * @param {User} data 
 */
async function createPDF(data, pageNumber){
    const doc = new PDF({
        layout: "landscape",
        size: "A4",
    
    });
    

    doc.pipe(fs.createWriteStream(`./exports_user_list.pdf`))
    ;(async function() {
        const table = {
        title: "User List",
        subtitle: `Total Users: ${data.length}  ${(typeof(pageNumber) === "number") ? "Page: "+ pageNumber : ""}`,
        headers: [
            
            {label:"First Name", property:"first_name", headerColor: "#00FF00"},
            {label: "Last Name", property: "last_name", headerColor: "#00FF00"},
            {label:"Email", property:"email", headerColor: "#00FF00"},
            {label: "Home Phone", property: "home_number", headerColor: "#00FF00"},
            {label: "Mobile Phone",property: "mobile_number", headerColor: "#00FF00"},
            {label: "Status", property: "status", headerColor: "#00FF00"}
        ],
        datas: data
    }
    await doc.table(table,{});
     doc.end();
    })();
}


module.exports = createPDF;
