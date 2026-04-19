"""
Train ML models for AI Career Navigator using real dataset.
Uses: AI-based Career Recommendation System.csv
Trains:
  - RandomForestClassifier for career prediction
  - Ridge regression for salary estimation (derived from career)
Saves models as pickle files.
"""

import pickle
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import Ridge
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

CSV_PATH = os.path.join(os.path.dirname(__file__), "AI-based Career Recommendation System.csv")

# Salary estimates by career (USD/year) — used for training the salary regressor
SALARY_ESTIMATES = {
    "Data Scientist": 125000,
    "Software Engineer": 130000,
    "UX Designer": 95000,
    "AI Researcher": 150000,
    "Project Manager": 110000,
    "Embedded Systems Engineer": 105000,
    "Data Analyst": 85000,
    "Digital Marketer": 72000,
    "NLP Engineer": 140000,
    "Financial Analyst": 95000,
    "Research Scientist": 120000,
    "Front-end Developer": 100000,
    "Software Developer": 110000,
    "Machine Learning Engineer": 145000,
    "Marketing Manager": 90000,
    "Full Stack Developer": 115000,
    "AI Specialist": 140000,
    "Cybersecurity Analyst": 105000,
    "Research Analyst": 80000,
    "DevOps Engineer": 120000,
    "Graphic Designer": 70000,
    "Deep Learning Engineer": 145000,
    "Business Analyst": 90000,
    "Backend Developer": 115000,
    "Biostatistician": 100000,
    "Data Engineer": 125000,
    "Content Strategist": 75000,
    "Automation Engineer": 110000,
    "Mobile Developer": 110000,
    "UX Researcher": 95000,
    "Cybersecurity Specialist": 115000,
    "Cloud Engineer": 130000,
}


def build_skill_universe(df: pd.DataFrame) -> list[str]:
    """Extract all unique skills from the dataset."""
    all_skills = set()
    for skills_str in df["Skills"].dropna():
        for s in skills_str.split(";"):
            cleaned = s.strip().lower()
            if cleaned:
                all_skills.add(cleaned)
    return sorted(all_skills)


def build_interest_universe(df: pd.DataFrame) -> list[str]:
    """Extract all unique interests from the dataset."""
    all_interests = set()
    for interest_str in df["Interests"].dropna():
        for i in interest_str.split(";"):
            cleaned = i.strip().lower()
            if cleaned:
                all_interests.add(cleaned)
    return sorted(all_interests)


def encode_features(df: pd.DataFrame, skill_universe: list[str], interest_universe: list[str]) -> np.ndarray:
    """Build feature matrix:  skill binary vector + interest binary vector + education one-hot + age."""
    education_map = {"bachelor's": [1, 0, 0], "master's": [0, 1, 0], "phd": [0, 0, 1]}
    rows = []
    for _, row in df.iterrows():
        # Skills binary
        skills_present = set(s.strip().lower() for s in str(row["Skills"]).split(";") if s.strip())
        skill_vec = [1 if s in skills_present else 0 for s in skill_universe]

        # Interests binary
        interests_present = set(i.strip().lower() for i in str(row["Interests"]).split(";") if i.strip())
        interest_vec = [1 if i in interests_present else 0 for i in interest_universe]

        # Education one-hot
        edu = str(row["Education"]).strip().lower()
        edu_vec = education_map.get(edu, [0, 0, 0])

        # Age (normalised)
        age = float(row["Age"]) / 50.0 if pd.notna(row["Age"]) else 0.5

        rows.append(skill_vec + interest_vec + edu_vec + [age])

    return np.array(rows, dtype=float)


def build_career_skill_profiles(df: pd.DataFrame) -> dict[str, list[str]]:
    """Build a mapping of career -> most common skills from the dataset."""
    profiles: dict[str, list[str]] = {}
    for career in df["Recommended_Career"].unique():
        career_rows = df[df["Recommended_Career"] == career]
        skill_counts: dict[str, int] = {}
        for skills_str in career_rows["Skills"].dropna():
            for s in skills_str.split(";"):
                cleaned = s.strip().lower()
                if cleaned:
                    skill_counts[cleaned] = skill_counts.get(cleaned, 0) + 1
        # Sort by frequency, keep all skills for this career
        sorted_skills = sorted(skill_counts.keys(), key=lambda x: skill_counts[x], reverse=True)
        profiles[career] = sorted_skills
    return profiles


def train_and_save(model_dir: str = "models"):
    """Train models from CSV and save to disk."""
    os.makedirs(model_dir, exist_ok=True)

    print("Loading dataset from CSV...")
    df = pd.read_csv(CSV_PATH)
    print(f"  {len(df)} rows, {df['Recommended_Career'].nunique()} career types")

    # Build universes
    skill_universe = build_skill_universe(df)
    interest_universe = build_interest_universe(df)
    print(f"  {len(skill_universe)} unique skills, {len(interest_universe)} unique interests")

    # Encode features
    X = encode_features(df, skill_universe, interest_universe)
    y_career = df["Recommended_Career"].values

    # Career label encoder
    le = LabelEncoder()
    y_career_encoded = le.fit_transform(y_career)

    # Salary targets (based on career)
    y_salary = np.array([SALARY_ESTIMATES.get(c, 80000) for c in y_career], dtype=float)
    # Add some variance based on recommendation score
    if "Recommendation_Score" in df.columns:
        scores = df["Recommendation_Score"].fillna(0.8).values
        y_salary = y_salary * (0.8 + 0.4 * scores)  # scale salary by 0.8x to 1.2x based on score

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y_career_encoded, test_size=0.2, random_state=42)

    # Train career classifier
    print("Training career prediction model (RandomForest)...")
    clf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1, max_depth=15)
    clf.fit(X_train, y_train)
    train_acc = clf.score(X_train, y_train)
    test_acc = clf.score(X_test, y_test)
    print(f"  Train accuracy: {train_acc:.3f}, Test accuracy: {test_acc:.3f}")

    # Train salary regressor (on full data)
    print("Training salary prediction model (Ridge)...")
    reg = Ridge(alpha=1.0)
    reg.fit(X, y_salary)

    # Career skill profiles for gap analysis
    career_skill_profiles = build_career_skill_profiles(df)

    # Feature names for debugging
    feature_names = (
        [f"skill_{s}" for s in skill_universe]
        + [f"interest_{i}" for i in interest_universe]
        + ["edu_bachelors", "edu_masters", "edu_phd", "age_norm"]
    )

    # Save
    with open(os.path.join(model_dir, "career_classifier.pkl"), "wb") as f:
        pickle.dump(clf, f)
    with open(os.path.join(model_dir, "salary_regressor.pkl"), "wb") as f:
        pickle.dump(reg, f)
    with open(os.path.join(model_dir, "label_encoder.pkl"), "wb") as f:
        pickle.dump(le, f)
    with open(os.path.join(model_dir, "skill_universe.pkl"), "wb") as f:
        pickle.dump(skill_universe, f)
    with open(os.path.join(model_dir, "interest_universe.pkl"), "wb") as f:
        pickle.dump(interest_universe, f)
    with open(os.path.join(model_dir, "career_skill_profiles.pkl"), "wb") as f:
        pickle.dump(career_skill_profiles, f)
    with open(os.path.join(model_dir, "feature_names.pkl"), "wb") as f:
        pickle.dump(feature_names, f)

    print(f"Models saved to {model_dir}/")
    return clf, reg, le


if __name__ == "__main__":
    train_and_save()
