package utils
{

	public class LogUtils
	{

		/**
		 * Centralisation of all trace methods, and prefix this with a little
		 * timestamp
		 */
		static public function log(msg:String):void
		{
			trace(timestamp + '\t' + msg);
		}


		/**
		 * Useful function for logging, formatting the current time in a easy
		 * to read line.
		 * @return a ':' delimited time string like 12:34:56:789
		 *
		 */
		static public function get timestamp():String
		{
			var now:Date=new Date();
			var arTimestamp:Array=[now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()];
			return arTimestamp.join(':');
		}

	}
}
