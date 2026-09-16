export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'docente' | 'secretaria';
  created_at: string;
  updated_at: string;
}

export interface Docente {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  email: string;
  estado: 'Activo' | 'Inactivo';
  created_at: string;
  updated_at: string;
}

export interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  telefono: string;
  padre: string;
  direccion: string;
  estado: 'Activo' | 'Inactivo';
  created_at: string;
  updated_at: string;
}

export interface Aula {
  id: string;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  estado: 'Disponible' | 'Ocupada' | 'Mantenimiento';
  created_at: string;
  updated_at: string;
}

export interface Horario {
  id: string;
  materia: string;
  docente_id: string;
  aula_id: string;
  dia: 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';
  hora_inicio: string;
  hora_fin: string;
  grupo: string;
  created_at: string;
  updated_at: string;
}
