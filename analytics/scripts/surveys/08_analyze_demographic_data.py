import ast
import os

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

# Load the survey data
df = pd.read_csv("survey_final_clean.csv")

# Create a directory for plots
output_dir = "demographics_plots"
os.makedirs(output_dir, exist_ok=True)

# Function to extract specific qualitative answers
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

# Function to extract specific quantitative answers
def extract_answer_quan(row, question_id):
    raw = row.get('quantitative')
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

# Extract demographic answers
df['age'] = df.apply(lambda r: extract_answer_quan(r, 'age'), axis=1)
df['gender'] = df.apply(lambda r: extract_answer(r, 'sex'), axis=1)
df['travel_freq'] = df.apply(lambda r: extract_answer(r, 'travelFrequency'), axis=1)

# Calculate response rate
total_sessions = df.shape[0]
responded_age = df['age'].notna().sum()
responded_gender = df['gender'].notna().sum()
responded_travel = df['travel_freq'].notna().sum()

response_summary = pd.DataFrame({
    'Question': ['Age', 'Gender', 'Travel Frequency'],
    'Responses': [responded_age, responded_gender, responded_travel],
    'Total': [total_sessions] * 3,
    'Proportion': [responded_age / total_sessions,
                   responded_gender / total_sessions,
                   responded_travel / total_sessions]
})

# Save to CSV
response_summary.to_csv("demographic_data_summary.csv", index=False)
print("Saved demographic data to 'demographic_data_summary.csv'")

# Prepare age plot
df['age'] = pd.to_numeric(df['age'], errors='coerce')
plt.figure(figsize=(6, 4))
sns.violinplot(y=df['age'].dropna(), color="#BCDEDC", inner="quartile")
plt.title("Age Distribution of Participants")
plt.ylabel("Age")
plt.xlabel("")
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "age_violin.png"))

gender_order = [
    "Female",
    "Male"
]

# Prepare gender plot
plt.figure(figsize=(5, 4))
print(df['gender'].value_counts(dropna=True))
df['gender'].value_counts(dropna=True).reindex(gender_order).plot(kind='bar', color="#E29578")
plt.title("Gender Distribution")
plt.xlabel("")
plt.ylabel("Number of Participants")
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "gender_distribution.png"))

travel_order = [
    "Once a year",
    "2 – 3 times a year",
    "More than 3 times a year"
]

# Prepare travel frequency plot
plt.figure(figsize=(6, 4))
print(df['travel_freq'].value_counts(dropna=True))
df['travel_freq'].value_counts(dropna=True).reindex(travel_order).plot(kind='bar', color="#006D77")
plt.title("Travel Frequency")
plt.xlabel("")
plt.ylabel("Number of Participants")
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "travel_frequency.png"))

print(f"Plots saved to {output_dir}/")
