import Link from 'next/link'
import dateFormat from 'dateformat'

class Post extends React.Component {
	render() {
		const { id, title, publish_date } = this.props

		const permalink = !!id ? `/post/${id}` : false

		return (
			<div className="post-block">
				<Link href={permalink}>
					<a title={title}>
						{title && <h2>{title}</h2>}
						{publish_date && (
							<time
								dateTime={dateFormat(
									publish_date,
									'isoDateTime',
								)}
							>
								{dateFormat(publish_date, 'mmmm d, yyyy')}
							</time>
						)}
					</a>
				</Link>
			</div>
		)
	}
}

export default Post
