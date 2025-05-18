import json

import pandas as pd

# Load JSON data from a file
file_path = '/data/finalDataN68.json'
with open(file_path, 'r') as f:
    data = json.load(f)

# Flatten and extract all events from all sessions and steps
all_metrics = []

# ---> Data Preparation
study_data = data["__collections__"]["multi-carousel-study"]
for session_id, session_content in study_data.items():
    steps = session_content["__collections__"]["steps"]
    for step_id, step_content in steps.items():
        task_type = step_content.get("taskType")
        interface_option = step_content.get("interfaceOption")
        events = step_content.get("events", [])
        
        # Initialize metrics
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
            t = event["type"]

            # Start / End
            if t == "taskStart":
                start_time = event["timestamp"]
            elif t == "taskEnd":
                end_time = event["timestamp"]
    
            # Interactions
            elif t in {"click","scroll","arrowClick","arrowKeyDown"}:
                interaction_count += 1
                if t in {"scroll","arrowClick","arrowKeyDown"}:
                    scroll_count += 1
                # Capture which accommodation was “booked”
                elif t == "click":
                    if event["details"].get("targetType") == "bookNowButton":
                        selected_accommodation = event["details"].get("accommodation")

            # Navigation & Page refresh
            elif t == "navigation":
                dest = event["details"].get("to")
                if dest in {"resultsPage", "detailView"}:
                    navigation_count += 1
                elif dest == "pageRefresh":
                    reset_count += 1

            # Filters
            elif t in {"filterApply", "filterStep", "filterReset", "filterResetAll"}:
                filter_count += 1
                if t == "filterReset" or t == "filterResetAll" or (t == "filterStep" and event["details"].get("goTo") is True):
                    reset_count += 1

            # Hovers
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

# Convert to DataFrame
df_metrics = pd.DataFrame(all_metrics)

# Filter for only goal/exploratory tasks with interfaceOption present
task_metrics = df_metrics[
    df_metrics["task_type"].isin(["goal", "exploratory"]) &
    df_metrics["interface_option"].notnull()
]

# ---> Data Cleaning
task_metrics_clean = task_metrics.copy()

# 1. Drop incomplete tasks
task_metrics_clean = task_metrics_clean[task_metrics_clean["task_completion_time_sec"].notnull()]

# 2. Filter on realistic durations
task_metrics_clean = task_metrics_clean[task_metrics_clean["task_completion_time_sec"].between(5, 1000)]

# 3. Require a Book click
task_metrics_clean = task_metrics_clean[task_metrics_clean["selected_accommodation"].notnull()]

# 4. Drop zero‐interaction goals
task_metrics_clean = task_metrics_clean[task_metrics_clean["total_interactions"] > 0]

task_metrics_clean.to_csv("task_metrics_clean.csv", index=False)

# Compute “rejected” rows
df_rejected = task_metrics.loc[~task_metrics.index.isin(task_metrics_clean.index)]
print(f"Rejected rows: {len(df_rejected)} of {len(task_metrics)} total task‐rows")
print(df_rejected[[
    "session_id",
    "step_id",
    "interface_option",
    "task_type",
    "task_completion_time_sec",
    "total_interactions"
]].sort_values(["task_type","task_completion_time_sec"]).head(20))

# Count tasks before and after data cleaning
task_counts_before = task_metrics["interface_option"].value_counts().reset_index()
task_counts_after = task_metrics_clean["interface_option"].value_counts().reset_index()

task_counts_before.columns = ["interface_option", "task_count"]
task_counts_after.columns = ["interface_option", "task_count"]

task_counts_before.to_csv("task_counts_before_cleaning.csv", index=False)
task_counts_after.to_csv("task_counts_after_cleaning.csv", index=False)
