package events
{
	import flash.events.Event;

	import models.YoutubeCommentVO;

	public class ChatEvent extends Event
	{
		public var comment:YoutubeCommentVO;
		public static const CHAT_EVENT:String="onMessageReceived";

		public function ChatEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false, _comment:YoutubeCommentVO=null)
		{
			comment=_comment;
			super(type, bubbles, cancelable);
		}

		// Override clone
		override public function clone():Event
		{
			return new ChatEvent(type, bubbles, cancelable, comment);
		}
	}
}
