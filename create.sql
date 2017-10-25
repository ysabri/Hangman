drop table if exists Words;
drop table if exists temp;

create table Words (
	id		integer primary key,
	word 	varchar(30) not null
	);
create table temp (
	word varchar(30) not null
	)