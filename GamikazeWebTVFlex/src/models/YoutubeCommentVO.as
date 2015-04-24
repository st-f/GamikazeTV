package models
{
	import mx.utils.ObjectProxy;

	[Bindable]
	public class YoutubeCommentVO
	{
		public var authorUID:String;
		public var authorName:String;
		public var authorThumbURL:String;
		public var category:String;
		public var content:String;
		public var published:String;
		public var title:String
		public var uid:String;
		public var updated:String;
		public var videoid:String;

		public function YoutubeCommentVO(source:ObjectProxy=null)
		{
			if (!source)
				return;
			if (source.content)
			{
				content=source.content;
			}
			if (source.author)
			{
				authorUID=source.author.userId;
				authorName=source.author.name;
				authorThumbURL='http://i4.ytimg.com/i/' + source.authorUID + '/1.jpg'
			}
			if (source.title)
			{
				title=source.title;
			}
			if (source.published)
			{
				published=source.published;
			}
		}
	}
}
