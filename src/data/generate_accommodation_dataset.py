import json
import random

from accom_utils import (generate_accommodation_name, generate_features,
                         generate_images, generate_rating_by_type,
                         generate_skewed_distance, price_ranges,
                         random_location_at_distance)
from coverage_utils import coverage_for_axes

# Total accommodations count to generate by this script
TOTAL_COUNT=250

axis_pairs = [
    ('price','rating'),
    ('price','distance'),
    ('price','type'),
    ('rating','distance'),
    ('rating','type'),
    ('distance','type'),
]

dataset, next_id = [], 1
# Seed every combination of the six axis-pairs
for axis1, axis2 in axis_pairs:
    recs, next_id = coverage_for_axes(axis1, axis2, next_id)
    needed = TOTAL_COUNT - len(dataset)
    dataset.extend(recs[:needed])
    if len(dataset) >= TOTAL_COUNT:
        print("Warning: total count exceeded. Breaking the loop.")
        break

def build_random_accommodation(id: int) -> dict:
    accom_type = random.choice(list(price_ranges.keys()))
    price_range = price_ranges[accom_type]
    distance = generate_skewed_distance()
    features = generate_features(accom_type)

    return {
        "id": str(id),
        "versionBenchmark": {
            "name": generate_accommodation_name(accom_type),
            "location": random_location_at_distance(distance),
            "images": generate_images(accom_type, features)},
        "versionSingleAxisCarousel": {
            "name": generate_accommodation_name(accom_type),
            "location": random_location_at_distance(distance),
            "images": generate_images(accom_type, features)},
        "versionMultiAxisCarousel": {
            "name": generate_accommodation_name(accom_type),
            "location": random_location_at_distance(distance),
            "images": generate_images(accom_type, features)},
        "price": round(random.uniform(price_range[0], price_range[1]), 2),
        "rating": generate_rating_by_type(accom_type),
        "distance": distance,
        "type": accom_type,
        "features": features,
    }

# Generate the rest of the dataset
while len(dataset) < TOTAL_COUNT:
    dataset.append( build_random_accommodation(next_id) )
    next_id += 1

# Save dataset
with open("/src/data/accommodationDataset.json", "w") as f:
    json.dump(dataset, f, indent=2)

"/src/data/accommodationDataset.json"
