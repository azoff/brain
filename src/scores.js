const util = require('util')
const tabs = require('./tabs')
const assert = require('./assert')

const serializer = {
	'Date': { assertion: assert.date(), fallback: new Date() },
	'Member': { required: true },
	'Score': { required: true, assertion: assert.int(-10,10) },
	'Story': { required: true },
	'Communicated': { assertion: assert.bool() },
	'Recognized': { assertion: assert.bool() },
}

const handler = module.exports = async function(conn, subcommand, ...args) {
	if (subcommand === 'add') {
		return add(conn, ...args)
	}
}

const add = handler.add = async function(conn, ...args) {
	const tab = await tabs(conn, 'get', 'scores')
	const row = await assert.serializeArgs(serializer, ...args)
	return await util.promisify(conn.addRow).call(conn, tab.id, row)
}