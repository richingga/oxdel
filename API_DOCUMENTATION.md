# Oxdel API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": {}, // Response data (if any)
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

For paginated responses:
```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Cek email Anda untuk OTP."
}
```

#### POST /auth/verify
Verify email with OTP code.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/forgot-password
Request password reset link.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### PUT /auth/resetpassword/:token
Reset password with token.

**Request Body:**
```json
{
  "password": "NewSecurePass123!"
}
```

#### GET /auth/me
Get current user info (requires auth).

### Templates

#### GET /templates
Get all templates with pagination and filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `category` (optional): Filter by category
- `type` (optional): Filter by type
- `search` (optional): Search in name, category, type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wedding Invitation",
      "type": "undangan",
      "category": "pernikahan",
      "description": "Beautiful wedding invitation template",
      "preview_url": "https://...",
      "thumbnail_url": "https://...",
      "is_premium": 0,
      "price": 0,
      "featured": 1,
      "downloads": 150,
      "rating": 4.5,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

#### GET /templates/categories
Get all template categories.

**Response:**
```json
{
  "success": true,
  "data": ["pernikahan", "bisnis", "portfolio", "jasa"]
}
```

#### GET /templates/types
Get all template types.

#### GET /templates/:id
Get single template details.

#### GET /templates/:id/builder
Get template with parsed slots for builder (requires auth).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wedding Invitation",
    "code": "<div>{NAMA} & {PASANGAN}</div>",
    "slots": "NAMA,PASANGAN,TANGGAL,TEMPAT",
    "parsedSlots": [
      {
        "key": "NAMA",
        "label": "Nama",
        "type": "text",
        "required": true,
        "placeholder": "Masukkan nama lengkap"
      }
    ],
    "previewUrl": "/api/templates/1/preview"
  }
}
```

#### GET /templates/:id/preview
Get template preview with dummy data (HTML response).

#### POST /templates (Admin only)
Create new template.

**Request Body:**
```json
{
  "name": "Template Name",
  "type": "undangan",
  "category": "pernikahan",
  "description": "Template description",
  "code": "<div>{NAMA}</div>",
  "slots": "NAMA,EMAIL",
  "preview_url": "https://...",
  "thumbnail_url": "https://...",
  "is_premium": false,
  "price": 0,
  "featured": false
}
```

#### PUT /templates/:id (Admin only)
Update template.

#### DELETE /templates/:id (Admin only)
Delete template.

### Pages (User Projects)

#### GET /pages/mine
Get user's pages with pagination (requires auth).

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status (draft, published, archived)
- `search`: Search in title, slug

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "My Wedding",
      "slug": "my-wedding",
      "status": "published",
      "visibility": "public",
      "template_name": "Wedding Invitation",
      "template_type": "undangan",
      "view_count": 150,
      "preview_url": "/preview/my-wedding",
      "edit_url": "/builder/1",
      "public_url": "/my-wedding",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

#### POST /pages
Create new page (requires auth).

**Request Body:**
```json
{
  "title": "My Wedding Invitation",
  "template_id": 1,
  "content": {
    "NAMA": "John Doe",
    "PASANGAN": "Jane Smith",
    "TANGGAL": "2024-06-15",
    "TEMPAT": "Grand Ballroom"
  },
  "status": "draft",
  "visibility": "public"
}
```

#### GET /pages/:id
Get page details for editing (requires auth & ownership).

#### PUT /pages/:id
Update page (requires auth & ownership).

#### DELETE /pages/:id
Delete page (requires auth & ownership).

#### GET /pages/:id/analytics
Get page analytics (requires auth & ownership).

**Response:**
```json
{
  "success": true,
  "data": {
    "total_views": 150,
    "unique_views": 120,
    "daily_views": [
      {"date": "2024-01-01", "views": 10},
      {"date": "2024-01-02", "views": 15}
    ]
  }
}
```

#### GET /pages/public/:slug
Get public page data (no auth required).

#### GET /pages/render/:slug
Render public page as HTML (no auth required).

### Upload

#### POST /upload/image
Upload single image to Cloudinary (requires auth).

**Request:** `multipart/form-data` with field `image`.

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "public_id": "oxdel/abc123",
    "width": 800,
    "height": 600,
    "format": "jpg",
    "size": 12345
  },
  "message": "Gambar berhasil diupload"
}
```

### Users

#### GET /users/profile
Get user profile (requires auth).

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limits

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Registration: 3 requests per hour
- Email endpoints: 3 requests per 5 minutes

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- XSS protection
- CORS configuration
- Rate limiting
- Security headers (Helmet.js)

## Development

### Environment Variables
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=oxdel_db

SMTP_HOST=smtp.brevo.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### Database Setup
1. Create MySQL database
2. Run migration files in `/database/migrations/`
3. Insert sample data if needed

### Running the Server
```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:5000`