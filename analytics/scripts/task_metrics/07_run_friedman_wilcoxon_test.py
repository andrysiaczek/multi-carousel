import itertools
import os

import pandas as pd
from scipy.stats import friedmanchisquare, wilcoxon
from statsmodels.stats.multitest import multipletests

# Load cleaned data
df = pd.read_csv("task_metrics_clean_full_participants.csv")

# Configuration
metrics = [
    "task_completion_time_sec",
    "total_interactions",
    "total_navigations",
    "total_filters",
    "total_resets",
    "total_hovers",
    "total_scrolls"
]
interfaces = ["benchmark", "single", "multi"]
alpha = 0.05
output_dir = "friedman_wilcoxon"
os.makedirs(output_dir, exist_ok=True)

def run_friedman_analysis(df_input, label):
    results = []

    # Pre-aggregate per participant & interface (goal + exploratory averaged)
    agg_df = (
        df_input.groupby(["session_id", "interface_option"])
        .mean(numeric_only=True)
        .reset_index()
    )

    for metric in metrics:
        # Pivot to wide format
        wide = agg_df.pivot(index="session_id", columns="interface_option", values=metric).dropna()

        if wide.shape[1] < 3:
            continue

        # Friedman test
        stat, p = friedmanchisquare(wide["benchmark"], wide["single"], wide["multi"])
        base_result = {
            "metric": metric,
            "friedman_chi2": stat,
            "friedman_p": p
        }

        # Post-hoc Wilcoxon if significant
        if p < alpha:
            pairs = list(itertools.combinations(interfaces, 2))
            raw_p = []
            posthoc_results = []

            for a, b in pairs:
                w_stat, p_w = wilcoxon(wide[a], wide[b])
                raw_p.append(p_w)
                posthoc_results.append((f"{a} vs {b}", w_stat, p_w))

            # Holm correction
            reject, p_holm, _, _ = multipletests(raw_p, alpha=alpha, method="holm")

            for i, (pair, w, p_unc) in enumerate(posthoc_results):
                results.append({
                    **base_result,
                    "comparison": pair,
                    "wilcoxon_W": w,
                    "p_uncorrected": p_unc,
                    "p_holm": p_holm[i],
                    "significant": reject[i],
                    "task_type": label
                })
        else:
            results.append({
                **base_result,
                "comparison": None,
                "wilcoxon_W": None,
                "p_uncorrected": None,
                "p_holm": None,
                "significant": None,
                "task_type": label
            })

    # Save to CSV
    df_results = pd.DataFrame(results)
    out_path = os.path.join(output_dir, f"friedman_wilcoxon_{label}.csv")
    df_results.to_csv(out_path, index=False)
    print(f"Saved: {out_path}")

# Run analyses
run_friedman_analysis(df, "all_tasks")
run_friedman_analysis(df[df["task_type"] == "exploratory"], "exploratory")
run_friedman_analysis(df[df["task_type"] == "goal"], "goal")
