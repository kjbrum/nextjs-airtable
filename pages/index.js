import fetch from 'isomorphic-unfetch'

import Layout from '../components/Layout'
import PostBlock from '../components/PostBlock'

class Home extends React.Component {
	constructor() {
		super()

		this.state = {
			airtablePosts: [],
		}
	}

	componentDidMount() {
		const { props } = this

		const transferPosts = new Promise(resolve => {
			const collectPosts = []

			Object.keys(props).map(item => {
				// Filter out other props like 'url', etc.
				if (typeof props[item].id !== 'undefined') {
					collectPosts.push(props[item])
				}
			})

			resolve(collectPosts)
		})

		Promise.resolve(transferPosts).then(data => {
			this.setState({ airtablePosts: data })
		})
	}

	render() {
		const { airtablePosts } = this.state

		// Loading Airtable data
		if (!Array.isArray(airtablePosts) || !airtablePosts.length) {
			return (
				<Layout>
					<p>Loading&hellip;</p>
				</Layout>
			)
		} else {
			return (
				<Layout>
					{airtablePosts.map(post => (
						<PostBlock
							key={post.id}
							id={post.id}
							slug={post.slug}
							title={post.title}
							publish_date={post.publish_date}
						/>
					))}
				</Layout>
			)
		}
	}
}

Home.getInitialProps = async context => {
	const basePath =
		process.env.NODE_ENV === 'development'
			? `http://localhost:${process.env.PORT}`
			: process.env.SITE_URL

	const res = await fetch(`${basePath}/api/posts`)
	const airtablePosts = await res.json()

	return airtablePosts ? airtablePosts.data : {}
}

export default Home
