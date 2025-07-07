from flask import Blueprint, request, jsonify
import requests
from models import db, Admin, Category, Brand, Product
import re
from unidecode import unidecode
import datetime
from flask import current_app, make_response
import jwt
import secrets
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token, set_access_cookies

admin_bp = Blueprint('api', __name__, url_prefix='/api/admin')

BUNNY_STORAGE_ZONE = 'aidibysmarttech'
BUNNY_STORAGE_API_KEY = '39a5bd39-84f5-419b-bb47b193a370-faf1-4954'
BUNNY_STORAGE_ENDPOINT = f'https://storage.bunnycdn.com/{BUNNY_STORAGE_ZONE}'

def slugify(text):
    text = unidecode(text).lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


@admin_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    admin = Admin.query.filter_by(username=username).first()

    if not admin or not admin.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    admin_token = create_access_token(
        identity=str(admin.id),
        expires_delta=datetime.timedelta(days=1),
    )

    response = make_response(jsonify({'message': 'Login successful'}))

    set_access_cookies(response, admin_token)

    return response

@admin_bp.route('/logout', methods=['POST'])
def admin_logout():
    response = make_response(jsonify({'message': 'Logged out'}))
    response.set_cookie('admin_token', '', expires=0)
    return response

# Check user auth
@admin_bp.route('/check-auth', methods=['GET'])
@jwt_required()
def check_auth():
    admin_id = get_jwt_identity()
    print(f"Admin ID: {admin_id}")
    return jsonify({"authenticated": True, "user_id": admin_id}), 200


# ----------- CATEGORY ROUTES -----------

@admin_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{'id': c.id, 'name': c.name} for c in categories])

@admin_bp.route('/categories', methods=['POST'])
@jwt_required()
def add_category():
    admin_id = get_jwt_identity()
    admin = Admin.query.get(admin_id)
    
    if not admin:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Category already exists'}), 400
    category = Category(name=data['name'], slug=slugify(data['name']))
    db.session.add(category)
    db.session.commit()
    return jsonify({'id': category.id, 'name': category.name}), 201

@admin_bp.route('/categories/<int:id>', methods=['PUT'])
@jwt_required()
def update_category(id):
    admin_id = get_jwt_identity()
    admin = Admin.query.get(admin_id)

    if not admin:
        return jsonify({'error': 'Unauthorized'}), 401
    
    category = Category.query.get_or_404(id)
    data = request.get_json()
    category.name = data.get('name', category.name)
    db.session.commit()
    return jsonify({'id': category.id, 'name': category.name})

@admin_bp.route('/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted'})


# ----------- BRAND ROUTES -----------

@admin_bp.route('/brands', methods=['GET'])
def get_brands():
    brands = Brand.query.all()
    return jsonify([
        {'id': b.id, 'name': b.name, 'category_id': b.category_id}
        for b in brands
    ])

@admin_bp.route('/brands', methods=['POST'])
def add_brand():
    data = request.get_json()
    if Brand.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Brand already exists'}), 400
    brand = Brand(name=data['name'], category_id=data['category_id'], slug=slugify(data['name']))
    db.session.add(brand)
    db.session.commit()
    return jsonify({'id': brand.id, 'name': brand.name}), 201

@admin_bp.route('/brands/<int:id>', methods=['PUT'])
def update_brand(id):
    brand = Brand.query.get_or_404(id)
    data = request.get_json()
    brand.name = data.get('name', brand.name)
    brand.category_id = data.get('category_id', brand.category_id)
    db.session.commit()
    return jsonify({'id': brand.id, 'name': brand.name, 'category_id': brand.category_id})

@admin_bp.route('/brands/<int:id>', methods=['DELETE'])
def delete_brand(id):
    brand = Brand.query.get_or_404(id)
    db.session.delete(brand)
    db.session.commit()
    return jsonify({'message': 'Brand deleted'})


# ----------- PRODUCT ROUTES -----------

@admin_bp.route('/products', methods=['GET'])
def get_products():
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)

    paginated = Product.query.paginate(page=page, per_page=per_page, error_out=False)

    products = [{
        'id': p.id,
        'title': p.title,
        'images': p.images,
        'description': p.description,
        'price': str(p.price),
        'original_price': str(p.original_price),
        'review_count': p.review_count,
        'in_stock': p.in_stock,
        'is_new': p.is_new,
        'is_sale': p.is_sale,
        'sales_count': p.sales_count,
        'created_at': p.created_at.isoformat(),
        'brand_id': p.brand_id
    } for p in paginated.items]

    return jsonify({
        'products': products,
        'page': paginated.page,
        'per_page': paginated.per_page,
        'total_pages': paginated.pages,
        'total_items': paginated.total
    })

@admin_bp.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    product = Product(
        images=data.get('images', []),
        title=data['title'],
        description=data.get('description', ''),
        price=data['price'],
        original_price=data.get('original_price'),
        review_count=data.get('review_count', 0),
        in_stock=data.get('in_stock', True),
        is_new=data.get('is_new', False),
        is_sale=data.get('is_sale', False),
        sales_count=data.get('sales_count', 0),
        brand_id=data['brand_id']
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'id': product.id, 'title': product.title}), 201

@admin_bp.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    for field in ['images', 'title', 'description', 'price', 'original_price', 'review_count',
                  'in_stock', 'is_new', 'is_sale', 'sales_count', 'brand_id']:
        if field in data:
            setattr(product, field, data[field])
    db.session.commit()
    return jsonify({'id': product.id, 'title': product.title})

@admin_bp.route('/upload', methods=['POST'])
def upload_to_bunny():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    filename = file.filename

    if not filename:
        return jsonify({'error': 'No selected file'}), 400

    # Upload to BunnyCDN
    upload_url = f"{BUNNY_STORAGE_ENDPOINT}/{filename}"

    response = requests.put(
        upload_url,
        data=file.stream,
        headers={
            'AccessKey': BUNNY_STORAGE_API_KEY,
            'Content-Type': 'application/octet-stream'
        }
    )

    if response.status_code == 201:
        file_url = f"https://{BUNNY_STORAGE_ZONE}.b-cdn.net/{filename}"
        return jsonify({'message': 'File uploaded successfully', 'url': file_url}), 201
    else:
        return jsonify({'error': 'Upload failed', 'details': response.text}), response.status_code