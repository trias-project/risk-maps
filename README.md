# trias-risk-map

Small Vue-based prototype to show risk maps (data from GeoTiff files), without any server-side component.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### To deploy

On [https://trias-project.github.io/risk-maps/](https://trias-project.github.io/risk-maps/)

```
$ npm run build
```

Then commit and push, including the `docs` directory. GitHub pages does the rest. 

### Map overlays

1) Keep source data in `source_data/overlays`
2) Convert to GeoJSON (also reproject and simplify as needed), and keep the result in `public/overlays`. Example:

    $ ogr2ogr -f GeoJSON -t_srs crs:84 -simplify 30 public/overlays/ecoregions.geojson source_data/overlays/ecoregions/ecoregions.shp