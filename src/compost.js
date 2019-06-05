const util = require('util')
const tabs = require('./tabs')
const assert = require('./assert')

const serializer = {
	'Recorded': { assertion: assert.date(), fallback: new Date() },
	'Idea': { required: true },
	'Urgency': { required: true, assertion: assert.int(1,4) },
	'Value': { required: true, assertion: assert.int(1,4) },
	'Tags': false,
}

const handler = module.exports = async function(conn, subcommand, ...args) {
	if (subcommand === 'add') {
		return add(conn, ...args)
	}
}

const add = handler.add = async function(conn, ...args) {
	const tab = await tabs(conn, 'get', 'compost')
	const row = await assert.serializeArgs(serializer, ...args)
	return await util.promisify(conn.addRow).call(conn, tab.id, row)
}