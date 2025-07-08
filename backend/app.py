
from flask import Flask, abort, request, redirect, url_for, jsonify
from sqlalchemy import func
from config import Config
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta
from models import db
from flask_cors import CORS
import pytz
from models import Category, Brand, Product, db
from flask_jwt_extended import JWTManager

app = Flask(__name__)
jwt = JWTManager(app)
app.config.from_object(Config)
db.init_app(app)
lebanon_tz = pytz.timezone("Asia/Beirut")

app.config['SECRET_KEY'] = '1289'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
app.config["JWT_CSRF_IN_COOKIES"] = True
app.config['JWT_TOKEN_LOCATION'] = ['cookies'] 
app.config['JWT_COOKIE_SECURE'] = False  # Set to True in production (requires HTTPS)
app.config['JWT_COOKIE_SAMESITE'] = 'lax'
app.config['JWT_ACCESS_COOKIE_NAME'] = 'admin_token'
app.config['JWT_COOKIE_HTTPONLY'] = True


CORS(
    app,
    supports_credentials=True,
    allow_headers=["Authorization", "Content-Type", "X-CSRF-TOKEN"],
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://192.168.0.108:5173",
                "http://192.168.56.1:5173",
            ],
            "allow_headers": ["Authorization", "Content-Type", "X-CSRF-TOKEN"],
            "expose_headers": ["Authorization"],
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
        },
    }
)


# Register admin blueprint
from blueprints.admin import admin_bp
app.register_blueprint(admin_bp)

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return jsonify({'message': 'Preflight OK'}), 200

@app.route('/api')
def index():
    return "Welcome to the API"

# Get all categories
@app.route('/api/categories')
def get_categories():
    categories = Category.query.all()
    result = []
    for c in categories:
        result.append({
            'id': c.id,
            'name': c.name,
            'slug': c.slug
        })
    return jsonify(result)

# Get all brands
@app.route('/api/brands')
def get_brands():
    brands = Brand.query.all()
    result = []
    for b in brands:
        result.append({
            'id': b.id,
            'name': b.name,
            'slug': b.slug,
            'category_id': b.category_id
        })
    return jsonify(result)

def serialize_product(p):
    return {
        'id': p.id,
        'title': p.title,
        'images': p.images,
        'description': p.description,
        'price': int(p.price),
        'original_price': int(p.original_price),
        'review_count': p.review_count,
        'in_stock': p.in_stock,
        'is_new': p.is_new,
        'is_sale': p.is_sale,
        'sales_count': p.sales_count,
        'created_at': p.created_at.isoformat(),
        'brand_id': p.brand_id
    }

@app.route('/api/products/newest')
def get_newest_products():
    products = Product.query.order_by(Product.created_at.desc()).limit(3).all()
    return jsonify([serialize_product(p) for p in products])

@app.route('/api/products/bestsellers')
def get_best_sellers():
    products = Product.query.order_by(Product.sales_count.desc()).limit(3).all()
    return jsonify([serialize_product(p) for p in products])

@app.route('/api/products/sale')
def get_on_sale_products():
    limit = request.args.get('limit', default=6, type=int)
    products = Product.query.filter_by(is_sale=True).limit(limit).all()
    return jsonify([serialize_product(p) for p in products])

@app.route('/api/products/<int:product_id>/click', methods=['POST'])
def increment_click(product_id):
    product = Product.query.get_or_404(product_id)
    product.sales_count += 1
    db.session.commit()
    return jsonify({'message': 'Click recorded', 'sales_count': product.sales_count})


# @app.route('/api/products', methods=['GET'])
# def get_products():
#     category_slug = request.args.get('category')
#     brand_slug = request.args.get('brand')

#     query = Product.query

#     # Filter by brand
#     if brand_slug:
#         brand = Brand.query.filter_by(slug=brand_slug).first()
#         if not brand:
#             return jsonify({'error': 'Brand not found'}), 404
#         query = query.filter(Product.brand_id == brand.id)

#     # Filter by category (through brand)
#     elif category_slug:
#         category = Category.query.filter_by(slug=category_slug).first()
#         if not category:
#             return jsonify({'error': 'Category not found'}), 404
#         query = query.join(Product.brand).filter(Brand.category_id == category.id)

#     products = query.all()

#     return jsonify([
#         {
#             'id': p.id,
#             'title': p.title,
#             'images': p.images,
#             'description': p.description,
#             'price': str(p.price),
#             'original_price': str(p.original_price),
#             'review_count': p.review_count,
#             'in_stock': p.in_stock,
#             'is_new': p.is_new,
#             'is_sale': p.is_sale,
#             'sales_count': p.sales_count,
#             'created_at': p.created_at.isoformat(),
#             'brand_id': p.brand_id
#         } for p in products
#     ])

@app.route('/api/products/minifilter')
def filter_products():
    brand_id = request.args.get('brand_id')
    products = Product.query.filter_by(brand_id=brand_id).all()
    return jsonify([serialize_product(p) for p in products])
from flask import request, jsonify
from sqlalchemy import func

@app.route('/api/products/filter', methods=['GET'])
def get_filtered_products():
    category_slug = request.args.get('category_slug')
    brand_slugs = request.args.get('brand_slugs')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    sort_by = request.args.get('sort_by')
    in_stock = request.args.get('in_stock', type=lambda v: v.lower() == 'true')
    is_sale = request.args.get('is_sale', type=lambda v: v.lower() == 'true')
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=12, type=int)

    query = Product.query

    if category_slug:
        category = Category.query.filter_by(slug=category_slug).first()
        if category:
            query = query.join(Product.brand).filter(Brand.category_id == category.id)

    if brand_slugs:
        brand_slug_list = brand_slugs.split(',')
        query = query.join(Product.brand).filter(Brand.slug.in_(brand_slug_list))

    price_query = query.with_entities(func.min(Product.price), func.max(Product.price)).first()
    min_possible_price, max_possible_price = price_query

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if in_stock is not None:
        query = query.filter(Product.in_stock == in_stock)

    if is_sale is not None:
        query = query.filter(Product.is_sale == is_sale)

    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'newest':
        query = query.order_by(Product.created_at.desc())
    elif sort_by == 'popularity':
        query = query.order_by(Product.sales_count.desc())

    # Get total count before pagination
    total_count = query.count()

    # Apply pagination
    query = query.offset((page - 1) * limit).limit(limit)

    products = query.all()

    product_list = [
        {
            'id': p.id,
            'title': p.title,
            'image': p.images[0] if p.images else None,
            'description': p.description,
            'price': float(p.price),
            'originalPrice': float(p.original_price) if p.original_price else None,
            'reviewCount': p.review_count,
            'category': p.brand.category.name,
            'brand': p.brand.name,
            'inStock': p.in_stock,
            'isNew': p.is_new,
            'isSale': p.is_sale,
        } for p in products
    ]

    return jsonify({
        'products': product_list,
        'meta': {
            'min_price': float(min_possible_price) if min_possible_price else 0,
            'max_price': float(max_possible_price) if max_possible_price else 1000,
            'total': total_count,
            'page': page,
            'limit': limit,
            'total_pages': (total_count + limit - 1) // limit
        }
    })


@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    brand = Brand.query.get(product.brand_id)
    category = Category.query.get(brand.category_id) if brand else None

    return jsonify({
        'id': product.id,
        'title': product.title,
        'images': product.images,
        'description': product.description,
        'price': float(product.price),
        'originalPrice': float(product.original_price) if product.original_price else None,
        'reviewCount': product.review_count,
        'inStock': product.in_stock,
        'isNew': product.is_new,
        'isSale': product.is_sale,
        'salesCount': product.sales_count,
        'createdAt': product.created_at.isoformat() if product.created_at else None,
        'brand': {
            'id': brand.id,
            'name': brand.name,
            'slug': brand.slug,
            'category_id': brand.category_id
        } if brand else None,
        'category': {
            'id': category.id,
            'name': category.name,
            'slug': category.slug
        } if category else None
    })

# Search products by title
@app.route('/api/products/search', methods=['GET'])
def search_products():
    query = request.args.get('query', '')
    if not query:
        return jsonify([])

    products = Product.query.filter(Product.title.ilike(f'%{query}%')).all()
    return jsonify([serialize_product(p) for p in products])

@app.route('/api/products/<int:product_id>/similar', methods=['GET'])
def get_similar_products(product_id):
    # Get the main product
    product = Product.query.get_or_404(product_id)
    brand = Brand.query.get(product.brand_id)
    if not brand:
        return jsonify([])

    # First: Get products from the **same brand**, excluding the original
    same_brand_products = (
        Product.query
        .filter(
            Product.brand_id == brand.id,
            Product.id != product.id
        )
        .limit(4)
        .all()
    )

    # If we already have 4 or more, return them
    if len(same_brand_products) >= 4:
        return jsonify([serialize_product(p) for p in same_brand_products])

    # Second: Get products from the **same category**, excluding already added products
    remaining = 4 - len(same_brand_products)
    same_category_products = (
        Product.query
        .join(Brand)
        .filter(
            Brand.category_id == brand.category_id,
            Product.id != product.id,
            Product.id.notin_([p.id for p in same_brand_products])
        )
        .limit(remaining)
        .all()
    )

    # Combine both lists
    similar_products = same_brand_products + same_category_products
    return jsonify([serialize_product(p) for p in similar_products])


if __name__ == "__main__":
    with app.app_context():
        db.create_all() 
    app.run(debug=True, host='0.0.0.0', port=8000)