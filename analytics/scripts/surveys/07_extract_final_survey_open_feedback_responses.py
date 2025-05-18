import ast

import pandas as pd

# Load the survey data
df = pd.read_csv("survey_final_clean.csv")

# Define which questionIds to keep
desired_question_ids = {"favoriteWhy", "realWhy", "feedback"}

# Helper function to extract desired qualitative responses
def extract_selected_feedback(row):
    raw = row.get("qualitative")
    if pd.isna(raw):
        return []
    try:
        raw = raw.replace('""', '"')  # fix escaped quotes
        entries = ast.literal_eval(raw)
        return [
            (row["session_id"], q["questionId"], q["answer"].strip())
            for q in entries
            if q["questionId"] in desired_question_ids and q["answer"].strip()
        ]
    except Exception:
        return []

# Flatten all selected feedback
all_feedback = []
for _, row in df.iterrows():
    all_feedback.extend(extract_selected_feedback(row))

# Create DataFrame
feedback_df = pd.DataFrame(all_feedback, columns=["session_id", "question_id", "answer"])

# Save to CSV
feedback_df.to_csv("final_survey_open_feedback.csv", index=False)
print("Saved filtered open feedback to 'final_survey_open_feedback.csv'")
