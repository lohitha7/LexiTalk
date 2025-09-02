from flask import Flask, render_template, request, jsonify
from nltk.corpus import wordnet
import pyttsx3
import emoji

app = Flask(__name__)
engine = pyttsx3.init()

def get_emoji_for_word(word):
    """
    Returns a relevant emoji for any given English word using the emoji package.
    If no emoji found, returns empty string.
    """
    word = word.lower()
    for emj, data in emoji.EMOJI_DATA.items():
        if 'en' in data and word in data['en']:
            return emj
    return ""  # No emoji found

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/define', methods=['POST'])
def define():
    word = request.form.get('word').lower()
    synsets = wordnet.synsets(word)

    if synsets:
        definitions_list = [syn.definition() for syn in synsets]
        num_meanings = len(definitions_list)

        # Get emoji dynamically
        emoji_for_word = get_emoji_for_word(word)
        emoji_text = emoji_for_word if emoji_for_word else "No emoji found"

        return jsonify({
            "word": word,
            "num_meanings": num_meanings,
            "definitions": definitions_list,
            "emoji": emoji_text
        })

    return jsonify({"error": f"No definition found for '{word}'"})

@app.route('/speak', methods=['POST'])
def speak():
    text = request.form.get('text')
    try:
        engine.say(text)
        engine.runAndWait()
        return jsonify({"status": "spoken"})
    except RuntimeError:
        # Avoid "run loop already started" error
        new_engine = pyttsx3.init()
        new_engine.say(text)
        new_engine.runAndWait()
        return jsonify({"status": "spoken with new engine"})

if __name__ == '__main__':
    app.run(debug=True)
