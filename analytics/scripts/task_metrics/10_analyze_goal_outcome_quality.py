import ast
import itertools

import matplotlib.pyplot as plt
import pandas as pd
from pandas.api.types import CategoricalDtype
from scipy.stats import friedmanchisquare, wilcoxon
from statsmodels.stats.multitest import multipletests

# 1. Load cleaned task metrics and filter to goal tasks
df = pd.read_csv("task_metrics_clean_full_participants.csv")
df = df[df["task_type"] == "goal"].copy()

# 2. Parse the selected_accommodation JSON and extract numeric fields
df['selected_accommodation'] = df['selected_accommodation'].apply(ast.literal_eval)
df['price']    = df['selected_accommodation'].apply(lambda a: a['price'])
df['rating']   = df['selected_accommodation'].apply(lambda a: a['rating'])
df['distance'] = df['selected_accommodation'].apply(lambda a: a['distance'])
df['rating_per_euro'] = df['rating'] / df['price']

# 3. Descriptive statistics
desc = (
    df.groupby("interface_option")[["price", "rating", "distance", "rating_per_euro"]]
      .agg(['mean', 'std', 'count'])
)
desc.to_csv("goal_outcome_descriptive_stats.csv")
print("Saved descriptive statistics to 'goal_outcome_descriptive_stats.csv'")

# 4. Aggregate per participant & interface
outcome_metrics = ["price", "rating", "distance", "rating_per_euro"]
agg = (
    df
    .groupby(["session_id", "interface_option"])[outcome_metrics]
    .mean()
    .reset_index()
)

# 5. Friedman + post-hoc Wilcoxon
alpha = 0.05
interfaces = ["benchmark", "single", "multi"]
results = []

for metric in outcome_metrics:
    wide = agg.pivot(index="session_id", columns="interface_option", values=metric).dropna()
    chi2, p = friedmanchisquare(wide["benchmark"], wide["single"], wide["multi"])

    results.append({
        "metric": metric,
        "comparison": "Friedman omnibus",
        "chi2": chi2,
        "W": None,
        "p_uncorrected": p,
        "p_holm": None,
        "significant": p < alpha
    })

    if p < alpha:
        raw_ps = []
        comparisons = []
        for a, b in itertools.combinations(interfaces, 2):
            W, p_unc = wilcoxon(wide[a], wide[b])
            raw_ps.append(p_unc)
            comparisons.append((f"{a} vs {b}", W, p_unc))

        reject, p_holm, _, _ = multipletests(raw_ps, alpha=alpha, method='holm')
        for (pair, W, p_unc), ph, sig in zip(comparisons, p_holm, reject):
            results.append({
                "metric": metric,
                "comparison": pair,
                "chi2": None,
                "W": W,
                "p_uncorrected": p_unc,
                "p_holm": ph,
                "significant": sig
            })

# Save results to CSV
results_df = pd.DataFrame(results)
results_df.to_csv("friedman_wilcoxon_goal_outcome.csv", index=False)
print("Saved test results to 'friedman_wilcoxon_goal_outcome.csv'")

# 6. Define label mapping
label_map = {
    "benchmark": "List",
    "single": "Single-directional",
    "multi": "Multi-directional"
}

# Replace interface labels in the DataFrame
df["interface_label"] = df["interface_option"].map(label_map)

# Define categorical order
interface_order = ["List", "Single-directional", "Multi-directional"]
cat_type = CategoricalDtype(categories=interface_order, ordered=True)
df["interface_label"] = df["interface_label"].astype(cat_type)

# 7. Boxplots (1×2 grid)
fig, axes = plt.subplots(1, 2, figsize=(10, 8))
axes = axes.flatten()
for ax, metric in zip(axes, ["rating_per_euro","distance"]):
    df.boxplot(column=metric, by='interface_label', ax=ax)
    ax.set_title(metric.replace('_', ' ').title())
    ax.set_xlabel('')
    ax.set_ylabel(metric.replace('_', ' ').title())

plt.suptitle('Outcome Quality Distributions by Interface (Goal Tasks)')
plt.tight_layout(rect=[0, 0.03, 1, 0.95])

# Save boxplots image
plt.savefig("goal_outcome_boxplots.png", dpi=300)
print("Saved boxplots to 'goal_outcome_boxplots.png'")
plt.close()
