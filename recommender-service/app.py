from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        watchlist_response = requests.get(f'http://localhost:3001/api/watchlist/{user_id}')
        watchlist = watchlist_response.json()

        catalog_response = requests.get('http://localhost:8080/api/catalog')
        catalog = catalog_response.json()

        if not watchlist:
            return jsonify([])

        watched_ids = [item['catalogId'] for item in watchlist]
        
        user_genres = set()
        for item in watchlist:
            for cat_item in catalog:
                if cat_item['id'] == item['catalogId']:
                    genres = cat_item['category'].replace('/', ' ').split()
                    for g in genres:
                        user_genres.add(g)
        
        recommendations = []
        for cat_item in catalog:
            if cat_item['id'] not in watched_ids:
                item_genres = cat_item['category'].replace('/', ' ').split()
                if any(genre in user_genres for genre in item_genres):
                    recommendations.append(cat_item)

        if not recommendations:
            recommendations = [item for item in catalog if item['id'] not in watched_ids][:2]

        return jsonify(recommendations)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)