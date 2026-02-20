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
            return jsonify(catalog[:2])

        watched_ids = [item['catalogId'] for item in watchlist]
        watched_categories = []
        
        for item in watchlist:
            for cat_item in catalog:
                if cat_item['id'] == item['catalogId']:
                    watched_categories.append(cat_item['category'])
        
        recommendations = []
        for cat_item in catalog:
            if cat_item['id'] not in watched_ids and cat_item['category'] in watched_categories:
                recommendations.append(cat_item)
        
        if not recommendations:
            recommendations = [item for item in catalog if item['id'] not in watched_ids]

        return jsonify(recommendations)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)