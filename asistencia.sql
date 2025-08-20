create database asistencia;

create table asistencia (
    id_asistencia serial primary key,
    id_empleado int not null,
    fecha date not null,
    hora_entrada time not null,
    hora_salida time,
    foreign key (id_empleado) references empleados(id_empleado)
);

create table empleados (
    id_empleado serial primary key,
    nombre varchar(100) not null,
    departamento varchar(100) not null
);