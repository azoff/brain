#!/usr/bin/env node

const GoogleSpreadsheet = require('google-spreadsheet')

function papply(obj, method, ...args) {
	return new Promise((resolve, reject) => {
		args.push(function(err, data){
			if (err) reject(err)
			else resolve(data)
		})
		obj[method](...args)
	})
}

async function authorize() {
	const creds = require(process.argv.slice(-2)[0])
	const sheetId = process.argv.slice(-1)[0]
	const conn = new GoogleSpreadsheet(sheetId)
	await papply(conn, 'useServiceAccountAuth', creds)
	return conn
}

async function main() {
	const conn = await authorize()
	const { worksheets } = await papply(conn, 'getInfo')
	console.log(worksheets)
}

main().catch(console.error)