import pandas as pd
import numpy as np
import re
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

# Helper method to remove punctuation/number and make text lowercase
def clean_text(text ):
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

def perform_topic_modeling(filename):
    review_data= pd.read_excel(filename)
    print(review_data.head(2))
    print(len(review_data))
    print('Name')
    print(len(review_data.groupby('Name')))
    print('Reference')
    print(len(review_data.groupby('Reference')))

    nltk.download('stopwords') # run this one time
    stop_words = stopwords.words('english')

    additional_words = ['security', 'threat']
    stop_words.extend(additional_words)

    words = list()
    # Loop through each row, get all text from URL, clean and write to Words
    for index, row in review_data.iterrows():
        URL = row["Reference"]

        try:
            # Get request to get page data from URL
            driver = requests.get(URL)

            # Parses data to html
            soup = BeautifulSoup(driver.content, "html.parser")

            # Retrives the body of the html file
            tag = soup.body

            # Strips body of html tags and stores remaining words in a single string
            text = ' '.join([s for s in tag.stripped_strings])

            # Clean the text (remove numbers and punctuation, make lower case)
            temp = clean_text(text)

            # Remove stop words from text
            text = remove_stopwords(temp, stop_words)

            if len(text) < 50:
                 text = ""

        except:
            text = ""
            print("Error getting link")
        row["Summary"] = text
        words.append(text)

    #new_col = pd.DataFrame({"Words": words})
    #review_data = pd.concat([review_data, new_col], axis=1)
    #print(review_data.head(2))

    text_list=review_data['Summary'].tolist()
    print(text_list[1])
    tokenized_reviews = lemmatization(text_list)
    print(tokenized_reviews[1])

    review_data["Tokens"] = tokenized_reviews
    review_data.to_excel(filename, index=False)

    dictionary = corpora.Dictionary(tokenized_reviews)
    doc_term_matrix = [dictionary.doc2bow(rev) for rev in tokenized_reviews]

    # Creating the object for LDA model using gensim library
    LDA = gensim.models.ldamodel.LdaModel

    # Build LDA model
    lda_model = LDA(corpus=doc_term_matrix, id2word=dictionary, num_topics=10, random_state=100, chunksize=1000, passes=50,iterations=100)

    lda_model.print_topics()

    return lda_model
