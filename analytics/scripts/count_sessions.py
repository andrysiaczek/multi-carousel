import json

import pandas as pd

# === Part 1: Count all sessions in the raw JSON ===
json_path = '/data/finalData.json'
with open(json_path, 'r') as f:
    data = json.load(f)

study_data = data.get("__collections__", {}).get("multi-carousel-study", {})
all_session_ids = list(study_data.keys())
total_raw_sessions = len(all_session_ids)

# === Part 2: Count distinct sessions in the cleaned dataset ===
df_clean = pd.read_csv("/data/task_metrics_clean.csv")
distinct_clean_sessions = df_clean["session_id"].nunique()

# === Part 3: Count distinct full sessions ===
df_clean_full = pd.read_csv("/data/task_metrics_clean_full_participants.csv")
distinct_clean_full_sessions = df_clean_full["session_id"].nunique()

# === Print results ===
print(f"Total sessions in raw JSON: {total_raw_sessions}")
print(f"Distinct sessions in cleaned dataset: {distinct_clean_sessions}")
print(f"Distinct full sessions in full-participant dataset: {distinct_clean_full_sessions}")

# === Save to CSV ===
summary_df = pd.DataFrame({
    "Dataset": [
        "Raw JSON (all sessions)",
        "Cleaned dataset (valid tasks)",
        "Cleaned full participants (used in inferential stats)"
    ],
    "Session Count": [
        total_raw_sessions,
        distinct_clean_sessions,
        distinct_clean_full_sessions
    ]
})

summary_df.to_csv("session_counts_summary.csv", index=False)
