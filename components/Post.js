import dateFormat from 'dateformat'
import Markdown from 'react-markdown'

class Post extends React.Component {
	render() {
		const { title, content, publish_date } = this.props

		return (
			<div className="post">
				<div className="post-title">{title && <h1>{title}</h1>}</div>

				<div className="post-date">
					{publish_date && (
						<time
							dateTime={dateFormat(publish_date, 'isoDateTime')}
						>
							{dateFormat(publish_date, 'mmmm d, yyyy')}
						</time>
					)}
				</div>

				<div className="post-content">
					{content && <Markdown source={content} />}
				</div>
			</div>
		)
	}
}

export default Post
