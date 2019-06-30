// Access .env variables
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const next = require('next')

// Airtable
const Airtable = require('airtable')
Airtable.configure({
	apiKey: process.env.AIRTABLE_API_KEY,
})

// Server/Next setup
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const app = next({
	dev,
})
const handle = app.getRequestHandler()

const serialize = data => JSON.stringify({ data })

app.prepare()
	.then(() => {
		const server = express()

		// API - All posts
		server.get('/api/posts', (req, res) => {
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
		})

		// API - Single post
		server.get('/api/post/:id', (req, res) => {
			Promise.resolve(getAirtablePost(req.params.id))
				.then(data => {
					res.writeHead(200, { 'Content-Type': 'application/json' })
					return res.end(serialize(data))
				})
				.catch(error => {
					console.log(error)
					res.writeHead(200, { 'Content-Type': 'application/json' })
					return res.end(serialize({}))
				})
		})

		// Single post
		server.get('/post/:id/:slug', (req, res) => {
			const queryParams = {
				id: req.params.id,
				slug: req.params.slug,
			}

			app.render(req, res, '/single', queryParams)
		})

		server.get('*', (req, res) => {
			return handle(req, res)
		})

		// Start server
		server.listen(port, err => {
			if (err) throw err
			console.log(`> Ready on http://localhost:${port}`)
		})
	})
	.catch(ex => {
		console.error(ex.stack)
		process.exit(1)
	})

// Get all Airtable posts
const getAirtablePosts = () => {
	const base = new Airtable.base(process.env.AIRTABLE_BASE_ID)

	return new Promise((resolve, reject) => {
		const allAirtablePosts = []

		base(process.env.AIRTABLE_TABLE_NAME)
			.select({
				sort: [
					{
						field: 'publish_date',
						direction: 'desc',
					},
				],
			})
			.eachPage(
				(records, fetchNextPage) => {
					// Get the fields
					records.forEach(record => {
						const post = {
							id: record.id,
							title: record.get('title'),
							slug: record.get('slug'),
							content: record.get('content'),
							publish_date: record.get('publish_date'),
						}

						// Push post to
						allAirtablePosts.push(post)
					})

					fetchNextPage()
				},
				error => {
					if (error) {
						console.error(error)
						reject({ error })
					}
					resolve(allAirtablePosts)
				},
			)
	})
}

// Get a single Airtable post
const getAirtablePost = recordId => {
	const base = new Airtable.base(process.env.AIRTABLE_BASE_ID)

	return new Promise((resolve, reject) => {
		base(process.env.AIRTABLE_TABLE_NAME).find(
			recordId,
			(error, record) => {
				if (error) {
					console.error(error)
					reject({ error })
				}

				const airtablePost = {
					title: record.get('title'),
					content: record.get('content'),
					publish_date: record.get('publish_date'),
				}

				resolve(airtablePost)
			},
		)
	})
}
