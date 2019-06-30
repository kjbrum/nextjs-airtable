import React from 'react'
import Head from 'next/head'

class Layout extends React.Component {
	render() {
		return (
			<div>
				<Head>
					<meta charSet="utf-8" />
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>

					<title>Next.js + Airtable</title>
				</Head>

				{this.props.children}
			</div>
		)
	}
}

export default Layout
