var fs = require('fs');
var _ = require('lodash');
var argv = require('optimist').argv;
var inside = require('point-in-polygon');
var numeral = require('numeral');
var moment = require('moment');
var util = require('util');

// from https://github.com/moment/moment/issues/463#issuecomment-16698903
moment.duration.fn.format = function (input) {
    var output = input;
    var milliseconds = this.asMilliseconds();
    var totalMilliseconds = 0;
    var replaceRegexps = {
        years: /Y(?!Y)/g,
        months: /M(?!M)/g,
        weeks: /W(?!W)/g,
        days: /D(?!D)/g,
        hours: /H(?!H)/g,
        minutes: /m(?!m)/g,
        seconds: /s(?!s)/g,
        milliseconds: /S(?!S)/g
    }
    var matchRegexps = {
        years: /Y/g,
        months: /M/g,
        weeks: /W/g,
        days: /D/g,
        hours: /H/g,
        minutes: /m/g,
        seconds: /s/g,
        milliseconds: /S/g
    }
    for (var r in replaceRegexps) {
        if (replaceRegexps[r].test(output)) {
            var as = 'as'+r.charAt(0).toUpperCase() + r.slice(1);
            var value = new String(Math.floor(moment.duration(milliseconds - totalMilliseconds)[as]()));
            var replacements = output.match(matchRegexps[r]).length - value.length;
            output = output.replace(replaceRegexps[r], value);

            while (replacements > 0 && replaceRegexps[r].test(output)) {
                output = output.replace(replaceRegexps[r], '0');
                replacements--;
            }
            output = output.replace(matchRegexps[r], '');

            var temp = {};
            temp[r] = value;
            totalMilliseconds += moment.duration(temp).asMilliseconds();
        }
    }
    return output;
}

var polygonsFile = fs.readFileSync(argv.polygons, 'utf8');
var pointsFile = fs.readFileSync(argv.points, 'utf8');

var polygons = JSON.parse(polygonsFile);
var points = JSON.parse(pointsFile);

var polygonCount = polygons.features.length;
var pointCount = points.features.length;

var start = Date.now();
var insidePoints = 0;

// for each point,
_(points.features)
.each(function(point, i, array) {

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
			insidePoints++;

		}

	});

	if (i % 100 == 0 || i === array.length - 1) {
		var now = Date.now();
		var pointsProcessed = i + 1;
		var pointsLeft = pointCount - pointsProcessed;
		var timeTaken = now - start;
		var timeLeft = (timeTaken/pointsProcessed) * pointsLeft;
		util.print('\r\033[KInside points: ' + numeral(insidePoints).format('0, 0') + '   Points processed: ' + numeral(pointsProcessed).format('0,0') + '   Points left: ' + numeral(pointsLeft).format('0,0') + '   Time left: ' + moment.duration(timeLeft).format('HH:mm:ss'));
	}

});

console.log('\nWriting to ' + argv.output);
fs.writeFileSync(argv.output, JSON.stringify(polygons, null, 4));
fs.writeFileSync('duplicates.geojson', JSON.stringify(points, null, 4));




