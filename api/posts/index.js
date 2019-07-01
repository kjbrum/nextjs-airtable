const { getAirtablePosts } = require('../../helpers/airtable')
const { serialize } = require('../../helpers/utilities')

module.exports = (req, res) => {
	Promise.resolve(getAirtablePosts())
		.then(data => {
			res.writeHead(200, { 'Content-Type': 'application/json' })
			return res.end(serialize(data))
		})
		.catch(error => {
			console.log(error)
			res.writeHead(200, { 'Content-Type': 'application/json' })
			return res.end(serialize({}))
		})
}
