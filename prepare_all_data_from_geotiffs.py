# This script prepares all data for the JS viewer, based on the source GeoTiff
# files (from source_data/geotiffs):
#
# - The GeoTiff files are reprojected and copied to the destination directory
# - The taxon IDs are extracted from the filenames
# - For each taxon, a GeoJSON file is generated with the current occurrences (based on the Belgian cube and the EEA grid)
# - Finally, a JSON species list (to be copy-pasted in the webapp configuration) is generated


# Requirements
# ============
#
# the "gdalwarp" command must be on the path
# The pygbif python package is also needed
# + Pandas / geopandas

import os
import shutil
import subprocess
from pygbif import species
import json

from prepare_occurrence_data import create_occurrence_geojsons

dirname = os.path.dirname(__file__)

# Configuration
SOURCE_DIR = os.path.join(dirname, "./source_data/geotiffs")
GEOTIFF_DESTINATION_DIR = os.path.join(dirname, "./public/geotiffs")
OCCURRENCES_DESTINATION_DIR = os.path.join(dirname, "./public/occurrences")
PURGE_DESTINATION_DIRS = True
# Beware!! The GeoTiff source file appears to be EPSG:4151, but it's because of
# incomplete/incorrect metadata
SOURCE_EPSG = "EPSG:3035"
DESTINATION_EPSG = "EPSG:4326"


def _recreate_dir(path):
    try:
        shutil.rmtree(path)
    except FileNotFoundError:
        pass
    os.makedirs(path)


# 1. Empty destination dirs, if requested
if PURGE_DESTINATION_DIRS:
    _recreate_dir(GEOTIFF_DESTINATION_DIR)
    _recreate_dir(OCCURRENCES_DESTINATION_DIR)

# 2. For each source file
species_ids = set()  # GBIF species IDs found in sour ce GeoTiffs

for filename in os.listdir(SOURCE_DIR):
    # Only applies to content that looks like Amy's GeoTiffs
    if filename.startswith("be_"):
        # 2.1 Keep track of all encountered species
        species_id = filename.split('_')[1]
        species_ids.add(species_id)

        # 2.2 Reproject the file and save it to DESTINATION_DIR
        base_filename, extension_filename = os.path.splitext(filename)
        destination_filename = f"{base_filename}.4326{extension_filename}"

        subprocess.run(["gdalwarp",
                        "-s_srs", SOURCE_EPSG,
                        "-t_srs", DESTINATION_EPSG,
                        os.path.join(SOURCE_DIR, filename),
                        os.path.join(GEOTIFF_DESTINATION_DIR, destination_filename)])


# 3. Create occurrence GeoJSON files:
create_occurrence_geojsons(species_ids, destination_dir=OCCURRENCES_DESTINATION_DIR)

# 4. Get species data and generate configuration:
species_conf = []
for species_id in species_ids:
    sn = species.name_usage(key=species_id)['scientificName']
    species_conf.append({'value': int(species_id), 'text': sn})

species_conf = sorted(species_conf, key=lambda k: k['text'])
print("Species configuration (to copy-paste in config file): ")
print("======================================================")
print(json.dumps(species_conf, indent=2))
