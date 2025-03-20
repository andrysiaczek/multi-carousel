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
        "Common room", "Free Wi-Fi", "Shared kitchen", "Lockers", "Shared bathroom", "24h reception", "Luggage storage", "Hostel entertainment"
    ],
    "Hostel (Private Room)": [
        "Private room", "Free Wi-Fi", "Shared kitchen", "Lockers", "Shared bathroom", "24h reception", "Luggage storage", "Hostel entertainment"
    ],
    "Budget Hotel": [
        "Free Wi-Fi", "Private bathroom", "Air conditioning", "24h reception", "TV in room", "Breakfast available", "Daily housekeeping"
    ],
    "Guesthouse / Bed & Breakfast (B&B)": [
        "Breakfast included", "Free Wi-Fi", "Garden", "Terrace", "Private bathroom", "Family-friendly", "Non-smoking rooms", "Tea/coffee maker"
    ],
    "Mid-Range Hotel": [
        "Free Wi-Fi", "Private bathroom", "Air conditioning", "24h reception", "Restaurant", "Bar", "Room service", "Fitness center"
    ],
    "Upper Mid-Range Hotel": [
        "Free Wi-Fi", "Private bathroom", "Rooftop terrace", "Air conditioning", "Restaurant", "Room service", "Pool", "Gym", "Bar"
    ],
    "Luxury Hotel": [
        "Spa", "Pool", "Restaurant", "Concierge", "Valet parking", "Luxury rooms", "Bar", "Room service", "Fitness center", "Sea view", "Private beach", "Airport shuttle"
    ],
    "Entire Apartment / House": [
        "Entire place", "Kitchen", "Free Wi-Fi", "Washer", "Balcony", "Air conditioning", "Coffee machine", "Self check-in", "Parking", "Pet-friendly"
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
def generate_features(accommodation_type, min_count=3, max_count=7):
    possible_features = features_by_type[accommodation_type]
    count = random.randint(min_count, max_count)
    return random.sample(possible_features, count)

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
