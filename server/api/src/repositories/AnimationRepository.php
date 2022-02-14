<?php
namespace Src\Repositories;

class AnimationRepository {

    private $db = null;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function findAll()
    {
        $statement = "
            SELECT *
            FROM animation;
        ";

        try {
            $statement = $this->db->query($statement);
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function find($id)
    {
        $statement = "
            SELECT *
            FROM animation
            WHERE id = ?;
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array($id));
            $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
            return $result;
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }
    }

    public function insert(Array $input)
    {
        $statement = "
            INSERT INTO animation
                (name, type, source, height, text, text_color, style, speed, background_color, music_type, music_url, music_path)
            VALUES
                (:name, :type, :source, :height, :text, :text_color, :style, :speed, :background_color, :music_type, :music_url, :music_path);
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array(
                'name' => $input['name'],
                'type'  => $input['type'],
                'source' => $input['source'] ?? null,
                'height' => $input['height'] ?? null,
                'text' => $input['text'] ?? null,
                'text_color' => $input['textColor'] ?? null,
                'style' => $input['style'],
                'speed' => $input['speed'],
                'background_color' => $input['backgroundColor'],
                'music_type' => $input['musicType'],
                'music_url' => $input['musicUrl'] ?? null,
                'music_path' => $input['musicPath'] ?? null
            ));
            return $statement->rowCount();
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            exit($e->getMessage());
        }
    }

    public function update($id, Array $input)
    {
        $statement = "
            UPDATE animation
            SET 
                name = :name,
                type = :type,
                source = :source,
                height = :height,
                text = :text,
                text_color = :text_color,
                style = :style,
                speed = :speed,
                background_color = :background_color,
                music_type = :music_type,
                music_url = :music_url,
                music_path = :music_path
            WHERE id = :id;
        ";
        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array(
                'id' => (int) $id,
                'name' => $input['name'],
                'type'  => $input['type'],
                'source' => $input['source'] ?? null,
                'height' => $input['height'] ?? null,
                'text' => $input['text'] ?? null,
                'text_color' => $input['textColor'] ?? null,
                'style' => $input['style'],
                'speed' => $input['speed'],
                'background_color' => $input['backgroundColor'],
                'music_type' => $input['musicType'],
                'music_url' => $input['musicUrl'],
                'music_path' => $input['musicPath']
            ));
            return $statement->rowCount();
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            exit($e->getMessage());
        }
    }

    public function delete($id)
    {
        $statement = "
            DELETE FROM animation
            WHERE id = :id;
        ";

        try {
            $statement = $this->db->prepare($statement);
            $statement->execute(array('id' => $id));
            return $statement->rowCount();
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }    
    }
}