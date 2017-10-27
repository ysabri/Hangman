drop table if exists Twords;
drop table if exists temp;
drop table if exists noun;
drop table if exists Words;

create table Twords (
	id		integer primary key,
	word 	varchar(30) not null
	);
create table temp (
	word varchar(30) not null
	);
create table noun (
	id		integer primary key,
	word 	varchar(30) not null
	);
create table Words (
	id		integer primary key,
	word 	varchar(30) not null
);