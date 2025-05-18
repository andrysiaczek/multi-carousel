import os

import matplotlib.pyplot as plt
import pandas as pd
import scipy.stats as st

# Load data
task_metrics_clean = pd.read_csv("task_metrics_clean.csv")

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
task_types = {
    "all": task_metrics_clean,
    "exploratory": task_metrics_clean[task_metrics_clean["task_type"] == "exploratory"],
    "goal": task_metrics_clean[task_metrics_clean["task_type"] == "goal"]
}

# Create root output directory
root_dir = "qq_plots"
os.makedirs(root_dir, exist_ok=True)

for task_label, df in task_types.items():
    task_dir = os.path.join(root_dir, task_label)
    os.makedirs(task_dir, exist_ok=True)

    for metric in metrics:
        for interface in interfaces:
            data = df.query(f"interface_option == '{interface}'")[metric]

            if data.empty:
                continue

            plt.figure()
            st.probplot(data, dist="norm", plot=plt)
            plt.title(f"{metric.replace('_', ' ').title()} — {interface} ({task_label})")
            filename = os.path.join(task_dir, f"{metric}_{interface}.png")
            plt.savefig(filename, dpi=300, bbox_inches="tight")
            plt.close()

print("QQ plots saved in 'qq_plots/' directory.")
