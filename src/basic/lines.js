/*
	 ___       ___  ________   _______   ________
	|\  \     |\  \|\   ___  \|\  ___ \ |\   ____\
	\ \  \    \ \  \ \  \\ \  \ \   __/|\ \  \___|_
	 \ \  \    \ \  \ \  \\ \  \ \  \_|/_\ \_____  \
	  \ \  \____\ \  \ \  \\ \  \ \  \_|\ \|____|\  \
	   \ \_______\ \__\ \__\\ \__\ \_______\____\_\  \
	    \|_______|\|__|\|__| \|__|\|_______|\_________\
	                                       \|_________|

 */

/*
	EXTERNAL DEPENDENCIES
 */

/*
	INTERNAL DEPENDENCIES
 */

import ReferenceHelper from './reference-helpers';
import Utils from '../utils/utils';
import TangramReference from '../utils/reference';
import Colors from '../style/colors';
import Geom from '../utils/geom';

const LR = TangramReference.getLine(); // Line reference

/*
	INTERNAL LINE FUNCTIONS
 */

const getLineAlpha = function(c3ss) {
	let alpha = c3ss[LR['stroke-opacity'].css] || ReferenceHelper.defaultAlpha(LR, 'line');

	return Utils.buildCCSSFn(alpha.js).toString();
};

const getLineColor = function(c3ss) {
	return c3ss[LR.stroke.css] || ReferenceHelper.defaultColor(LR, 'line');
};

const getColor = function(c3ss) {
	const alpha = getLineAlpha(c3ss);
	const color = getLineColor(c3ss);

	return {
		color: Colors.getAlphaColor(
				Utils.buildCCSSFn(color.js),
				alpha
			)
	};
};

const getWidth = function(c3ss) {
	let width = c3ss[LR['stroke-width'].css];

	return {
		width: Geom.px2Meters(Utils.buildCCSSFn(width.js).toString())
			.replace(/\n/g, ' ')
			.trim()
	};
};
/**
 * Basic Line
 */

var Line = {};

export default Line;

Line.getDraw = function(c3ss) {
	let line = {};

	if (TangramReference.checkSymbolizer(c3ss, 'line')) {
		Object.assign(
				line,
				getColor(c3ss),
				getWidth(c3ss)
			);
	}

	return { lines_blend: line };
};

Line.getStyle = function() {
	let style = {
		lines_blend: {
			base: 'lines',
			blend: 'overlay'
		}
	};

	// NOTE: this no makes sense actually.
	// if (TangramReference.checkSymbolizer(c3ss, 'polygons')) {
	// 	Object.assign(
	// 			style.polygons_blend
	// 		);
	// };

	return style;
};
