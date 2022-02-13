<?php
require 'vendor/autoload.php';
use Dotenv\Dotenv;

use Src\DatabaseConnector;

$dotenv = DotEnv::createImmutable(__DIR__);
$dotenv->load();

$dbConnection = (new DatabaseConnector())->getConnection();
