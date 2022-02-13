<?php
namespace Src\Controller;

use Src\Repositories\AnimationRepository;

class AnimationController {
    private $db;
    private $requestMethod;
    private $animationId;

    private $repository;

    public function __construct($db, $requestMethod, $animationId) {
        $this->db = $db;;
        $this->requestMethod = $requestMethod;
        $this->animationId = $animationId;
        $this->repository = new AnimationRepository($db);
    }

    public function processRequest() {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->animationId) {
                    $response = $this->getAnimation($this->animationId);
                } else {
                    $response = $this->getAllAnimations();
                };
                break;
            case 'POST':
                $response = $this->createAnimation();
                break;
            case 'PUT':
                $response = $this->updateAnimation($this->animationId);
                break;
            case 'DELETE':
                $response = $this->deleteAnimation($this->animationId);
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }
        header($response['status_code_header']);
        if ($response['body']) {
            echo $response['body'];
        }
    }

    private function getAllAnimations()
    {
        $result = $this->repository->findAll();
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function getAnimation($id)
    {
        $result = $this->repository->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }

    private function createAnimation() {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validateAnimation($input)) {
            return $this->unprocessableEntityResponse();
        }
        $input["textColor"] = hexdec($input["textColor"]);
        $input["backgroundColor"] = hexdec($input["backgroundColor"]);
        $this->repository->insert($input);
        $response['status_code_header'] = 'HTTP/1.1 201 Created';
        $response['body'] = null;
        return $response;
    }

    private function updateAnimation($id)
    {
        $result = $this->repository->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        if (!$this->validateAnimation($input)) {
            return $this->unprocessableEntityResponse();
        }
        $this->repository->update($id, $input);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function deleteAnimation($id)
    {
        $result = $this->repository->find($id);
        if (!$result) {
            return $this->notFoundResponse();
        }
        $this->repository->delete($id);
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = null;
        return $response;
    }

    private function validateAnimation($input)
    {
        // if (!isset($input['name'])) {
        //     return false;
        // }
        // if (!isset($input['lastname'])) {
        //     return false;
        // }
        return true;
    }

    private function unprocessableEntityResponse()
    {
        $response['status_code_header'] = 'HTTP/1.1 422 Unprocessable Entity';
        $response['body'] = json_encode([
            'error' => 'Invalid input'
        ]);
        return $response;
    }

    private function notFoundResponse()
    {
        $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        $response['body'] = null;
        return $response;
    }
}