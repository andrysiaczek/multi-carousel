import ast

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# 1. Load cleaned task metrics
task_metrics_clean = pd.read_csv("task_metrics_clean.csv")

# 2. Parse the selected accommodation JSON strings
task_metrics_clean['selected_accommodation'] = task_metrics_clean['selected_accommodation'].apply(ast.literal_eval)

# 3. Filter to goal-oriented tasks only
goals = task_metrics_clean[task_metrics_clean['task_type'] == 'goal'].copy()

# 4. Extract numeric fields and success flags
goals['price']      = goals['selected_accommodation'].apply(lambda a: a['price'])
goals['distance']   = goals['selected_accommodation'].apply(lambda a: a['distance'])
goals['has_pool']   = goals['selected_accommodation'].apply(lambda a: 'Swimming pool' in a['features'])

goals['price_ok']    = goals['price']    <= 100
goals['distance_ok'] = goals['distance'] <= 2
goals['pool_ok']     = goals['has_pool']

# 5. Compute success rates (%) per interface
success_rates = (
    goals
      .groupby('interface_option')[['price_ok','distance_ok','pool_ok']]
      .mean()
      * 100
).round(1)

print(success_rates)

# Rename interfaces
interface_labels = {
    'benchmark': 'List',
    'single': 'Single-directional',
    'multi': 'Multi-directional'
}

# Reorder and rename the index
success_rates = (
    success_rates
    .loc[["benchmark", "single", "multi"]]
    .rename(index=interface_labels)
)

# 6. Plot grouped bar chart
metrics     = ['price_ok','distance_ok','pool_ok']
labels      = ['Price ≤ €100','Distance ≤ 2 km','Has a Swimming Pool']
interfaces  = success_rates.index.tolist()
x           = np.arange(len(metrics))
width       = 0.25
colors      = ['#BCDEDC', '#E29578', '#006D77']

plt.figure(figsize=(8,5))
for i, (iface, color) in enumerate(zip(interfaces, colors)):
    plt.bar(x + (i-1)*width, success_rates.loc[iface, metrics], width, label=iface, color=color)

plt.xticks(x, labels)
plt.ylabel('Success Rate (%)')
plt.title('Goal‐Achievement Success Rates by Interface')
plt.ylim(0, 100)
plt.legend(title='Interface')
plt.tight_layout()

# Save the figure
output_path = "goal_task_success_rates.png"
plt.savefig(output_path, dpi=300, bbox_inches='tight')
plt.show()

print(f"Plot saved to {output_path}")
