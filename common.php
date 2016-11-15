<?php

$adv_price=299;

function error($string)
{
 mysql_close();
 $arr = array('answer' => 'error', 'string' => $string);
 echo json_encode($arr);
 exit;
}
function warning($string)
{
 mysql_close();
 $arr = array('answer' => 'warning', 'string' => $string);
 echo json_encode($arr);
 exit;
}
function success($string)
{
 mysql_close();
 $arr = array('answer' => 'success', 'string' => $string);
 echo json_encode($arr);
 exit;
}
//----------------------------------------
// подключение
//----------------------------------------
function ConnectDB()
{
  if (!mysql_connect("srv-db-plesk08.ps.kz:3306","aksum_user","Mvfv90#3")) error(mysql_error());
  if (!mysql_select_db("aksumark_database")) error(mysql_error());
  mysql_query("SET NAMES 'utf8'"); 
  mysql_query("SET CHARACTER SET 'utf8'");
  mysql_query("SET SESSION collation_connection = 'utf8_general_ci'");
  session_start();
}
?>