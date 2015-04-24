package netgroup
{
	import flash.events.NetStatusEvent;
	import flash.net.GroupSpecifier;
	import flash.net.NetConnection;

	public class NetGroupManager
	{

		private const SERVER:String="rtmfp://p2p.rtmfp.net/";
		private const DEVKEY:String="YOUR-DEVELOPER-KEY";
		private var nc:NetConnection;

		public function NetGroupManager()
		{
		}

		private function connect():void
		{
			nc=new NetConnection();
			nc.addEventListener(NetStatusEvent.NET_STATUS, netStatus);
			nc.connect(SERVER + DEVKEY);
		}

		private function setupGroup():void
		{
			var groupspec:GroupSpecifier=new GroupSpecifier("myGroup/g1");
			groupspec.serverChannelEnabled=true;
			groupspec.postingEnabled=true;

			netGroup=new NetGroup(nc, groupspec.groupspecWithAuthorizations());
			netGroup.addEventListener(NetStatusEvent.NET_STATUS, netStatus);
			user="user" + Math.round(Math.random() * 10000);
		}

		private function netStatus(event:NetStatusEvent):void
		{
			trace(event.info.code);
			switch (event.info.code)
			{
				case "NetConnection.Connect.Success":
					setupGroup();
					break;

				case "NetGroup.Connect.Success":
					connected=true;

					break;

				case "NetGroup.Posting.Notify":
					receiveMessage(event.info.message);
					break;
			}
		}

		private var seq:int=0;

		private function sendMessage():void
		{
			var message:Object=new Object();
			message.sender=netGroup.convertPeerIDToGroupAddress(nc.nearID);
			message.user=txtUser.text;
			message.text=txtMessage.text;
			message.sequence=seq++; // *to keep unique
			netGroup.post(message);
			receiveMessage(message);
			txtMessage.text="";
		}

		private function receiveMessage(message:Object):void
		{
			write(message.user + ": " + message.text);
		}

		private function write(txt:String):void
		{
			txtHistory.text+=txt + "n";
		}
	}
}
