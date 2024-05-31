
'use strict';

const Plugin = module.exports;

const codeRegex = /(?:<pre>(?:.|\n)*?<\/pre>|<code>(?:.|\n)*?<\/code>)/gi;

const colorRegex = /%\((#(?:[A-Fa-f0-9]{3}(?:[A-Fa-f0-9]{3})?)|(?:rgb\(\d{1,3},\d{1,3},\d{1,3}\))|(?:[a-zа-я]){3,})\)\[(.+?)\]/gi;

Plugin.registerFormatting = function (payload) {
	const formatting = [
		{ name: 'eyedropper', className: 'fa fa-eyedropper', title: 'Color' },
	];

	payload.options = payload.options.concat(formatting);

	return payload;
}

Plugin.parse = function (data, callback) {
	if (data && 'string' === typeof data) {
		data = parser(data);
	} else if (data.postData && data.postData.content && data.postData.content.match(colorRegex)) {
		data.postData.content = parser(data.postData.content);
	} else if (data.userData && data.userData.signature && data.userData.signature.match(colorRegex)) {
		data.userData.signature = parser(data.userData.signature);
	}
	callback(null, data);
};

function parser (data) {
	var codeTags = [];

	function chooseColor ($1) {
		$1 = $1.toLowerCase();
		if ('лидер' === $1) return '#cf0000';
		if ('генерал' === $1) return '#f7632b';
		if ('офицер' === $1) return '#cf6800';
		if ('рекрутер' === $1) return '#008000';
		if ('рыцарь' === $1) return '#0090ff';
		if ('соратник' === $1) return '#3ba8a8';
		return $1;
	}

	data = data.replace(codeRegex, function (match) {
		codeTags.push(match);
		return '___CODE___';
	});

	data = data.replace(colorRegex, function (match, $1, $2) {
		$1 = chooseColor($1);
		return '<span style="color: ' + $1 + ';">' + $2 + '</span>';
	});

	data = data.replace(/___CODE___/gi, function (match) {
		return codeTags.shift();
	});

	return data;
}


