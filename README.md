batch-point-in-polygon
===============

Given a list of polygons and points, batch-point-in-polygon will determine if each point is inside a polygon.

If found, the point will be added to the polygon.


### example:

Given a list of polygons, `polygons.geojson`:

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

and a list of points, `points.geojson`:

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

the following command

    node app.js --polygons polygons.geojson --points points.geojson --output output.geojson

will assign points to matching polygons, and generate a new GeoJSON file, `output.geojson`:

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
