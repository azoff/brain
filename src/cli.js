#!/usr/bin/env node

const authorize = require('./auth')

async function handler(conn, subcommand, args) {
	return require(`./${subcommand}`).call(conn, conn, ...args)
}

async function main() {
	const conn = await authorize()
	const [ command, ...args ] = process.argv.slice(2)
	return handler(conn, command, args)
}

main().then(console.log).catch(console.error)