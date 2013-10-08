'use strict';

// @ifdef NATIVE
angular.module('services.CordovaAPI')
	/**
	 * wraps the cordova FILE API for saving JSON objects. each object is saved as its own
	 * file. each app writes to its own directory. the paths and file names are derived from
	 * values passed in: packagePath, appName, keyFieldName, data.
	 */
	.service('Storage', ['$q', '$timeout', function ($q, $timeout) {

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
		 * Deletes the specified file from the specified directory
		 */
		var _cordovaDelete = function(packagePath, appName, keyFieldName, data) {

			var deferred = $q.defer();

			var dirName = getDirName(packagePath, appName);
			var key = getKey(keyFieldName, data);
			var fileName = getFileName(appName, key);

			getFileEntry(dirName, fileName).then(function(fileEntry) {

				function removed(removedEntry) {
					$timeout(function() {
						deferred.resolve(removedEntry);
					});
				}

				function fail(error) {
					console.log(error.code);
					var errorObject = {'message' : error.code};
					deferred.reject(errorObject);
				}

				fileEntry.remove(removed, fail);
			});

			return deferred.promise;
		};

		/**
		 * Deletes all files from the specified directory
		 *
		 * Note: ideally, we'd like to use directoryEntry.removeRecursively() here,
		 * but that does not work on Android devices. simulator, yes, devices, no.
		 */
		var _cordovaDeleteAll = function(packagePath, appName) {

			var deferred = $q.defer();

			_cordovaReadDirectory(packagePath, appName).then(function(filesInDir) {

				// removes each file as it is found
				function removeFile(dirName, fileName) {

					var removeFileDeferred = $q.defer();

					getFileEntry(dirName, fileName).then(function(fileEntry) {

						function removed(removedEntry) {
							$timeout(function() {
								removeFileDeferred.resolve(removedEntry);
							});
						}

						function fail(error) {
							console.log(error.code);
							var errorObject = {'message' : error.code};
							removeFileDeferred.reject(errorObject);
						}

						fileEntry.remove(removed, fail);
					});

					return removeFileDeferred.promise;
				};

				// if the directory is empty, we can resolve with an empty array
				if ((filesInDir == null) || (filesInDir == undefined) || (filesInDir.length == 0)) {
					deferred.resolve(filesInDir);
				}

				// otherwise, we need to remove each file
				var dirName = getDirName(packagePath, appName);

				// use $q to collect all the results; we'll store the promises here
				var promises = [];

				for (var i=0; i < filesInDir.length; i++) {
					var fileInDir = filesInDir[i];
					var fileName = fileInDir.name;

					promises.push(removeFile(dirName, fileName));
				}

				// collect all the promise results, then resolve the main promise
				$q.all(promises).then(
					function (results) {
						deferred.resolve(results);
					}
				);
			});

			return deferred.promise;
		};

		/**
		 * Given the package and app name, read the contents of the directory and return an array
		 * of saved objects. Each file in the directory represents a saved JSON object.
		 */
		function _getDirectoryContents(packagePath, appName) {

			var deferred = $q.defer();

			// read the directory contents
			_cordovaReadDirectory(packagePath, appName).then(function(filesInDir) {

				// if the directory is empty, we can resolve with an empty array
				if ((filesInDir == null) || (filesInDir == undefined) || (filesInDir.length == 0)) {
					deferred.resolve([]);
				}

				// otherwise, we need to process each file in the directory by reading its contents
				var dirName = getDirName(packagePath, appName);

				// use $q to collect all the results; we'll store the promises here
				var promises = [];

				for (var i=0; i < filesInDir.length; i++) {
					var fileInDir = filesInDir[i];
					var fileName = fileInDir.name;

					promises.push(_cordovaReadFile(dirName, fileName));
				}

				// collect all the promise results, then resolve the main promise
				$q.all(promises).then(
					function (results) {
						deferred.resolve(results);
					}
				);
			});

			return deferred.promise;
		}

		/**
		 * public API
		 */
		return {
			get: function(packagePath, appName) {
				var deferred = $q.defer();

				_getDirectoryContents(packagePath, appName).then(function(response) {
					deferred.resolve(response);
				});

				return deferred.promise;
			},

			save: function(packagePath, appName, keyFieldName, data) {
				var deferred = $q.defer();

				_cordovaSave(packagePath, appName, keyFieldName, data).then(function(response) {
					deferred.resolve(response);
				});

				return deferred.promise;
			},

			delete: function(packagePath, appName, keyFieldName, data) {
				var deferred = $q.defer();

				_cordovaDelete(packagePath, appName, keyFieldName, data).then(function(response) {
					deferred.resolve(response);
				});

				return deferred.promise;
			},

			deleteAll: function(packagePath, appName) {
				var deferred = $q.defer();

				_cordovaDeleteAll(packagePath, appName).then(function(response) {
					deferred.resolve(response);
				});

				return deferred.promise;
			}
		}
	}]);
// @endif
