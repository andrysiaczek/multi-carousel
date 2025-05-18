import json
from collections import Counter

import pandas as pd

# Load JSON data from a file
file_path = '/data/finalDataN68.json'
with open(file_path, "r") as f:
    data = json.load(f)

# Extract one interfaceOrder per session
study_data = data["__collections__"]["multi-carousel-study"]
interface_orders = []

for session_id, session_content in study_data.items():
    steps = session_content.get("__collections__", {}).get("steps", {})
    for step in steps.values():
        order = step.get("interfaceOrder")
        if order:
            interface_orders.append(tuple(order))
            break  # Use only one interfaceOrder per session

# Count and save
order_counts = Counter(interface_orders)
df_counts = pd.DataFrame(order_counts.items(), columns=["interface_order", "count"])
df_counts["interface_order"] = df_counts["interface_order"].apply(lambda x: ", ".join(x))
df_counts.to_csv("interface_order_count.csv", index=False)
