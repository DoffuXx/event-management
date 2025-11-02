## Tech Stack

- **Backend**: Laravel with PHP
- **Frontend**: React with Inertia.js
- **Styling**: TailwindCSS with Headless UI
- **Admin Panel**: Laravel Nova
- **Build Tool**: Vite
- **Authentication**: Laravel Sanctum
- **Additional**: FullCalendar, date-fns, Ziggy for route helpers

## Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.2 or higher**
- **Composer** (latest version)
- **Node.js 18.x or higher**
- **npm** or **yarn**
- **Database** (MySQL, PostgreSQL, or SQLite)
- **Git**

## Quick Setup

The project includes a convenient setup script that handles most of the installation process:

```bash
# Clone the repository
git clone <your-repository-url>
cd <project-directory>

# Run the automated setup
composer run setup
```

This command will:

- Install PHP dependencies
- Copy `.env.example` to `.env`
- Generate application key
- Run database migrations
- Install Node.js dependencies
- Build frontend assets

### 1. Install PHP Dependencies

```bash
composer install
```

### 2. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Setup

Edit your `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

For SQLite (development):

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
```

### 4. Run Migrations

```bash
php artisan migrate
```

### 5. Install Node.js Dependencies

```bash
npm install
```

### 6. Build Assets

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
```

## Laravel Nova Setup

This project includes Laravel Nova for admin functionality. To set up Nova:

### 1. Nova License

Ensure you have a valid Laravel Nova license and access to the Nova repository. The composer.json already includes the Nova repository configuration.

### 2. Nova Installation

Nova should be installed automatically with `composer install`. If you encounter issues:

```bash
composer update laravel/nova
```

### 3. Nova Assets

Publish Nova's assets:

```bash
php artisan nova:install
```

### 4. Create Nova User

Create an admin user for Nova:

```bash
php artisan db:seed

```

## Development

### Running the Development Environment

The project includes a comprehensive development script that runs multiple services concurrently:

```bash
composer run dev
```

This command starts:

- **Laravel development server** (http://localhost:8000)
- **Queue worker** for background jobs
- **Laravel Pail** for real-time log monitoring
- **Vite development server** for hot module replacement

### Individual Services

You can also run services individually:

```bash
# Laravel server
php artisan serve

# Queue worker
php artisan queue:listen

# Log monitoring
php artisan pail

# Frontend development
npm run dev
```
