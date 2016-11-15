/* 
---------------------------------
AksuMarket
мобильная версия
Bobkov Ilya
---------------------------------
*/
 $("#mobile_button_menu").click(function() {
    alert("!");
 });
 $("#mobile_button_search").click(function() {
    alert("!");
 });
        $.ajax({
            url: "server.php",
            data: {
                func: "GetCategories"
            },
            success: function(data) {
                var obj = jQuery.parseJSON(data);
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "success") {
		$("#mobile_select_category, #mobile_main_menu").empty();
                $.each(obj.string, function(key, val)
                {
		  $("#mobile_select_category").append("<option value='"+val.id+"'>"+val.name+"</option>")
		  $("#mobile_main_menu").append("<li value='"+val.id+"'>"+val.name+"</li>")
		});
		}
	}
	});


        $.ajax({
            url: "server.php",
            data: {
                func: "GetRegions"
            },
            success: function(data) {
                var obj = jQuery.parseJSON(data);
                if (obj.answer == "error") error(obj.string);
                if (obj.answer == "success") {
		$("#mobile_select_region").empty();
                $.each(obj.string, function(key, val)
                {
		  $("#mobile_select_region").append("<option value='"+val.region_id+"'>"+val.name+"</option>")
		});
	        $("#mobile_select_city").append("<option value='0'>------</option>");
		/* выбор города*/
                $('#mobile_select_region').on('change', function() {                
                    $.ajax({
                        url: "server.php",
                        data: {
                            func: "GetCity",
                            "region_id": $(this).val()
                        },
                        success: function(data) {
                            var obj = jQuery.parseJSON(data);
                            if (obj.answer == "error") error(obj.string);
                            if (obj.answer == "success"){
			        $("#mobile_select_city").empty();
                            $.each(obj.string, function(key, val) {
                                $("#mobile_select_city").append("<option value='" + val.city_id + "'>" + val.name + "</option>")
                            });
			   }
                        }
                    });
                });
		}
	}
	});