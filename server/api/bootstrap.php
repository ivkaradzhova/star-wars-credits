<?php
require 'vendor/autoload.php';
require_once 'DatabaseConnector.php';
use Dotenv\Dotenv;

$dotenv = DotEnv::createImmutable(__DIR__);
$dotenv->load();

$dbConnection = (new DatabaseConnector())->getConnection();
