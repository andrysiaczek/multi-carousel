import ast

import pandas as pd

# Load survey data
df = pd.read_csv("survey_post_interface_clean.csv")

# Parse the quantitative column from stringified JSON to list-of-dicts
df["quantitative"] = df["quantitative"].apply(lambda x: ast.literal_eval(x) if pd.notnull(x) else [])

# Flatten quantitative responses into rows per question
rows = []
for _, row in df.iterrows():
    session = row["session_id"]
    interface = row["interface_option"]
    for q in row["quantitative"]:
        rows.append({
            "session_id": session,
            "interface_option": interface,
            "question_id": q["questionId"],
            "answer": q["answer"]
        })

df_flat = pd.DataFrame(rows)

# Filter only interface-specific questions based on ID prefixes
interface_question_prefixes = {
    "benchmark": "benchmark_",
    "single": "single_",
    "multi": "multi_"
}
df_flat = df_flat[df_flat["interface_option"].isin(interface_question_prefixes.keys())]
df_flat = df_flat[df_flat.apply(lambda x: x["question_id"].startswith(interface_question_prefixes[x["interface_option"]]), axis=1)]

# Compute mean and std per question
summary = (
    df_flat.groupby(["interface_option", "question_id"])["answer"]
    .agg(["mean", "std", "count"])
    .round(2)
    .reset_index()
)

# Save to CSV
summary.to_csv("interface_specific_survey_question_stats.csv", index=False)
print("Saved interface-specific quantitative question stats to 'interface_specific_survey_question_stats.csv'")
