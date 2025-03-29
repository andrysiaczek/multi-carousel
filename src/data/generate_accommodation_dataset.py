import random
import json

# Accommodation types and corresponding price ranges
accommodation_types = {
    "Hostel (Dormitory Bed)": (18, 35),
    "Hostel (Private Room)": (50, 80),
    "Budget Hotel": (50, 90),
    "Guesthouse / Bed & Breakfast (B&B)": (60, 120),
    "Mid-Range Hotel": (90, 150),
    "Upper Mid-Range Hotel": (130, 200),
    "Luxury Hotel": (250, 600),
    "Entire Apartment / House": (70, 300)
}

# Features list (tailored to accommodation type)
features_by_type = {
    "Hostel (Dormitory Bed)": [
        "Hostel entertainment", "Shared kitchen", "Common room", "Lockers", "Shared bathroom", 
    ],
    "Hostel (Private Room)": [
        "Hostel entertainment", "Shared kitchen", "Lockers", "Shared bathroom", "Private room", "Tea/coffee maker"
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
       "Free Wi-Fi", "Tea/coffee maker", "Entire place", "Kitchen", "Washer", "Washing machine", "Pet-friendly"
    ]
}

dynamic_features_by_type = {
    "Hostel (Dormitory Bed)": [
        "Free Wi-Fi", "24h reception", "Breakfast available", "Non-smoking rooms", "Bar", "Rooftop terrace", "Pool", "Self check-in"
    ],
    "Hostel (Private Room)": [
        "Free Wi-Fi", "24h reception", "Breakfast available", "Non-smoking rooms", "Bar", "Rooftop terrace", "Pool", "Self check-in"
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
       "Luggage storage", "Air conditioning", "TV", "Garden", "Terrace", "Non-smoking rooms", "Pool", "Sea view", "Private beach", "Balcony", "Self check-in", "Parking"
    ]
}

# Image mappings
image_mappings = {
    "Hostel": (["hostel1.jpg", "hostel2.jpg", "hostel3.jpg"], ["hostel4.jpg", "hostel5.jpg", "hostel6.jpg"]),
    "Budget Hotel": (["budget1.jpg", "budget2.jpg", "budget3.jpg"], ["budget4.jpg", "budget5.jpg", "budget6.jpg"]),
    "Guesthouse": (["guesthouse1.jpg", "guesthouse2.jpg", "guesthouse3.jpg"], ["guesthouse4.jpg", "guesthouse5.jpg", "guesthouse6.jpg"]),
    "Mid-Range Hotel": (["midrange1.jpg", "midrange2.jpg", "midrange3.jpg"], ["midrange4.jpg", "midrange5.jpg", "midrange6.jpg"]),
    "Upper Mid-Range Hotel": (["uppermid1.jpg", "uppermid2.jpg", "uppermid3.jpg"], ["uppermid4.jpg", "uppermid5.jpg", "uppermid6.jpg"]),
    "Luxury Hotel": (["luxury1.jpg", "luxury2.jpg", "luxury3.jpg"], ["luxury4.jpg", "luxury5.jpg", "luxury6.jpg"]),
    "Entire Apartment": (["apartment1.jpg", "apartment2.jpg", "apartment3.jpg"], ["apartment4.jpg", "apartment5.jpg", "apartment6.jpg"])
}

# Location centers
valencia_center = (39.4699, -0.3763)
malaga_center = (36.7213, -4.4214)

# First part of the name (adjective/descriptive) (tailored to accommodation type)
names_part_1_by_type = {
    "Hostel (Dormitory Bed)": ["Cozy", "Urban", "Trendy", "Happy", "Youth", "Chill", "Cool"],
    "Hostel (Private Room)": ["Cozy", "Urban", "Charming", "Youth", "Trendy", "Colorful"],
    "Budget Hotel": ["Budget", "Simple", "Easy", "Urban", "Classic", "Friendly"],
    "Guesthouse / Bed & Breakfast (B&B)": ["Charming", "Rustic", "Peaceful", "Country", "Family", "Comfy"],
    "Mid-Range Hotel": ["Modern", "Stylish", "Classic", "Central", "Elegant", "City"],
    "Upper Mid-Range Hotel": ["Boutique", "Elegant", "Trendy", "Classic", "Stylish", "Grand"],
    "Luxury Hotel": ["Luxury", "Grand", "Royal", "Elegant", "Exclusive", "Majestic"],
    "Entire Apartment / House": ["Sunny", "Modern", "Cozy", "Charming", "Stylish", "Central", "Hidden"]
}

# Second part of the name (tailored to accommodation type)
names_part_2_by_type = {
    "Hostel (Dormitory Bed)": ["Hostel", "Inn", "Place", "Stay", "Rooms"],
    "Hostel (Private Room)": ["Hostel", "Inn", "Place", "Stay", "Rooms"],
    "Budget Hotel": ["Hotel", "Inn", "Stay", "Residence", "Suites"],
    "Guesthouse / Bed & Breakfast (B&B)": ["Guesthouse", "House", "B&B", "Cottage", "Inn"],
    "Mid-Range Hotel": ["Hotel", "Residence", "Suites", "Place"],
    "Upper Mid-Range Hotel": ["Hotel", "Boutique", "Suites", "Residence", "Stay"],
    "Luxury Hotel": ["Hotel", "Suites", "Resort", "Palace", "Villa"],
    "Entire Apartment / House": ["Apartment", "House", "Flat", "Villa", "Loft", "Studio"]
}

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
def get_images(accom_type):
    if "Hostel" in accom_type:
        return image_mappings["Hostel"]
    elif "Budget Hotel" in accom_type:
        return image_mappings["Budget Hotel"]
    elif "Guesthouse" in accom_type:
        return image_mappings["Guesthouse"]
    elif "Mid-Range Hotel" in accom_type:
        return image_mappings["Mid-Range Hotel"]
    elif "Upper Mid-Range Hotel" in accom_type:
        return image_mappings["Upper Mid-Range Hotel"]
    elif "Luxury Hotel" in accom_type:
        return image_mappings["Luxury Hotel"]
    elif "Entire Apartment" in accom_type:
        return image_mappings["Entire Apartment"]
    else:
        return ([], [])

# Generate dataset
dataset = []
for i in range(1, 151):  # 150 accommodations
    accom_type = random.choice(list(accommodation_types.keys()))
    price_range = accommodation_types[accom_type]
    price = round(random.uniform(price_range[0], price_range[1]), 2)
    rating = round(random.uniform(1.0, 5.0), 1)
    distance = round(random.uniform(1.0, 10.0), 1)
    features = generate_features(accom_type)
    nameI = generate_accommodation_name(accom_type)
    nameII = generate_accommodation_name(accom_type)
    locationI = random_location(valencia_center)
    locationII = random_location(malaga_center)
    imagesI, imagesII = get_images(accom_type)

    dataset.append({
        "id": str(i),
        "nameI": nameI,
        "nameII": nameII,
        "price": price,
        "rating": rating,
        "distance": distance,
        "type": accom_type,
        "features": features,
        "locationI": locationI,
        "locationII": locationII,
        "imagesI": imagesI,
        "imagesII": imagesII
    })

# Save dataset
with open("/src/data/accommodationDataset.json", "w") as f:
    json.dump(dataset, f, indent=2)

"/src/data/accommodationDataset.json"
