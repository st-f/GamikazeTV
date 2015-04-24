package qs.controls
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.Loader;
	import flash.display.LoaderInfo;
	import flash.events.Event;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.URLRequest;
	import flash.system.ApplicationDomain;

	import mx.controls.listClasses.BaseListData;
	import mx.controls.listClasses.IDropInListItemRenderer;
	import mx.controls.listClasses.IListItemRenderer;
	import mx.core.EdgeMetrics;
	import mx.core.IDataRenderer;
	import mx.core.UIComponent;
	import mx.events.FlexEvent;
	
	import mx.rpc.soap.LoadEvent;
	import mx.skins.RectangularBorder;
	
	import qs.caching.ContentCache;

	/**
	 *  Dispatched when the <code>data</code> property changes.
	 *
	 *  <p>When you use a component as an item renderer,
	 *  the <code>data</code> property contains the data to display.
	 *  You can listen for this event and update the component
	 *  when the <code>data</code> property changes.</p>
	 * 
	 *  @eventType mx.events.FlexEvent.DATA_CHANGE
	 */
	[Event(name="dataChange", type="mx.events.FlexEvent")]

	/**
	 *  Dispatched when content loading is complete.
	 *
	 *  <p>This event is dispatched regardless of whether the load was triggered
	 *  by an autoload or an explicit call to the <code>load()</code> method.</p>
	 *
	 *  @eventType flash.events.Event.COMPLETE
	 */
	[Event(name="complete", type="flash.events.Event")]

	/**
	 *  Dispatched when a network request is made over HTTP 
	 *  and Flash Player can detect the HTTP status code.
	 * 
	 *  @eventType flash.events.HTTPStatusEvent.HTTP_STATUS
	 */
	[Event(name="httpStatus", type="flash.events.HTTPStatusEvent")]

	/**
	 *  Dispatched when the properties and methods of a loaded SWF file 
	 *  are accessible. The following two conditions must exist
	 *  for this event to be dispatched:
	 * 
	 *  <ul>
	 *    <li>All properties and methods associated with the loaded 
	 *    object and those associated with the control are accessible.</li>
	 *    <li>The constructors for all child objects have completed.</li>
	 *  </ul>
	 * 
	 *  @eventType flash.events.Event.INIT
	 */
	[Event(name="init", type="flash.events.Event")]

	/**
	 *  Dispatched when an input/output error occurs.
	 *  @see flash.events.IOErrorEvent
	 *
	 *  @eventType flash.events.IOErrorEvent.IO_ERROR
	 */
	[Event(name="ioError", type="flash.events.IOErrorEvent")]

	/**
	 *  Dispatched when a network operation starts.
	 * 
	 *  @eventType flash.events.Event.OPEN
	 */
	[Event(name="open", type="flash.events.Event")]

	/**
	 *  Dispatched when content is loading.
	 *
	 *  <p>This event is dispatched regardless of whether the load was triggered
	 *  by an autoload or an explicit call to the <code>load()</code> method.</p>
	 *
	 *  <p><strong>Note:</strong> 
	 *  The <code>progress</code> event is not guaranteed to be dispatched.
	 *  The <code>complete</code> event may be received, without any
	 *  <code>progress</code> events being dispatched.
	 *  This can happen when the loaded content is a local file.</p>
	 *
	 *  @eventType flash.events.ProgressEvent.PROGRESS
	 */
	[Event(name="progress", type="flash.events.ProgressEvent")]

	/**
	 *  Dispatched when a security error occurs while content is loading.
	 *  For more information, see the Flash Player SecurityErrorEvent class.
	 *
	 *  @eventType flash.events.SecurityErrorEvent.SECURITY_ERROR
	 */
	[Event(name="securityError", type="flash.events.SecurityErrorEvent")]

	/**
	 *  Dispatched when a loaded object is removed, 
	 *  or when a second load is performed by the same control 
	 *  and the original content is removed prior to the new load beginning.
	 * 
	 *  @eventType flash.events.Event.UNLOAD
	 */
	[Event(name="unload", type="flash.events.Event")]

	[Effect(name="completeEffect", event="complete")]
	
	[DefaultBindingProperty(source="percentLoaded", destination="source")]
	[DefaultBindingProperty(source="progress", destination="source")]
	[DefaultTriggerEvent("complete")]

	[Style(name="backgroundAlpha", type="Number", inherit="no")]
	[Style(name="backgroundColor", type="uint", format="Color", inherit="no")]
	[Style(name="borderColor", type="uint", format="Color", inherit="no")]
	[Style(name="borderSides", type="String", inherit="no")]
	[Style(name="borderStyle", type="String", enumeration="inset,outset,solid,none", inherit="no")]
	[Style(name="borderThickness", type="Number", format="Length", inherit="no")]
	[Style(name="brokenImageSkin", type="Class", inherit="no")]
	[Style(name="cornerRadius", type="Number", format="Length", inherit="no")]
	[Style(name="dropShadowEnabled", type="Boolean", inherit="no")]
	[Style(name="dropShadowColor", type="uint", format="Color", inherit="yes")]
	[Style(name="shadowDirection", type="String", enumeration="left,center,right", inherit="no")]
	[Style(name="shadowDistance", type="Number", format="Length", inherit="no")]
	[Style(name="dropShadowColor", type="uint", format="Color", inherit="yes")]
	[Style(name="shadowDirection", type="String", enumeration="left,center,right", inherit="no")]
	[Style(name="shadowDistance", type="Number", format="Length", inherit="no")]
	
	[Style(name="horizontalAlign", type="String", enumeration="left,center,right", inherit="no")]
	[Style(name="verticalAlign", type="String", enumeration="bottom,middle,top", inherit="no")]

	public class SuperImage extends UIComponent implements IDataRenderer, IDropInListItemRenderer, IListItemRenderer
	{
		
		public function SuperImage():void
		{
			super();
			
			tabChildren = false;
			tabEnabled = true;
			
			addEventListener(FlexEvent.INITIALIZE, initializeHandler);
			
			showInAutomationHierarchy = true;
		}
	
		private var _source:*;
		private var _oldSource:*;
		private var _sourceChanged:Boolean = false;
		private var _sourceSet:Boolean = false;
		private var _content:DisplayObject;
		private var _cacheName:String = "";
		private var _maintainAspectRatio:Boolean = true;
		private var _border:RectangularBorder;
		private var _loadedFromCache:Boolean = false;
		private var _autoLoad:Boolean = true;
		private var _brokenImage:Boolean = false;
		private var _bytesLoaded:Number = NaN;
		private var _bytesTotal:Number = NaN;
		private var _data:Object;
		private var _listData:BaseListData;

		/**
		 *  A flag that indictes whether content starts loading automatically
		 *  or waits for a clal to the <code>load()</code> method.
		 *  If <code>true</code>, the content loads automatically. 
		 *  If <code>false</code>, you must call the <code>load()</code> method.
		 *
		 *  @default true
		 */
		[Bindable("autoLoadChanged")]
		[Inspectable(defaultValue="true")]
		 public function get autoLoad():Boolean
		{
			return _autoLoad;
		}
		public function set autoLoad(value:Boolean):void
		{
			if (_autoLoad != value)
			{
				_autoLoad = value;
		
				_sourceChanged = true;
		
				invalidateProperties();
				invalidateSize();
				invalidateDisplayList();
		
				dispatchEvent(new Event("autoLoadChanged"));
			}
		}
		
		/**
		 *  The number of bytes of the SWF or image file already loaded.
		 */
		[Bindable("progress")]
		public function get bytesLoaded():Number
		{
			return _bytesLoaded;
		}
		
		/**
		 *  The total size of the SWF or image file.
		 */
		[Bindable("complete")]
		public function get bytesTotal():Number
		{
			return _bytesTotal;
		}

		/**
		 *  This property contains the object that represents
		 *  the content that was loaded in the control. 
		 */
		public function get content():DisplayObject
		{
			if (_content is Loader)
				return Loader(_content).content;
		
			return _content;
		}
		
		/**
		 *  Height of the scaled content loaded by the control, in pixels. 
		 *  Note that this is not the height of the control itself, but of the 
		 *  loaded content. Use the <code>height</code> property of the control
		 *  to obtain its height.
		 *
		 *  <p>The value of this property is not final when the <code>complete</code> event is triggered. 
		 *  You can get the value after the <code>updateComplete</code> event is triggered.</p>
		 *
		 *  @default NaN
		 */
		public function get contentHeight():Number
		{
			return _content ? _content.height : NaN;
		}
		
		/**
		 *  Width of the scaled content loaded by the control, in pixels. 
		 *  Note that this is not the width of the control itself, but of the 
		 *  loaded content. Use the <code>width</code> property of the control
		 *  to obtain its width.
		 *
		 *  <p>The value of this property is not final when the <code>complete</code> event is triggered. 
		 *  You can get the value after the <code>updateComplete</code> event is triggered.</p>
		 *
		 *  @default NaN
		 */
		public function get contentWidth():Number
		{
			return _content ? _content.width : NaN;
		}

		[Bindable]
		public function set maintainAspectRatio(value:Boolean):void
		{
			_maintainAspectRatio = value;
			invalidateSize();
		}
		
		public function get maintainAspectRatio():Boolean
		{
			return _maintainAspectRatio;
		}
	
		/**  
		 * The image cache to use.  You can use this to segment different groups of SuperImages
		 * into different caches, each with their own caching rules and limits. The default value is the empty
		 * string, which is the global cache.  a value of null tells the SuperImage not to cache at all.
		*/
		[Bindable] 
		public function set cacheName(value:String):void
		{
			_cacheName = value;
		}
		
		public function get cacheName():String
		{
			return _cacheName;
		}

		/**
		 *  The <code>data</code> property lets you pass a value to the component
		 *  when you use it in an item renderer or item editor. 
		 *  You typically use data binding to bind a field of the <code>data</code> 
		 *  property to a property of this component.
		 *
		 *  <p>When you use the control as a drop-in item renderer, Flex 
		 *  will use the <code>listData.label</code> property, if it exists,
		 *  as the value of the <code>source</code> property of this control, or
		 *  use the <code>data</code> property as the <code>source</code> property.</p>
		 *
		 *  @default null
		 *  @see mx.core.IDataRenderer
		 */
		[Bindable("dataChange")]
		[Inspectable(environment="none")]
		public function get data():Object
		{
			return _data;
		}
		
		public function set data(value:Object):void
		{
			_data = value;
			
			if (!_sourceSet)
			{
				source = listData ? listData.label : data;
				_sourceSet = false;
			}
		
			dispatchEvent(new FlexEvent(FlexEvent.DATA_CHANGE));
		}

		/**
		 *  When a component is used as a drop-in item renderer or drop-in
		 *  item editor, Flex initializes the <code>listData</code> property
		 *  of the component with the appropriate data from the List control.
		 *  The component can then use the <code>listData</code> property
		 *  to initialize the other properties of the drop-in
		 *  item renderer
		 *
		 *  <p>You do not set this property in MXML or ActionScript;
		 *  Flex sets it when the component is used as a drop-in item renderer
		 *  or drop-in item editor.</p>
		 *
		 *  @default null
		 *  @see mx.controls.listClasses.IDropInListItemRenderer
		 */
		[Bindable("dataChange")]
		[Inspectable(environment="none")]
		public function get listData():BaseListData
		{
			return _listData;
		}
		
		public function set listData(value:BaseListData):void
		{
			_listData = value;
		}

		/** 
		 * What to display. Options are:  Bitmap, BitmapData, url, URLRequest, 
		 * or a Class or ClassName that when instantiated matches one of the other
		 * options.
		*/
		[Bindable("sourceChanged")]
		[Inspectable(category="General", defaultValue="", format="File")]
		public function set source(value:*):void
		{
			_sourceSet = true;
			
			if (value != _source)
			{
				_source = value;
		
				_sourceChanged = true;
	
				invalidateProperties();
				invalidateSize();
				invalidateDisplayList()
	
				dispatchEvent(new Event("sourceChanged"));
			}
		}
		
		public function get source():*
		{
			return _source;
		}
		
		public function load(url:Object = null):void
		{
			if (url)
				_source = url;

			if (_content is Loader)
			{
				Loader(_content).contentLoaderInfo.removeEventListener(Event.COMPLETE,						contentLoaderInfo_completeEventHandler);
				Loader(_content).contentLoaderInfo.removeEventListener(HTTPStatusEvent.HTTP_STATUS,			contentLoaderInfo_httpStatusEventHandler);
				Loader(_content).contentLoaderInfo.removeEventListener(Event.INIT,							contentLoaderInfo_initEventHandler);
				Loader(_content).contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR,				contentLoaderInfo_ioErrorEventHandler);
				Loader(_content).contentLoaderInfo.removeEventListener(Event.OPEN,							contentLoaderInfo_openEventHandler);
				Loader(_content).contentLoaderInfo.removeEventListener(ProgressEvent.PROGRESS,				contentLoaderInfo_progressEventHandler);
				Loader(_content).contentLoaderInfo.removeEventListener(SecurityErrorEvent.SECURITY_ERROR,	contentLoaderInfo_securityErrorEventHandler);
				Loader(_content).contentLoaderInfo.removeEventListener(Event.UNLOAD,						contentLoaderInfo_unloadEventHandler);
			}	

			if (_content != null)
			{
				// remove any old content.
				removeChild(_content);					
			}
			_loadedFromCache = false;
			_brokenImage = false;
			_content = null;
			
			// now examine our source property and convert it into something we can render.
			var newSource:* = _source;
			
			if (newSource is XML || newSource is XMLList)
			{
				newSource = newSource.toString();
			}
			
			if (newSource is String)
			{
				// first check and see if its the name of a class.
				try {
					var c:Class = (ApplicationDomain.currentDomain.getDefinition(newSource) as Class);
					if (c != null)
						newSource = c;
						
				} catch(e:Error) {}
			}
			
			//TODO:  Keep working on this to display and resize SWF's that are loaded
			if (newSource is Class)
			{
				// if it's a class, instantiate it.
				newSource = new newSource();
				
				_oldSource = newSource;
				
				_content = newSource;
				addChild(newSource);
				
				invalidateSize();
				invalidateDisplayList();
				return;
			}
			
			// if it's bitmap or bitmap data, we know how to render that.
			if (newSource is Bitmap)
			{
				_content = newSource;
			}
			else if (newSource is BitmapData)
			{
				_content = new Bitmap(newSource);
			}
			else if (newSource is String || newSource is URLRequest)
			{
				// it's an url that needs to be loaded.	
				var cachedContent:DisplayObject;

				if (_cacheName == null)
				{
					// if we don't have a cache, just load it up into a loader.
					cachedContent = new Loader();
					Loader(cachedContent).load((newSource is URLRequest)? newSource:new URLRequest(newSource));
				}
				else
				{
					// we have a cache, so delegate to the cache to do the loading.
					cachedContent = ContentCache.getCache(_cacheName).getContent(newSource);
				}

				_loadedFromCache = true;
				
				// now the cache can give us back different types of display objects. If they gave us back a Loader,
				// and the loader is actively loading, we need to listen to it to know when its completed.
				if (cachedContent is Loader)
				{
					var l:Loader = Loader(cachedContent);
					
					if (l.contentLoaderInfo.bytesTotal == 0 || (l.contentLoaderInfo.bytesLoaded < l.contentLoaderInfo.bytesTotal))
					{
						l.contentLoaderInfo.addEventListener(Event.COMPLETE,					contentLoaderInfo_completeEventHandler);
						l.contentLoaderInfo.addEventListener(HTTPStatusEvent.HTTP_STATUS,		contentLoaderInfo_httpStatusEventHandler);
						l.contentLoaderInfo.addEventListener(Event.INIT,						contentLoaderInfo_initEventHandler);
						l.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR,				contentLoaderInfo_ioErrorEventHandler);
						l.contentLoaderInfo.addEventListener(Event.OPEN,						contentLoaderInfo_openEventHandler);
						l.contentLoaderInfo.addEventListener(ProgressEvent.PROGRESS,			contentLoaderInfo_progressEventHandler);
						l.contentLoaderInfo.addEventListener(SecurityErrorEvent.SECURITY_ERROR,	contentLoaderInfo_securityErrorEventHandler);
						l.contentLoaderInfo.addEventListener(Event.UNLOAD,						contentLoaderInfo_unloadEventHandler);
					}
				}
				
				_content = cachedContent;
			}
			
			_oldSource = newSource;
			
			if (_content != null)
				addChild(_content);
				
			invalidateSize();
			invalidateDisplayList();
		}
	
		override protected function createChildren():void
		{
			createBorderSkin();
		}
	
		private function createBorderSkin():void
		{
			var borderClass:Class = getStyle("borderSkin");
			if (borderClass != null)
			{
				_border  = new borderClass();
				_border.styleName = this;
				addChild(_border);
			}
		}
	
		override protected function commitProperties():void
		{
			super.commitProperties();

			if (_sourceChanged)
			{
				_sourceChanged = false;
	
				if (_autoLoad)
	                load(_source);
			}
		}
		
		override protected function measure():void
		{
			var contentWidth:Number;
			var contentHeight:Number;
	
			if (_content == null)
			{
				// we have no content...if we also don't have source, just set our size to zero.
				if (_source == null || _source == "")
				{
					contentWidth = 0;
					contentHeight = 0;
				}
			}
			else
			{
				contentWidth = 0;
				contentHeight = 0;
				var metrics:EdgeMetrics;
				
				if (_border != null)
				{
					// if we have a border, first find out how big our border is.
					metrics = _border.borderMetrics;
				}
	
				if (_content is Loader)
				{
					try {
						// we have a loader...ask the loader how big his content is. It's possible he doesn't know yet.
						contentWidth = Loader(_content).contentLoaderInfo.width;
						contentHeight = Loader(_content).contentLoaderInfo.height;
					} catch(e:Error) {}
				}
				else
				{
					// assuming that we only contain simple flash display objects, their 'measured' size is their unscaled width/height.
					contentWidth = _content.width / _content.scaleX;
					contentHeight = _content.height / _content.scaleY;
				}
				
				if (contentWidth > 0 && contentHeight > 0)
				{
					// now adjust to maintain aspect ratio.
					if (_maintainAspectRatio)
					{
						if (!isNaN(percentWidth))
						{
							// if we have a percent width
							if (isNaN(percentHeight) && isNaN(explicitHeight))
							{
								// and no explicit size, assume that our current width is our final width, and 
								// report an appropriate height. If it's not our final width, we'll come back through this codepath later to adjust.
								contentHeight = (unscaledWidth - metrics.left - metrics.right)/contentWidth * contentHeight;
							}
						}
						else if (!isNaN(percentHeight))
						{
							// if we have a percent height
							if (isNaN(percentWidth) && isNaN(explicitWidth))
							{
								// and no explciitly controled width, report an appropriate width. Again, if our height changes, we'll deal with it later.
								contentWidth = (unscaledHeight - metrics.top - metrics.bottom)/contentHeight * contentWidth;
							}
						}
						
						// if we have an explicit width or height but not both, we're pretty sure we're going to end up at that width/height, and 
						// the other dimension will be whatever our measured size is.  So report our measured sizes based on that explicit size.
						if (!isNaN(explicitWidth))
						{
							if (isNaN(explicitHeight))
							{
								contentHeight = (explicitWidth-metrics.left - metrics.right)/contentWidth * contentHeight;
							}
						}
						else if (!isNaN(explicitHeight))
						{
							contentWidth = (explicitHeight - metrics.top - metrics.bottom)/contentHeight * contentWidth;
						}
					}
				}				
			}	
			
			if (!isNaN(contentWidth) || !isNaN(contentHeight))
			{		
				// add in the size of our border.
				if (metrics != null)
				{
					contentHeight += metrics.top + metrics.bottom;
					contentWidth += metrics.left + metrics.right;
				}
				
				measuredWidth = contentWidth;
				measuredHeight = contentHeight;
			}
		}
		
		override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
		{
			if (_content != null)
			{
				var borderMetrics:EdgeMetrics;
				var contentWidth:Number = unscaledWidth;
				var contentHeight:Number = unscaledHeight;
				
				if (_border != null)
				{
					_border.visible = true;
					borderMetrics = _border.borderMetrics;
					contentWidth -= borderMetrics.left + borderMetrics.right;
					contentHeight -= borderMetrics.top + borderMetrics.bottom;
				}
				
				if (_maintainAspectRatio)
				{
					var myAR:Number = contentWidth/contentHeight;			
					var contentAR:Number = (_content.width / _content.scaleX) / (_content.height / _content.scaleY);
					
					if (!isNaN(contentAR))
					{						
						
						if (contentAR > myAR)
						{
							_content.width = contentWidth;
							_content.height = contentHeight = contentWidth / contentAR;						
						}
						else
						{
							_content.height = contentHeight;
							_content.width = contentWidth = contentHeight * contentAR;
						}
					
						if (!isNaN(percentWidth))
						{
							if (isNaN(percentHeight) && isNaN(explicitHeight))
							{
								if (myAR != contentAR)
									invalidateSize();
							}
						}
						else if (!isNaN(percentHeight))
						{
							if (isNaN(percentWidth) && isNaN(explicitWidth))
							{
								if (myAR != contentAR)
									invalidateSize();								
							}
						}
					}
				}
				else
				{
					_content.width = contentWidth;
					_content.height = contentHeight;
				}				
				
				if (_border != null)
				{
					_content.x = (unscaledWidth - _content.width) * getHorizontalAlignValue();
					_content.y = (unscaledHeight - _content.height) * getVerticalAlignValue();
					
					_border.setActualSize(contentWidth + borderMetrics.left + borderMetrics.right,
					                      contentHeight + borderMetrics.top + borderMetrics.bottom);
					_border.x = _content.x - borderMetrics.left;			
					_border.y = _content.y - borderMetrics.top;	
				}
				else
				{
					_content.x = (unscaledWidth - _content.width) * getHorizontalAlignValue();
					_content.y = (unscaledHeight - _content.height) * getVerticalAlignValue();
				}
			}
			else
			{
				if (_border != null)
					_border.visible = false;
			}
		}
		
		private function getHorizontalAlignValue() : Number
		{
			var horizontalAlign:String = getStyle("horizontalAlign");
		
			if (horizontalAlign == "left")
				return 0;
			else if (horizontalAlign == "right")
				return 1;
		
			// default = center
			return 0.5;
		}

		private function getVerticalAlignValue() : Number
		{
			var verticalAlign:String = getStyle("verticalAlign");
		
			if (verticalAlign == "top")
				return 0;
			else if (verticalAlign == "bottom")
				return 1;
		
			// default = middle
			return 0.5;
		}
		
		private function initializeHandler(event:FlexEvent):void
		{
			if (_sourceChanged)
			{
				_sourceChanged = false;
				
				if (_autoLoad)
		            load(_source);
			}
		}

		private function contentLoaderInfo_completeEventHandler(event:Event):void
		{
			// Sometimes we interrupt a load to start another load after
			// the bytes are in but before the complete event is dispatched.
			// In this case we get an IOError when we call close()
			// and the complete event is dispatched anyway.
			// Meanwhile we've started the new load.
			// We ignore the complete if the contentHolder doesn't match
			// because that means it was for the old content
			if (LoaderInfo(event.target).loader != _content)
				return;
		
			dispatchEvent(event);
		
			invalidateSize();
			invalidateDisplayList();
		}

		private function contentLoaderInfo_httpStatusEventHandler(event:HTTPStatusEvent):void
		{
			dispatchEvent(event);
		}
	
		private function contentLoaderInfo_initEventHandler(event:Event):void
		{
			dispatchEvent(event);
		}

		private function contentLoaderInfo_ioErrorEventHandler(event:IOErrorEvent):void
		{
			// Error loading content, show the broken image.
			source = getStyle("brokenImageSkin");
		
			// Force the load of the broken image skin here, since that will
			// clear the brokenImage flag. After the image is loaded we set
			// the brokenImage flag.
			load();
			_sourceChanged = false;
			_brokenImage = true;
		
			// Redispatch the event from this SWFLoader,
			// but only if there is a listener.
			// If there are no listeners for ioError event,
			// a runtime error is displayed.
			if (hasEventListener(event.type))
				dispatchEvent(event);
		}

		private function contentLoaderInfo_openEventHandler(event:Event):void
		{
			dispatchEvent(event);
		}
	
		private function contentLoaderInfo_progressEventHandler(event:ProgressEvent):void
		{
			_bytesTotal = event.bytesTotal;
			_bytesLoaded = event.bytesLoaded;
		
			dispatchEvent(event);
		}

		private function contentLoaderInfo_securityErrorEventHandler(event:SecurityErrorEvent):void
		{
			dispatchEvent(event);
		}

		private function contentLoaderInfo_unloadEventHandler(event:Event):void
		{
			dispatchEvent(event);
		}
	}
}

