const util = require('util')

module.exports = async function(conn, subcommand, ...args) {
	const { worksheets } = await util.promisify(conn.getInfo).call(conn)
	const tabs = worksheets.map(({ title, id }) => ({ title, id }))
	if (subcommand === 'get') {
		return tabs.filter(t => t.title === args[0]).pop()
	} else {
		return tabs
	}
}