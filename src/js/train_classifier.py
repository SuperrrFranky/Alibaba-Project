import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib

# Load and prepare data
df = pd.read_csv('../data/sample-transactions.csv')
X = df['Description']
y = df['Category']

# Vectorize text
vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

# Train model with Multinomial Naive Bayes, which is often better for text classification
model = MultinomialNB()
model.fit(X_vec, y)

# Save trained model and vectorizer
joblib.dump(model, '../models/transaction_classifier.pkl')
joblib.dump(vectorizer, '../models/tfidf_vectorizer.pkl')
print("Model saved to ../models/")