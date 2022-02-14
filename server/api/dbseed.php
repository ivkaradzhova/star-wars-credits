<?php
require 'bootstrap.php';

$statement = <<<EOS
    use ending_credits;

    create table if not exists animation (
        id int not null auto_increment,
        name varchar(100) not null,
        type varchar(100) not null,
        source varchar(100),
        height int,
        text longtext,
        text_color varchar(100),
        style varchar(100) not null,
        speed int not null,
        background_color varchar(100) not null,
        music_type varchar(100) not null,
        music_url varchar(100),
        music_path varchar(100),
        primary key (id)
    );
EOS;

try {
    $createTable = $dbConnection->exec($statement);
} catch (\PDOException $e) {
    exit($e->getMessage());
}