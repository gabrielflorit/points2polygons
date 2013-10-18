var polygon = {
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"properties": {},
			"geometry": {
			"type": "Polygon",
			"coordinates": [
					[
						[0,0],
						[3,0],
						[3,3],
						[0,3],
						[0,2],
						[2,2],
						[2,1],
						[0,1],
						[0,0]
					]
				]
			}
		}
	]
};

var outsidePoint = {
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "Point",
				"coordinates": [1.5,1.5]
			}
		}
	]
};

var assert = require("assert");
var _ = require('lodash');
var pip = require('../batch-point-in-polygon.js');

describe('#batch-point-in-polygon()', function() {
	it('should not place outside point inside the polygon', function() {

		var result = pip.batch(polygon, outsidePoint);
		assert.deepEqual(result.polygons, polygon);
		assert.deepEqual(result.orphans, outsidePoint.features);

	});
});











