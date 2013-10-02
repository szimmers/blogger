'use strict';

angular.module('services.StorageService', ['services.EnvironmentService'])
	.service('Storage', function ($q, Environment, $timeout) {

		/**
		 * test data for webapp
		 */
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
				$timeout(function() {
					deferred.resolve(fileEntry);
				});
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
		 * given the directory name (which includes the path and the app name), creates a cordova DirectoryEntry object
		 * and fulfills its promise. the directory is created if it doesn't exist.
		 */
		function getDirectoryEntry(dirName) {

			var deferred = $q.defer();

			function gotFS(fileSystem) {
				fileSystem.root.getDirectory(dirName, {create: true, exclusive: false}, gotDirectoryEntry, fail);
			}

			function gotDirectoryEntry(directoryEntry) {
				$timeout(function() {
					deferred.resolve(directoryEntry);
				});
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
					$timeout(function() {
						deferred.resolve(entries);
					});
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

			getFileEntry(dirName, fileName).then(function(fileEntry) {

				function gotFileWriter(writer) {
					writer.onwriteend = function(evt) {
						$timeout(function() {
							deferred.resolve(data);
						});
					};

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
		 * Given the package and app name, read the contents of the directory and return an array
		 * of saved objects. Each file in the directory represents a saved JSON object. The method
		 * resolves/rejects the provided $q variable, deferred.
		 */
		function getDirectoryContents(packagePath, appName, deferred) {

			// read the directory contents
			_cordovaReadDirectory(packagePath, appName).then(function(filesInDir) {

				// if the directory is empty, we can resolve with an empty array
				if ((filesInDir == null) || (filesInDir == undefined) || (filesInDir.length == 0)) {
					deferred.resolve([]);
				}

				// otherwise, we need to process each file in the directory by reading its contents
				var items = [];
				var dirName = getDirName(packagePath, appName);

				// this is the callback method for the "each", below. it reads the file contents,
				// pushes the result into the items array, then indicates it's done so the "each"
				// can continue.
				var getFileInDir = function(fileInDir, doneCallback) {
					var fileName = fileInDir.name;

					_cordovaReadFile(dirName, fileName).then(function(response) {
						items.push(response);
						doneCallback(null);
					}, function(response) {
						doneCallback(response.message);
					});
				};

				// process each file in series, then executes the closure method to
				// resolve the promise.
				async.eachSeries(filesInDir, getFileInDir, function(err) {
					if (err) {
						console.log(err);
					}
					else {
						deferred.resolve(items);
					}
				});
			});
		}

		/**
		 * public API
		 */
		return {
			get: function(packagePath, appName) {
				var deferred = $q.defer();

				if (Environment.isNative() === true) {
					getDirectoryContents(packagePath, appName, deferred);
				}
				else {
					_localRead(packagePath, appName).then(function(response) {
						deferred.resolve(response);
					}, function(response) {
						deferred.reject(response);
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
