const snakeCase = require('snake-case')

// process.env.SERIALIZER_ENABLE_READLINE=1
// process.env.SERIALIZER_PROMPT_OPTIONALS=1

const assert = module.exports = (cond, msg = 'assertion failed') => {
	if (!cond) throw new Error(msg)
}

assert.date = (msg = 'date value error') => {
	return val => {
		try {
			return new Date(val).toISOString().split('T')[0]
		} catch (e) {
			assert(false, `${msg}: ${e}`)
		}
	}
}

assert.int = (min, max, msg = 'int value error') => {
	return val => {
		try {
			const i = parseInt(val, 10)
			if (min !== undefined)
				assert(i>=min, `${msg}: ${i} < ${min}`)
			if (max !== undefined)
				assert(i<=max, `${msg}: ${i} > ${max}`)
			return i.toString()
		} catch (e) {
			assert(false, `${msg}: ${e}`)
		}
	}
}

const serialize = assert.serialize = async (serializer, obj) => {
	const serialized = {}
	for (let [key, rules] of Object.entries(serializer)) {
		let value = obj[snakeCase(key)]
		if (value == null && process.env.SERIALIZER_ENABLE_READLINE)
			if (rules && rules.required || process.env.SERIALIZER_PROMPT_OPTIONALS) {
				value = await new Promise((resolve, reject) => {
					const rl = require('readline').createInterface({
					  input: process.stdin,
					  output: process.stdout
					})
					rl.question(`${key}? `, answer => {
						rl.close()
						resolve(answer === '' ? undefined : answer)
					})
				})
			}
		if (rules !== false) {
			let aerr = null
			if (rules.assertion) {
				try {
					value = rules.assertion(value)
				} catch (e) {
					aerr = e
					value = undefined
					if (rules.fallback) {
						value = rules.assertion(rules.fallback)
					}
				}
			}
			if (value == null) {
				if (rules.required)
					assert(false, aerr ? aerr.message : `${key} is a required value`)
			}
		}
		serialized[key] = value
	}
	return serialized
}

assert.serializeArgs = (serializer, ...args) => {
	const obj = {}
	args.forEach(arg => {
		const [key, value] = arg.split('=')
		obj[snakeCase(key)] = value
	})
	return serialize(serializer, obj)
}
