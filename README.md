[![Build Status](https://travis-ci.org/gabrielflorit/points2polygons.png)](https://travis-ci.org/gabrielflorit/points2polygons)
points2polygons
===============

Given a list of polygons and points, `points2polygons` will determine if each point is inside a polygon, using [point-in-polygon](https://github.com/substack/point-in-polygon).

If found, the point will be added to the polygon.

### For example:

Given a list of polygons, `polygons.geojson`:

```javascript
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": { },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [0,0],
                        ...
```

and a list of points, `points.csv`:

```
address,        lat, lon
111 Point Lane, 1,   1
```

`points2polygons` will assign points to matching polygons, and generate a new GeoJSON file, `output.geojson`:

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
                            "address": "111 Point Lane"
                        }
                        "geometry": {
                            "type": "Point",
                            "coordinates": [1,1]
                        }
                    }
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [0,0],
                        ...
```

Points with no polygons will be placed in their own GeoJSON file, `orphans.geojson`.

## Aggregation!

`points2polygons` can perform sum and count aggregations. Let me explain. Say you have a `town.geojson`:

```javascript
{
    "type": "Feature",
    "properties": {
        "name": "Polygonville"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [0,0],
```

and `houses.csv`:

```
address,        color, value, latitude, longitude
111 Point Lane, red,   100,   1,        1
222 Point Lane, green, 200,   2,        2
333 Point Lane, red,   300,   3,        3
```

Running `points2polygons --polygons town.geojson --points houses.csv` will correctly place the houses in our town, and generate something like this:

```javascript
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Polygonville",
                "points": [
                    // a house
                    {
                        "type": "Feature",
                        "properties": {
                            "address": "111 Point Lane",
                            "color": "red",
                            "value": "100"
                        }
                        "geometry": {
                            "type": "Point",
                            "coordinates": [1,1]
                        }
                    },
                    // another house
                    {
                        "type": "Feature",
                        "properties": {
                            "address": "222 Point Lane",
                            "color": "green",
                            "value": "200"
                        }
                        "geometry": {
                            "type": "Point",
                            "coordinates": [2,2]
                        }
                    },
                    ...
                ]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [0,0],
```

But what I really want is a count of red and green houses in my town. In other words, I want to

### count

by `color`. Use the `--count` param. Running `points2polygons --polygons town.geojson --points houses.csv --count color` generates something like this:

```javascript
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Polygonville",
                "green": 1, // there is one green house in the town
                "red": 2 // there are two red houses in the town
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [0,0],
```

`properties` doesn't contain `points` anymore, only the aggregation result.

Pretty incredible! But what I really want is a total of house values, by color. In other words, I want to

### sum

`value`, and group by `color`. Use the `--groupBy` and `--sum` params. Running `points2polygons --polygons town.geojson --points houses.csv --groupBy color --sum value` generates something like this:

```javascript
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Polygonville",
                "green": 200, // this town's green houses are worth a total of 200
                "red": 400 // this towns's red houses are worth a total of 400
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [0,0],
```

**Pretty incredible!**

## Installation

    npm install points2polygons

## Using it as a console utility

```
➜ points2polygons
Batch point-in-polygon operations. Creates a GeoJSON file of polygons containing points.
Usage: points2polygons

Options:
  -y, --polygons   a GeoJSON file of polygons                        [required]
  -t, --points     a CSV file of points                              [required]
  -i, --latitude   latitude field                                    [default: "latitude"]
  -e, --longitude  longitude field                                   [default: "longitude"]
  -d, --delimiter  delimiter character                               [default: ","]
  -o, --output     a GeoJSON file of polygons containing points      [default: "output.json"]
  -c, --count      aggregate points and count - group by this field  [default: null]
  -g, --groupBy    aggregate points and sum - group by this field    [default: null]
  -s, --sum        aggregate points and sum - sum this field         [default: null]
```

## Using it as a library

    require('points2polygons')

### .batch(polygons, points, showProgress, count, groupBy, sum)

* `polygons`: (required) a GeoJSON object of polygons.
* `points`: (required) a GeoJSON object of points.
* `showProgress`: (optional) a callback that gets fired per point processed, and receives the current point index.
* `count`: (optional) if provided, will aggregate points and count this field. [See example](https://github.com/gabrielflorit/points2polygons/edit/master/README.md#count).
* `groupBy`: (optional) if provided, will aggregate points and sum, grouping by this field. [See example](https://github.com/gabrielflorit/points2polygons/edit/master/README.md#sum).
* `sum`: (optional) if provided, will aggregate points and sum, summing by this field. [See example](https://github.com/gabrielflorit/points2polygons/edit/master/README.md#sum).
 
Returns an object with two properties:

* `polygons`: same as input, but each polygon has a `points` property containing corresponding points.
* `orphans`: a GeoJSON object containing points with no polygons.

## See also

* [point-in-polygon](https://github.com/substack/point-in-polygon): determine if a point is inside a polygon.
* [csv2geojson](https://github.com/mapbox/csv2geojson): magically convert csv files to geojson files.
