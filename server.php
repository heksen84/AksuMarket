<?php
include_once "common.php";
// -----------------------------------
// получить категорию
// -----------------------------------
if ( $_GET["func"] == "GetCategory" )
{
 session_start();
 echo $_SESSION["category"];
}
// ---------------------------------
// АВТОРИЗАЦИЯ
// ---------------------------------
if ( $_GET["func"] == "AuthUser" )
{
 ConnectDB();
 $new_login = strip_tags(htmlspecialchars($_GET["auth_login"]));
 $new_password = strip_tags(htmlspecialchars($_GET["auth_password"]));
 $result = mysql_query( "SELECT * FROM users WHERE login='".$new_login."'AND password='".md5($new_password)."'" );
 if (!$result) error(mysql_error());
 $num = mysql_num_rows( $result );

 /* больше нуля */
 if ($num>0)
 {
   while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
   {
     $_SESSION["user_id"] = (int)$row['id'];
   }
   $_SESSION["user_name"]=$_GET["auth_login"];
   success($_SESSION["user_name"]);
 }
 else
 {
  warning("указаны не верные данные!");
 }
}
// --------------------------------
// РЕГИСТРАЦИЯ
// --------------------------------
if ( $_POST["func"] == "RegUser" )
{
 $captcha="";
 if (isset($_POST["g-recaptcha-response"])) $captcha = $_POST["g-recaptcha-response"];
 ConnectDB();
 /* проверка логина */
 $result = mysql_query( "SELECT login FROM users WHERE login='".$_POST["login"]."'" );
 if (!$result) error(mysql_error());
 $num = mysql_num_rows( $result );
 if ($num>0) warning("Такой логин уже зарегистрирован. Укажите другой!");
 /* проверка пароля */
 $result = mysql_query( "SELECT email FROM users WHERE email='".$_POST["email"]."'" );
 if (!$result) error(mysql_error());
 $num = mysql_num_rows( $result );
 if ($num>0) warning("Такая почта уже зарегистрирована. Укажите другую!");
 if (!$captcha) warning("Подтвердите себя!");
 /* регистрация */
 $result = mysql_query( "INSERT INTO users VALUES ( NULL,'".$_POST["login"]."','".md5($_POST["password"])."','".$_POST["email"]."',NOW())" ); 
 if (!$result) error(mysql_error());
 $_SESSION["user_id"]=mysql_insert_id();
 $_SESSION["user_name"]=$_POST["login"];
 success($_SESSION["user_name"]);
}
// ---------------------------------------
// ВЫХОД
// ---------------------------------------
if ( $_GET["func"] == "Exit" )
{
 session_unset();
}
// -------------------------------------
// ПОЛУЧИТЬ КАТЕГОРИИ
// -------------------------------------
if ( $_GET["func"] == "GetCategories" )
{
 ConnectDB(); 
 $result = mysql_query( "SELECT id,name FROM categories ORDER BY id" ); 
 if (!$result) error(mysql_error());
 else
 {
  while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
  {
    $row['id'] 	 = (int)$row['id'];
    $row['name'] = $row['name'];
    $row_set[]   = $row;
  }
  success($row_set);
 }
}
// ----------------------------------------
// НАЙТИ СТРОКУ (ПОИСК)
// ----------------------------------------
if ( $_GET["func"] == "UserSearchString" )
{
 ConnectDB();
 // ------------------------------
 // ПОИСК ПО ВСЕМУ КАЗАХСТАНУ
 // ------------------------------
 if ($_GET["region"]=="0")
 {
  if ($_GET["category"]=="0")
  $result = mysql_query( "SELECT * FROM adverts WHERE name LIKE '%".$_GET["search_string"]."%' ORDER BY type DESC, price ASC LIMIT ".$_GET["StartWith"].",100" );
  else
  $result = mysql_query( "SELECT * FROM adverts WHERE name LIKE '%".$_GET["search_string"]."%' AND category='".$_GET["category"]."' ORDER BY type DESC, price ASC LIMIT ".$_GET["StartWith"].",100" );
  if (!$result) error(mysql_error());
  $num = mysql_num_rows( $result );
  if ($num==0) warning("ничего нет!");
  while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
  {
   $result2 = mysql_query("SELECT name FROM categories WHERE id='".$row["category"]."'");
   if (!$result2) error(mysql_error());
   $row2 = mysql_fetch_array( $result2, MYSQL_ASSOC );
   $row['type'] = (int)$row['type'];
   $row['category_name'] = $row2["name"];
   $row_set[] = $row;
  }
  success($row_set);  
 }
 else
 // ------------------------------
 // ПОИСК ПО ЗАДАННЫМ ОБЛАСТЯМ
 // ------------------------------
 if ($_GET["category"]=="0")
 $result = mysql_query( "SELECT * FROM adverts WHERE name LIKE '%".$_GET["search_string"]."%' AND region='".$_GET["region"]."' AND city='".$_GET["city"]."' ORDER BY price ASC LIMIT ".$_GET["StartWith"].",100" );
 else
 $result = mysql_query( "SELECT * FROM adverts WHERE name LIKE '%".$_GET["search_string"]."%' AND category='".$_GET["category"]."' AND region='".$_GET["region"]."' AND city='".$_GET["city"]."' ORDER BY price ASC LIMIT ".$_GET["StartWith"].",100" );
 if (!$result) error(mysql_error());
 $num = mysql_num_rows( $result );
 if ($num==0) warning("ничего нет!");
 while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
 {
   $row['type'] = (int)$row['type'];
   $row_set[] = $row;
 }
 success($row_set);
}
// ----------------------------------
// ПУБЛИКАЦИЯ ОБЪЯВЛЕНИЯ
// ----------------------------------
if ( $_POST["func"] == "AdvPublic" )
{
 ConnectDB();
 if (!is_numeric($_POST["price"])) warning("укажите цену в виде числа"); 
 $result = mysql_query( "INSERT INTO adverts VALUES ( NULL,'".$_POST["name"]."','".$_POST["text"]."','".$_POST["price"]."','".$_POST["contacts"]."',".$_POST["category"].",".$_POST["type"].",".$_SESSION["user_id"].",NOW(),0,'".$_POST["region"]."','".$_POST["city"]."')" );
 if (!$result) error(mysql_error());
 success(mysql_insert_id());
}
// ------------------------------------
// ПОЛУЧИТЬ СЛУЧАЙНОЕ VIP-ОБЪЯВЛЕНИЕ
// ------------------------------------
if ( $_GET["func"] == "GetRandomVip" )
{
 ConnectDB();
 $result = mysql_query( "SELECT * FROM adverts WHERE type=1 ORDER BY rand() LIMIT 1" ); 
 if (!$result) error(mysql_error());
 $row = mysql_fetch_array( $result, MYSQL_ASSOC );
 $row['id'] = (int)$row['id'];
 $row_set[] = $row;
 success($row_set);
}
// --------------------------------------
// ВОССТАНОВЛЕНИЕ ДАННЫХ
// --------------------------------------
if ( $_GET["func"] == "RestorePassword" )
{
  ConnectDB();
  $email = trim($_GET["email"]);
  $result = mysql_query("SELECT login,email FROM users WHERE email='".$email."'");
  if (!$result) error(mysql_error());
  $row = mysql_fetch_array( $result, MYSQL_ASSOC );
  $num = mysql_num_rows( $result );
  if ($num>0)
  {
   $chars="qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP";
   $max=10; 
   $size=StrLen($chars)-1; 
   $password=null;                                                
   while($max--) 
   {
     $password.=$chars[rand(0,$size)]; 
   }
   $newmdPassword = md5($password); 
   // to - кому, from - от кого
   if (!mail($email, "Восстановление пароля к AksuMarket", "Пользователь: ".$row["login"]."\nНовый пароль: ".$password,"From:aksumarket@mail.ru"))
   {
    error("Ошибка отправки почты!");
   }
   else
   {
    $result = mysql_query("UPDATE users SET password = '$newmdPassword' WHERE email = '$email'");
    if (!$result) error(mysql_error());
    success("Проверьте почту!"); 
   }
 }
 else error("Такой email - не зарегистрирован!");
}
// -------------------------------------
// ПОЛУЧИТЬ ОБЪЯВЛЕНИЯ
// -------------------------------------
if ( $_GET["func"] == "GetMyAdverts" )
{
 ConnectDB();
 $result = mysql_query( "SELECT id,name,text,data_reg,views,type FROM adverts WHERE user_id='".$_SESSION["user_id"]."'");
 if (!$result) error(mysql_error());
 while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
 {
   $new_date = new DateTime($row['data_reg']);
   $row['data_reg'] = $new_date->format('d/m/Y');
   $row_set[] = $row;
 }
 success($row_set);
}
// --------------------------------------
// ЦЕНА ЗА СРОЧНОЕ ОБЪЯВЛЕНИЕ
// --------------------------------------
if ( $_GET["func"] == "GetAdvertPrice" ) { echo $adv_price; }
// -----------------------------------------
// ПОЛУЧИТЬ ПОЛНОЕ ОБЪЯВЛЕНИЕ
// -----------------------------------------
if ( $_GET["func"] == "GetAdvertFullInfo" )
{
 ConnectDB();
 $result = mysql_query( "SELECT ip FROM views WHERE ip='".$_SERVER["REMOTE_ADDR"]."' AND advert_id='".$_GET["advert_id"]."'");
 if (!$result) error(mysql_error());
 $num = mysql_num_rows( $result );
 if ($num==0)
 {
  $result = mysql_query( "INSERT INTO views VALUES ( NULL,'".$_SERVER["REMOTE_ADDR"]."','".$_GET["advert_id"]."','".$_SESSION["user_id"]."')" ); 
  if (!$result) error(mysql_error());
  $result = mysql_query( "SELECT views FROM adverts WHERE id='".$_GET["advert_id"]."'");
  if (!$result) error(mysql_error());
  $row = mysql_fetch_array( $result, MYSQL_ASSOC );
  $views = $row['views']+1;
  $result = mysql_query( "UPDATE adverts SET views='".$views."' WHERE id='".$_GET["advert_id"]."'" );
  if (!$result) error(mysql_error());
 }
 $result = mysql_query( "SELECT * FROM adverts WHERE id='".$_GET["advert_id"]."'");
 if (!$result) error(mysql_error());
 $row = mysql_fetch_array( $result, MYSQL_ASSOC );
 $new_date = new DateTime($row['data_reg']);
 $row['data_reg'] = $new_date->format('d/m/Y');
 $row_set[] = $row;
 success($row_set);
}
// ---------------------------------------
//  ПОЛУЧИТЬ ФОТКИ
// ---------------------------------------
if ( $_GET["func"] == "GetAdvertImages" )
{
 ConnectDB();
 $result = mysql_query( "SELECT name FROM images WHERE advert_id='".$_GET["advert_id"]."'");
 if (!$result) error(mysql_error());
 while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
 {
  $row_set[] = $row;
 }
 success($row_set);
}
// ------------------------------------------
//  ПОЛУЧИТЬ ТИТУЛЬНУЮ ФОТКУ
// ------------------------------------------
if ( $_GET["func"] == "GetAdvertMainImage" )
{
 ConnectDB();
 $result = mysql_query( "SELECT name FROM images WHERE advert_id='".$_GET["advert_id"]."'");
 if (!$result) error(mysql_error());
 $row = mysql_fetch_array( $result, MYSQL_ASSOC );
 $row_set[] = $row;
 success($row_set);
}
// -------------------------------------
// УДАЛИТЬ ОБЪЯВЛЕНИЕ
// -------------------------------------
if ( $_GET["func"] == "DeleteAdvert" )
{
 ConnectDB();
 // Удалить объявления пользователя
 $result = mysql_query("DELETE FROM adverts WHERE id='".$_GET["advert_id"]."'");
 if (!$result) error("Удаление объявлений пользователя:".mysql_error());
 // Удалить просмотры объявлений пользователя
 $result = mysql_query("DELETE FROM views WHERE advert_id='".$_GET["advert_id"]."'");
 if (!$result) error("Удаление просмотров пользователя:".mysql_error());
 // Удалить изображения объявлений пользователя
 $result = mysql_query("SELECT name FROM images WHERE advert_id='".$_GET["advert_id"]."'");
 if (!$result) error("Список изображений пользователя:".mysql_error());
 // Перебор всех картинок
 while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
 {  
   if (!unlink('img/userfiles/'.$row["name"])) error("невозможно удалить файл img/userfiles/".$row["name"]);
 }
 // получить список картинок и удалить их с диска
 $result = mysql_query("DELETE FROM images WHERE advert_id='".$_GET["advert_id"]."'");
 if (!$result) error("Удаление изображений пользователя:".mysql_error());
 success("DeleteAdvert:OK!");
}
// ----------------------------------
// УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ
// ----------------------------------
if ( $_GET["func"] == "DeleteUser" )
{
 // ---- Алгоритм --------------------------------
 // 1.Нужно удалить все объявления пользователя
 // 2.Нужно удалить все просмотры пользователя
 // 3.Нужно удалить все изображения пользователя
 // 4.Нужно самого пользователя
 // ----------------------------------------------
 ConnectDB();
 $result = mysql_query("DELETE FROM adverts WHERE user_id='".$_SESSION["user_id"]."'");
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
 success("вы удалены с сайта!");
}
// ----------------------------------
// Загрузка регионов
// ----------------------------------
if ( $_GET["func"] == "GetRegions" )
{
 ConnectDB();
 $result = mysql_query("SELECT * FROM region ORDER by name");
 if (!$result) error(mysql_error());
 while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
 {
  $row_set[] = $row;
 }
 success($row_set);
}
// ----------------------------------
// Загрузка городов
// ----------------------------------
if ( $_GET["func"] == "GetCity" )
{
 ConnectDB();
 $result = mysql_query("SELECT * FROM city WHERE region_id=".$_GET["region_id"]." ORDER by name ");
 if (!$result) error(mysql_error());
 while( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
 {
  $row_set[] = $row;
 }
 success($row_set);
}
// ----------------------------------
// Получить регион по ID
// ----------------------------------
if ( $_GET["func"] == "GetRegionFromId" )
{
 ConnectDB();
 $result = mysql_query("SELECT * FROM region WHERE region_id=".$_GET["region_id"]." LIMIT 1");
 if (!$result) error(mysql_error());
 $row = mysql_fetch_array( $result, MYSQL_ASSOC );
 $row_set[] = $row;
 success($row_set);
 mysql_close();
}
// ----------------------------------
// Получить город по ID
// ----------------------------------
if ( $_GET["func"] == "GetCityFromId" )
{
 ConnectDB();
 $result = mysql_query("SELECT * FROM city WHERE city_id=".$_GET["city_id"]." LIMIT 1");
 if (!$result) error(mysql_error());
 $row = mysql_fetch_array( $result, MYSQL_ASSOC );
 $row_set[] = $row;
 success($row_set);
}
// -------------------------------------
// ПОЛУЧИТЬ КАТЕГОРИЮ ПО ID
// -------------------------------------
if ( $_GET["func"] == "GetCategoryById" )
{
 ConnectDB(); 
 $result = mysql_query( "SELECT category FROM adverts WHERE category='".$_GET["category_id"]."'" ); 
 if (!$result) error(mysql_error());
 else
 {
  $row = mysql_fetch_array( $result, MYSQL_ASSOC );
  $result2 = mysql_query("SELECT name FROM categories WHERE id='".$row["category"]."'");
  if (!$result2) error(mysql_error());
  $row = mysql_fetch_array( $result2, MYSQL_ASSOC );
  $row_set[] = $row;
  success($row_set);
 }
}
/*
----------------------------------
 curl запрос
----------------------------------
*/
function curl_get_file_contents($URL)
{
 $c = curl_init();
 curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
 curl_setopt($c, CURLOPT_URL, $URL);
 $contents = curl_exec($c);
 curl_close($c);
 if ($contents) return $contents;
 else return FALSE;
}
/*
----------------------------------
 загрузить карту
----------------------------------
*/
if ( $_GET["func"] == "LoadMap" )
{
 $xmlString = curl_get_file_contents($_GET["adress"]);
 $xml = simplexml_load_string($xmlString);
 success($xml);
}
?>