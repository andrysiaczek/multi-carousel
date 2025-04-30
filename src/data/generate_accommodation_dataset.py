import json
import os
import random

from geopy.distance import distance as geopy_distance
from geopy.point import Point

# Accommodation types and corresponding price ranges
price_ranges = {
    "Hostel (Dormitory Bed)": (15, 35),
    "Hostel (Private Room)": (50, 80),
    "Budget Hotel": (50, 90),
    "Guesthouse / Bed & Breakfast (B&B)": (60, 120),
    "Mid-Range Hotel": (90, 150),
    "Upper Mid-Range Hotel": (130, 200),
    "Luxury Hotel": (250, 600),
    "Entire Apartment / House": (70, 300)
}

# Accommodation types and corresponding rating ranges
rating_ranges = {
    "Hostel (Dormitory Bed)": (2.5, 4.2),
    "Hostel (Private Room)": (3.0, 4.5),
    "Budget Hotel": (3.0, 4.2),
    "Guesthouse / Bed & Breakfast (B&B)": (3.5, 4.8),
    "Mid-Range Hotel": (3.8, 4.7),
    "Upper Mid-Range Hotel": (4.0, 4.9),
    "Luxury Hotel": (4.3, 5.0),
    "Entire Apartment / House": (3.8, 5.0),
}

# Features list (tailored to accommodation type)
features_by_type = {
    "Hostel (Dormitory Bed)": [
        "Hostel entertainment", "Shared kitchen", "Common room", "Lockers", "Shared bathroom", 
    ],
    "Hostel (Private Room)": [
        "Hostel entertainment", "Shared kitchen", "Shared bathroom", "Private room", "Tea/coffee maker"
    ],
    "Budget Hotel": [
        "Private room", "Private bathroom", "Tea/coffee maker"
    ],
    "Guesthouse / Bed & Breakfast (B&B)": [
       "Private room", "Private bathroom", "Breakfast available", "Tea/coffee maker"
    ],
    "Mid-Range Hotel": [
        "Free Wi-Fi", "Luggage storage", "Private room", "Private bathroom", "Breakfast available", "Tea/coffee maker"
    ],
    "Upper Mid-Range Hotel": [
       "Free Wi-Fi", "24h reception", "Luggage storage", "Private room", "Private bathroom", "Air conditioning", "TV in room", "Breakfast available", "Restaurant", "Bar", "Airport shuttle", "Coffee machine", "Parking"
    ],
    "Luxury Hotel": [
        "Free Wi-Fi", "24h reception", "Luggage storage", "Private room", "Private bathroom", "Air conditioning", "TV in room", "Breakfast available", "Daily housekeeping", "Restaurant", "Bar", "Room service", "Fitness center", "Pool", "Gym", "Airport shuttle", "Coffee machine", "Parking"
    ],
    "Entire Apartment / House": [
       "Free Wi-Fi", "Tea/coffee maker", "Entire place", "Kitchen", "Washer", "Washing machine", "Pet-friendly", "Balcony"
    ]
}

dynamic_features_by_type = {
    "Hostel (Dormitory Bed)": [
        "Free Wi-Fi", "24h reception", "Breakfast available", "Non-smoking rooms", "Bar", "Rooftop terrace", "Pool", "Self check-in"
    ],
    "Hostel (Private Room)": [
        "Free Wi-Fi", "24h reception", "Breakfast available", "Non-smoking rooms", "Bar", "Rooftop terrace", "Pool", "Self check-in", "Lockers"
    ],
    "Budget Hotel": [
        "Free Wi-Fi", "Shared bathroom", "24h reception", "Luggage storage", "Air conditioning", "Breakfast available", "Non-smoking rooms", "Balcony", "Self check-in", "Parking", "Pet-friendly"
    ],
    "Guesthouse / Bed & Breakfast (B&B)": [
       "Shared kitchen", "Free Wi-Fi", "24h reception", "Luggage storage", "Air conditioning", "TV in room", "Breakfast included", "Family-friendly", "Non-smoking rooms", "Restaurant", "Room service", "Rooftop terrace", "Balcony", "Parking", "Pet-friendly"
    ],
    "Mid-Range Hotel": [
        "24h reception", "Air conditioning", "TV in room", "Breakfast included", "Family-friendly", "Non-smoking rooms", "Restaurant", "Bar", "Room service", "Fitness center", "Rooftop terrace", "Pool", "Gym", "Sea view", "Balcony", "Self check-in", "Parking", "Pet-friendly"
    ],
    "Upper Mid-Range Hotel": [
        "Daily housekeeping", "Breakfast included", "Family-friendly", "Non-smoking rooms", "Room service", "Fitness center", "Rooftop terrace", "Pool", "Gym", "Spa", "Concierge", "Sea view", "Private beach", "Balcony"
    ],
    "Luxury Hotel": [
        "Breakfast included", "Non-smoking rooms", "Rooftop terrace", "Spa", "Concierge", "Sea view", "Private beach", "Balcony"
    ],
    "Entire Apartment / House": [
       "Luggage storage", "Air conditioning", "TV", "Garden", "Terrace", "Non-smoking rooms", "Pool", "Sea view", "Private beach", "Self check-in", "Parking"
    ]
}

# Location center
valencia_center = (39.4699, -0.3763)

# First part of the name (adjective/descriptive) (tailored to accommodation type)
names_part_1_by_type = {
    "Hostel (Dormitory Bed)": [
        "Cozy", "Urban", "Trendy", "Happy", "Youth", "Chill", "Cool",
        "Breezy", "Cheerful", "Wander", "Roaming", "Lively", "Vibrant"
    ],
    "Hostel (Private Room)": [
        "Cozy", "Urban", "Charming", "Youth", "Trendy", "Colorful",
        "Friendly", "Hip", "Nest", "Quiet", "Warm", "Crisp"
    ],
    "Budget Hotel": [
        "Budget", "Simple", "Easy", "Urban", "Classic", "Friendly",
        "Essential", "Compact", "Bright", "Smart", "City", "Affordable"
    ],
    "Guesthouse / Bed & Breakfast (B&B)": [
        "Charming", "Rustic", "Peaceful", "Country", "Family", "Comfy",
        "Homely", "Quaint", "Sunny", "Quiet", "Inviting", "Relaxing"
    ],
    "Mid-Range Hotel": [
        "Modern", "Stylish", "Classic", "Central", "Elegant", "City",
        "Urban", "Convenient", "Smart", "Comfort", "Civic", "Balance"
    ],
    "Upper Mid-Range Hotel": [
        "Boutique", "Elegant", "Trendy", "Classic", "Stylish", "Grand",
        "Artisan", "Refined", "Executive", "Chic", "Polished", "Grace"
    ],
    "Luxury Hotel": [
        "Luxury", "Grand", "Royal", "Elegant", "Exclusive", "Majestic",
        "Opulent", "Prestige", "Premier", "Palatial", "Golden", "Serene"
    ],
    "Entire Apartment / House": [
        "Sunny", "Modern", "Cozy", "Charming", "Stylish", "Central", "Hidden",
        "Private", "Minimal", "Airy", "Open", "Scenic", "Peaceful"
    ]
}

# Second part of the name (tailored to accommodation type)
names_part_2_by_type = {
    "Hostel (Dormitory Bed)": [
        "Hostel", "Inn", "Place", "Stay", "Rooms", "Lounge", "Bunk", "Commons", "Camp"
    ],
    "Hostel (Private Room)": [
        "Hostel", "Inn", "Place", "Stay", "Rooms", "Retreat", "Nook", "Den", "Corner"
    ],
    "Budget Hotel": [
        "Hotel", "Inn", "Stay", "Residence", "Suites", "Rooms", "Lodge", "Stopover", "Nights"
    ],
    "Guesthouse / Bed & Breakfast (B&B)": [
        "Guesthouse", "House", "B&B", "Cottage", "Inn", "Lodge", "Villa", "Retreat", "Haven"
    ],
    "Mid-Range Hotel": [
        "Hotel", "Residence", "Suites", "Place", "Stay", "Commons", "Inn", "Center", "Spot"
    ],
    "Upper Mid-Range Hotel": [
        "Hotel", "Boutique", "Suites", "Residence", "Stay", "Haven", "Collection", "Villa"
    ],
    "Luxury Hotel": [
        "Hotel", "Suites", "Resort", "Palace", "Villa", "Collection", "Estate", "Sanctuary", "Retreat"
    ],
    "Entire Apartment / House": [
        "Apartment", "House", "Flat", "Villa", "Loft", "Studio", "Suite", "Cabin", "Getaway", "Retreat"
    ]
}

# Generate a skewed rating
def generate_rating_by_type(accommodation_type: str) -> float:
    low, high = rating_ranges.get(accommodation_type, (3.0, 4.5))
    # Bias towards higher values in range
    return round(random.triangular(low, high, high), 2)
    
# Generate a skewed distance: most close, some medium, few far    
def generate_skewed_distance():
    random_value = random.random()
    if random_value < 0.4:
        # Central (0.0–1.0 km): 40%
        return round(random.uniform(0.0, 1.0), 2)
    elif random_value < 0.6:
        # Walkable (1.5–3.5 km): 20%
        return round(random.uniform(1.0, 1.5), 1)
    elif random_value < 0.85:
        # Walkable but farther (1.5–3.5 km): 25%
        return round(random.uniform(1.5, 3.5), 1)
    elif random_value < 0.97:
        # Commutable (3.5–6.0 km): 12%
        return round(random.uniform(3.5, 6.0), 1)
    else:
        # Far suburbs or remote (6.0–10.0 km): 3%
        return round(random.uniform(6.0, 10.0), 1)
    
def random_location_at_distance(dist_km):
    bearing = random.uniform(0, 360)  # Random direction in degrees
    origin = Point(valencia_center[0], valencia_center[1])
    destination = geopy_distance(kilometers=dist_km).destination(origin, bearing)
    return {"lat": round(destination.latitude, 6), "lng": round(destination.longitude, 6)}

# Helper to pick appropriate features based on type
def generate_features(accommodation_type):
    features = features_by_type[accommodation_type]
    dynamic_features = dynamic_features_by_type[accommodation_type]

    # Determine the number of dynamic features to pick
    max_dynamic_count = len(dynamic_features)
    min_dynamic_count = max(0, max_dynamic_count - 6)
    dynamic_count = random.randint(min_dynamic_count, max_dynamic_count)

    # Randomly select the determined number of dynamic features
    selected_dynamic_features = random.sample(dynamic_features, dynamic_count)

    # Combine static and dynamic features
    combined_features = list(set(features + selected_dynamic_features))

    return combined_features

# Helper to generate accommodation name
def generate_accommodation_name(accommodation_type):
    part1_options = names_part_1_by_type[accommodation_type]
    part2_options = names_part_2_by_type[accommodation_type]
    part1 = random.choice(part1_options)
    part2 = random.choice(part2_options)
    return f"{part1} {part2}"

# Helper to generate random location near a center
def random_location(center):
    lat_offset = random.uniform(-0.02, 0.02)
    lng_offset = random.uniform(-0.02, 0.02)
    return {"lat": round(center[0] + lat_offset, 6), "lng": round(center[1] + lng_offset, 6)}

# Helper to pick appropriate images based on type
def generate_images(accom_type, features):
    # Accommodation type mappings
    type_mapping = {
        "Hostel (Dormitory Bed)": "hostel_dormitory_bed",
        "Hostel (Private Room)": "hostel_private_room",
        "Budget Hotel": "budget_hotel",
        "Guesthouse / Bed & Breakfast (B&B)": "guesthouse_bnb",
        "Mid-Range Hotel": "midrange_hotel",
        "Upper Mid-Range Hotel": "upper_midrange_hotel",
        "Luxury Hotel": "luxury_hotel",
        "Entire Apartment / House": "entire_apartment_house"
    }

    # Feature mapping for images
    feature_mapping = {
        "Gym": "gym",
        "Pool": "pool",
        "Rooftop terrace": "rooftop_terrace",
        "Sauna": "sauna",
        "Sea view": "sea_view",
    }

    # Determine folder paths based on accommodation type
    base_path = "/images/"
    accom_folder = type_mapping.get(accom_type, "generic")

    # Accommodation image categories
    if accom_type == "Entire Apartment / House":
        categories = ["balcony", "bathroom", "kitchen", "living_room", "room"]
    else:
        categories = ["room", "bathroom", "reception"]

    # Gather accommodation images
    image_paths = []
    for category in categories:
        image_number = random.randint(1, 10)  # Randomly pick a number from 1 to 10
        image_file = f"{category}{image_number}.jpg"
        image_path = os.path.join(base_path, accom_folder, category, image_file)
        image_paths.append(image_path)

    # Gather feature images
    for feature in features:
        if feature in feature_mapping:
            folder_name = feature_mapping[feature]
            image_number = random.randint(1, 5)  # Randomly pick from 5 feature images
            image_file = f"{folder_name}{image_number}.jpg"
            image_path = os.path.join(base_path, "features", folder_name, image_file)
            image_paths.append(image_path)

    return image_paths

# Generate dataset
dataset = []
for i in range(1, 201):  # 200 accommodations
    accom_type = random.choice(list(price_ranges.keys()))
    price_range = price_ranges[accom_type]
    distance = generate_skewed_distance()
    features = generate_features(accom_type)

    dataset.append({
        "id": str(i),
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
    })

# Save dataset
with open("/src/data/accommodationDataset.json", "w") as f:
    json.dump(dataset, f, indent=2)

"/src/data/accommodationDataset.json"
