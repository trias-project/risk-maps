# trias-risk-map

Small Vue-based tool to show risk maps (modelled data from GeoTiff files, and occurrences from ), without any server-side component.

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
3. Add a configuration entry to `Home.vue`

### Updating data (GeoTiff and/or occurrences from the cube) files

1. If there are new GeoTiffs, copy received files to `source_data/geotiffs`
2. Run `$ python prepare_all_data.py`

That's all, the script will save its output to `src/species_config.json`.

## License

[MIT License](LICENSE)
