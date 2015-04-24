<?php
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use GTVChat\Chat;

    require __DIR__ . '/vendor/autoload.php';

    $server = IoServer::factory(
        new WsServer(
            new Chat()
        )
      , 8080
    );

    $server->run();