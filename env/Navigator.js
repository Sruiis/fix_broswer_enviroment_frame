// Navigator对象
Navigator = function Navigator(){return FaustVM.toolsFunc.throwError("TypeError", "Illegal constructor")}
FaustVM.toolsFunc.safeProto(Navigator, "Navigator");
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "vendorSub", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "vendorSub_get", arguments, '')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "productSub", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "productSub_get", arguments, '20030107')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "vendor", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "vendor_get", arguments, 'Google Inc.')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "maxTouchPoints", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "maxTouchPoints_get", arguments, 10)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "scheduling", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "scheduling_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "userActivation", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "userActivation_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "doNotTrack", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "doNotTrack_get", arguments, null)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "geolocation", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "geolocation_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "connection", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "connection_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "plugins", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "plugins_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "mimeTypes", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mimeTypes_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "pdfViewerEnabled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "pdfViewerEnabled_get", arguments, true)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "webkitTemporaryStorage", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webkitTemporaryStorage_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "webkitPersistentStorage", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webkitPersistentStorage_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "hardwareConcurrency", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "hardwareConcurrency_get", arguments, 12)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "cookieEnabled", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "cookieEnabled_get", arguments, true)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "appCodeName", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "appCodeName_get", arguments, 'Mozilla')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "appName", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "appName_get", arguments, 'Netscape')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "appVersion", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "appVersion_get", arguments, '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "platform", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "platform_get", arguments, 'Win32')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "product", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "product_get", arguments, 'Gecko')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "userAgent", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "userAgent_get", arguments, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "language", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "language_get", arguments, 'zh-CN')}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "languages", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "languages_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "onLine", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "onLine_get", arguments, true)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "webdriver", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webdriver_get", arguments, false)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "getGamepads", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "getGamepads", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "javaEnabled", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "javaEnabled", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "sendBeacon", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "sendBeacon", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "vibrate", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "vibrate", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "bluetooth", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "bluetooth_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "clipboard", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "clipboard_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "credentials", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "credentials_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "keyboard", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "keyboard_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "managed", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "managed_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "mediaDevices", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mediaDevices_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "storage", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "storage_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "serviceWorker", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "serviceWorker_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "virtualKeyboard", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "virtualKeyboard_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "wakeLock", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "wakeLock_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "deviceMemory", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "deviceMemory_get", arguments, 8)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "ink", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "ink_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "hid", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "hid_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "locks", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "locks_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "mediaCapabilities", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mediaCapabilities_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "mediaSession", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "mediaSession_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "permissions", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "permissions_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "presentation", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "presentation_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "serial", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "serial_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "usb", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "usb_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "windowControlsOverlay", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "windowControlsOverlay_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "xr", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "xr_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "userAgentData", {configurable:true, enumerable:true, get:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "userAgentData_get", arguments)}, set:undefined});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "canShare", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "canShare", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "share", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "share", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "clearAppBadge", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "clearAppBadge", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "getBattery", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "getBattery", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "getUserMedia", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "getUserMedia", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "requestMIDIAccess", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "requestMIDIAccess", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "requestMediaKeySystemAccess", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "requestMediaKeySystemAccess", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "setAppBadge", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "setAppBadge", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "webkitGetUserMedia", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "webkitGetUserMedia", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "getInstalledRelatedApps", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "getInstalledRelatedApps", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "registerProtocolHandler", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "registerProtocolHandler", arguments)}});
FaustVM.toolsFunc.defineProperty(Navigator.prototype, "unregisterProtocolHandler", {configurable:true, enumerable:true, writable:true, value:function (){return FaustVM.toolsFunc.dispatch(this, Navigator.prototype, "Navigator", "unregisterProtocolHandler", arguments)}});

// navigator对象
navigator = {}
Object.setPrototypeOf(navigator, Navigator.prototype);
