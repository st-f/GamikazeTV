package utils
{
	import models.PlaylistEntryVO;

	public class PlaylistUtils
	{

		//public const SECONDS_IN_DAY:int=86400;

		public static function getPlaylistEntries(xml:XML):Vector.<PlaylistEntryVO>
		{
			var ret:Vector.<PlaylistEntryVO>=new Vector.<PlaylistEntryVO>();
			var atom:Namespace=new Namespace("http://www.w3.org/2005/Atom");
			var media:Namespace=new Namespace("http://search.yahoo.com/mrss/");
			var gd:Namespace=new Namespace("http://schemas.google.com/g/2005");
			var yt:Namespace=new Namespace("http://gdata.youtube.com/schemas/2007");
			default xml namespace=atom; // IMPORTANT
			const length:int=xml..entry.length();
			trace("getPlaylist: " + length + " items.");
			var playlistEntry:PlaylistEntryVO
			for (var index:int=0; index < length; index++)
			{
				playlistEntry=new PlaylistEntryVO();
				playlistEntry.id=xml..entry[index]..yt::videoid
				if (xml..entry[index]..media::thumbnail[0])
					playlistEntry.thumbUrl=xml..entry[index]..media::thumbnail[0].@url;
				playlistEntry.title=xml..entry[index]..media::title;
				playlistEntry.description=xml..entry[index]..media::description;
				playlistEntry.duration=int(xml..entry[index]..yt::duration.@seconds);
				playlistEntry.youtubeCommentsURL=xml..entry[index]..gd::comments..@href;
				ret.push(playlistEntry);
			}
			//reset namespace. If not reset, SWFLoader will trigger an error. Intredasting.
			default xml namespace=new Namespace("");
			return ret;
		}

		public static function getPlaylistDuration(playlist:Vector.<PlaylistEntryVO>):int
		{
			var ret:int=0;
			for (var index:int=0; index < playlist.length; index++)
			{
				ret+=playlist[index].duration;
			}
			return ret;
		}

		//returns an array where first item is videoIndex, second is position in video, third is log
		public static function getPlaylistPosition(playlist:Vector.<PlaylistEntryVO>):Array
		{
			var ret:Array=[];
			const playlistDuration:int=PlaylistUtils.getPlaylistDuration(playlist);
			var currentTime:Date=new Date();
			/*currentTime.fullYear=currentTime.fullYearUTC;
			currentTime.month=currentTime.monthUTC;
			currentTime.date=currentTime.dateUTC;
			currentTime.hours=currentTime.hoursUTC;
			currentTime.minutes=currentTime.minutesUTC;*/
			//currentTime.hours+=currentTime.timezoneOffset / 60;
			var currentTimeAtStartOfDay:Date=new Date();
			currentTimeAtStartOfDay.hours=0;
			currentTimeAtStartOfDay.minutes=0;
			currentTimeAtStartOfDay.seconds=0;
			currentTimeAtStartOfDay.milliseconds=0;
			const secondsElapsedInDay:int=currentTime.hoursUTC * 60 * 60 + currentTime.minutesUTC * 60 + currentTime.secondsUTC;
			//const secondsElapsedInDay:int=(currentTime.time - currentTimeAtStartOfDay.time) / 1000;
			const playlistLoopIndexInDay:int=Math.floor(secondsElapsedInDay / playlistDuration);
			const restOfTime:int=secondsElapsedInDay - (playlistLoopIndexInDay * playlistDuration);
			/*trace("currentTime.time: " + currentTime.time);
			trace("currentTimeAtStartOfDay.time: " + currentTimeAtStartOfDay.time);
			trace("currentTime: " + currentTime);
			trace("currentTimeAtStartOfDay: " + currentTimeAtStartOfDay);
			trace("secondsElapsedInDay: " + secondsElapsedInDay);
			trace("playlistDuration: " + playlistDuration);
			trace("playlistIndex: " + playlistLoopIndexInDay);
			trace("restOfTime: " + restOfTime);*/
			var currentCumulativeDuration:int=0;
			for (var index:int=0; index < playlist.length; index++)
			{
				currentCumulativeDuration+=playlist[index].duration;
				//trace(index + "currentCumulativeDuration: " + currentCumulativeDuration + " / restOfTime: " + restOfTime + " duration: " + playlist[index].duration + " title: " + playlist[index].title);
				if (currentCumulativeDuration > restOfTime)
				{
					const returnIndex:int=index;
					const atPosition:int=playlist[index].duration - (currentCumulativeDuration - restOfTime);
					break;
				}
			}
			/*trace("returnIndex: " + returnIndex);
			trace("atPosition: " + atPosition);
			trace("------------------------------------------------");
			trace("Playing: " + playlist[returnIndex].title + " at " + atPosition + " seconds.\n\n");*/
			const log:String="currentTime" + currentTime.toString() + " start with: " + playlist[returnIndex].title + ", atPosition: " + atPosition + " / " + playlist[returnIndex].duration + ", playlistDuration : " + playlistDuration + ", restOfTime: " + restOfTime + ", playlistLoopIndexInDay: " + playlistLoopIndexInDay + ", secondsElapsedInDay: " + secondsElapsedInDay + " timezone offset: " + currentTime.timezoneOffset;
			ret.push(returnIndex);
			ret.push(atPosition);
			ret.push(log);
			return ret;
		}
	}
}
