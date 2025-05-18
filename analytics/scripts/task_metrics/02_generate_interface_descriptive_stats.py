import pandas as pd

# Load the cleaned task metrics
task_metrics_clean = pd.read_csv("task_metrics_clean.csv")

# Metrics to analyze
metrics = [
    "task_completion_time_sec",
    "total_interactions",
    "total_navigations",
    "total_filters",
    "total_resets",
    "total_hovers",
    "total_scrolls"
]

# Group by interface only
desc_by_interface = (
    task_metrics_clean
    .groupby("interface_option")[metrics]
    .agg(['mean', 'std', 'count'])
)
desc_by_interface.to_csv("interface_descriptive_stats.csv")
print("Saved interface stats to 'interface_descriptive_stats.csv'")

# Group by interface and task type
desc_by_interface_task = (
    task_metrics_clean
    .groupby(["interface_option", "task_type"])[metrics]
    .agg(['mean', 'std', 'count'])
)
desc_by_interface_task.to_csv("interface_task_descriptive_stats.csv")
print("Saved interface per task stats to 'interface_task_descriptive_stats.csv'")
