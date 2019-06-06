const util = require('util')
const GoogleSpreadsheet = require('google-spreadsheet')
const GOOGLE_CREDENTIAL_PATH = process.env.GOOGLE_CREDENTIAL_PATH || `${__dirname}/../google-auth.json`

module.exports = async function() {
	const creds = require(GOOGLE_CREDENTIAL_PATH)
	const sheet_id = process.env.GOOGLE_SHEET_ID || creds.sheet_id
	const conn = new GoogleSpreadsheet(sheet_id)
	await util.promisify(conn.useServiceAccountAuth).call(conn, creds)
	return conn
}