drop table if exists Words;

create table Words (
	id		integer primary key,
	word 	varchar(30) not null
	);
create table temp (
	word varchar(30) not null
	)