# TODO: Document this script use in README
# TODO: create requirements.txt for all requirements for this scriopt, and also prepare_geotiffs.py

import pandas as pd
import geopandas as gpd
import fiona
import fiona.crs
import pprint
import os
import json

dirname = os.path.dirname(__file__)

MIN_COORD_UNCERTAINTY_SMALLER_OR_EQUAL_TO = 1000
MIN_YEAR = 1976
MAX_YEAR = 2020
BELGIAN_ALIEN_CUBE_URL = "https://raw.githubusercontent.com/trias-project/occ-cube-alien/master/data/processed/be_alientaxa_cube.csv"
OUTPUT_EPSG = "4326"


def _get_cube():
    return pd.read_csv(BELGIAN_ALIEN_CUBE_URL)


def _build_output_df_for_taxon(taxon_id, cube, eea_grid):
    cube = cube[cube["taxonKey"] == int(taxon_id)]  # We only select data about the requested taxon

    cube_grouped_by_cell = {}
    for cell_name, group in cube.groupby("eea_cell_code"):
        cell_dict = {}
        for _, row in group.iterrows():
            cell_dict[row["year"]] = {"n": row["n"], "min_coord_uncertainty": row["min_coord_uncertainty"]}
        cube_grouped_by_cell[cell_name] = cell_dict

    # cube_grouped_by_cell has the following format:
    # {"1kmE3847N3100": {2019: {"min_coord_uncertainty": 8.0, "n": 1}},
    # "1kmE3847N3142": {2017: {"min_coord_uncertainty": 10.0, "n": 1},
    #                   2020: {"min_coord_uncertainty": 25.0, "n": 2}},
    # ...}

    print("DEBUG: prepared data: ")
    pprint.pprint(cube_grouped_by_cell)

    output_df = gpd.GeoDataFrame(data=[], columns=["cell_code", "geometry", "taxa"], crs=fiona.crs.from_epsg(OUTPUT_EPSG), )

    for cell_code, species_data in cube_grouped_by_cell.items():
        cell_data = eea_grid[eea_grid["CELLCODE"] == cell_code]

        output_df = output_df.append({"cell_code": cell_code, "geometry": cell_data.geometry.values[0], "taxa": species_data}, ignore_index=True)
    return output_df


def _save_empty_geojson_file(fn):
    with open(fn, "w") as outfile:
        json.dump({"type": "FeatureCollection", "features": []}, outfile)


def create_occurrence_geojsons(destination_dir):
    """Returns the list of all processed taxon IDs"""
    print("Downloading Belgian Alien data cube...", end="")
    cube = _get_cube()
    print("done.")

    print("Importing EEA grid data...", end="")
    eea_grid = gpd.read_file(os.path.join(dirname, "./source_data/eea_grid_shapefile/be_1km.shp"))
    eea_grid = eea_grid.to_crs(epsg=OUTPUT_EPSG)  # Reproject so we can later safely copy geometries to the output dataframe
    print("done.")

    print(f"Filtering cube so coordindates uncertainty is < {MIN_COORD_UNCERTAINTY_SMALLER_OR_EQUAL_TO}...", end="")
    cube = cube[cube["min_coord_uncertainty"] <= MIN_COORD_UNCERTAINTY_SMALLER_OR_EQUAL_TO]
    print("done.")

    print(f"Filtering cube for relevant years")
    cube = cube[cube["year"] >= MIN_YEAR]
    cube = cube[cube["year"] <= MAX_YEAR]
    print("done")

    taxa_ids = []

    for taxon_id in cube["taxonKey"].unique():
        taxa_ids.append(int(taxon_id))
        print(f"Building dataframe for taxon {taxon_id}...", end="")
        output_df = _build_output_df_for_taxon(taxon_id, cube, eea_grid)
        print("done.")

        print(f"Saving GeoJSON file for taxon {taxon_id}...", end="")
        fn = os.path.join(destination_dir, f"be_{taxon_id}_occurrences.geojson")
        if output_df.empty:
            _save_empty_geojson_file(fn)
        else:
            output_df.to_file(fn, driver="GeoJSON")
        
        print("done.")

    print("All done!")
    return taxa_ids
