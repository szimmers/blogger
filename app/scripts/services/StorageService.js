'use strict';

angular.module('services.StorageService', ['services.EnvironmentService'])
	.service('Storage', function ($q, Environment, $timeout) {

		function _localRead(packagePath, appName) {

			var deferred = $q.defer();

			var data = [
				{'uniqueId':1, 'creationDate': '2013-09-25T18:27:02.966Z', 'entry':'i like soup'},
				{'uniqueId':2, 'creationDate': '2013-09-25T18:28:33.123Z', 'entry':'soup is good food.'},
				{'uniqueId':3, 'creationDate': '2013-09-25T18:34:55.789Z', 'entry':'some hats are shaped like oklahoma\nsome hats are shaped like the Zuiderzee!'}
			];

			$timeout(function() {
				deferred.resolve(data);
			});

			return deferred.promise;
		}

		/**
		 * formats and returns a directory name
		 */
		function getDirName(packagePath, appName) {
			var dirName = packagePath + "." + appName;
			return dirName;
		}

		/**
		 * formats and returns a file name
		 */
		function getFileName(appName, key) {
			var fileName = appName + "." + key;
			return fileName;
		}

		/**
		 * formats and returns a file key, used to format a file name
		 */
		function getKey(keyFieldName, data) {
			var key = data[keyFieldName];
			return key;
		}

		/**
		 * given the directory and filename, creates a cordova FileEntry object and fulfills its
		 * promise. both the directory and file are created if they don't exist.
		 */
		function getFileEntry(dirName, fileName) {

			var deferred = $q.defer();

			function gotFS(fileSystem) {
				fileSystem.root.getDirectory(dirName, {create: true, exclusive: false}, gotDirectory, fail);
			}

			function gotDirectory(directory) {
				directory.getFile(fileName, {create: true, exclusive: false}, gotFileEntry, fail);
			}

			function gotFileEntry(fileEntry) {
				deferred.resolve(fileEntry);
			}

			function fail(error) {
				console.log(error.code);
				alert('getFileEntry: ' + error.code);
				var errorObject = {'message' : error.code};
				deferred.reject(errorObject);
			}

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

			return deferred.promise;
		}

		/**
		 * given the directory name (which includes the path and the app name), creates a cordova DirectoryEntry object
		 * and fulfills its promise. the directory is created if it doesn't exist.
		 */
		function getDirectoryEntry(dirName) {

			var deferred = $q.defer();

			function gotFS(fileSystem) {
				fileSystem.root.getDirectory(dirName, {create: true, exclusive: false}, gotDirectoryEntry, fail);
			}

			function gotDirectoryEntry(directoryEntry) {
				deferred.resolve(directoryEntry);
			}

			function fail(error) {
				console.log(error.code);
				var errorObject = {'message' : error.code};
				deferred.reject(errorObject);
			}

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

			return deferred.promise;
		}

		/**
		 * reads the contents of the file specified by the dirName and filename.
		 */
		function _cordovaReadFile(dirName, fileName) {

			var deferred = $q.defer();

			getFileEntry(dirName, fileName).then(function(fileEntry) {

				function gotFile(file) {
					var reader = new FileReader();

					reader.onloadend = function(evt) {
						var data = evt.target.result;

						$timeout(function() {
							deferred.resolve(JSON.parse(data));
						});
					}

					reader.readAsText(file);
				}

				function fail(error) {
					console.log(error.code);
					var errorObject = {'message' : error.code};
					deferred.reject(errorObject);
				}

				fileEntry.file(gotFile, fail);

			});

			return deferred.promise;
		}

		/**
		 * reads the contents of the directory specified by the package and app.
		 */
		function _cordovaReadDirectory(packagePath, appName) {

			var deferred = $q.defer();

			var dirName = getDirName(packagePath, appName);

			getDirectoryEntry(dirName).then(function(directoryEntry) {

				function fail(error) {
					console.log(error.code);
					var errorObject = {'message' : error.code};
					deferred.reject(errorObject);
				}

				var reader = directoryEntry.createReader();

				reader.readEntries(function(entries) {
					deferred.resolve(entries);
				}, fail);

			});

			return deferred.promise;
		}

		/**
		 * Creates a new file on the filesystem with the name supplied by getFileName().
		 * The contents of the file is the data.
		 */
		var _cordovaSave = function(packagePath, appName, keyFieldName, data) {

			var deferred = $q.defer();

			var dirName = getDirName(packagePath, appName);
			var key = getKey(keyFieldName, data);
			var fileName = getFileName(appName, key);

/*
			alert('data: ' + JSON.stringify(data));
			alert('keyFieldName: ' + keyFieldName);
alert('dirName: ' + dirName);
alert('key: ' + key);
alert('fileName: ' + fileName);
*/
			getFileEntry(dirName, fileName).then(function(fileEntry) {

//alert('got file entry for writing');
				function gotFileWriter(writer) {
					writer.onwriteend = function(evt) {
					//alert('written!');
						deferred.resolve(data);
					};

					//alert('trying to write');
					writer.seek(0);
					writer.write(JSON.stringify(data));
				}

				function fail(error) {
					console.log(error.code);
					var errorObject = {'message' : error.code};
					deferred.reject(errorObject);
				}

				fileEntry.createWriter(gotFileWriter, fail);

			});

			return deferred.promise;
		};

		/**
		 * public API
		 */
		return {
			get: function(packagePath, appName) {
				var deferred = $q.defer();

				if (Environment.isNative() === true) {
					_cordovaReadDirectory(packagePath, appName).then(function(entries) {

						if ((entries == null) || (entries == undefined) || (entries.length == 0)) {
							deferred.resolve([]);
						}

						var items = [];
						var dirName = getDirName(packagePath, appName);

						alert('got ' + entries.length + " items");

						entries.forEach(function(entry, index) {
							var fileName = entry.name;
							alert('grabbing: ' + fileName);

							_cordovaReadFile(dirName, fileName).then(function(response) {
								alert('got data: ' + JSON.stringify(response));
								items.push(response);
							}, function(response) {
								alert('error:' + response.message);
							});

						})();

alert('loop done, resolving...');
						deferred.resolve(items);
alert('resolved');

					}, function (response) {
						alert('error:' + response.message);
					});
				}
				else {
					_localRead(packagePath, appName).then(function(response) {
						deferred.resolve(response);
					}, function(response) {
						alert('error:' + response.message);
					});
				}

				return deferred.promise;
			},

			save: function(packagePath, appName, keyFieldName, data) {
				var deferred = $q.defer();

				if (Environment.isNative() === true) {
					_cordovaSave(packagePath, appName, keyFieldName, data).then(function(response) {
						deferred.resolve(response);
					});
				}
				else {
					deferred.resolve(data);
				}

				return deferred.promise;
			}
		}
	});
