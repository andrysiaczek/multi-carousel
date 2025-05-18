import ast
import itertools

import pandas as pd
from scipy.stats import friedmanchisquare, wilcoxon
from statsmodels.stats.multitest import multipletests

# === Load and parse the cleaned post-interface survey data ===
df = pd.read_csv("survey_post_interface_clean.csv")

# Safely parse each stringified list of dicts into actual Python objects
df["quantitative"] = df["quantitative"].apply(lambda x: ast.literal_eval(x) if pd.notnull(x) else [])

# Extract the quantitative answers into flat columns
def extract_quant_responses(quant_list):
    return {q["questionId"]: q["answer"] for q in quant_list}

quant_df = df["quantitative"].apply(extract_quant_responses).apply(pd.Series)

# Merge with session_id and interface_option
df_quant = pd.concat([df[["session_id", "interface_option"]], quant_df], axis=1)

# === Setup ===
items = ["ease", "fun", "helpful", "useful"]
interfaces = ["benchmark", "single", "multi"]
alpha = 0.05

friedman_results = []
wilcoxon_all = []

# === Run tests per item ===
for item in items:
    print(f"\n=== {item.capitalize()} ===")

    # Pivot: one row per participant, one column per interface
    wide_df = df_quant.pivot(index="session_id", columns="interface_option", values=item)

    # Keep only participants with responses in all three conditions
    wide_df = wide_df[interfaces].dropna()

    # Friedman test
    stat, p_friedman = friedmanchisquare(wide_df["benchmark"], wide_df["single"], wide_df["multi"])
    friedman_results.append({
        "item": item,
        "friedman_chi2": stat,
        "friedman_p": p_friedman
    })

    print(f"Friedman χ² = {stat:.3f}, p = {p_friedman:.4f}")

    if p_friedman < alpha:
        # Wilcoxon pairwise comparisons
        pairs = list(itertools.combinations(interfaces, 2))
        raw_p = []
        results = []

        for a, b in pairs:
            w_stat, p_val = wilcoxon(wide_df[a], wide_df[b])
            raw_p.append(p_val)
            results.append((item, f"{a} vs {b}", w_stat, p_val))

        # Holm correction
        reject, p_holm, _, _ = multipletests(raw_p, alpha=alpha, method="holm")
        for i, (item, pair, w_stat, p_val) in enumerate(results):
            wilcoxon_all.append({
                "item": item,
                "pair": pair,
                "W": w_stat,
                "p_uncorrected": p_val,
                "p_holm": p_holm[i],
                "significant": reject[i]
            })
        print(pd.DataFrame(wilcoxon_all[-3:]))  # Just print the last 3 pairwise for this item
    else:
        print("  → Not significant; no post-hoc tests run.")

# === Save results ===
pd.DataFrame(friedman_results).to_csv("friedman_test_results.csv", index=False)
pd.DataFrame(wilcoxon_all).to_csv("wilcoxon_posthoc_results.csv", index=False)

print("\nSaved Friedman results to 'friedman_test_on_post_interface_common_questions.csv'")
print("Saved Wilcoxon results to 'wilcoxon_posthoc_on_post_interface_common_questions.csv'")
