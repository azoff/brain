#!/usr/bin/env node

const util = require('util')
const GoogleSpreadsheet = require('google-spreadsheet')
const GOOGLE_CREDENTIAL_PATH = process.env.GOOGLE_CREDENTIAL_PATH || `${__dirname}/../google-auth.json`
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID

async function authorize() {
	const creds = require(GOOGLE_CREDENTIAL_PATH)
	const conn = new GoogleSpreadsheet(GOOGLE_SHEET_ID)
	await util.promisify(conn.useServiceAccountAuth).call(conn, creds)
	return conn
}

async function handler(conn, subcommand, args) {
	return require(`./${subcommand}`).call(conn, conn, ...args)
}

async function main() {
	const conn = await authorize()
	const [ command, ...args ] = process.argv.slice(2)
	return handler(conn, command, args)
}

main().then(console.log).catch(console.error)