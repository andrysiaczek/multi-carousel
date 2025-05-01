from accom_utils import (price_ranges)

price_bins = [
    { "label": "Very Low",  "lowerBound":   None, "upperBound":  50 },
    { "label": "Low",       "lowerBound":   50,   "upperBound": 100 },
    { "label": "Medium",    "lowerBound":  100,   "upperBound": 250 },
    { "label": "High",      "lowerBound":  250,   "upperBound":  None },
]

rating_bins = [
    { "label": "Low",       "lowerBound":   None, "upperBound":   3.0 },
    { "label": "Medium",    "lowerBound":    3.0, "upperBound":   4.0 },
    { "label": "High",      "lowerBound":    4.0, "upperBound":   4.5 },
    { "label": "Very High", "lowerBound":    4.5, "upperBound":   None },
]

distance_bins = [
    { "label": "Very Close", "lowerBound":   None, "upperBound":  1.0 },
    { "label": "Close",      "lowerBound":    1.0, "upperBound":  3.0 },
    { "label": "Medium",     "lowerBound":    3.0, "upperBound":  6.0 },
    { "label": "Far",        "lowerBound":    6.0, "upperBound":  None },
]

type_bins = list(price_ranges.keys())

# A lookup for coverage_for_axes('price','rating',…) etc.
axis_bins = {
    'price': price_bins,
    'rating': rating_bins,
    'distance': distance_bins,
    'type': type_bins,
}