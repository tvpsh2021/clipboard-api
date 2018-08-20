$(function () {
	var $filePreview = $('.file-preview');
	var $fileInfo = $('.file-info');
	var $consoleArea = $('.console-area');

	$('#clear-all').click( function () {
		$consoleArea.empty();
	});

	function cleanPreviewArea() {
		$filePreview.empty();
		$fileInfo.empty();
	}

	function prettifyFileSize(fileSize) {
		var tmpFileSize;

		if (fileSize < 1024) { // B
			return fileSize + ' Bytes';
		}

		tmpFileSize = fileSize / 1024;

		if (tmpFileSize < 1024) { // KB
			return Math.round(tmpFileSize * 10) / 10 + ' KB';
		}

		tmpFileSize = fileSize / 1024000;

		if (tmpFileSize < 1024) { // MB
			return Math.round(tmpFileSize * 10) / 10 + ' MB';
		}
	}

	function showDefaultFileInfo() {
		$fileInfo.html('<div class="file-name"> File in clipboard is not an recognizable image MIME type. </div>');
	}

	function loadFileInfo(files, realFileName) {
		var fileName = realFileName ? realFileName : '(no file name)';
		var fileInfo = ' \
			<div class="file-name"> File name: ' + fileName + '</div> \
			<div class="file-size"> File size: ' + prettifyFileSize(files[0].size) + '</div> \
			<div class="file-type"> File type: ' + files[0].type + '</div> \
		';

		$fileInfo.html(fileInfo);
	}

	function appendConsoleArea(str) {
		var now = new Date();
		var datetime = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
		var previousConsoleContent = $consoleArea.html();
		var newConsoleContent = '[' + datetime + '] You have copied -> ' + str + '<br><hr>';
		$consoleArea.html(newConsoleContent + previousConsoleContent);
	}

	document.onpaste = function (e) {
		e.preventDefault();
		cleanPreviewArea();

		var reader = new FileReader();
		var clipboardData = e.clipboardData;
		var files = clipboardData.files;
		var items = clipboardData.items;
		var types = clipboardData.types;

		console.log('clipboardData ->', clipboardData);
		console.log('clipboardData.files -> ', files);
		console.log('clipboardData.items -> ', items);
		console.log('clipboardData.types -> ', types);
		console.log('clipboardData.items[0] -> ', items[0]);
		console.log('clipboardData.items[1] -> ', items[1]);

		if (!items[0]) {
			showDefaultFileInfo();

			return ;
		}

		switch (items[0].kind) {
			case 'file':
				if (files.length) {
					reader.readAsDataURL(files[0]);
					reader.onload = function (e) {
						$filePreview.html('<img class="img-thumbnail" src="' + e.target.result + '"/>');
					};

					loadFileInfo(files);
				}

				break;
			case 'string':
				items[0].getAsString(function (s) {
					appendConsoleArea(s);
				});

				if (items[1] && items[1].kind === 'file' && files.length) {
					reader.readAsDataURL(files[0]);
					reader.onload = function (e) {
						$filePreview.html('<img class="img-thumbnail" src="' + e.target.result + '"/>');
					};
					items[0].getAsString(function (s) {
						loadFileInfo(files, s);
					});
				} else {
					showDefaultFileInfo();
				}

				break;
			default:
				alert('You have just found a bug! Tell author what have you copy to here: tvpsh2020@gmail.com');
		}

		console.log('=====================================');
	};
});
