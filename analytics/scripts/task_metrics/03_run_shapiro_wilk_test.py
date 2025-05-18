import pandas as pd
from scipy.stats import shapiro

# Load the cleaned data
task_metrics_clean = pd.read_csv("task_metrics_clean.csv")

# Configuration
interfaces = ["benchmark", "single", "multi"]
metrics = [
    "task_completion_time_sec",
    "total_interactions",
    "total_navigations",
    "total_filters",
    "total_resets",
    "total_hovers",
    "total_scrolls"
]

def run_shapiro_tests(df: pd.DataFrame, label: str):
    results = []

    for metric in metrics:
        for interface in interfaces:
            data = df.query(f"interface_option == '{interface}'")[metric]

            if len(data) < 3:
                result = {
                    "task_type": label,
                    "metric": metric,
                    "interface": interface,
                    "W": None,
                    "p_value": None,
                    "normality": "Insufficient data"
                }
            else:
                stat, p = shapiro(data)
                result = {
                    "task_type": label,
                    "metric": metric,
                    "interface": interface,
                    "W": round(stat, 3),
                    "p_value": round(p, 3),
                    "normality": "Reject normality" if p < 0.05 else "Fail to reject"
                }
            results.append(result)

    return pd.DataFrame(results)

# Run and save tests
df_all = run_shapiro_tests(task_metrics_clean, "all")
df_all.to_csv("shapiro_all_tasks.csv", index=False)

df_exploratory = run_shapiro_tests(task_metrics_clean[task_metrics_clean["task_type"] == "exploratory"], "exploratory")
df_exploratory.to_csv("shapiro_exploratory_tasks.csv", index=False)

df_goal = run_shapiro_tests(task_metrics_clean[task_metrics_clean["task_type"] == "goal"], "goal")
df_goal.to_csv("shapiro_goal_tasks.csv", index=False)

print("Saved Shapiro-Wilk test results for all, exploratory and goal-oriented tasks.")
