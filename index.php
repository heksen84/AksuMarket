<!DOCTYPE html>
<html lang="ru">
<head>
 <link href = "img/shop.ico" rel = "icon" type = "image/x-icon">
 <title>АксуМаркет</title>
 <meta charset="utf-8">
 <meta name = "viewport"    content = "width=device-width, initial-scale=1.0"/>
 <meta name = "description" content = "АксуМаркет - доска объявлений"/>
 <meta name = "keywords"    content = "Подать объявление, Разместить объявление, Объявления, Бесплатные объявления, Доска объявлений, Частные объявления, Казахстан, Купить, Продать, Обменять, Аксу, Adverts, Kz, Kazakhstan, AksuMarket"/>
 <meta name = "robots" 	    content = "index, follow"/>
 <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
 <script src = "https://www.google.com/recaptcha/api.js" async defer></script>
 <link rel = "stylesheet" type="text/css" href="css/tooltipster.css" />
 <link rel = "stylesheet" type="text/css" href="css/themes/tooltipster-light.css" />
 <link rel = "stylesheet" type="text/css" href="css/themes/tooltipster-noir.css" />
 <link rel = "stylesheet" type="text/css" href="css/themes/tooltipster-punk.css" />
 <link rel = "stylesheet" type="text/css" href="css/themes/tooltipster-shadow.css" />
 <link href = "css/sweet-alert.css" rel = "stylesheet">
 <link href = "css/nprogress.css"   rel = "stylesheet">
 <link href = "css/1920.css"   rel = "stylesheet">
 <link href = "css/1600.css"   rel = "stylesheet">
 <link href = "css/1280.css"   rel = "stylesheet">
 <link href = "css/1024.css"   rel = "stylesheet">
 <link href = "css/mobile.css" rel = "stylesheet">
 <!-- скрипты -->
 <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
 <script src = "js/jquery-2.1.4.min.js" type = "text/javascript"></script>
 <script src = "js/sweet-alert.min.js"  type = "text/javascript"></script> 
 <script src = "js/nprogress.js" 	type = "text/javascript"></script>
 <script src = "js/device.min.js" 	type = "text/javascript"></script>
 <script src = "js/aksumarket.js"	type = "text/javascript"></script>
 <!-- Yandex.Metrika counter -->
 <script type="text/javascript">
    (function (d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter35480685 = new Ya.Metrika({
                    id:35480685,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true
                });
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://mc.yandex.ru/metrika/watch.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(document, window, "yandex_metrika_callbacks");
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/35480685" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
</head>
 <body>
    <div id="screen">
    <header>
    <!-- МЕНЮ -->
    <div id="up_menu_block">
    <div class = "up_menu_button" id = "button_auth"  title="войти в сервис">Вход</div>    
    <div class = "up_menu_button" id = "button_forum" title="Перейти на форум АксуМаркет">форум доски</div>    
    </div>
    <div id = "header_block">
    <!-- ЛОГОТИП -->
    <div id = "logo_block" title = "перезагрузить страничку">
<!--    <img src="img/flagkz.jpg" id="logo_image"/>-->
    <h1 id="service_logo_text"><ins>АксуМаркет&reg</ins></h1>
    <div id = "service_description_text">доска объявлений</div>
    </div>
    <div id = "search_block">
    <input type = "text" placeholder = "строка поиска" id = "search_string" title = "строка поиска"></input>
    <select id = "cat_select"></select>
    <button id = "search_button" title = "поиск"><img src="img/search.png"></button>
    <div id='target_select_block'>
    Выберите область&nbsp;<select id = "obl_select"></select>
    Выберите город или село&nbsp;<select id = "city_select"></select>
    </div>
    </div>
    <div id = "advert_block"><h2>разместить объявление</h2></div>
    </div>
    </header>
    <article>
    <div id = "content_block"></div>
    <div id = "top">наверх</div>
    <div id = "vip_block">
    <div id = "vip_title">срочное объявление</div>
    <div id = "vip_advert" title="срочное объявление">
    <img id = "vip_image" src = "" ></img>
    <div id = "vip_advert_name"></div>
    <div id = "vip_advert_text"></div>
    <div id = "vip_advert_price"></div>
    </div>
    </div>
    <!--ВХОД-->
    <div class = "window" id = "auth_window">
    <div id = "auth_close_window" class = "close_window" title="закрыть окно">X</div>
    <h2 id="auth_title"><ins>вход</ins></h2>
    <input type = "text" placeholder="логин" id="auth_login" title="логин пользователя"></input>
    <input type = "password" placeholder="пароль" id="auth_password" title="пароль пользователя"></input>
    <div id="auth_restore">восстановить пароль</div>
    <div id="auth_register">регистрация</div>
    <button id="auth_enter" title="войти в сервис">вход</div>
    </div>
    <!-- РЕГИСТРАЦИЯ -->
    <div class = "window" id = "reg_window">
    <div id = "reg_window_close" class = "close_window" title="закрыть окно">X</div>
    <h2 id="reg_title"><ins>регистрация</ins></h2>
    <input type = "text" placeholder="логин" id="reg_login" title="логин пользователя"></input>
    <input type = "password" placeholder="пароль" id="reg_password" title="пароль пользователя"></input>   
    <input type = "email" placeholder="email" id="reg_email" title="почта пользователя"></input>
    <center><div class="g-recaptcha" data-sitekey="6LdZtRgTAAAAAErc8qFR0vm3bsfX6KCvsqYWwU2f"></div></center>
    <button id="button_reg" title="регистрация на сайте">регистрация</button>
    </div>
    <!-- RESTORE -->
    <div class = "window" id = "restore_window">
    <div id = "restore_window_close" class = "close_window" title="закрыть окно">X</div>
    <h2 id="restore_text"><ins>восстановление</ins></h2>
    <input type = "email" placeholder="укажите свой email" id="restore_email"></input>
    <button id="button_restore" title="восстановить данные">восстановить данные</button>
    </div>
    <!-- ОПЛАТА -->
    <div class = "big_window" id = "oplata_window">
    <div id = "close_oplata_window"title="закрыть окно">X</div>
    <h2 id="oplata_desc"><ins>ОПЛАТА</ins></h2>
    <h3>Цена:&nbsp;<ins><div id='oplata_price'></div></ins>&nbsp;тенге</h3>
    <div><button id="oplata_set" title="продолжить оплату">ПРОДОЛЖИТЬ</button></div>
    </div>
    <!--
     **************************
      ПОЛНОЕ ОБЪЯВЛЕНИЕ
     **************************
     -->
    <div class = "big_window" id = "full_adv_info_window">
    <div id = "close_full_adv_info_window" class = "close_window" title="закрыть окно">X</div>
    <h2 id='adv_view_title'><ins>ОБЪЯВЛЕНИЕ № </ins><div id='adv_number'></div></h2>
    <center><div id='full_adv_type' title='тип объявления'></div></center>
    <div id='full_adv_category' title='категория объявления'></div>
    <div id='full_adv_location' title='расположение'></div>
    <div id='full_adv_data_reg' title='дата регистрации объявления'></div>
    <div id='full_adv_name'     title='имя объявления'></div>
    <div id='full_adv_text'     title='текст объявления'></div>
    <div id='full_adv_contacts' title='контакты'></div>
    <div id='full_adv_price'    title='цена'></div>
    <div id="full_adv_photo_block"></div>
    </div>
    <!-- НОВОЕ ОБЪЯВЛЕНИЕ -->
    <div class = "big_window" id = "new_adv">
    <div id = "adv_close_window" class = "close_window" title="закрыть окно">X</div>
    <h2 style="color:white"><ins>новое объявление</ins></h2>
    <input type = "text" placeholder="название товара или услуги" id = "adv_name" title="укажите название товара или услуги"></input>
    <textarea placeholder="текст объявления" id = "adv_text" rows="11" title="макс. число символов - 512"></textarea>
    <select id = "adv_category" title="укажите категорию товара или услуги"></select>
    <input type = "text" placeholder="цена (в тенге)" id = "adv_price" title="укажите цену в тенге"></input>
    <input type = "text" placeholder="контактные данные" id = "adv_contacts" title="укажите контактные данные"></input>    
    <!-- РАСПОЛОЖЕНИЕ -->    
    <div id="adv_set_location_block" title="Укажите расположение">    
    <fieldset>
    <legend>РАСПОЛОЖЕНИЕ</legend>
    Область&nbsp;<select id = "new_adv_obl_select"></select>
    Город или село&nbsp;<select id = "new_adv_city_select"></select>
    </fieldset>
    </div>
    <div id="photo_block"></div>
    <input type="file" id="file" title="добавить фото" multiple=""></input>
    <!-- ТИП ОБЪЯВЛЕНИЯ -->
    <div id = "adv_type">
    <input type="radio" name='adv_radio' value="0" title="Стандартное объявление." checked="checked">стандартное объявление
<!--    <input type="radio" name='adv_radio' value="1" title="Периодически будет отображаться в правом блоке на главном экране а также будет выделено в общем списке объявлений.">срочное объявление-->
    </div>
    <!-- ПУБЛИКАЦИЯ -->
    <button id="adv_public" title="разместить объявление на сайте">разместить</button>    
    </div>   
    <!-- НАСТРОЙКИ -->
    <div class = "big_window" id = "my_cabinet_window">
    <div id = "my_cabinet_window_close" class = "close_window" title="закрыть окно">X</div>
    <div id='delete_user_container'><a href ="#" id='delete_user_link' title="удалить учётную запись">удалить учётную запись</a></div>
    <h1 id='user_settings_title'>личные объявления</h1>
    <div id='my_cab_header_block'>
    <button id='delete_advert' title='удалить объявление' class='button'>удалить</button>
    <input type='text' placeholder='фильтр' id='adverts_filter' title='Укажите данные для фильтрации'></input>
    </div>
    <table id='my_adverts_table'>
    <thead>
    <tr><th id='th_advert_info_num'>№</th><th id='th_advert_info_name'>название</th><th id='th_advert_info_date'>дата размещения</th><th id='th_advert_views'>просмотров</th></tr>
    </thead>
    <tbody>
    </tbody>
    </table>
    </div>
  </article>
  <div id = "back_screen1"></div>
  <footer><div><div id="window_size"></div>Служба поддержки:&nbsp;<ins style="color:yellow;cursor:pointer;" title='написать письмо в службу поддержки'>aksumarket@mail.ru</ins><div id="developer" title='Разработчик AksuSoftware'>AksuSoftware&reg</div></div></footer>
  <div id="map" style="width:99%; height:99%">
  <button id='close_yandex_map'>закрыть карту</button>
  </div>
  <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <div id="google_adscence"><ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-7522864627839907" data-ad-slot="6302009472"></ins></div>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</body>
</div>
</html>
<?php
//echo "<script>alert('".$_GET["cat"]."')</script>";
 session_start();
 if (isset($_GET["cat"])) $_SESSION["category"] = $_GET["cat"];
 else $_SESSION["category"] = "";
?>