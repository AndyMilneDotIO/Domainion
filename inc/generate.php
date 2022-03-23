<?php

    if(!isset($_REQUEST['domain']))
    {
        die("ERROR");
    }

    $domain = $_REQUEST['domain'];
    $apiKey = "THIS IS NOT A REAL API KEY";

    // Create Curl Call
    $curl = curl_init();
    $apiPath = "https://domain-availability.whoisxmlapi.com/api/v1?apiKey=" . $apiKey . "&domainName=" . $domain;

    curl_setopt_array($curl, array(
        CURLOPT_URL => $apiPath,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_2_0,
        CURLOPT_CUSTOMREQUEST => 'GET'
    ));

    $response = curl_exec($curl);

    curl_close($curl);

    echo $response;
    exit();

?>