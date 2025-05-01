import random
from itertools import product

from accom_utils import (generate_accommodation_name, generate_features,
                         generate_images, generate_rating_by_type,
                         generate_skewed_distance, price_ranges,
                         random_location_at_distance)
from bins import axis_bins, type_bins


def sample_uniform_in(bin_def):
    """Given {'lowerBound': x, 'upperBound': y} sample a float in [x,y)."""
    lo = bin_def.get('lowerBound', None)
    hi = bin_def.get('upperBound', None)
    if lo is None:
        lo = 0.0
    if hi is None:
        # if no upper bound, just pick something a bit above lo
        hi = lo * 2 or lo + 10
    return round(random.uniform(lo, hi),2)

def _build_record(rec_id, price, rating, distance, accom_type):
    features = generate_features(accom_type)

    return {
      "id": str(rec_id),
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
      "price":    round(price, 2),
      "rating":   round(rating, 2),
      "distance": distance,
      "type":     accom_type,
      "features": features,
    }

def coverage_for_axes(axis1: str, axis2: str, start_id: int):
    """Seed one record for each combination of axis1×axis2 bins."""
    recs = []
    next_id = start_id

    for b1, b2 in product(axis_bins[axis1], axis_bins[axis2]):
        # pick default random values for all four dims
        price = round(random.uniform(*price_ranges[random.choice(type_bins)]), 2)
        rating = generate_rating_by_type(random.choice(type_bins))
        distance   = generate_skewed_distance()
        typ    = random.choice(type_bins)

        # override the two seeded axes:
        if axis1 == 'price':
            price = sample_uniform_in(b1)
        elif axis1 == 'rating':
            rating = sample_uniform_in(b1)
        elif axis1 == 'distance':
            distance = sample_uniform_in(b1)
        else:  # axis1 == 'type'
            typ = b1

        if axis2 == 'price':
            price = sample_uniform_in(b2)
        elif axis2 == 'rating':
            rating = sample_uniform_in(b2)
        elif axis2 == 'distance':
            distance = sample_uniform_in(b2)
        else:  # axis2 == 'type'
            typ = b2

        recs.append(_build_record(next_id, price, rating, distance, typ))
        next_id += 1

    return recs, next_id
