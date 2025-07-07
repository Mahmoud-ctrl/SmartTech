from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Category, Brand, Product

# Replace with your actual PostgreSQL connection string
DATABASE_URL = "postgresql://smarttech:1289@localhost:5432/postgres"

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Create tables
Base.metadata.create_all(engine)

# Insert Categories
laptops = Category(name="Laptops")
phones = Category(name="Phones")
accessories = Category(name="Accessories")
session.add_all([laptops, phones, accessories])
session.commit()

# Insert Brands
apple = Brand(name="Apple", category_id=phones.id)
samsung = Brand(name="Samsung", category_id=phones.id)
asus = Brand(name="Asus", category_id=laptops.id)
session.add_all([apple, samsung, asus])
session.commit()

# Insert Products
product1 = Product(
    image="iphone14.jpg",
    title="iPhone 14 Pro",
    description="Latest Apple iPhone with A16 Bionic chip.",
    price=999.00,
    original_price=1099.00,
    in_stock=True,
    is_new=True,
    is_sale=True,
    brand_id=apple.id,
    specs={
        "Color": "Space Black",
        "Storage": "256GB",
        "RAM": "6GB",
        "Screen": "6.1-inch OLED"
    }
)

product2 = Product(
    image="rog_laptop.jpg",
    title="Asus ROG Zephyrus",
    description="High performance gaming laptop with RTX 3070.",
    price=1499.00,
    original_price=1699.00,
    in_stock=True,
    is_new=False,
    is_sale=True,
    brand_id=asus.id,
    specs={
        "CPU": "Ryzen 9",
        "GPU": "RTX 3070",
        "RAM": "16GB",
        "Storage": "1TB SSD",
        "Display": "15.6-inch 144Hz"
    }
)

session.add_all([product1, product2])
session.commit()

print("✅ Sample data inserted successfully!")
