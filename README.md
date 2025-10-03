# Personal Expense Management - Backend

API RESTful desarrollada en **NestJS** para la gestión de finanzas personales.
Provee endpoints seguros para la administración de usuarios, billeteras y transacciones, así como generación de reportes semanales.

## 🚀 Tecnologías principales

* **NestJS** (con TypeScript)
* **PostgreSQL** (via **TypeORM**)
* **JWT + bcrypt** – autenticación segura
* **Class-validator & DTOs** – validación de datos
* **Docker** – base de datos en contenedor
* **Pagination con QueryBuilder**

## 🏗️ Arquitectura del backend

El backend se organiza en **módulos independientes**:

* **AuthModule** → manejo de usuarios, login y registro (con encriptación de contraseñas + JWT).
* **UsersModule** → gestión de usuarios.
* **WalletsModule** → creación y administración de billeteras (cada usuario tiene múltiples billeteras).
* **TransactionsModule** → CRUD de transacciones con filtros y paginación.
* **ReportsModule** → generación de reportes semanales con días vacíos en `0`.

## ✨ Features principales

✅ Registro e inicio de sesión con seguridad (bcrypt + JWT).
✅ CRUD completo de transacciones.
✅ Filtros por fecha, categoría, tipo y billetera.
✅ Paginación eficiente con `limit` y `offset`.
✅ Reporte semanal con **CTE + generate_series** para garantizar que todos los días de la semana aparezcan, incluso sin movimientos.
✅ Validación robusta de DTOs con **class-validator**.
✅ Integración con base de datos PostgreSQL mediante **TypeORM**.

## 📦 Instalación y ejecución

```bash
# Clonar repositorio
git clone https://github.com/tuusuario/expense-management-backend.git

# Entrar al proyecto
cd expense-management-backend

# Instalar dependencias
yarn install

# Correr en desarrollo
yarn start:dev
```

## 🐘 Configuración de la base de datos (Docker)

Ejecutar PostgreSQL con Docker:

```bash
docker-compose up -d
```

## 🔑 Variables de entorno

Antes de ejecutar el proyecto, necesitas crear un archivo `.env` en la raíz basado en el archivo `.env.template`:

```env
cp .env.template .env
```

## 🔮 Próximos pasos

* Pruebas unitarias e2e con Jest.
* Exportación de reportes en PDF/Excel.
