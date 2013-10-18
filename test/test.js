var polygons = {
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"properties": {
				"name": "zero"
			},
			"geometry": {
				"type": "Polygon",
				"coordinates": [
					[
						[0,0],
						[3,0],
						[3,2],
						[2,2],
						[2,1],
						[1,1],
						[1,4],
						[2,4],
						[2,3],
						[3,3],
						[3,5],
						[0,5]
					]
				]
			}
		},
		{
			"type": "Feature",
			"properties": {
				"name": "one"
			},
			"geometry": {
				"type": "Polygon",
				"coordinates": [
					[
						[4,0],
						[7,0],
						[7,5],
						[4,5],
						[4,3],
						[5,3],
						[5,4],
						[6,4],
						[6,1],
						[5,1],
						[5,2],
						[4,2]
					]
				]
			}
		}
	]
};

var points = {
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"properties": {
				"name": "zero",
				"color": "green",
				"amount": 100
			},
			"geometry": {
				"type": "Point",
				"coordinates": [1.5,1.5]
			}
		},
		{
			"type": "Feature",
			"properties": {
				"name": "one",
				"color": "green",
				"amount": 200
			},
			"geometry": {
				"type": "Point",
				"coordinates": [2.5,1.5]
			}
		},
		{
			"type": "Feature",
			"properties": {
				"name": "two",
				"color": "green",
				"amount": 300
			},
			"geometry": {
				"type": "Point",
				"coordinates": [3.5,1.5]
			}
		},
		{
			"type": "Feature",
			"properties": {
				"name": "three",
				"color": "red",
				"amount": 400
			},
			"geometry": {
				"type": "Point",
				"coordinates": [4.5,1.5]
			}
		},
		{
			"type": "Feature",
			"properties": {
				"name": "four",
				"color": "red",
				"amount": 500
			},
			"geometry": {
				"type": "Point",
				"coordinates": [5.5,1.5]
			}
		}
	]
};

var assert = require("assert");
var _ = require('lodash');
var pip = require('../batch-point-in-polygon.js');

describe('#batch-point-in-polygon()', function() {

	it('should place point one inside polygon zero', function() {
		var result = pip.batch(polygons, points);
		assert.deepEqual(result.polygons.features[0].properties.points, [points.features[1]]);
	});

	it('should place point three inside polygon one', function() {
		var result = pip.batch(polygons, points);
		assert.deepEqual(result.polygons.features[1].properties.points, [points.features[3]]);
	});

	it('should place points zero, two and four in array of orphans', function() {
		var result = pip.batch(polygons, points);
		assert.deepEqual(result.orphans, [points.features[0], points.features[2], points.features[4]]);
	});

	it('counting by color should total up color counts', function() {
		var result = pip.batch(polygons, points, null, 'color');
		assert.deepEqual(result.polygons.features[0].properties['green'], 1);
		assert.deepEqual(result.polygons.features[1].properties['red'], 1);
	});

	it('grouping by color and amount should total up color amounts', function() {
		var result = pip.batch(polygons, points, null, null, 'color', 'amount');
		assert.deepEqual(result.polygons.features[0].properties['green'], 200);
		assert.deepEqual(result.polygons.features[1].properties['red'], 400);
	});

});
