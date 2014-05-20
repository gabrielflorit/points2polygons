var inside = require('point-in-polygon');
var _ = require('lodash');

var batch = function(_polygons, _points, showProgress, _count, _groupBy, _sum) {

	var polygons = JSON.parse(JSON.stringify(_polygons));

	var insidePointsCount = 0;
	var orphans = [];

	// for each point,
	_points.features.forEach(function(point, i, array) {

		var found = false;

		// for each polygon,
		polygons.features.forEach(function(polygon) {

			var geometryType = polygon.geometry.type;

			if (geometryType === 'Polygon') {

				// only search if not found
				if (!found) {

					if (inside(point.geometry.coordinates, polygon.geometry.coordinates[0])) {

						found = true;

						if (!polygon.properties.points) {
							polygon.properties.points = [];
						}

						polygon.properties.points.push(point);
						insidePointsCount++;
					}

				}
			}

			if (geometryType === 'MultiPolygon') {
	
				// for each coordinates
				polygon.geometry.coordinates.forEach(function(coordinates) {

					// only search if not found
					if (!found) {

						if (inside(point.geometry.coordinates, coordinates[0])) {

							found = true;

							if (!polygon.properties.points) {
								polygon.properties.points = [];
							}

							polygon.properties.points.push(point);
							insidePointsCount++;
						}

					}

				});
			}

		});

		// if we didn't find a polygon for this point, add it to an array
		// we'll use it to create orphans.geojson
		if (!found) {
			orphans.push(point);
		}

		// if defined, show progress
		showProgress && showProgress(i + 1);

	});

	if (_count) {

		polygons.features.forEach(function(polygon) {

			// get points
			var points = polygon.properties.points;
			if (points) {

				if (typeof _count === 'boolean') {

					polygon.properties.points = points.length;

				} else {

				var properties = _(points)
					.pluck('properties')
					.map(function(v, i) {

						var items = _(v)
						.filter(function(v, i) {
							return i.toLowerCase() == _count.toLowerCase();
						})
						.value();

						return items;

					})
					.flatten()
					.countBy(function(v, i) {
						return v;
					})
					.value();

				_.assign(polygon.properties, properties);

				delete polygon.properties.points;

				}

			}

		});

	} else if (_groupBy && _sum) {

		polygons.features.forEach(function(polygon) {

			// get points
			var points = polygon.properties.points;
			if (points) {

				var properties = {};

				_(points)
					.pluck('properties')
					.groupBy(function(v, i) {
						return v[_groupBy];
					})
					.each(function(v, i) {

						var sum = _(v)
							.map(function(v, i) {
								return Number(v[_sum]);
							})
							.reduce(function(a, b) {
								return a + b;
							});

						properties[i] = sum;
					});

				_.assign(polygon.properties, properties);

				delete polygon.properties.points;

			}

		});

	}

	return {
		polygons: polygons,
		orphans: orphans
	};

};

module.exports.batch = batch;
