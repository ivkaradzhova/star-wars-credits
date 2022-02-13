<?php

namespace Src;

class DatabaseConnector {
    private $dbConnection = null;

    public function __construct() {
        $host = $_ENV['DB_HOST'];
        $port = $_ENV['DB_PORT'];
        $db   = $_ENV['DB_DATABASE'];
        $user = $_ENV['DB_USERNAME'];
        $pass = $_ENV['DB_PASSWORD'];
        error_log($host . ' ' . $port . ' ' . $db . ' ' . $user . ' ' . $pass);

        try {
            $this->dbConnection = new \PDO(
                "mysql:host=$host;port=$port;dbname=$db",
                $user,
                $pass,
                array(\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION));
        } catch (\PDOException $e) {
            exit($e->getMessage());
            error_log('hellO!123' . $pass);
        }
    }

    public function getConnection() {
        return $this->dbConnection;
    }
}