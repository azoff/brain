const util = require('util')
const GoogleSpreadsheet = require('google-spreadsheet')
const GOOGLE_CREDENTIAL_PATH = process.env.GOOGLE_CREDENTIAL_PATH || "google-auth.json"
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID

module.exports = async function() {
	const creds = require(GOOGLE_CREDENTIAL_PATH)
	const conn = new GoogleSpreadsheet(GOOGLE_SHEET_ID)
	await util.promisify(conn.useServiceAccountAuth).call(conn, creds)
	return conn
}