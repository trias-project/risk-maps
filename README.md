# trias-risk-map

Small Vue-based prototype to show risk maps (data from GeoTiff files), without any server-side component.

## Installation and deployment

Install with:

```
npm install
```

Run in development with:

```
npm run serve
```

Build with:

```
npm run build
```

Then commit and push, including the `docs` directory. GitHub pages does the rest and will serve the site at <https://trias-project.github.io/risk-maps/>.

### Adding map overlays

1. Keep source data in `source_data/overlays`
2. Convert to GeoJSON (also reproject and simplify as needed), and keep the result in `public/overlays`. Example:

```
$ ogr2ogr -f GeoJSON -t_srs crs:84 -simplify 30 public/overlays/ecoregions.geojson source_data/overlays/ecoregions/ecoregions.shp
```

### Updating GeoTiff files

This process will also update occurrences based on the latest version of the data cube.

1. Copy received files to `source_data/geotiffs`
2. Run `$ python prepare_all_data_from_geotiffs`
3. Copy paste the species configuration (from the output of this script to `RiskMapApp.vue` (`data` section)

## License

[MIT License](LICENSE)
