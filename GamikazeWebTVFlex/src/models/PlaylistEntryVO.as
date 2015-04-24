package models
{
	import mx.collections.ArrayList;

	public class PlaylistEntryVO
	{
		public var id:String;
		public var thumbUrl:String;
		public var title:String;
		public var description:String;
		public var duration:int;
		public var comments:ArrayList;
		public var youtubeCommentsURL:String;
		public var youtubeComments:ArrayList;

		public function PlaylistEntryVO()
		{
		}
	}
}
