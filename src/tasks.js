const util = require('util')
const tabs = require('./tabs')
const assert = require('./assert')

const serializer = {
	'Task': { required: true },
	'Deadline': { assertion: assert.date() },
	'Assignee': false,
	'Link': false,
	'Depends On': false,
	'Urgency': { required: true, assertion: assert.int(1,4) },
	'Value': { required: true, assertion: assert.int(1,4) },
	'Created': { assertion: assert.date(), fallback: new Date() },
	'Started': { assertion: assert.date() },
	'Blocked': { assertion: assert.date() },
	'Completed': { assertion: assert.date() },
}

const handler = module.exports = async function(conn, subcommand, ...args) {
	if (subcommand === 'add') {
		return add(conn, ...args)
	}
}

const add = handler.add = async function(conn, ...args) {
	const tab = await tabs(conn, 'get', 'tasks')
	const row = await assert.serializeArgs(serializer, ...args)
	return await util.promisify(conn.addRow).call(conn, tab.id, row)
}