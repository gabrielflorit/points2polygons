var _ = require('lodash');
var inside = require('point-in-polygon');

var batch = function(polygons, points, showProgress) {

	var insidePointsCount = 0;
	var orphans = [];

	var start = Date.now();

	// for each point,
	_.each(points.features, function(point, i, array) {

		var found = false;

		// for each polygon,
		_.each(polygons.features, function(polygon) {

			// if the point is inside this polygon, add it
			if (!found && inside(point.geometry.coordinates, polygon.geometry.coordinates[0])) {

				found = true;

				if (!polygon.properties.points) {
					polygon.properties.points = [];
				}

				polygon.properties.points.push(point);
				insidePointsCount++;

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

	return {
		polygons: polygons,
		orphans: orphans
	};

};

module.exports.batch = batch;