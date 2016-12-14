/*
	 ________  ________  ___  ________   _________   
	|\   __  \|\   __  \|\  \|\   ___  \|\___   ___\ 
	\ \  \|\  \ \  \|\  \ \  \ \  \\ \  \|___ \  \_| 
	 \ \   ____\ \  \\\  \ \  \ \  \\ \  \   \ \  \  
	  \ \  \___|\ \  \\\  \ \  \ \  \\ \  \   \ \  \ 
	   \ \__\    \ \_______\ \__\ \__\\ \__\   \ \__\
	    \|__|     \|_______|\|__|\|__| \|__|    \|__|
	                                                 
 */

/*
	EXTERNAL DEPENDENCIES
 */
import MD5 from 'md5';

/*
	INTERNAL DEPENDENCIES
 */
import Utils form '../utils/utils';
import TR from '../utils/reference';
import Colors from '../style/colors';

const PR = TR.getPoint(); // Point reference

/*
	INTERNAL MARKER FUNCTIONS
 */

/**
 * get the internals marker alpha rules global alpha predomines above local alpha's
 * @param  {object} c3ss compiled carto css
 * @return {object}      object with the alpha extracted (global or local)
 */
const getMarkerAlphaRules = function(c3ss) {
	let gAlpha = c3ss[PR.opacity.css];

	if (gAlpha) {
		return {global: Utils.buildCCSSFn(gAlpha.js).toString()};
	}
	else {
		let fill = c3ss[PR['fill-opacity'].css],
			stroke = c3ss[PR['stroke-opacity'].css];
		
		fill = fill ? Utils.buildCCSSFn(fill.js).toString() : fill;
		stroke = stroke ? Utils.buildCCSSFn(stroke.js).toString() : stroke;
		
		return { fill, stroke };
	}
};

/**
 * get marker c3ss colors
 * @param  {object} c3ss compiled carto css
 * @return {object}      object with the colors
 */
const getMarkerColors = function(c3ss) {
	return {
		fill: c3ss[PR.fill.css],
		stroke: c3ss[PR.stroke.css]
	};
};

/**
 * get colors from cartocss with the alpha channel applied
 * @param  {object} c3ss compiled carto css
 * @return {object}      draw object with color and border_color
 */
const getColors = function(c3ss) {
	const alpha = getMarkerAlphaRules(c3ss);
	const colors = getMarkerColors(c3ss);
	
	let draw = {
		color: Colors.getAlphaColor(
				Utils.buildCCSSFn(color.js).toString(),
				alpha.global || alpha.fill
			)
	};

	if (colors.stroke) {
		draw.border_color = Colors.getAlphaColor(
			Utils.buildCCSSFn(stroke.js).toString(),
			alpha.global || alpha.stroke
		);
	}

	return draw;

};

/**
 * getWidth for the marker and his border
 * @param  {object} c3ss compiled carto css
 * @return {object}      size and border_width
 */
const getWidths = function(c3ss) {
	const size = c3ss[PR.width.css];
	const borderWidth = c3ss[PR['stroke-width'].css];
	
	let draw = {
		size: Utils.buildCCSSFn(size.js).toString()
	};

	if (borderWidth) {
		draw.border_width = Utils.buildCCSSFn(borderWidth.js).toString();
	}

	return draw;
};

/**
 * Get collide from allow-overlap in cartocss [NON-DYNAMIC]
 * @param  {object} c3ss compiled carto css
 * @return {object}      return draw object with a non-dynamic collide option
 */
const getCollide = function(c3ss) {
	const collide = c3ss[PR['allow-overlap'].css];
	
	if (collide) {
		return {
			collide: Utils.buildCCSSFn(collide.js, ['$zoom'])(10); // NOTE: I've put 10 as a default zoom parameter :)
		};
	}

	return {};
};

/**
 * Get texture from marker-file in cartocss [NON-DYNAMIC]
 * @param  {object} c3ss compiled carto css
 * @return {object}      return draw object with a non-dynamic texture.
 */
const getTexture = function(c3ss) {
	const texture = c3ss[PR['file'].css];

	if (texture) {
		return {
			texture: MD5(Utils.buildCCSSFn(texture.js, ['$zoom'])(10));
		};
	}

	return {};
};



/**
 * Basic point
 */

var Point = {};

export default Point;


/**
 * Get the draw (for tangram) object of a point from compiled carto css
 * @param  {object} c3ss compiled carto @class
 * @return {object}      object with the draw types and their properties
 */
Point.getDraw = function(c3ss) {
	let point = {};
	
	if (TR.checkSymbolizer(c3ss, 'markers')) {
		Object.assign(
				point,
				getColors(c3ss),
				getWidth(c3ss),
				getCollide(c3ss)
			);

	}

	return point;
};

Point.getStyle = function() {

};

Point.getTextures = function() {

};