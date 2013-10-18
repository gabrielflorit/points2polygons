[![Build Status](https://travis-ci.org/gabrielflorit/points2polygons.png)](https://travis-ci.org/gabrielflorit/points2polygons)
points2polygons
===============

Given a list of polygons and points, **points2polygons** will determine if each point is inside a polygon, using [point-in-polygon](https://github.com/substack/point-in-polygon).

If found, the point will be added to the polygon.

### For example:

Given a list of polygons, `polygons.geojson`:

```javascript
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -71.057828,
                            42.353339
                        ],...
```

and a list of points, `points.csv`:

```
town,lat,lon
Boston,42.358431,-71.059773
```

**points2polygons** will assign points to matching polygons, and generate a new GeoJSON file, `output.geojson`:

```javascript
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "points": [
                    {
                        "type": "Feature",
                        "properties": {
                            "town": "Boston"
                        }
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                -71.059773,
                                42.358431
                            ]
                        }
                    }
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -71.057828,
                            42.353339
                        ],...
```

Points with no polygons will be placed in their own GeoJSON file, `orphans.geojson`.

## Installation

    npm install points2polygons

## Using it as a console utility

```
➜ points2polygons
Batch point-in-polygon operations. Creates a GeoJSON file of polygons containing points.
Usage: points2polygons

Options:
  -y, --polygons   a GeoJSON file of polygons                       [required]
  -t, --points     a CSV file of points                             [required]
  -i, --latitude   latitude field                                   [default: "latitude"]
  -e, --longitude  longitude field                                  [default: "longitude"]
  -d, --delimiter  delimiter character                              [default: ","]
  -o, --output     a GeoJSON file of polygons containing points     [default: "output.json"]
  -c, --countBy    aggregate points by count - group by this field  [default: null]
  -g, --groupBy    aggregate points by sum - group by this field    [default: null]
  -s, --sumBy      aggregate points by sum - sum by this field      [default: null]
```

## Using it as a library

    require('points2polygons')

### .batch(polygons, points, showProgress, countBy, groupBy, sumBy)

* `polygons`: (required) a GeoJSON object of polygons.
* `points`: (required) a GeoJSON object of points.
* `showProgress`: (optional) a callback that gets fired per point processed, and receives the current point index.
* `countBy`: (optional) if provided, will aggregate points by count for this field. See example.
* `groupBy`: (optional) if provided, will aggregate points by sum, grouping by this field. See example.
* `sumBy`: (optional) if provided, will aggregate points by sum, summing by this field. See example.
 
Returns an object with two properties:

* `polygons`: same as input, but each polygon has a `points` property containing corresponding points.
* `orphans`: a GeoJSON object containing points with no polygons.
