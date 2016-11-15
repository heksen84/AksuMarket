<?php
include_once "common.php";
$i=0;
function img_resize($src, $dest, $width, $height, $rgb=0xFFFFFF, $quality=100)
{
 if (!file_exists($src)) return false;
 $size = getimagesize($src);
 if ($size === false) return false;
 $format = strtolower(substr($size['mime'], strpos($size['mime'], '/')+1));
 $icfunc = "imagecreatefrom" . $format;
 if (!function_exists($icfunc)) return false;
 $x_ratio = $width / $size[0];
 $y_ratio = $height / $size[1];
 $ratio = min($x_ratio, $y_ratio);
 $use_x_ratio = ($x_ratio == $ratio);
 $new_width = $use_x_ratio ? $width : floor($size[0] * $ratio);
 $new_height = !$use_x_ratio ? $height : floor($size[1] * $ratio);
 $new_left = $use_x_ratio ? 0 : floor(($width - $new_width) / 2);
 $new_top = !$use_x_ratio ? 0 : floor(($height - $new_height) / 2);
 $isrc = $icfunc($src);
 $idest = imagecreatetruecolor($width, $height);
 imagefill($idest, 0, 0, $rgb);
 imagecopyresampled($idest, $isrc, $new_left, $new_top, 0, 0, 
 $new_width, $new_height, $size[0], $size[1]);
 imagejpeg($idest, $dest, $quality);
 imagedestroy($isrc);
 imagedestroy($idest);
 return true;
}

foreach($_FILES as $file)
{ 
 /* проверка расширения */
 $blacklist = array(".php", ".phtml", ".php3", ".php4");  
 foreach ($blacklist as $item)
 {
  if(preg_match("/$item\$/i", $file['name']))
  {
   error("Загрузка скриптов не поддерживается!");
  }
 }
 /* проверка содержания */
 $imageinfo = getimagesize($file['tmp_name']);
 if($imageinfo['mime'] != 'image/gif' && $imageinfo['mime'] != 'image/jpeg' && $imageinfo['mime'] != 'image/png')
 {
  error("Только gif,png и jpg!");
 }
 switch($imageinfo['mime'])
 {
   case 'image/gif':  $ext=".gif"; break;
   case 'image/jpeg': $ext=".jpg"; break;
   case 'image/png':  $ext=".png"; break;
 }
 $new_image_name=substr(md5($file['name'].rand(0,99999)),0,10).$ext; // новое имя
 /*
  -----------------------
  загрузка изображений
  -----------------------
 */
 if (move_uploaded_file($file["tmp_name"], "img/userfiles/".$new_image_name))
 {
  if (!img_resize("img/userfiles/".$new_image_name, "img/userfiles/".$new_image_name, 640, 480))
  error("невозможно изменить размер изображения!"); 
  ConnectDB();
  $result = mysql_query( "INSERT INTO images VALUES ( NULL,'".$new_image_name."','".$_POST["advert_id"]."','".$_SESSION["user_id"]."')" );
  if (!$result) error(mysql_error());
 }
 else
 {
  error("обнаружена атака!");
 }
 $i++; if ($i>=5) break; //  не более пяти картинок
}
success("только изображения");
?>