<?php
require "vendor/autoload.php";
require "bootstrap.php";
require "dbseed.php";
use Src\Controller\AnimationController;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

if ($uri[2] !== 'animation') {
    header("HTTP/1.1 404 Not Found");
    exit();
}

$animationId = null;
if (isset($uri[3])) {
    $animationId = (int) $uri[3];
}

$requestMethod = $_SERVER["REQUEST_METHOD"];

$controller = new AnimationController($dbConnection, $requestMethod, $animationId);
$controller->processRequest();