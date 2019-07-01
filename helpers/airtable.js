// Airtable
const Airtable = require('airtable')
Airtable.configure({
	apiKey: process.env.AIRTABLE_API_KEY,
})

module.exports = {
	// Get all Airtable posts
	getAirtablePosts: () => {
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
	},

	// Get a single Airtable post
	getAirtablePost: recordId => {
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
	},
}
