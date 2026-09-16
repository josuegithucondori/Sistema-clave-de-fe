-- ============================================
-- ESQUEMA DE BASE DE DATOS
-- Academia Clave de Fe
-- ============================================

-- Tabla de usuarios (para autenticacion)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT DEFAULT 'admin' CHECK (rol IN ('admin', 'docente', 'secretaria')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de docentes
CREATE TABLE IF NOT EXISTS docentes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  especialidad TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  estado TEXT DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de alumnos
CREATE TABLE IF NOT EXISTS alumnos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  edad INTEGER CHECK (edad > 0 AND edad < 150),
  telefono TEXT,
  padre TEXT,
  direccion TEXT,
  estado TEXT DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de aulas
CREATE TABLE IF NOT EXISTS aulas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  ubicacion TEXT,
  capacidad INTEGER CHECK (capacidad > 0),
  estado TEXT DEFAULT 'Disponible' CHECK (estado IN ('Disponible', 'Ocupada', 'Mantenimiento')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de horarios
CREATE TABLE IF NOT EXISTS horarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  materia TEXT NOT NULL,
  docente_id UUID REFERENCES docentes(id) ON DELETE SET NULL,
  aula_id UUID REFERENCES aulas(id) ON DELETE SET NULL,
  dia TEXT NOT NULL CHECK (dia IN ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo')),
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  grupo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (hora_inicio < hora_fin)
);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;

-- Politicas para usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden ver usuarios" ON usuarios FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden ver docentes" ON docentes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden gestionar docentes" ON docentes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden ver alumnos" ON alumnos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden gestionar alumnos" ON alumnos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden ver aulas" ON aulas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden gestionar aulas" ON aulas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden ver horarios" ON horarios FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuarios autenticados pueden gestionar horarios" ON horarios FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Funcion para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_docentes_updated_at BEFORE UPDATE ON docentes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alumnos_updated_at BEFORE UPDATE ON alumnos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_aulas_updated_at BEFORE UPDATE ON aulas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_horarios_updated_at BEFORE UPDATE ON horarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar usuario admin (contrasena: admin123 - hasheada con bcrypt)
-- En produccion, usar Supabase Auth para crear usuarios
INSERT INTO usuarios (email, password_hash, nombre, rol)
VALUES ('admin@clavede-fe.com', '$2a$10$dummy_hash_for_initial_setup', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;
