const util = require('util')
const tabs = require('./tabs')
const assert = require('./assert')

const handler = module.exports = async function(conn, subcommand, ...args) {
	if (subcommand === 'add') {
		const row = await assert.serializeArgs(serializer, ...args)
		return add(conn, row)
	}
}

const serializer = handler.serializer = {
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

const add = handler.add = async function(conn, row) {
	const tab = await tabs(conn, 'get', 'tasks')
	row['Priority'] = priorityFormula(tab.rowCount+1)
	row['Status'] = statusFormula(tab.rowCount+1)
	row['Started'] = row['Started'] || startedFormula(tab.rowCount+1)
	return await util.promisify(conn.addRow).call(conn, tab.id, row)
}

const priorityFormula = row =>
	`=AVERAGE(((365-(IF(ISDATE(B${row}),B${row}-TODAY(),365)))/365),(G${row}/4),(F${row}/4),(COUNTIF($E$2:$E,A${row})/(COUNTIF($A$2:$A,"<>")-1)))`

const statusFormula = row =>
	`=IF(L${row}<>"","completed", IF(K${row}<>"","blocked", IF(J${row}<>"","in flight", IF(I${row}<>"","on deck",""))))`

const startedFormula = row =>
	`=IF(K${row}<>"",K${row},IF(L${row}<>"",L${row},""))`