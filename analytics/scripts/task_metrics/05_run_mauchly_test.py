import os

import pandas as pd
import pingouin as pg

# Load cleaned data
df = pd.read_csv("task_metrics_clean_full_participants.csv")

# Metrics to test
metrics = [
    "task_completion_time_sec",
    "total_interactions",
    "total_navigations",
    "total_filters",
    "total_resets",
    "total_hovers",
    "total_scrolls"
]

# Define output directory
os.makedirs("mauchly", exist_ok=True)

# Run Mauchly’s Test on each metric
def run_mauchly_tests(df, label):
    records = []

    for metric in metrics:
        wide = df.pivot_table(
            index='session_id',
            columns='interface_option',
            values=metric,
            aggfunc='mean'
        ).dropna()

        if wide.shape[1] < 2:
            records.append({
                "metric": metric,
                "sphericity": None,
                "W": None,
                "chi2": None,
                "dof": None,
                "pval": None,
                "note": "Skipped (not enough conditions)"
            })
            continue

        try:
            result = pg.sphericity(wide)
            if isinstance(result, tuple):  # in case result is tuple
                spher, W, chi2, dof, pval = result
            else:  # pg >=0.5 returns SpherResults
                spher, W, chi2, dof, pval = result.spher, result.W, result.chi2, result.dof, result.pval

            records.append({
                "metric": metric,
                "sphericity": spher,
                "W": W,
                "chi2": chi2,
                "dof": dof,
                "pval": pval,
                "note": "OK"
            })
        except Exception as e:
            records.append({
                "metric": metric,
                "sphericity": None,
                "W": None,
                "chi2": None,
                "dof": None,
                "pval": None,
                "note": f"Error: {str(e)}"
            })

    # Save results
    df_result = pd.DataFrame(records)
    df_result.to_csv(f"mauchly/mauchly_{label}.csv", index=False)
    print(f"Saved: mauchly_{label}.csv")


# Run for all, exploratory, and goal
run_mauchly_tests(df, "all_tasks")
run_mauchly_tests(df[df["task_type"] == "exploratory"], "exploratory")
run_mauchly_tests(df[df["task_type"] == "goal"], "goal")
