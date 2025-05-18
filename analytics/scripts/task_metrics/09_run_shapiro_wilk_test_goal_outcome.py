import ast

import pandas as pd
from scipy.stats import shapiro

# 1) Load & filter to goal tasks
df = pd.read_csv("task_metrics_clean.csv")
df = df[df["task_type"] == "goal"]

# 2) Parse selected accommodation and derive metrics
df["selected_accommodation"] = df["selected_accommodation"].apply(ast.literal_eval)
df["price"]    = df["selected_accommodation"].apply(lambda a: a["price"])
df["rating"]   = df["selected_accommodation"].apply(lambda a: a["rating"])
df["distance"] = df["selected_accommodation"].apply(lambda a: a["distance"])
df["rating_per_eur"] = df["rating"] / df["price"]

metrics = ["price", "rating", "distance", "rating_per_eur"]
interfaces = ["benchmark", "single", "multi"]

# 3) Shapiro–Wilk normality test and save results
results = []

for m in metrics:
    for iface in interfaces:
        series = df[df["interface_option"] == iface][m].dropna()
        if len(series) >= 3:
            W, p = shapiro(series)
            verdict = "Reject normality" if p < 0.05 else "Normal"
            results.append({
                "metric": m,
                "interface": iface,
                "W_stat": round(W, 3),
                "p_value": round(p, 3),
                "verdict": verdict
            })

# 4) Save results to CSV
results_df = pd.DataFrame(results)
results_df.to_csv("shapiro_goal_outcome_metrics.csv", index=False)
print("Saved results to 'shapiro_goal_outcome_metrics.csv'")
