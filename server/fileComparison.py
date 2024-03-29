import pandas as pd
import numpy as np
import re
import os
import string
import spacy
import gensim
from gensim import corpora
# libraries for visualization
import pyLDAvis
import pyLDAvis.gensim
import matplotlib.pyplot as plt
import seaborn as sns
import nltk
from nltk.corpus import stopwords
import requests 
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Helper method to remove punctuation/number and make text lowercase
def clean_text(text):
    delete_dict = {sp_character: '' for sp_character in string.punctuation}
    delete_dict[' '] = ' '
    table = str.maketrans(delete_dict)
    text1 = text.translate(table)
    #print('cleaned:'+text1)
    textArr= text1.split()
    text2 = ' '.join([w for w in textArr if ( not w.isdigit() and  ( not w.isdigit() and len(w)>3))])

    return text2.lower()

# function to remove stopwords
def remove_stopwords(text, stop_words):
    textArr = text.split(' ')
    rem_text = " ".join([i for i in textArr if i not in stop_words])
    return rem_text

def lemmatization(texts,allowed_postags=['NOUN', 'ADJ']):
       nlp = spacy.load('en_core_web_md', disable=['parser', 'ner'])
       output = []
       for sent in texts:
             doc = nlp(sent)
             output.append([token.lemma_ for token in doc if token.pos_ in allowed_postags ])
       return output

def compare_file_to_topics(file_contents, model):
    # Convert file contents to a list of tokens
    file_tokens = lemmatization([file_contents])[0]

    #file_tokens = file_contents.split()

    print(file_tokens)

    # Create a dictionary representation of the file
    dictionary = corpora.Dictionary([file_tokens])

    file_dict = dictionary.doc2bow(file_tokens)

    print(file_dict)

    #file_vector = gensim.matutils.corpus2dense([file_dict], num_terms=len(dictionary)).T

    # Create a TF-IDF model
    tfidf_model = gensim.models.TfidfModel([file_dict])

    # Convert the file dictionary to a TF-IDF vector
    file_vector = tfidf_model[file_dict]

    print(file_vector)

    # Calculate cosine similarity between the file and each topic
    similarities = []
    for topic in model.show_topics(formatted=False):
        topic_words = list()
        tuple_list = topic[1]

        for tup in tuple_list:
            topic_words.append(tup[0])
            print(topic_words)

        topic_dict = dictionary.doc2bow(topic_words)
        # Create a TF-IDF model
        tfidf_model = gensim.models.TfidfModel([topic_dict])

        print(tfidf_model)

        # Convert the file dictionary to a TF-IDF vector
        topic_vector = tfidf_model[topic_dict]

        print(topic_vector)

        #topic_vector = gensim.matutils.corpus2dense([topic_dict], num_terms=len(dictionary)).T

        # COSINE SIMILARITY
        # Convert the lists into numerical vectors
        text1 = ' '.join(file_tokens)
        text2 = ' '.join(topic_words)
        vectorizer = CountVectorizer().fit_transform([text1, text2])

        cosine_sim = cosine_similarity(vectorizer)
        similarities.append(cosine_sim)

    return similarities

def perform_file_comparison(file_path, optimal_model):

    with open(file_path, "r") as file:
        file_contents = file.read()

    # Compare the file to each topic
    similarities = compare_file_to_topics(file_contents, optimal_model)

    # Print the similarities
    for i, similarity in enumerate(similarities):
        print(f"Topic {i+1}: {similarity}")


def clean_data(file_path):

    with open(file_path, "r") as file:
        file_contents = file.read()
    
    file_contents = clean_text(file_contents)

    stop_words = stopwords.words('english')
    additional_words = ['security', 'threat']
    stop_words.extend(additional_words)
    file_contents = remove_stopwords(file_contents, stop_words)

    file_tokens = lemmatization([file_contents])[0]

    return file_tokens


def compute_cosine_similarity(text1, text2):
    """
    Compute cosine similarity between two texts.
    
    Parameters:
    text1 (str): First text.
    text2 (str): Second text.
    
    Returns:
    float: Cosine similarity between the two texts.
    """
    text1 = "" if pd.isnull(text1) else text1
    text2 = "" if pd.isnull(text2) else text2

    vectorizer = CountVectorizer().fit_transform([text1, text2])
    similarity = cosine_similarity(vectorizer[0], vectorizer[1])
    return similarity[0][0]

def find_relevant_datasets(file_path, datasets):
    relevant_datasets = []

    similarities = []

    for dataset in datasets:
        dataset_folder = os.path.join("./datasets", dataset)
        model_path = os.path.join("./models", dataset + '_model.pkl')
        
        # Compare each topic set in the model to the text from the uploaded file using cosine similarity
        # For demonstration purposes, I'll just assume similarity and add the dataset to relevant datasets
        relevant_datasets.append(dataset)

    return relevant_datasets

def compare(file_name, datasets, num):
    file_path = os.path.join("./files", file_name)

    file_tokens = clean_data(file_path)

    relevant_datasets = find_relevant_datasets(file_path, datasets)

    similarity_scores = []

    for dataset in relevant_datasets:
        dataset_path = os.path.join("./datasets", dataset)
        data = pd.read_excel(dataset_path)

        for index, row in data.iterrows():
            data_tokens = row["Tokens"]
            link = row["Reference"]

            text1 = ' '.join(file_tokens)
            #print(text1)
            #data_tokens = [word.strip() for word in data_tokens]
            text2 = row["Summary"]
            print(text2)

            if text2 != "":
                similarity = compute_cosine_similarity(text1, text2)
                similarity_percent = ((similarity + 1)/2)*100
                similarity_scores.append((dataset, index, link, similarity_percent))
            print(similarity)
    
    # Sort the similarity scores in descending order
    similarity_scores.sort(key=lambda x: x[3], reverse=True)

    # Select the top n most similar entries
    top_n_similar_entries = similarity_scores[:num]

    print(top_n_similar_entries)

    return top_n_similar_entries



