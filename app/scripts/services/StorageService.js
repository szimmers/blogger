'use strict';

angular.module('services.StorageService', ['services.EnvironmentService'])
	.service('Storage', function ($q, Environment, $timeout) {

		var _localRead = function(filename) {

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

/*
		var _cordovaRead = function(filename) {

			var deferred = $q.defer();
			var dbEntries = [];

			var file = {
				writer: { available: false },
				reader: { available: false }
			};

			function fail(msg) {
				alert(msg);
				var error = {'message': msg};
				//deferred.reject(error);
			}

			function readText() {
				if (file.entry) {
					file.entry.file(function (filename) {
						var reader = new FileReader();
						reader.onloadend = function (evt) {
							alert(evt.target.result);
							var textArray = evt.target.result.split("\n");

							dbEntries = textArray.concat(dbEntries);

							$timeout(function() {
								deferred.resolve(dbEntries);
							});
						}

						reader.readAsText(filename);
					});
				}

				return false;
			}

			function gotFileEntry(fileEntry) {
				file.entry = fileEntry;
				readText();
			}

			function gotFS(fs) {
				fs.root.getFile(filename, {create:true, exclusive:false}, gotFileEntry, fail);
			}

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

			return deferred.promise;
		}
		*/

		/*
		var _cordovaSave = function(filename, data) {

			var deferred = $q.defer();

			var file = {
				writer: { available: false },
				reader: { available: false }
			};

			function fail(msg) {
				alert(msg);
			}

			function saveText() {
				if (file.writer.available) {
					file.writer.available = false;
					file.writer.object.onwriteend = function (evt) {
						file.writer.available = true;

						deferred.resolve(data);
					}

					file.writer.object.seek(writer.length);
					file.writer.object.write(data);
				}
				else {
					var error = {'message': 'save failed'};
					deferred.reject(error);
				}
			}

			function gotFileWriter(fileWriter) {
				file.writer.available = true;
				file.writer.object = fileWriter;
				saveText(data);
			}

			function gotFileEntry(fileEntry) {
				file.entry = fileEntry;
				fileEntry.createWriter(gotFileWriter, fail);
				//readText();
			}

			function gotFS(fs) {
				fs.root.getFile(filename, {create:true, exclusive:false}, gotFileEntry, fail);
			}

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

			return deferred.promise;
		};
		*/

		var _cordovaRead = function(filename) {

			var deferred = $q.defer();

			function gotFS(fileSystem) {
				fileSystem.root.getFile(filename, {create:true, exclusive:false}, gotFileEntry, fail);
			}

			function gotFileEntry(fileEntry) {
				fileEntry.file(gotFile, fail);
			}

			function gotFile(file){
				readAsText(file);
			}

			function readAsText(file) {
				var reader = new FileReader();

				reader.onloadend = function(evt) {
					var data = evt.target.result;
					alert('data: ' + JSON.stringify(data));

					var items = data.split('|');
					alert('items: ' + JSON.stringify(items));

					var items2 = JSON.parse(items);
					alert('items2: ' + JSON.stringify(items2));

					//deferred.resolve(items);
					$timeout(function() {
						deferred.resolve(items);
					});
					/*
					*/
				};

				reader.readAsText(file);
			}

			function fail(evt) {
				alert('read fail: '+ evt.target.error.code);
				console.log(evt.target.error.code);
				var errorObject = {'message' : evt.target.error.code};
				deferred.reject(errorObject);
			}

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

			return deferred.promise;
		};

		/**
		 *
		 */
		var _cordovaSave = function(filename, data) {

			var deferred = $q.defer();

			function gotFS(fileSystem) {
				fileSystem.root.getFile(filename, {create: true, exclusive: false}, gotFileEntry, fail);
			}

			function gotFileEntry(fileEntry) {
				fileEntry.createWriter(gotFileWriter, fail);
			}

			function gotFileWriter(writer) {
				writer.onwriteend = function(evt) {
					deferred.resolve(data);
				};

				writer.seek(writer.length);
				writer.write(JSON.stringify(data) + ' | ');
			}

			function fail(error) {
				console.log(error.code);
				var errorObject = {'message' : error.code};
				deferred.reject(errorObject);
			}

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

			return deferred.promise;
		};

		return {
			get: function(filename) {
				var deferred = $q.defer();

				if (Environment.isNative() === true) {
					_cordovaRead(filename).then(function(response) {
						//alert('fulfilled 1:' + response);
						deferred.resolve(response);
					}, function(response) {
						alert('error:' + response.message);
					});
				}
				else {
					_localRead(filename).then(function(response) {
						deferred.resolve(response);
					}, function(response) {
						alert('error:' + response.message);
					});
				}

				return deferred.promise;
			},

			save: function(filename, data) {
				var deferred = $q.defer();

				if (Environment.isNative() === true) {
					_cordovaSave(filename, data).then(function(response) {
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
