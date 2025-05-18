import ast
import os
import re

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

label_map = {
    "benchmark": "List",
    "single": "Single",
    "multi": "Multi"
}

def extract_answer(row, question_id):
    raw = row.get('qualitative')
    if pd.isna(raw):
        return None
    try:
        raw = raw.replace('""', '"')
        qa_list = ast.literal_eval(raw)
    except (ValueError, SyntaxError):
        return None
    for qa in qa_list:
        if qa.get('questionId') == question_id:
            return qa.get('answer')
    return None

output_dir = "final_survey_plots"
os.makedirs(output_dir, exist_ok=True)

# Load CSV
df = pd.read_csv("survey_final_clean.csv")

# Parse interface order (list of 3 strings)
def clean_and_parse_list(s):
    if pd.isna(s):
        return []
    s = re.sub(r'""', '"', s)  # Replace double double-quotes with single double-quote
    return ast.literal_eval(s)

df['iface_order'] = df['interface_order'].apply(clean_and_parse_list)

def safe_parse_rank(raw):
    if pd.isna(raw):
        return [None, None, None]
    try:
        cleaned = raw.replace('""', '"')  # fix double quotes
        return ast.literal_eval(cleaned)
    except:
        return [None, None, None]

df['rank_raw'] = df.apply(lambda r: extract_answer(r, 'rank'), axis=1)
rank_df = df['rank_raw'].apply(safe_parse_rank).apply(pd.Series)
rank_df.columns = ['rank1','rank2','rank3']
df = pd.concat([df, rank_df], axis=1)

# Extract raw answers
df['favorite_raw'] = df.apply(lambda r: extract_answer(r, 'favorite'), axis=1)
df['real_raw']     = df.apply(lambda r: extract_answer(r, 'real'), axis=1)

def resolve_interface(answer, iface_order):
    if pd.isna(answer) or not iface_order:
        return None
    if str(answer).isdigit():
        idx = int(answer)
        if 0 <= idx < len(iface_order):
            return iface_order[idx]
    elif answer in iface_order:
        return answer
    return None

# Convert favorite/real from index to interface label using iface_order
df['favorite'] = df.apply(lambda r: resolve_interface(r['favorite_raw'], r['iface_order']), axis=1)
df['real']     = df.apply(lambda r: resolve_interface(r['real_raw'], r['iface_order']), axis=1)

# Parse ranking (already a list of strings like ['benchmark', 'single', 'multi'])
rank_df = df['rank_raw'].apply(lambda x: ast.literal_eval(x) if pd.notna(x) else [None, None, None]).apply(pd.Series)
rank_df.columns = ['rank1','rank2','rank3']
df[['rank1', 'rank2', 'rank3']] = rank_df

# Ensure rank1/2/3 are flat strings (not lists or objects)
df['rank1'] = df['rank1'].astype(str)
df['rank2'] = df['rank2'].astype(str)
df['rank3'] = df['rank3'].astype(str)

rank1 = df['rank1'].map(label_map)
rank2 = df['rank2'].map(label_map)
rank3 = df['rank3'].map(label_map)

# --- Favorite bar chart ---
fav_counts = df['favorite'].map(label_map).value_counts(normalize=True).reindex(label_map.values())
plt.figure(figsize=(4,3))
fav_counts.plot.bar(color = ['#BCDEDC', '#E29578', '#006D77'])
plt.title("Favorite Interface")
plt.xlabel("")
plt.ylabel("Proportion of participants")
plt.xticks(rotation=0)
plt.ylim(0,1)
plt.gca().yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f"{y:.0%}"))
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "favorite_bar.png"), dpi=150)

# --- Real-use bar chart ---
real_counts = df['real'].map(label_map).value_counts(normalize=True).reindex(label_map.values())
plt.figure(figsize=(4,3))
real_counts.plot.bar(color = ['#BCDEDC', '#E29578', '#006D77'])
plt.title("Would Use in Real Booking")
plt.xlabel("")
plt.ylabel("Proportion of participants")
plt.xticks(rotation=0)
plt.ylim(0,1)
plt.gca().yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f"{y:.0%}"))
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "realuse_bar.png"), dpi=150)

# --- Stacked-bar for Rank ---
rank_counts = pd.DataFrame({
    '1st': rank1.value_counts(normalize=True).reindex(label_map.values()),
    '2nd': rank2.value_counts(normalize=True).reindex(label_map.values()),
    '3rd': rank3.value_counts(normalize=True).reindex(label_map.values()),
}).fillna(0)

plt.figure(figsize=(5,3))
bottom = np.zeros(len(rank_counts))
colors = ['#BCDEDC',  # soft sky blue
          '#E29578',  # mint green
          '#006D77']  # light neutral gray
for idx, pos in enumerate(['1st','2nd','3rd']):
    plt.bar(rank_counts.index, rank_counts[pos], bottom=bottom, label=pos, color=colors[idx])
    bottom += rank_counts[pos].values

plt.title("Rank of Interface by Effectiveness")
plt.ylabel("Proportion of participants")
plt.ylim(0,1)
plt.xticks(rotation=0)
plt.legend(title="Position", bbox_to_anchor=(1.05, 1), loc='upper left')
plt.gca().yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f"{y:.0%}"))
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "rank_stackedbar.png"), dpi=150)

print(f"Plots saved in {output_dir}/")

# Save numeric results to CSV
fav_counts.to_frame(name="proportion").to_csv(os.path.join(output_dir, "favorite_counts.csv"))
real_counts.to_frame(name="proportion").to_csv(os.path.join(output_dir, "realuse_counts.csv"))
rank_counts.to_csv(os.path.join(output_dir, "rank_distribution.csv"))

print("Data summaries saved as CSV in", output_dir)
