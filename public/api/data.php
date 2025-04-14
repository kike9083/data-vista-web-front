
<?php
// Este archivo debe colocarse en una carpeta pública de tu servidor Apache
// Actúa como proxy para la API de NocoDB, ocultando la token API

// Habilitar CORS para desarrollo local
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Responder a las solicitudes OPTIONS (necesario para CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Asegúrate de cambiar esta token por la tuya
$API_TOKEN = "AQUI_TU_TOKEN_API";

// Obtener parámetros de consulta de la URL
$offset = isset($_GET['offset']) ? $_GET['offset'] : 0;
$limit = isset($_GET['limit']) ? $_GET['limit'] : 100;
$where = isset($_GET['where']) ? $_GET['where'] : '';
$viewId = "vwl8dt2wal8s2yns"; // ID de vista de la API

// Construir la URL de la API con los parámetros
$api_url = "https://n8n-nocodb.kbma6o.easypanel.host/api/v2/tables/msolwpe9cseajnu/records";
$api_url .= "?offset={$offset}&limit={$limit}&viewId={$viewId}";

// Añadir filtro where si existe
if (!empty($where)) {
    $api_url .= "&where=" . urlencode($where);
}

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $api_url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "xc-token: {$API_TOKEN}"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

// Establecer el tipo de contenido a JSON
header('Content-Type: application/json');

if ($err) {
    // Error en la solicitud
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Error de conexión: " . $err
    ]);
} else {
    // Devolver la respuesta tal como viene de la API
    echo $response;
}
