import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

# Load the CSV
df = pd.read_csv("interface_specific_survey_question_stats.csv")

# Map better item names for plotting
label_map = {
    "benchmark_list_efficient": "Efficient (List)",
    "benchmark_list_scan_ease": "Scan Ease (List)",
    "multi_cell_action_combined": "Cell Click = Combo Filter",
    "multi_filter_easy": "Filters Easy to Use",
    "multi_filter_helpful": "Filters Helpful",
    "multi_header_click_filters": "Header Click = Filter",
    "multi_history_saved": "History Panel Understood",
    "multi_history_step_back": "Step-back Noticed",
    "multi_item_click_shows_list": "Item Click → List",
    "multi_scroll_axes_confusing": "Horiz/Vert Scroll Confusing",
    "multi_scroll_axes_helpful": "Horiz/Vert Scroll Helpful",
    "multi_scroll_diagonal_confusing": "Diagonal Scroll Confusing",
    "multi_scroll_diagonal_helpful": "Diagonal Scroll Helpful",
    "multi_scroll_notice": "Noticed Multi-scroll",
    "multi_show_results_button": '"Show Results" Understood',
    "single_compare_helpful": "Separate Lists Helpful",
    "single_horiz_scroll_ease": "Horizontal Scroll Easy",
    "single_independent_lists": "Lists = Independent",
    "single_info_density": "List Info Density",
    "single_title_filter_clear": "Title Filter Clear",
    "single_title_filter_intuitive": "Title Filter Intuitive"
}
df["item_label"] = df["question_id"].map(label_map)

# Radar chart per interface
grouped = df.groupby("interface_option")
for interface in grouped.groups.keys():
    subset = df[df["interface_option"] == interface]
    labels = subset["item_label"].values
    stats = subset["mean"].values
    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    stats = np.concatenate((stats, [stats[0]]))  # close the circle
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.plot(angles, stats, color="#006D77", linewidth=2)
    ax.fill(angles, stats, color="#BCDEDC", alpha=0.25)
    ax.set_yticks([1, 3, 5, 7])
    ax.set_ylim(1, 7)
    ax.set_title(f"{interface.capitalize()} Interface", size=14, pad=20)
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, fontsize=9)
    plt.tight_layout()
    plt.savefig(f"radar_{interface}.png", dpi=300)
    plt.close()

# Map interface labels
interface_label_map = {
    "benchmark": "List",
    "single": "Single-directional",
    "multi": "Multi-directional"
}
df["interface_label"] = df["interface_option"].map(interface_label_map)

# Pivot and reindex columns to desired order
heatmap_df = df.pivot(index="item_label", columns="interface_label", values="mean")
heatmap_df = heatmap_df[["List", "Single-directional", "Multi-directional"]]

# Plot heatmap
plt.figure(figsize=(10, 10))
sns.heatmap(
    heatmap_df,
    annot=True,
    fmt=".2f",
    cmap="YlGnBu",
    vmin=1, vmax=7,
    linewidths=0.5, linecolor='white',
    cbar_kws={"label": "Mean Rating (1-7)"}
)
plt.title("Mean Ratings by Interface-specific Survey Items", fontsize=14, pad=12)
plt.xlabel('')
plt.ylabel('')
plt.tight_layout()
plt.savefig("interface_specific_items_heatmap.png", dpi=300)
