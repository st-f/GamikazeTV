package models
{

	[Bindable]
	public class _ChatMessageVO
	{
		public var userUID:String;
		public var userService:String; //either "FB" or "YT"
		public var userName:String;
		public var userThumbURL:String;
		public var message:String;

		public function _ChatMessageVO()
		{
		}
	}
}
