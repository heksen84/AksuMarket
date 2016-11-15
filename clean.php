<?php
include "common.php";
ConnectDB();
$result = mysql_query("SELECT id,name,data_reg FROM adverts");
if (!$result) error(mysql_error());
echo "<table border='0'>";
while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
{
 $date1 = new DateTime($row["data_reg"]);
 $date2 = new DateTime();
 $diff = $date2->diff($date1)->format("%a");
 echo "<tr><td>".$row["id"]."</td><td>".$row["name"]."</td><td>".$row["data_reg"]."</td><td>(".$diff." дней как размещено)</td></tr>";
 if ($diff >=30)
 {
  $result = mysql_query("DELETE FROM adverts WHERE id='".$row["id"]."'");
  if (!$result) error("Удаление объявлений пользователя:".mysql_error());
  // Удалить просмотры объявлений пользователя
  $result = mysql_query("DELETE FROM views WHERE advert_id='".$row["id"]."'");
  if (!$result) error("Удаление просмотров пользователя:".mysql_error());
  // Удалить изображения объявлений пользователя
  $result = mysql_query("SELECT name FROM images WHERE advert_id='".$row["id"]."'");
  if (!$result) error("Список изображений пользователя:".mysql_error());
  // Перебор всех картинок
  while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
  {  
   if (!unlink('img/userfiles/'.$row["name"])) error("невозможно удалить файл img/userfiles/".$row["name"]);
  }
  // получить список картинок и удалить их с диска
  $result = mysql_query("DELETE FROM images WHERE advert_id='".$row["id"]."'");
  if (!$result) error("Удаление изображений пользователя:".mysql_error());
  success("DeleteAdvert:OK!");
 }
}
echo "</table>";

 /* УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ */
 /*$result = mysql_query("DELETE FROM adverts WHERE user_id='".$_SESSION["user_id"]."'");
 if (!$result) error("Удаление объявлений пользователя:".mysql_error());
 $result = mysql_query("DELETE FROM views WHERE advert_id='".$_SESSION["user_id"]."'");
 if (!$result) error("Удаление просмотров пользователя:".mysql_error());
 $result = mysql_query("SELECT name FROM images WHERE user_id='".$_SESSION["user_id"]."'");
 if (!$result) error("Список изображений пользователя:".mysql_error());
 while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
 {  
   if (!unlink('img/userfiles/'.$row["name"])) error("невозможно удалить файл img/userfiles/".$row["name"]);
 }
 $result = mysql_query("DELETE FROM images WHERE user_id='".$_SESSION["user_id"]."'");
 if (!$result) error("Удаление изображений пользователя:".mysql_error()); 
 $result = mysql_query("DELETE FROM users WHERE id='".$_SESSION["user_id"]."'");
 if (!$result) error(mysql_error());
 success("вы удалены с сайта!");*/
?>