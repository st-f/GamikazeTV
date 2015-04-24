<?php
function get_current_url()
{
    $currenturl="http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
    return $currenturl;
}

function getData($sqlquery)
{
    $data = array();
    $result = mysql_query($sqlquery) or die('Error. '.mysql_error().$sqlquery);
    if ($result)
    {
        while($row = mysql_fetch_assoc($result))
        {
            $data[] = $row;
        }
    }
    return $data;
}
?>