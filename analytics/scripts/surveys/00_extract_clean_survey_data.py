import json

import pandas as pd

# === Load raw JSON data ===
json_path = '/data/finalData.json'
with open(json_path, 'r') as f:
    data = json.load(f)

# === Flatten survey data ===
study_data = data.get("__collections__", {}).get("multi-carousel-study", {})
post_interface_surveys = []
final_surveys = []
surveys_metrics = []

for session_id, session_content in study_data.items():
    steps = session_content.get("__collections__", {}).get("steps", {})
    for step_id, step in steps.items():
        if step.get("taskType") == "survey":
            events = step.get("events", [])
            for event in events:
                event_type = event.get("type")
                details = event.get("details", {})
                target = details.get("targetType")

                record = {
                    "session_id": session_id,
                    "step_id": step_id,
                    "interface_option": step.get("interfaceOption"),
                    "interface_order": step.get("interfaceOrder"),
                    "responses": details
                }
    
                if target in {"infoButton", "previewToggleButton"} or details.get("to") == "pageRefresh":
                    surveys_metrics.append(record)
                else:
                    if step.get("interfaceOption"):
                        post_interface_surveys.append(record)
                    else:
                        final_surveys.append(record)

# Convert to DataFrames
df_post_survey = pd.DataFrame(post_interface_surveys)
df_final_survey = pd.DataFrame(final_surveys)
df_survey_metrics = pd.DataFrame(surveys_metrics)

# === Basic Cleaning ===

# Drop any with missing session_id or step_id
df_post_survey.dropna(subset=["session_id", "step_id", "interface_option"], inplace=True)
df_final_survey.dropna(subset=["session_id", "step_id"], inplace=True)

# Drop duplicates
df_post_survey.drop_duplicates(subset=["session_id", "interface_option"], inplace=True)
df_final_survey.drop_duplicates(subset=["session_id"], inplace=True)

# Unpack response dictionaries into columns
post_responses_expanded = df_post_survey["responses"].apply(pd.Series)
df_post_survey_clean = pd.concat([df_post_survey.drop(columns=["responses"]), post_responses_expanded], axis=1)

final_responses_expanded = df_final_survey["responses"].apply(pd.Series)
df_final_survey_clean = pd.concat([df_final_survey.drop(columns=["responses"]), final_responses_expanded], axis=1)

# Keep only participants who completed the final survey
complete_session_ids = set(df_final_survey_clean["session_id"])
print(len(complete_session_ids))

df_post_survey_clean = df_post_survey_clean[df_post_survey_clean["session_id"].isin(complete_session_ids)]
df_survey_metrics = df_survey_metrics[df_survey_metrics["session_id"].isin(complete_session_ids)]

# Save to CSV
df_post_survey_clean.to_csv("survey_post_interface_clean.csv", index=False)
df_final_survey_clean.to_csv("survey_final_clean.csv", index=False)
df_survey_metrics.to_csv("survey_metrics_clean.csv", index=False)
