import ast

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

# Load the cleaned post-interface survey data
df = pd.read_csv("survey_post_interface_clean.csv")

# Safely parse each stringified list of dicts into actual Python objects
df["quantitative"] = df["quantitative"].apply(lambda x: ast.literal_eval(x) if pd.notnull(x) else [])

# Turn the list of quantitative answers into a flat dictionary: {'ease': 6, 'fun': 5, ...}
def extract_quant_responses(quant_list):
    return {q['questionId']: q['answer'] for q in quant_list}

quant_df = df["quantitative"].apply(extract_quant_responses).apply(pd.Series)

# Merge back with interface option
df_quant = pd.concat([df["interface_option"], quant_df], axis=1)

# Standardize column order
columns = ["interface_option", "ease", "fun", "helpful", "useful"]
df_quant = df_quant[columns]

# Rename interface labels for better readability
interface_label_map = {
    "benchmark": "List",
    "single": "Single-directional",
    "multi": "Multi-directional"
}
df_quant["interface_option"] = df_quant["interface_option"].map(interface_label_map)
colors = ['#BCDEDC', '#E29578', '#006D77']
order = ["List", "Single-directional", "Multi-directional"]

# Rename metrics labels for better readability
label_map = {
    "ease": "Ease",
    "fun": "Fun",
    "helpful": "Helpfulness",
    "useful": "Usefulness"
}

# 1. Descriptive stats
desc = df_quant.groupby("interface_option")[["ease","fun","helpful","useful"]].agg(["mean","std"]).round(2)
desc.to_csv("post_interface_survey_common_questions_descriptive_stats.csv")
print("Saved post-interface common questions survey stats to 'post_interface_survey_common_questions_descriptive_stats.csv'")

# 2. Boxplots
plt.figure(figsize=(10, 8))
for i, col in enumerate(["ease", "fun", "helpful", "useful"], 1):
    plt.subplot(2, 2, i)
    sns.boxplot(x="interface_option", y=col, data=df_quant,
                order=order, palette=dict(zip(order, colors)))
    plt.title(label_map[col])
    plt.xlabel('')
    plt.ylabel('')
    plt.ylim(1, 7)
plt.tight_layout()
plt.savefig("post_interface_boxplots.png", dpi=300)
