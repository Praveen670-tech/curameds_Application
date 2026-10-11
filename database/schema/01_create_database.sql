-- ==============================================================
-- CURAMEDS MEDICINE MONITORING & TELEMEDICINE PLATFORM
-- File: 01_create_database.sql
-- Purpose: Initialize database schema with utf8mb4 encoding
-- ==============================================================

-- Create database if not already present
CREATE DATABASE IF NOT EXISTS curameds_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE curameds_db;

-- Set session parameters for strict SQL compliance
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';
