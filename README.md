[![Build Status](https://travis-ci.org/gabrielflorit/points2polygons.png)](https://travis-ci.org/gabrielflorit/points2polygons)
points2polygons
===============

Given a list of polygons and points, points2polygons will determine if each point is inside a polygon, using [point-in-polygon](https://github.com/substack/point-in-polygon).

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

and a list of points, `points.geojson`:

```javascript
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.057961,
                    42.352929
                ]
            },...
```

`batch-point-in-polygon` will assign points to matching polygons, and generate a new GeoJSON file, `output.geojson`:

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
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                -71.057961,
                                42.352929
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

    -> batch-point-in-polygon --polygons polygons.json --points points.json --output output.json

## Using it as a library

    require('batch-point-polygon')

### .batch(polygons, points, showProgress)

* `polygons`: (required) a GeoJSON object of polygons.
* `points`: (required) a GeoJSON object of points.
* `showProgress`: (optional) a callback that gets fired per point processed, and receives the current point index.
 
Returns an object with two properties:

* `polygons`: same as input, but each polygon has a `points` property containing corresponding points.
* `orphans`: a GeoJSON object containing points with no polygons.
