-- ====================================================================
-- SIMA AUTO DATABASE SCHEMA (MySQL 8.0+)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS sima_auto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sima_auto;

-- Enable Foreign Key Checks
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. VEHICLES TABLE (Core Vehicle Entity)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reference VARCHAR(50) NOT NULL UNIQUE COMMENT 'e.g. SA-2020-Q3',
    make VARCHAR(100) NOT NULL,
    model_range VARCHAR(100) NOT NULL COMMENT 'e.g. Q3 (F3B)(11.2018->)',
    trim_line VARCHAR(150) DEFAULT NULL COMMENT 'e.g. 40 TFSI quattro S line Sport',
    price_dh DECIMAL(12, 2) NOT NULL,
    mileage_km INT UNSIGNED NOT NULL,
    first_registration VARCHAR(10) NOT NULL COMMENT 'MM/YYYY format e.g. 01/2020',
    status ENUM('Disponible', 'Réservé', 'Vendu') DEFAULT 'Disponible',
    featured TINYINT(1) DEFAULT 0,
    main_image_url VARCHAR(500) NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_make_model (make, model_range),
    INDEX idx_status (status),
    INDEX idx_price (price_dh),
    INDEX idx_mileage (mileage_km)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. TECHNICAL_DATA TABLE (Specific Technical Specifications)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_technical_data (
    vehicle_id INT UNSIGNED PRIMARY KEY,
    vehicle_condition VARCHAR(100) DEFAULT 'Used vehicle, Accident-free',
    category VARCHAR(100) DEFAULT 'SUV/Off-road Vehicle/Pickup Truck',
    origin VARCHAR(100) DEFAULT 'German edition',
    owners_count INT UNSIGNED DEFAULT 1,
    cubic_capacity VARCHAR(50) DEFAULT NULL COMMENT 'e.g. 1,984 ccm',
    power VARCHAR(50) DEFAULT NULL COMMENT 'e.g. 140 kW (190 hp)',
    drive_type VARCHAR(100) DEFAULT 'Internal combustion engine',
    fuel VARCHAR(50) DEFAULT 'Petrol',
    energy_consumption VARCHAR(50) DEFAULT NULL COMMENT 'e.g. 7.5 l/100km',
    co2_emissions VARCHAR(50) DEFAULT NULL COMMENT 'e.g. 171 g/km',
    transmission VARCHAR(50) DEFAULT 'Automatic',
    emission_class VARCHAR(50) DEFAULT 'Euro6d-TEMP',
    emissions_sticker VARCHAR(50) DEFAULT '4 (Green)',
    seats_count INT UNSIGNED DEFAULT 5,
    door_count VARCHAR(20) DEFAULT '4/5',
    climatisation VARCHAR(100) DEFAULT 'Automatic climatisation, 3 zones',
    parking_sensors VARCHAR(150) DEFAULT 'Rear, Front, Camera',
    airbags VARCHAR(150) DEFAULT 'Front and Side and More Airbags',
    manufacturer_colour VARCHAR(100) DEFAULT NULL COMMENT 'e.g. Turboblau',
    colour VARCHAR(100) DEFAULT NULL COMMENT 'e.g. Blue Metallic',
    interior_design VARCHAR(150) DEFAULT NULL COMMENT 'e.g. Part leather, Black',
    weight VARCHAR(50) DEFAULT NULL COMMENT 'e.g. 1,695 kg',
    cylinders INT UNSIGNED DEFAULT 4,
    tank_capacity VARCHAR(50) DEFAULT NULL COMMENT 'e.g. 60 l',
    trailer_load_braked VARCHAR(50) DEFAULT NULL COMMENT 'e.g. 2,100 kg',
    trailer_load_unbraked VARCHAR(50) DEFAULT NULL COMMENT 'e.g. 750 kg',
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. FEATURES MASTER TABLE (List of all available equipment options)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS features (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. VEHICLE_FEATURES TABLE (Many-to-Many Relationship)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_features (
    vehicle_id INT UNSIGNED NOT NULL,
    feature_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (vehicle_id, feature_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. VEHICLE_GALLERY TABLE (Secondary Photos)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_gallery (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT UNSIGNED DEFAULT 0,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. LEADS / INQUIRIES TABLE (Tracking Customer Inquiries)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT UNSIGNED DEFAULT NULL,
    customer_name VARCHAR(100) DEFAULT NULL,
    phone_number VARCHAR(30) DEFAULT NULL,
    channel ENUM('WhatsApp', 'Phone Call', 'Form') DEFAULT 'WhatsApp',
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED DATA INSERTION
-- ====================================================================

-- Populate Master Features Checklist
INSERT INTO features (name) VALUES
('ABS'), ('Adaptive cornering lights'), ('Adaptive Cruise Control'), ('Alloy wheels'), ('Ambient lighting'),
('Android Auto'), ('Apple CarPlay'), ('Arm rest'), ('Autom. dimming interior mirror'), ('Bluetooth'),
('Central locking'), ('DAB radio'), ('Digital cockpit'), ('Distance warning system'), ('Electric seat adjustment'),
('Electric side mirror'), ('Electric tailgate'), ('Electric windows'), ('Emergency brake assist'), ('Emergency call system'),
('Folding exterior mirrors'), ('Four-wheel drive'), ('Full Service History'), ('Glare-free high beam headlights'),
('Hands-free kit'), ('Headlight washer system'), ('Heated seats'), ('Heated steering wheel'), ('High beam assist'),
('Hill-start assist'), ('Immobilizer'), ('Induction charging for smartphones'), ('Integrated music streaming'),
('Isofix'), ('Keyless central locking'), ('Lane change assist'), ('Leather steering wheel'), ('LED headlights'),
('LED running lights'), ('Light sensor'), ('Lumbar support'), ('Multifunction steering wheel'), ('Navigation system'),
('Non-smoker vehicle'), ('On-board computer'), ('Paddle shifters'), ('Panoramic roof'), ('Power Assisted Steering'),
('Rain sensor'), ('Sound system'), ('Speed limit control system'), ('Sport seats'), ('Sports package'),
('Sports suspension'), ('Start-stop system'), ('Summer tyres'), ('Sunroof'), ('Tinted windows'),
('Touchscreen'), ('Traction control'), ('Traffic sign recognition'), ('Trailer coupling, swiveling'),
('Tyre pressure monitoring'), ('USB port');

-- Insert Sample Vehicle: Audi Q3
INSERT INTO vehicles (
    reference, make, model_range, trim_line, price_dh, mileage_km, 
    first_registration, status, featured, main_image_url, description
) VALUES (
    'SA-2020-Q3', 'Audi', 'Q3 (F3B)(11.2018->)', '40 TFSI quattro S line S-Line Sline Sport', 
    380000.00, 99000, '01/2020', 'Disponible', 1, 
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
    'Véhicule en état impeccable. Carnet d entretien à jour chez la maison. Origine Allemagne.'
);

-- Get Inserted Vehicle ID for technical data & features insertion
SET @audi_id = LAST_INSERT_ID();

-- Insert Technical Specifications for Audi Q3
INSERT INTO vehicle_technical_data (
    vehicle_id, vehicle_condition, category, origin, owners_count, 
    cubic_capacity, power, drive_type, fuel, energy_consumption, 
    co2_emissions, transmission, emission_class, emissions_sticker, 
    seats_count, door_count, climatisation, parking_sensors, airbags, 
    manufacturer_colour, colour, interior_design, weight, cylinders, 
    tank_capacity, trailer_load_braked, trailer_load_unbraked
) VALUES (
    @audi_id, 'Used vehicle, Accident-free', 'SUV/Off-road Vehicle/Pickup Truck', 'German edition', 2,
    '1,984 ccm', '140 kW (190 hp)', 'Internal combustion engine', 'Petrol', '7.5 l/100km',
    '171 g/km', 'Automatic', 'Euro6d-TEMP', '4 (Green)',
    5, '4/5', 'Automatic climatisation, 3 zones', 'Rear, Front, Camera', 'Front and Side and More Airbags',
    'Turboblau', 'Blue Metallic', 'Part leather, Black', '1,695 kg', 4,
    '60 l', '2,100 kg', '750 kg'
);

-- Insert Selected Features for Audi Q3
INSERT INTO vehicle_features (vehicle_id, feature_id)
SELECT @audi_id, id FROM features WHERE name IN (
    'ABS', 'Adaptive Cruise Control', 'Alloy wheels', 'Ambient lighting', 'Android Auto', 
    'Apple CarPlay', 'Arm rest', 'Bluetooth', 'Central locking', 'Digital cockpit', 
    'Distance warning system', 'Electric seat adjustment', 'Electric side mirror', 'Electric tailgate', 
    'Four-wheel drive', 'Full Service History', 'Hands-free kit', 'Heated seats', 'Isofix', 
    'Keyless central locking', 'Leather steering wheel', 'LED headlights', 'LED running lights', 
    'Light sensor', 'Multifunction steering wheel', 'Navigation system', 'Paddle shifters', 
    'Panoramic roof', 'Rain sensor', 'Sound system', 'Sport seats', 'Sports package', 
    'Sports suspension', 'Start-stop system', 'Tinted windows', 'Touchscreen', 'Traction control', 'USB port'
);

-- Insert Gallery Images for Audi Q3
INSERT INTO vehicle_gallery (vehicle_id, image_url, display_order) VALUES
(@audi_id, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', 1),
(@audi_id, 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80', 2),
(@audi_id, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 3),
(@audi_id, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', 4);