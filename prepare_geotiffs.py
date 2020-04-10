# This script reprojects and copy to the right location the source GeoTiff
# files (from source_data/geotiffs) It will also extract species info from
# the filenames and outputs configuration that can be copy-pasted in the
# JS applicatio.

# Requirements
# ============
#
# the "gdalwarp" command must be on the path
# The pygbif python package is also needed

import os
import shutil
import subprocess
from pygbif import species
import json

dirname = os.path.dirname(__file__)

# Configuration
SOURCE_DIR = os.path.join(dirname, "./source_data/geotiffs")
DESTINATION_DIR = os.path.join(dirname, "./public/geotiffs")
PURGE_DESTINATION_DIR = True
# Beware!! The source file appears to be EPSG:4151, but it's because of
# incomplete/incorrect metadata
SOURCE_EPSG = "EPSG:3035"
DESTINATION_EPSG = "EPSG:4326"


# 1. Empty destination dir, if requested
if PURGE_DESTINATION_DIR:
    shutil.rmtree(DESTINATION_DIR)
    os.makedirs(DESTINATION_DIR)

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
                        os.path.join(DESTINATION_DIR, destination_filename)])


# 3. Get species data and generate configuration:
species_conf = []
for species_id in species_ids:
    sn = species.name_usage(key=species_id)['scientificName']
    species_conf.append({'value': int(species_id), 'text': sn})

species_conf = sorted(species_conf, key=lambda k: k['text'])
print("Species configuration (to copy-paste in config file): ")
print("======================================================")
print(json.dumps(species_conf, indent=2))
