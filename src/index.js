#!/usr/bin/env node

const authorize = require('./auth')
const express = require('express')
const assert = require('./assert')
const port = parseInt(process.env.SERVER_PORT || '3000', 10)

function route(app, name) {
	const path = `/${name}`
	app.post(path, async (req, res) => {
		const { add, serializer } = require(`./${name}`)
		const conn = await authorize()
		try {
			console.log('<<<', req.body)
			const input = await assert.serialize(serializer, req.body)
			const row = await add(conn, input)
			console.log('>>>', row)
			res.redirect(path)
		} catch (e) {
			console.error(e)
			res.status(400).send(e.message)
		}
	})
}


const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.static('static'))
route(app, 'tasks')
route(app, 'scores')
route(app, 'compost')
app.listen(port, () => console.log(`server listening on ${port}...`))