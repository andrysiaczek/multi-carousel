import json

import pandas as pd

# Load JSON data from file
file_path = '/data/finalDataN68.json'
with open(file_path, 'r') as f:
    data = json.load(f)

# Step 1: Identify session_ids that contain the final survey
valid_session_ids = set()
study_data = data["__collections__"]["multi-carousel-study"]
for session_id, session_content in study_data.items():
    steps = session_content.get("__collections__", {}).get("steps", {})
    for step_id, step_content in steps.items():
        if step_content.get("taskType") == "survey" and not step_content.get("interfaceOption"):
            valid_session_ids.add(session_id)
            break  # No need to check other steps

# Step 2: Extract and flatten valid events
all_metrics = []

for session_id, session_content in study_data.items():
    if session_id not in valid_session_ids:
        continue

    steps = session_content["__collections__"]["steps"]
    for step_id, step_content in steps.items():
        task_type = step_content.get("taskType")
        interface_option = step_content.get("interfaceOption")
        events = step_content.get("events", [])

        # Only process goal and exploratory tasks with an interface option
        if task_type not in {"goal", "exploratory"} or not interface_option:
            continue

        metrics = {
            "session_id": session_id,
            "step_id": step_id,
            "interface_option": interface_option,
            "task_type": task_type,
            "task_completion_time_sec": None,
            "total_interactions": 0
        }

        start_time = None
        end_time = None
        interaction_count = 0
        selected_accommodation = None
        navigation_count = 0
        filter_count = 0
        reset_count = 0
        hover_count = 0
        scroll_count = 0

        for event in events:
            t = event.get("type")
            details = event.get("details", {})

            if t == "taskStart":
                start_time = event.get("timestamp")
            elif t == "taskEnd":
                end_time = event.get("timestamp")

            elif t in {"click", "scroll", "arrowClick", "arrowKeyDown"}:
                interaction_count += 1
                if t in {"scroll", "arrowClick", "arrowKeyDown"}:
                    scroll_count += 1
                elif t == "click" and details.get("targetType") == "bookNowButton":
                    selected_accommodation = details.get("accommodation")

            elif t == "navigation":
                dest = details.get("to")
                if dest in {"resultsPage", "detailView"}:
                    navigation_count += 1
                elif dest == "pageRefresh":
                    reset_count += 1

            elif t in {"filterApply", "filterStep", "filterReset", "filterResetAll"}:
                filter_count += 1
                if t in {"filterReset", "filterResetAll"} or (t == "filterStep" and details.get("goTo")):
                    reset_count += 1
            elif t == "hover":
                hover_count += 1

        if start_time and end_time:
            metrics["task_completion_time_sec"] = (end_time - start_time) / 1000
        metrics["total_interactions"] = interaction_count
        metrics["selected_accommodation"] = selected_accommodation
        metrics["total_navigations"] = navigation_count
        metrics["total_filters"] = filter_count
        metrics["total_resets"] = reset_count
        metrics["total_hovers"] = hover_count
        metrics["total_scrolls"] = scroll_count

        all_metrics.append(metrics)

# Step 3: Convert to DataFrame
df_metrics = pd.DataFrame(all_metrics)

# Step 4: Filter for only goal/exploratory tasks with interfaceOption present
task_metrics = df_metrics[
    df_metrics["task_type"].isin(["goal", "exploratory"]) &
    df_metrics["interface_option"].notnull()
]

# Step 5: Clean the data
task_metrics_clean = df_metrics.copy()
task_metrics_clean = task_metrics_clean[task_metrics_clean["task_completion_time_sec"].notnull()]
task_metrics_clean = task_metrics_clean[task_metrics_clean["task_completion_time_sec"].between(5, 1000)]
task_metrics_clean = task_metrics_clean[task_metrics_clean["selected_accommodation"].notnull()]
task_metrics_clean = task_metrics_clean[task_metrics_clean["total_interactions"] > 0]

# Step 6: Keep only sessions with exactly 2 tasks per interface and all 3 interfaces
valid_sessions = (
    task_metrics_clean
    .groupby(["session_id", "interface_option"])
    .size()
    .unstack(fill_value=0)
)
complete_sessions = valid_sessions[
    (valid_sessions == 2).all(axis=1)
].index

# Filter the dataset
task_metrics_clean = task_metrics_clean[task_metrics_clean["session_id"].isin(complete_sessions)]

# Step 7: Save results
task_metrics_clean.to_csv("task_metrics_clean_full_participants.csv", index=False)

# Log interface counts before and after cleaning
interface_counts_before = df_metrics["interface_option"].value_counts().reset_index()
interface_counts_before.columns = ["interface_option", "task_count"]
interface_counts_before.to_csv("task_counts_before_cleaning_full_participants.csv", index=False)

interface_counts_after = task_metrics_clean["interface_option"].value_counts().reset_index()
interface_counts_after.columns = ["interface_option", "task_count"]
interface_counts_after.to_csv("task_counts_after_cleaning_full_participants.csv", index=False)

print("Filtered data for completed participants saved as 'task_metrics_clean_full_participants.csv'")
