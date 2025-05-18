import ast
import os

import pandas as pd

# Load survey data
df = pd.read_csv("survey_post_interface_clean.csv")

# Parse qualitative column from stringified JSON to list-of-dicts
df["qualitative"] = df["qualitative"].apply(lambda x: ast.literal_eval(x) if pd.notnull(x) else [])

# Interface-specific qualitative question ID prefixes
interface_qual_ids = {
    "benchmark": [
        "benchmark_feature_ideas"
    ],
    "single": [
        "single_what_works",
        "single_title_filter_feedback",
        "single_title_filter_improve"
    ],
    "multi": [
        "multi_what_works",
        "multi_improve"
    ]
}

# Flatten qualitative feedback into rows
rows = []
for _, row in df.iterrows():
    session = row["session_id"]
    interface = row["interface_option"]
    for q in row["qualitative"]:
        qid = q["questionId"]
        if qid in interface_qual_ids.get(interface, []):
            rows.append({
                "session_id": session,
                "interface_option": interface,
                "question_id": qid,
                "answer": q["answer"]
            })

df_qual = pd.DataFrame(rows)

# Save to CSV (one file per interface for clarity)
output_dir = "qualitative_feedback_by_interface"
os.makedirs(output_dir, exist_ok=True)

for interface in df_qual["interface_option"].unique():
    subset = df_qual[df_qual["interface_option"] == interface]
    filename = os.path.join(output_dir, f"{interface}_qualitative_feedback.csv")
    subset.to_csv(filename, index=False)
    print(f"Saved: {filename}")
