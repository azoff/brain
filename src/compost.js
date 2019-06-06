const util = require('util')
const tabs = require('./tabs')
const assert = require('./assert')

const handler = module.exports = async function(conn, subcommand, ...args) {
	if (subcommand === 'add') {
		return add(conn, await assert.serializeArgs(serializer, ...args))
	}
}

const serializer = handler.serializer = {
	'Recorded': { assertion: assert.date(), fallback: new Date() },
	'Idea': { required: true },
	'Urgency': { required: true, assertion: assert.int(1,4) },
	'Value': { required: true, assertion: assert.int(1,4) },
	'Tags': false,
}

const add = handler.add = async function(conn, row) {
	const tab = await tabs(conn, 'get', 'compost')
	return await util.promisify(conn.addRow).call(conn, tab.id, row)
}