var inside = require('point-in-polygon');

var batch = function(polygons, points, showProgress) {

	var insidePointsCount = 0;
	var orphans = [];

	// for each point,
	points.features.forEach(function(point, i, array) {

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

	return {
		polygons: polygons,
		orphans: orphans
	};

};

module.exports.batch = batch;