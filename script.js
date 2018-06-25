$(function () {
	$('#clear-all').click( function () {
		$('.console-area').empty();
	});

	function cleanPreviewArea() {
		$('.file-preview, .file-info').empty();
	}

	function prettifyFileSize(fileSize) {
		var tmp;

		if (fileSize < 1024) { // B
			return fileSize + ' Bytes';
		}

		tmp = fileSize/1024;

		if (tmp < 1024) { // KB
			return Math.round(tmp * 10) / 10 + ' KB';
		}

		tmp = fileSize/1024000;

		if (tmp < 1024) { // MB
			return Math.round(tmp * 10) / 10 + ' MB';
		}
	}

	function showDefaultFileInfo() {
		$('.file-info').append('<div class="file-name"> File in clipboard is not an recognizable image MIME type. </div>');
	}

	function loadFileInfo(files, realFileName) {
		var fileName = realFileName ? realFileName : '(no file name)';

		$('.file-info').append('<div class="file-name"> File name: ' + fileName + '</div>');
		$('.file-info').append('<div class="file-size"> File size: ' + prettifyFileSize(files[0].size) + '</div>');
		$('.file-info').append('<div class="file-type"> File type: ' + files[0].type + '</div>');
	}

	document.onpaste = function (e) {
		e.preventDefault();

		cleanPreviewArea();

		var reader = new FileReader();
		var clipboardData = e.clipboardData;

		console.log('clipboardData ->', clipboardData);

		var files = clipboardData.files;
		var items = clipboardData.items;
		var types = clipboardData.types;

		console.log('clipboardData.files -> ', files);
		console.log('clipboardData.items -> ', items);
		console.log('clipboardData.types -> ', types);
		console.log('clipboardData.items[0] -> ', items[0]);
		console.log('clipboardData.items[1] -> ', items[1]);

		if (items[0].kind === 'file') {
			if (files.length) {
				reader.readAsDataURL(files[0]);
				reader.onload = function (e) {
					$('.file-preview').append('<img class="img-thumbnail" src="' + e.target.result + '"/>');
				};

				loadFileInfo(files);
			}
		} else if (items[0].kind === 'string') {
			items[0].getAsString(function (s) {
				$('.console-area').append('[You have copied -> ] ' + s + '<br><hr>');
			});

			if (items[1] && items[1].kind === 'file' && files.length) {
				reader.readAsDataURL(files[0]);
				reader.onload = function (e) {
					$('.file-preview').append('<img class="img-thumbnail" src="' + e.target.result + '"/>');
				};
				items[0].getAsString(function (s) {
					loadFileInfo(files, s);
				});
			} else {
				showDefaultFileInfo();
			}
		} else {
			alert('You have just found a bug! Tell author what have you copy to here: tvpsh2020@gmail.com');
		}

		console.log('=====================================');
	};
});
