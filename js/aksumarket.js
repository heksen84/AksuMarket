// -----------------------------
// AksuMarket
// Доска объявлений АксуМаркет
// Developed by Ilya Bobkov
// AksuSoftware
// Copyright 2015-2016(c)
// -----------------------------
$(document).ready(function() {

var loaded=0;

if (device.mobile()==true)
{
   $("body").load( "/mobile.php", function()
   {
   });
}

$(window).resize(function()
{

 $("#window_size").html($(window).width()+"x"+$(window).height());

 if ($(window).width() <= 600)
 {
   $("body").load( "/mobile.php", function()
   {   
     loaded=1;
   });
 }
 else 
 if ($(window).width() >= 600)
 {
   if (loaded==1)
   $("body").load( "/index.php", function()
   {
    loaded=0;
   });
  }
});

$(window).trigger("resize");

// отображение только для не мобильных уcтройств
if (device.mobile()==false)
{
    var my_cab_advert_id = 0;
    var photo_count = 0;
    var advert_num = 0;
    var StartWith = 0;
    var category = 0;
    var user_name;
    var active_window;
    var url;
    var region_and_city_loaded_in_advert;
    var photo_loaded=0;

    sweetAlertInitialize();
    
    /* ф-ция ошибки */
    function error(string) {
        swal("ПРОИЗОШЛА ОШИБКА!", string, "error");
        console.error(string);
    }

    function warning(string) {
        swal("ВНИМАНИЕ!", string, "warning");
        console.warn(string);
    }


    /* проверка на зарегестрированность */
    if (localStorage.getItem("user_access") == "1") {
        $.ajax({
            url: "server.php",
            data: {
                "func": "AuthUser",
                "auth_login": localStorage.getItem("user_name"),
                "auth_password": localStorage.getItem("user_password"),
            },
            success: function(data) {
                var obj = jQuery.parseJSON(data);
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "warning") warning(obj.string);
                if (obj.answer == "success") {
                    ShowUserSeetingsUpMenuButton(obj.string);
                };
            }
        });
    }

    // ---------------------------
    // проверка email
    // ---------------------------
    function validateEmail($email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test($email);
    }
    // ----------------------------
    //
    // ----------------------------
    $.ajax({
        url: "funcs.php",
        data: {
            func: "GetUrl"
        },
        success: function(data) {
            url = data;
        }
    });

    // ---------------------------------
    // редирект на логотипе
    // ---------------------------------
    $("#logo_block").click(function() {
        $(location).attr("href", url);
    });

    /*
    ------------------------------
    ЗАГРУЗКА РЕГИОНОВ и ГОРОДОВ
    ------------------------------
    */
    $.ajax({
        url: "server.php",
        data: {
            func: "GetRegions",
        },
        async:false,
        success: function(data) {
            var obj = jQuery.parseJSON(data);
            if (obj.answer == "error") error(obj.string);
            if (obj.answer == "success") {
                $("#obl_select").append("<option value='0' title='Искать по всему Казахстану'>Весь Казахстан</option>");
                $.each(obj.string, function(key, val) {
                    $("#obl_select").append("<option value='" + val.region_id + "'>" + val.name + "</option>")
                });

                $("#obl_select option").eq(0).attr("selected", "selected");
                $("#city_select").append("<option value='0'>ничего нет</option>");

                /* выбор города*/
                $("#obl_select").on("change", function() {
                    $("#city_select").empty();
                    $.ajax({
                        url: "server.php",
                        data: {
                            func: "GetCity",
                            "region_id": $(this).val()
                        },
                        success: function(data) {
                            var obj = jQuery.parseJSON(data);
                            if (obj.answer == "error") error(obj.string);
                            $.each(obj.string, function(key, val) {
                                $("#city_select").append("<option value='" + val.city_id + "'>" + val.name + "</option>")
                            });
                        }
                    });
                });
            }
        }
    });

    /*
    ---------------------                           
    обновить vip-блок
    ---------------------
    */
    function UpdateVip() {
        $.ajax({
            url: "server.php",
            data: {
                func: "GetRandomVip"
            },
            success: function(data) {
                var obj = jQuery.parseJSON(data);
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "success") {
                    if (obj.string[0].id == 0) {
                        $("#vip_image").empty();
                        $("#vip_image").attr("src", "img/info.png");
                        $("#vip_advert").append("<ins>Это место для срочного объявления!</ins>");
                    } else {
                        $.ajax({
                            url: "server.php",
                            data: {
                                "func": "GetAdvertMainImage",
                                "advert_id": obj.string[0].id,
                                async: false
                            },
                            success: function(data) {	   		        
                                console.log(data);
                                var obj = jQuery.parseJSON(data);
                                if (obj.answer == "error") error(obj.string);
                                if (obj.answer == "warning") swal(obj.string);
                                if (obj.answer == "success") {
                                    $("#vip_advert img").empty();
                                    if (obj.string != "false")
				    {
                                     $("#vip_advert img").attr("src", "img/userfiles/" + obj.string[0].name);                                     
                                     $("#vip_advert img").attr("title", obj.string[0].id);
				     $("#vip_advert").attr("data-id", obj.string[0].id);
				    }
				    else
				    {
				     $("#vip_advert img").attr("src", "img/question2.png");
				     $("#vip_advert img").attr("title", "нет фотографии");
				    }
                                }
                            }
                        });

                        /* 
                        --------------------
			FULL VIP INFO CLICK
                        --------------------
			*/
                        $("#vip_image").click(function() {
                            ShowFullInfoWindow(obj.string[0].id);
                        });

                        $("#vip_advert_name, #vip_advert_text, #vip_advert_price").empty();
                        $("#vip_advert_name").append("<h3 style='color:white'>"+obj.string[0].name+"</h3>");
                        $("#vip_advert_text").append("<div style='color:blue'>"+obj.string[0].text+"</div>");
                        $("#vip_advert_price").append("<div id='vip_price'>Цена:&nbsp;"+obj.string[0].price+"</div>");
                    }
                }
            }
        });
    }

    UpdateVip();

    // ----------------------------------------
    // обработка списка категорий
    // ----------------------------------------
    $("#cat_select").on("change", function() {
        category = $(this).val();
    });

    /*
    ------------------------------
    показать категории
    ------------------------------
    */
    function ShowCategories() {
	active_window="Categories";
	StartWith = 0;
        $.ajax({
            url: "server.php",
            data: {
                func: "GetCategories"
            },
            success: function(data) {
                var obj = jQuery.parseJSON(data);
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "success") {
                    var img;
                    $("#content_block").empty();
                    $.each(obj.string, function(key, val) {
                        $("#content_block").append("<div class='cat_block' id='"+val.id+"'></div>");
                        switch (val.id) {
                            case 1:
                                img = "transport.jpg";
                                break;
                            case 2:
                                img = "nedvizhimost.jpg";
                                break;
                            case 3:
                                img = "bytovaya_technica.jpg";
                                break;
                            case 4:
                                img = "rabota_i_business.jpg";
                                break;
                            case 5:
                                img = "dlya_doma_i_dachi.jpg";
                                break;
                            case 6:
                                img = "lychnye_veshy.jpg";
                                break;
                            case 7:
                                img = "zhivotnye.jpg";
                                break;
                            case 8:
                                img = "hobby_i_otdyh.jpg";
                                break;
                            case 9:
                                img = "uslugi.jpg";
                                break;
                            case 10:
                                img = "drugoe.jpg";
                                break;
                        }
                        $("#"+val.id).append("<img src='img/" + img + "'width='100%' height='100%' title='" + val.name + "'>");
                        $("#"+val.id).click(function() {
                            category = val.id;
                            UserSearchString();
			    category = 0;
                        });
                    });
                }
            }
        });	
    }

    // ******************************
    // ПОКАЗАТЬ ПОЛНОЕ ОБЪЯВЛЕНИЕ
    // ******************************
    function ShowFullInfoWindow(id) {
        $("#back_screen1").fadeIn("100");
        $("#full_adv_info_window").fadeIn(200);
        active_window = "#full_adv_info_window";

        /*x*/
        $("#close_full_adv_info_window").click(function() {	    
            $("#full_adv_info_window").fadeOut(200);
            $("#back_screen1").fadeOut("100");
            active_window="SearchResults";
        });

        $("#adv_number").html(id);

        function ShowCategoryByID(category_id)
	{
	    $.ajax({
                url: "server.php",
                data: {
                    "func": "GetCategoryById",
                    "category_id": category_id,
                },
                success: function(data) {	
                    var obj = jQuery.parseJSON(data);
                    if (obj.answer == "error") error(obj.string);
                    if (obj.answer == "success") {
                    $("#full_adv_category").html("<div style='display:inline-block;color:white'>категория:&nbsp;</div>"+obj.string[0].name);
                    }
                }
            });	
        }
        /*----------------------------------------------
          ПОКАЗАТЬ ДАННЫЕ О МЕСТОПОЛОЖЕНИИ ПО ID
          ----------------------------------------------*/
        function ShowLocationFromIds(region_id, city_id) {
            var region, city;

            $.ajax({
                url: "server.php",
                data: {
                    "func": "GetRegionFromId",
                    "region_id": region_id,
                },
                async: false,
                success: function(data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.answer == "error") error(obj.string);
                    if (obj.answer == "success") {
                        region = obj.string[0].name;
                    }
                }
            });

            $.ajax({
                url: "server.php",
                data: {
                    "func": "GetCityFromId",
                    "city_id": city_id,
                },
                async: false,
                success: function(data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.answer == "error") error(obj.string);
                    if (obj.answer == "success") {
                        city = obj.string[0].name;
                    }
                }
            });

            $("#full_adv_location").html("<div style='display:block' id='open_in_yandex_map_link'>"+region+"&nbsp;"+city+"</div>");
            $("#open_in_yandex_map_link").click(function() {
            $.ajax({
                url: "server.php",
                data: {
                    "func": "LoadMap",
                    "adress": "https://geocode-maps.yandex.ru/1.x/?geocode="+region+","+city,
                },
                success: function(data) {
		    alert(data);
                    var obj = jQuery.parseJSON(data);
                    if (obj.answer == "error") error(obj.string);
                    if (obj.answer == "success") {
		    $("#map").show();
		var map = new ymaps.Map("map", {
            center: [55.76, 37.64], 
            zoom: 7
        });

            $("#close_yandex_map").click(function(){
	       $("#map").hide();
	    });

                    }
                }
            });

            });

        } // endfunc

        $.ajax({
            url: "server.php",
            data: {
                "func": "GetAdvertFullInfo",
                "advert_id": id
            }, // получить список объявлений
            async: false,
            success: function(data) {
                var obj = jQuery.parseJSON(data);
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "success") {
                    ShowLocationFromIds(obj.string[0].region, obj.string[0].city);
                    if (obj.string[0].type==0) $("#full_adv_type").html("");
                    if (obj.string[0].type==1) $("#full_adv_type").html("срочное");
                    $("#full_adv_name").html(obj.string[0].name);
		    ShowCategoryByID(obj.string[0].category);	
                    $("#full_adv_data_reg").html(obj.string[0].data_reg + "&nbspг.");
                    $("#full_adv_text").html(obj.string[0].text);
                    $("#full_adv_contacts").html(obj.string[0].contacts);
                    $("#full_adv_price").html("Цена:&nbsp;" + obj.string[0].price + "&nbsp;тнг.");
                    $.ajax({
                        url: "server.php",
                        data: {
                            "func": "GetAdvertImages",
                            "advert_id": id
                        },
                        success: function(data) {
                            var obj = jQuery.parseJSON(data);
                            if (obj.answer == "error") error(obj.string);
                            if (obj.answer == "warning") swal(obj.string);
                            if (obj.answer == "success") {
                                $("#full_adv_photo_block").empty();
                                $.each(obj.string, function(key, val) {
                                    $("#full_adv_photo_block").append("<img src='img/userfiles/" + val.name + "' class='adv_img_item' title='" + val.name + "'/>");
                                });
                                $(".adv_img_item").click(function() {
                                    window.open($(this).attr("src"), "_blank");
                                });
                            }
                        }
                    });
                };
            }
        });
    }
    // ---------------------------
    // функция поиска строки
    // ---------------------------
    function UserSearchString() {
	NProgress.start();

       	    $("body").append($("#google_adscence"));
	    $("#google_adscence").css("display","none");

            //alert("Строка поиска: "+$("#search_string").val()+"\nНачать с: "+StartWith+"\nКатегория: "+category);
	    $.ajax({
            url: "server.php",
            data: {
                "func": "UserSearchString",
                "search_string": $("#search_string").val(),
                "StartWith": StartWith,
                "category": category,
                "region": $("#obl_select").val(),
                "city": $("#city_select").val(),
            },
            success: function(data) {
//		    alert(data); 
                    var obj = jQuery.parseJSON(data);
                    $("#content_block").empty();	            
                    if (obj.answer == "error") error(obj.string);
                    if (obj.answer == "warning") {
                 	$("#content_block").append($("#google_adscence"));
			$("#google_adscence").css("display","block");
                        $("#content_block").append("<div id='center'>ничего нет<br><div id='big_return' title='перейти к оглавлению'>к оглавлению</div></div>");
			/* возврат */
                        $("#big_return").click(function()
			{
		       	 $("body").append($("#google_adscence"));
			 $("#google_adscence").css("display","none");
                         ShowCategories();
                        });
//		 	$("#content_block").append("<div><h1>Директ!</h1></div>");
                    }
                    if (obj.answer == "success") {

                     /*$("#content_block").append("<select id='advert_sort_select' title='Сортировка объявлений'></select>")
  	             $("#advert_sort_select").append("<option value='0'>дешевле</option>")
	             $("#advert_sort_select").append("<option value='1'>дороже</option>")
	             $('#advert_sort_select').on('change', function()
	             {	 
         		if ($(this).val()=="0")
	 	        {
			  alert("0");
	                }
         		if ($(this).val()=="1")
	 	        {
			  alert("1");
	                }

	                StartWith=0;
                        UserSearchString();
		     });*/
			
                        /* перебор элементов массива */
                        $.each(obj.string, function(key, val) {
                            $("#content_block").append("<div class='item' data-id='" + val.id + "'></div>")
                            $(".item").eq($(this).index()).append("<img src = 'img/logo.jpg' class='item_image' title='ID: " + val.id + "'></img>");
                            $(".item").eq($(this).index()).append("<div class='item_text_block'></div>");
			    $(".item_text_block").eq($(this).index()).append("<div class='adv_item_category' title='категория:&nbsp"+val.category_name+"'>" + val.category_name + "</div>");
                            $(".item_text_block").eq($(this).index()).append("<div class='adv_item_name'>" + val.name + "</div>");
                            $(".item_text_block").eq($(this).index()).append("<div class='adv_item_text'>" + val.text + "</div>");			   
			    $(".item_text_block").eq($(this).index()).append("<div class='adv_item_price'>Цена: " + val.price + " тенге<div class='adv_settings'></div></div>");

/*			    if (val.type == 0) $(".item_text_block").eq($(this).index()).find(".adv_settings").html("<div class='set_adv_vip'>сделать срочным</div>");
		            $(".set_adv_vip").eq($(this).index()).click(function(){
//			    SetAdvVip($(this))
				alert($(this).index());
	    		    });
                           */
                            if (val.type == 1)
                            {
			      $(".item_text_block").eq($(this).index()).find(".adv_settings").html("<div class='vip'>СРОЧНОЕ</div>");
                              $(".item").eq($(this).index()).css("background", "rgb(100,255,100)");			     
                            }
                            /* 
			    ----------------------------------
			     получить изображения объявления
			    ----------------------------------
			    */
                            $.ajax({
                                url: "server.php",
                                data: {
                                    "func": "GetAdvertMainImage",
                                    "advert_id": val.id
                                },
                                async: false,
                                success: function(data) {
                                    var obj = jQuery.parseJSON(data);
                                    if (obj.answer == "error") error(obj.string);
                                    if (obj.answer == "warning") swal(obj.string);
                                    if (obj.answer == "success") {
                                        if (obj.string != "false")
                                        {
 				          $(".item img").eq($(this).index()).attr("src", "img/userfiles/" + obj.string[0].name);                                          
			                }
                                    }
                                }
                            });
                        });


                 	$("#content_block").append($("#google_adscence"));
			$("#google_adscence").css("display","block");

                        /* РЕКЛАМА ОТ ЯНДЕКСА */
//                 	$("#content_block").append("<div><h1>Директ!</h1></div>");

                        /* НАВИГАЦИЯ */
                        $("#content_block").append("<div id='next_items'  title='листать дальше'>дальше</div>")
                        $("#content_block").append("<div id='prev_items'  title='листать назад'>назад</div>")
                        $("#content_block").append("<div id='go_to_begin' title='подняться вверх'>подняться вверх</div>")
                        $("#content_block").append("<div id='return' title='перейти к оглавлению' style='font-size:130%'>к оглавлению</div>");
                        

                        /* вперёд */
                        $("#next_items").click(function() {
                            StartWith = StartWith + 100;
                            UserSearchString();
                        });

                        /* назад */
                        $("#prev_items").click(function() {
                            if (StartWith > 0) {
                                StartWith = StartWith - 100;
                                UserSearchString();
                            }
                        });

                        /* к началу */
                        $("#go_to_begin").click(function() {
                            StartWith = 0;
			    category = 0;
                            UserSearchString();
                        });

			$("#return").click(function() {
		       	$("body").append($("#google_adscence"));
			$("#google_adscence").css("display","none");
                        ShowCategories();
                        });

                        /* полное объявление */
                        $(".item").click(function() {
                            ShowFullInfoWindow($(this).data("id"));
                        });
                    }
                } //success
        });
	
        active_window="SearchResults";
	NProgress.done();
        return false;
    }
    // -------------------------------------
    // строка поиска
    // -------------------------------------
    $("#search_button").click(function() {
        StartWith = 0;
        UserSearchString();
    });

    //**********************************
    //* обработка меню
    //**********************************
    function SetUpMenuHandlers() {

        $("#button_forum").click(function() // FORUM
            {
                window.open("forum", "_blank");
            });

        $("#button_auth").click(function() // ВХОД
            {
                $("#back_screen1").fadeIn(100);
                $("#auth_window").fadeIn(100);
                $("#auth_window input").val("");
                $("#auth_login").focus();             
                var active_input_index = 0;
                var inputs = $("#auth_window input");

                // auth: нажатия в инпутах
                inputs.keyup(function(e) {
                    if (e.keyCode == 13) {
                        if (inputs.eq(active_input_index).val() == "") {
                            inputs.eq(active_input_index).focus();
                            swal("ВНИМАНИЕ!", "заполните поле", "warning");
                        } else {
                            active_input_index++;
                            inputs.eq(active_input_index).focus();
                            if (active_input_index == inputs.length) {
                                enter();
                            }
                        }
                    }
                });
	     active_window = "#auth_window";
            });

        // закрыть окно авторизации
        $("#auth_close_window").click(function() {
            $("#back_screen1").fadeOut(200);
            $('#auth_window').fadeOut(100);
        });

        // -------- ОПЛАТА ------------
        $("#oplata").click(function() {
            $("#qiwi_window").show();
            active_window = "#qiwi_window";
        });

    } // SetUpMenuHandlers()

    SetUpMenuHandlers();

    // **************************************
    //
    // новое объявление
    //
    // **************************************
    $("#advert_block").click(function() {
        if (localStorage.getItem("user_access") == 0 || localStorage.getItem("user_access") == null) {
            swal("ВНИМАНИЕ!", "Для размещения необходима авторизация!", "warning");
            $("#button_auth").trigger("click");
        } else {
            $("#adv_category").val(0);
            $("#back_screen1").fadeIn(200);
            $("#new_adv_obl_select, #new_adv_city_select").empty();
            $("#new_adv_city_select").append("<option>ничего нет</option>");
            $("#new_adv").fadeIn(200);
            $.ajax({
                url: "server.php",
                data:
	        {
                    func: "GetRegions"
                },
                success: function(data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.answer == "error") error(obj.string);
                    $("#new_adv_obl_select").append("<option value='0'>-------</option>");
                    $.each(obj.string, function(key, val) {
                        $("#new_adv_obl_select").append("<option value='" + val.region_id + "'>" + val.name + "</option>")
                    });

                    /*
                    -----------------
		    выбрать города
		    -----------------
		    */
                    $("#new_adv_obl_select").on('change', function() {
                        $.ajax({
                            url: "server.php",
                            data: {
                                func: "GetCity",
                                "region_id": $(this).val()
                            },
                            success: function(data) {
                                $("#new_adv_city_select").empty();
                                var obj = jQuery.parseJSON(data);
                                if (obj.answer == "error") error(obj.string);
                                $.each(obj.string, function(key, val) {
                                    $("#new_adv_city_select").append("<option value='" + val.city_id + "'>" + val.name + "</option>");
                                });
                            }
                        });
                    });
                }
            });
            $("#adv_name").focus();
            active_window = "#new_adv";
            var active_input_index = 0;
            var inputs = $("#new_adv input, #new_adv textarea");
            inputs.keyup(function(e) {
                if (e.keyCode == 13) {
                    if (inputs.eq(active_input_index).val() == "") {
                        inputs.eq(active_input_index).focus();
                        swal("ВНИМАНИЕ!", "заполните поле", "warning");
                    } else {
                        active_input_index++;
                        inputs.eq(active_input_index).focus();
                        if (active_input_index == inputs.length) {}
                    }
                }
            });
        }
    });

    // закрыть объявление
    $("#adv_close_window").click(function() {
        $("#new_adv").hide();
        $("#back_screen1").fadeOut(200);
        active_window="SearchResults";
    });

    //************************
    // ПУБЛИКАЦИЯ ОБЪЯВЛЕНИЯ
    //************************
    function PublicAdvert() {
        $.ajax({
            url: "server.php",
            data: {
                "func": "AdvPublic",
                "name": $("#adv_name").val(),
                "text": $("#adv_text").val(),
                "category": $("#adv_category").val(),
                "price": $("#adv_price").val(),
                "contacts": $("#adv_contacts").val(),
                "category": $("#adv_category").val(),
                "type": $("input[type='radio']:checked").val(),
                "region": $("#new_adv_obl_select").val(),
                "city": $("#new_adv_city_select").val()
            },
            method: "POST",
            success: function(data) {
                var obj = jQuery.parseJSON(data);
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "warning") warning(obj.string);
                if (obj.answer == "success") {
              	    if ( photo_loaded==1)
		    {	
                    /* ЗАГРУЗКА ИЗОБРАЖЕНИЙ */
                    var data = new FormData();
                    jQuery.each(jQuery("#file")[0].files, function(i, file) {
                        data.append("file" + i, file);
                    });
                    /* определяю id объявления */
                    data.append("advert_id", obj.string);
                    /* отправка данных */
                    $.ajax({
                        url: "upload.php",
                        data: data,
                        method: "POST",
                        processData: false,
                        contentType: false,
                        success: function(data) {
                            var obj = jQuery.parseJSON(data);
                            if (obj.answer == "error") error(obj.string);
                            if (obj.answer == "success") {			   
                            }
                        }
                    });
		     photo_loaded=0;
		   } // photo_loaded;

		     $("#new_adv").hide();
                     $("#back_screen1").hide();
                     UserSearchString();                           
                     swal("объявление размещено!");
                }
            }
        });
    }

    // ------------------------
    // окно оплаты
    // ------------------------
    function ShowOplataWindow() {
        $("#oplata_window").show();
        active_window = "#oplata_window";

        /*X*/
        $("#close_oplata_window").click(function() {
            $("#oplata_window").hide();
            active_window = "#new_adv";
        });

        /* 
         ================================
         совершить оплату
         ================================
        */
        $("#oplata_set").click(function() {
            if ($("#oplata_number_input").val() == "") swal("укажите номер");
            else
            {		
		PublicAdvert(); // регистрация
                $("#close_oplata_window").trigger("click");
//		active_window = "#new_adv";
            }
        });

        /* 
	****************************
	ПОЛУЧИТЬ ЦЕНУ ОБЪЯВЛЕНИЯ
	****************************
	*/
        $.ajax({
            url: "server.php",
            data: {
                func: "GetAdvertPrice"
            },
            success: function(data) {
                $("#oplata_price").html(data);
            }
        });
    }

    // ----------------------------------
    // публикация объявления
    // ----------------------------------
    $("#adv_public").click(function() {
        if ($("#adv_name").val() == "") {
            $("#adv_name").focus();
            swal("ВНИМАНИЕ!", "укажите название товара или услуги", "warning");
        } else
        if ($("#adv_text").val() == "") {
            $("#adv_text").focus();
            swal("ВНИМАНИЕ!", "укажите текст объявления", "warning");
        } else
        if ($("#adv_category").val() == 0) {
            $("#adv_category").focus();
            $("#adv_category").click();
            swal("ВНИМАНИЕ!", "укажите категорию объявления", "warning");
        } else
        if ($("#adv_price").val() == "") {
            $("#adv_price").focus();
            swal("ВНИМАНИЕ!", "укажите цену в тенге", "warning");
        } else
        if ($("#adv_contacts").val() == "") {
            $("#adv_contacts").focus();
            swal("ВНИМАНИЕ!", "укажите контактные данные", "warning");
        } else
        if ($("#new_adv_obl_select").val() == "0") swal("Укажите область размещения!");
        else {
            if ($("input[type='radio']:checked").val() == "1") {
                ShowOplataWindow();
            } else {
                PublicAdvert();
            }
        }
    });

    // -----------------------	
    // КАБИНЕТ ПОЛЬЗОВАТЕЛЯ
    // -----------------------	  
    function ShowUserCabinet() {
        $("#back_screen1").fadeIn(100);
        $("#my_cabinet_window").show();
        active_window = "#my_cabinet_window";
        // закрыть окно
        $("#my_cabinet_window_close").click(function() {
            $("#my_cabinet_window").hide();
            $("#back_screen1").fadeOut(100);
        });

        /* 
	----------------------------------------------
	фильтр объявлений в настройках пользователя
	----------------------------------------------
        */
        $("#adverts_filter").keyup(function(e) {
            $("#my_adverts_table tbody td:nth-child(2)").each(function() {
                if ($("#adverts_filter").val().toLowerCase() != $(this).text().substr(0, $("#adverts_filter").val().length).toLowerCase()) {
                    $(this).parent().hide();
                } else {
                    $(this).parent().show();
                }
            });
        });

        // *****************************************
        // удаление учётки
        // *****************************************
        $("#delete_user_link").click(function() {
            swal({
                    title: "Удалить учётную запись?",
                    text: user_name,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Да",
                    cancelButtonText: "Нет",
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                function(isConfirm) {
                    if (isConfirm) {
                        $.ajax({
                            url: "server.php",
                            data: {
                                "func": "DeleteUser"
                            }, // получить список объявлений
                            success: function(data) {
                                var obj = jQuery.parseJSON(data);
                                if (obj.answer == "error") alert(obj.string);
                                if (obj.answer == "success") {
                                    alert("Учётная запись удалена!");
                                    $("#my_cabinet_window_close").click();
                                    localStorage.setItem("user_access", "0");
                                    $("#button_user_exit").trigger("click");
                                }
                            }
                        });
                    } //isConfirm
                });
        });

        $.ajax({
            url: "server.php",
            data: {
                "func": "GetMyAdverts"
            }, // получить список объявлений
            async: false,
            success: function(data) {
                var obj = jQuery.parseJSON(data);
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "success") {
                    var i = 1;
                    $("#my_adverts_table tbody").empty();
                    $.each(obj.string, function(key, val) {
                        $("#my_adverts_table").append("<tr data-id=" + val.id + "><td title='ID:" + val.id + "'>" + i + "</td><td title='" + val.text + "'>" + val.name + "</td><td>" + val.data_reg + "</td><td title='просмотров:&nbsp;" + val.views + "'>" + val.views + "</td></tr>");
                        if (val.type == "1") {
                            $("#my_adverts_table tr").eq(i).css("background", "rgb(150,250,150)");
                        }
                        i++;
                    });
                };
            }
        });

        /* click my_adverts */
        $("#my_adverts_table tbody tr").click(function() {
            my_cab_advert_id = $(this).data("id");
            advert_num = $(this).index();
            $("#my_adverts_table tbody tr").css("color", "blue");
            $(this).css("color", "#FF8C00");
        });

        /* обновить таблицу */
        function UpdateAdvertsTable() {
            var i = 1;
            var num_strings = $("#my_adverts_table tbody tr").length;
            $('#my_adverts_table tbody tr').each(function() {
                if (i != num_strings + 1) $(this).children().eq(0).html(i);
                i++;
            });
        }

        /* удалить объявление */
        $("#delete_advert").click(function() {
            if ($("#my_adverts_table tbody tr").length > 0)
                swal({
                        title: "Удалить объявление?",
                        text: $("#my_adverts_table tbody tr").eq(advert_num).children().eq(1).text(),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Да",
                        cancelButtonText: "Нет",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            $.ajax({
                                url: "server.php",
                                data: {
                                    "func": "DeleteAdvert",
                                    "advert_id": my_cab_advert_id
                                }, // получить список объявлений
                                success: function(data) {
                                    var obj = jQuery.parseJSON(data);
                                    if (obj.answer == "error") error(obj.string);
                                    if (obj.answer == "success") {
                                        $("#my_adverts_table tbody tr").eq(advert_num).remove();
                                        UpdateAdvertsTable();
                                        advert_num = 0;
                                        $('#my_adverts_table tbody tr').eq(0).css("color", "black");
                                        //UserSearchString();
                                    };
                                }
                            });
                        }
                    });
        }); // advert click
    }
    //**********************************************
    //* НАСТРОЙКА ВЕРХНЕГО МЕНЮ
    //**********************************************
    function ShowUserSeetingsUpMenuButton(username) {
        user_name = username;
        localStorage.setItem("user_access", "1");
        $("#auth_window").hide();
        $("#back_screen1").fadeOut(200);
        $("#up_menu_block").empty();
        $("#up_menu_block").append('<div class = "up_menu_button" id = "button_user_exit" title="войти из сервиса">Выход</div>');
        $("#up_menu_block").append('<div id="user_name" title="настройки пользователя ' + username + '">' + username + '&nbsp;(настройки)</div>');
        $("#up_menu_block").append('<div class = "up_menu_button" id = "button_forum" title="Перейти на форум АксуМаркет">форум доски</div>');
        // ------------------------------------
        // FORUM
        // ------------------------------------
        $("#button_forum").click(function() {
            window.open("forum", "_blank");
        });
        /*----------------------------------------
		  ВЫХОД
                  -----------------------------------------*/
        $("#button_user_exit").click(function() {
            $.ajax({
                url: "server.php", // session_unset();
                data: {
                    "func": "Exit"
                },
                success: function(data) {
                    localStorage.setItem("user_access", "0");
                }
            });
            $("#up_menu_block").empty();
            $("#up_menu_block").append('<div class = "up_menu_button" id = "button_auth" title="войти в сервис">Вход</div>');
            $("#up_menu_block").append('<div class = "up_menu_button" id = "button_forum" title="Перейти на форум АксуМаркет">форум доски</div>');
            SetUpMenuHandlers();
        });

        /* личный кабинет */
        $("#user_name").click(function() {
            ShowUserCabinet();
        });
    }
    // ----------------------------------
    // ф-ция обработки входа
    // ----------------------------------
    function enter() {
        if ($("#auth_login").val() == "") {
            $("#auth_login").focus();
            swal("ВНИМАНИЕ!", "укажите логин", "warning");
        } else
        if ($("#auth_password").val() == "") {
            $("#auth_password").focus();
            swal("ВНИМАНИЕ!", "укажите пароль", "warning")
        } else {
            $.ajax({
                url: "server.php",
                data: {
                    "func": "AuthUser",
                    "auth_login": $("#auth_login").val(),
                    "auth_password": $("#auth_password").val()
                },
                success: function(data) {
                        var obj = jQuery.parseJSON(data);
                        if (obj.answer == "error") error(obj.string);
                        if (obj.answer == "warning") warning(obj.string);
                        if (obj.answer == "success") {
                            localStorage.setItem("user_name", $("#auth_login").val());
                            localStorage.setItem("user_password", $("#auth_password").val());
                            ShowUserSeetingsUpMenuButton(obj.string);
                        }; // if ( obj.answer == "success" )
                    } // success: function( data )
            });
        }
    }
    // -----------------------------------
    // ВХОД
    // -----------------------------------
    $("#auth_enter").click(function() {
        enter();
    });
    // ----------------------------------
    // окно регистрации
    // ----------------------------------
    $("#auth_register").click(function() {
        $("#reg_window").show();
        active_window = "#reg_window";
        $("#reg_window input").val("");
        $("#reg_login").focus();

        // перечень всех input'ов        
        var inputs = $("#reg_window input");
        var active_input_index = 0;

        // **********************************
        // обработка нажатий на элементы
        // **********************************
        inputs.keypress(function(e) {
            if (e.keyCode == 13) {
                if (inputs.eq(active_input_index).val() == "") {
                    inputs.eq(active_input_index).focus();
                    swal("ВНИМАНИЕ!", "заполните поле", "warning");
                } else {
                    active_input_index++;
                    inputs.eq(active_input_index).focus();
                    if (active_input_index == inputs.length) {
                        Register();
                    }
                }
            }
        });

        // -----------------------------------------------	
        // ОБРАБОТКА КРЕСТИКА - закрыть окно регистрации
        // -----------------------------------------------
        $("#reg_window_close").click(function() {
            $("#reg_window").hide();
            $("#auth_window").fadeIn("500");            
        });
    });

    // --------------------------------
    // восстановление данных доступа
    // --------------------------------
    $("#auth_restore").click(function() {
	$("#auth_window").hide();
        $("#restore_window").show();
        active_window = "#restore_window";
        $("#restore_window input").val("");
        $("#restore_email").focus();
        // ОБРАБОТКА закрытия окна
        $("#restore_window_close").click(function() {
            $("#restore_window").hide();
   	    $("#auth_window").show();
	    active_window = "#auth_window";
        });
    });

    // -------------------------------------------
    // нажатие enter на строке поиска
    // -------------------------------------------
    $("#search_string").keypress(function(event) {
        switch (event.keyCode) {
            case 13:
                UserSearchString();
                break;
        }
    });

    // ----------------------------------
    // закрыть активное окно
    // ----------------------------------
    $("body").keydown(function(event) {
        switch (event.keyCode) {
            case 27:
                {		   
		   switch(active_window)
		   {
		     case "SearchResults": ShowCategories(); break;
		     case "#auth_window":  $("#auth_close_window").trigger("click"); break;
		     case "#reg_window":   $("#reg_window_close").trigger("click"); break;						
		     case "#full_adv_info_window": $("#close_full_adv_info_window").trigger("click"); break;
		     case "#my_cabinet_window": $("#my_cabinet_window_close").trigger("click"); break;			
		     case "#new_adv": $("#adv_close_window").trigger("click"); break;			
		   }
                   $(active_window).hide();
                   $("#back_screen1").fadeOut(200);
                   break;
                }
        }
    });

    $("#search_string").focus();
    // ---------------------------		
    // получить список категорий
    // ---------------------------
    $.ajax({
        url: "server.php",
        data: {
            func: "GetCategories"
        },
        success: function(data) {
            var obj = jQuery.parseJSON(data);
            if (obj.answer == "error") error(obj.string);
            if (obj.answer == "success") {
                $("#cat_select, #adv_category").append('<option value="0">категория объявления</option>');
                $.each(obj.string, function(key, val) {
                    $("#cat_select, #adv_category").append('<option value=' + val.id + '>' + val.name + '</option>');
                });
            }
        }
    });

    // ---------------------------------------
    // прокрутка контента	  
    // ---------------------------------------
    $("#content_block").scroll(function() {
        if ($(this).scrollTop() > 350)
            $("#top").fadeIn();
        else
            $("#top").fadeOut();
    });

    $("#top").click(function() {
        $("#content_block").animate({
            scrollTop: 0
        }, 0);
    });

    // ----------------------
    // загрузка картинок
    // ----------------------
    function handleFileSelect(evt) {
        $("#photo_block").empty();
        var files = evt.target.files; // FileList object
        for (var i = 0; i < 5; i++) {
            f = files[i];
            if (!f.type.match("image.*")) {
                continue;
            }
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    $("#photo_block").append("<img src='" + e.target.result + "' class='adv_img_item' title='" + theFile.name + "'/>");
                };
            })(f);

            reader.readAsDataURL(f);
	    photo_loaded=1;
        }
    }

    document.getElementById('file').addEventListener('change', handleFileSelect, false);

    // ----------------------------------
    // обработка данных при регистрации
    // ----------------------------------
    function Register() {
        if ($("#reg_login").val() == "") {
            $("#reg_login").focus();
            swal("ВНИМАНИЕ!", "укажите логин", "warning");
        } else
        if ($("#reg_password").val() == "") {
            $("#reg_password").focus();
            swal("ВНИМАНИЕ!", "укажите пароль", "warning");
        } else
        if ($("#reg_password").val().length < 8) {
            $("#reg_password").focus();
            swal("ВНИМАНИЕ!", "пароль слишком простой! (нужно как минимум 8 символов)", "warning");
        } else
        if ($("#reg_email").val() == "") {
            $("#reg_email").focus();
            swal("ВНИМАНИЕ!", "укажите email", "warning");
        } else
        if (!validateEmail($("#reg_email").val())) {
            $("#reg_email").focus();
            swal("ВНИМАНИЕ!", "укажите нормальный email", "warning");
        } else
            $.ajax({
                url: "server.php",
                data: {
                    "func": "RegUser",
                    "login": $("#reg_login").val(),
                    "password": $("#reg_password").val(),
                    "email": $("#reg_email").val(),
                    "g-recaptcha-response": grecaptcha.getResponse(),
                },
                method: "POST",
                success: function(data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.answer == "error") error(obj.string);
                    if (obj.answer == "warning") warning(obj.string);
                    if (obj.answer == "success") {
                        $("#reg_window").hide();
                        $("#auth_window").hide();
                        $("#back_screen1").fadeOut(100);
                        localStorage.setItem("user_name", $("#reg_login").val());
                        localStorage.setItem("user_password", $("#reg_password").val());
                        ShowUserSeetingsUpMenuButton(obj.string);
                        swal("регистрация прошла успешно!");
                    }
                }
            });
    }
    // -------------------------------------------
    // кнопка регистрации (обработка)
    // -------------------------------------------
    $("#button_reg").click(function() {
        Register();
    });
    // ----------------------------------
    // восстановление данные
    // ----------------------------------
    $("#button_restore").click(function() {
        if ($("#restore_email").val() == "") {
            $("#restore_email").focus();
            swal("ВНИМАНИЕ!", "укажите email", "warning");
        } else
        if (!validateEmail($("#restore_email").val())) {
            $("#restore_email").focus();
            swal("ВНИМАНИЕ!", "укажите нормальный email", "warning");
        } else {

            $.ajax({
                url: "server.php",
                data: {
                    func: "RestorePassword",
                    "email": $("#restore_email").val()
                },
                success: function(data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.answer == "error") error(obj.string);
                    if (obj.answer == "warning") warning(obj.string);
                    if (obj.answer == "success") {
                        swal("Данные для восстановления входа отправлены!", obj.string);
                        $("#restore_window").hide();
                    }
                }
            });
        }
    });

    /* 
    -------------------------
    ПРЕДПРОСМОТР ИЗОБРАЖЕНИЙ
    -------------------------
    */
    function PreviewImage() {
        var oFReader = new FileReader();
        oFReader.readAsDataURL(document.getElementById("uploadImage").files[0]);
        oFReader.onload = function(oFREvent) {
            document.getElementById("department_logo").src = oFREvent.target.result;
        };
    };

        $.ajax({
            url: "server.php",
            data:
            {
                "func": "GetCategory",
            },
            success: function(data) 
	    {
	     if (data == "") ShowCategories();
	     else
	     {
	      category = data;
              UserSearchString();
             }
            }
        });
    
 } // if device mobile
});