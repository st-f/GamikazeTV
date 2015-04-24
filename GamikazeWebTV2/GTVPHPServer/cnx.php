<?php
	// Specify domains from which requests are allowed
	header('Access-Control-Allow-Origin: *');
	// Specify which request methods are allowed
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
	// Additional headers which may be sent along with the CORS request
	// The X-Requested-With header allows jQuery requests to go through
	header('Access-Control-Allow-Headers: X-Requested-With');
	
	//$con = mysql_connect("localhost","root","root");
	$con = mysql_connect("localhost","root","3EzSFDf5");
    if (!$con)
    {
        die('Could not connect: ' . mysql_error());
    }
    mysql_select_db("GamikazeTV", $con) or die(mysql_error());

    function getData($sqlquery)
    {
        $data = array();
        $result = mysql_query($sqlquery) or die('Error. '.mysql_error().$sqlquery);
        if ($result)
        {
            $json = array();
            $total_records = mysql_num_rows($result);
            if($total_records >= 1){
              while ($row = mysql_fetch_array($result, MYSQL_ASSOC)){
                $json[] = $row;
              }
            }
            return json_encode($json);
        }
        else
        {
            return "error";
        }
    }
?>