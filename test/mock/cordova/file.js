/**
 * Mocked cordova File APIs.
 */

// tests can flip these switches to get different behavior for methods where a success and failure
// handler are provided.
window.cordovaFileTestFlags = {
	'canGetFileSystem': true,
	'canGetDirectoryEntry': true,
	'canGetFile': true,
	'canReadEntries': true,
	'canCreateWriter': true,
	'canRemoveFile': true
};

// cordova file error codes (reproduced here in absence of loaded cordova apis)
// NOTE: no research went into which of these codes are dispatched when, so anything
// below is a best-guess based on name/situation.
window.cordovaFileError = {
	'NOT_FOUND_ERR' : 1,
	'SECURITY_ERR' : 2,
	'ABORT_ERR' : 3,
	'NOT_READABLE_ERR' : 4,
	'ENCODING_ERR' : 5,
	'NO_MODIFICATION_ALLOWED_ERR' : 6,
	'INVALID_STATE_ERR' : 7,
	'SYNTAX_ERR' : 8,
	'INVALID_MODIFICATION_ERR' : 9,
	'QUOTA_EXCEEDED_ERR' : 10,
	'TYPE_MISMATCH_ERR' : 11,
	'PATH_EXISTS_ERR' : 12
};

// satisfies references to LocalFileSystem
window.LocalFileSystem = {
	'TEMPORARY' : 0,
	'PERSISTENT' : 1
};

function resetCordovaFileTestFlags() {
	window.cordovaFileTestFlags.canGetFileSystem = true;
	window.cordovaFileTestFlags.canGetDirectoryEntry = true;
	window.cordovaFileTestFlags.canGetFile = true;
	window.cordovaFileTestFlags.canReadEntries = true;
	window.cordovaFileTestFlags.canCreateWriter = true;
	window.cordovaFileTestFlags.canRemoveFile = true;
}

// a fileWriter is created from fileEntry.createWriter(). here, we provide a couple
// methods to spy on.
var fileWriter = {
	'seek' : function(pos) {},
	'write' : function(data) {
		var onwriteendevent = new CustomEvent("onwriteend",
		{
			bubbles: true,
			cancelable: true
		});

		onwriteend(onwriteendevent);
	},
	'onwriteend' : function(event) {

	}
};

// a removedEntry is created from fileEntry.remove().
var removedEntry = {
	'path' : '/some/random/path'
};

// a fileEntry is created from reading directory contents.
var fileEntry = {
	'path' : '/some/random/path',
	'createWriter' : function(success, fail) {
		if ((cordovaFileTestFlags.canCreateWriter === true) && (success != null)) {
			success(fileWriter);
		}
		else if ((cordovaFileTestFlags.canCreateWriter === false) && (fail != null)) {
			fail({code: window.cordovaFileError.NO_MODIFICATION_ALLOWED_ERR});
		}
	},
	'remove' : function(success, fail) {
		if ((cordovaFileTestFlags.canRemoveFile === true) && (success != null)) {
			success(removedEntry);
		}
		else if ((cordovaFileTestFlags.canRemoveFile === false) && (fail != null)) {
			fail({code: window.cordovaFileError.NO_MODIFICATION_ALLOWED_ERR});
		}
	}
};

// a reader is created from directoryEntry.createReader().
var reader = {
	'readEntries' : function(success, fail) {
		if ((cordovaFileTestFlags.canReadEntries === true) && (success != null)) {
			success([fileEntry, fileEntry, fileEntry]);
		}
		else if ((cordovaFileTestFlags.canReadEntries === false) && (fail != null)) {
			fail({code: window.cordovaFileError.NOT_READABLE_ERR});
		}
	}
};

// a directoryEntry is created from fileSystem.getDirectory().
var directoryEntry = {
	'getFile' : function(fileName, config, success, fail) {
		if ((cordovaFileTestFlags.canGetFile === true) && (success != null)) {
			success(fileEntry);
		}
		else if ((cordovaFileTestFlags.canGetFile === false) && (fail != null)) {
			fail({code: window.cordovaFileError.NOT_FOUND_ERR});
		}
	},
	'createReader' : function() {
		return reader;
	}
};

// a filesSystem is created from window.requestFileSystem()
var fileSystem = {
	'root' : {
		'getDirectory' : function(dirName, config, success, fail) {
			if ((cordovaFileTestFlags.canGetDirectoryEntry === true) && (success != null)) {
				success(directoryEntry);
			}
			else if ((cordovaFileTestFlags.canGetDirectoryEntry === false) && (fail != null)) {
				fail({code: window.cordovaFileError.NOT_FOUND_ERR});
			}
		}
	}
};

// the starting point to access files through the cordova api.
window.requestFileSystem = function(type, size, success, fail) {
	if ((cordovaFileTestFlags.canGetFileSystem === true) && (success != null)) {
		success(fileSystem);
	}
	else if ((cordovaFileTestFlags.canGetFileSystem === false) && (fail != null)) {
		fail({code: window.cordovaFileError.SECURITY_ERR});
	}
};
