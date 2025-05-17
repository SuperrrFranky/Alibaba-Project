import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# Load and prepare data
df = pd.read_csv('../data/sample-transactions.csv')
X = df['Description']
y = df['Category']

# Vectorize text
vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

# Train model
model = LogisticRegression()
model.fit(X_vec, y)

# Save trained model and vectorizer
joblib.dump(model, '../models/transaction_classifier.pkl')
joblib.dump(vectorizer, '../models/tfidf_vectorizer.pkl')
print("Model saved to ../models/")