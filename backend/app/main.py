from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FarmaZi API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "FarmaZi API funcionando!", "status": "active"}

@app.post("/api/auth/login")
def login(username: str = Form(), password: str = Form()):
    # Usuarios mock para desarrollo
    users = {
        "admin": "admin123",
        "vendedor": "vendedor123", 
        "farmaceutico": "farm123"
    }
    
    if username in users and users[username] == password:
        return {"access_token": "mock-token-123", "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

@app.get("/api/auth/me")
def get_current_user():
    return {
        "id": "1",
        "username": "admin",
        "email": "admin@farmazi.com",
        "full_name": "Administrador",
        "role_id": 1,
        "is_active": True
    }

@app.get("/api/products")
def get_products():
    return [
        {"id": "1", "name": "Paracetamol 500mg", "price": 2.50, "stock": 100},
        {"id": "2", "name": "Ibuprofeno 400mg", "price": 3.20, "stock": 50},
        {"id": "3", "name": "Amoxicilina 500mg", "price": 8.90, "stock": 25},
        {"id": "4", "name": "Vitamina C 1000mg", "price": 15.00, "stock": 80},
    ]