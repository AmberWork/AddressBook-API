require('dotenv').config()
const { UMAIL, UPASS } = process.env
var nodemailer = require('nodemailer')

class Emailer {
	#transporter = nodemailer.createTransport({
		service: 'gmail',
        secure:true,
		auth: {
			user: UMAIL,
			pass: UPASS,
		},
	})

	constructor() {}
	/**
	 * Sends an email to the intended recipient.
	 * @param {string} to - The recipient or recipient array for the email
	 * @param {string} sub - The subject of the email
	 * @param {string} body - The body of the email
	 */
	sendMail(to, sub, body_text,body_html, attachment) {
		let selectedAttachment = [];
		// check if attachment is an array;
		if(attachment){
			if(Array.isArray(attachment)){
				selectedAttachment = attachment;
			}else{
				selectedAttachment.push(attachment);
			}
		}
		
		let mailOptions = {
			to: to,
			from: UMAIL,
			subject: sub,
			text: body_text,
			html: body_html,
			attachments:selectedAttachment,
		}
		this.#transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.error(error)
				throw error
			} else {
				console.log('Email sent: ' + info.response)
			}
		})
	}
}

module.exports = new Emailer()