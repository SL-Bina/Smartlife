management actionda selecler falan sistemi yaxsi islemir live islemir ora ve bir birlerine gore filter olmalidi ora asagidakina uygunda islemelidi ve oranin storage hissesini falan tam hell et her sehifede paralel islemelidi

mtk
get {{end_point}}/search/module/mtk?name=masa&status=active&phone=0551229911&email=example@mail.ru&website=https://example.site&desc=lorem ipsum dolor&lat=41&lng=51&color_code=#hfedhe

complex 
get {{end_point}}/search/module/complex?status=active&phone=0551229911&email=example@mail.ru&website=https://example.site&desc=lorem ipsum dolor&lat=41&lng=51&color_code=&mtk_id=44#hfedhe

building 
get {{end_point}}/search/module/building?name=2031&status=active&complex_ids[]=5

block 
get {{end_point}}/search/module/block?complex_ids[]=5&complex_ids[]=2&name=BlockName&building_ids[]=2&status=active

property
get {{end_point}}/search/module/property?mtk_ids[]2=&complex_ids[]=5&complex_ids[]=2&name=ApartmentName&building_ids[]=2&block_ids[]=3&property_type=1&area=32&floor=12&apartment_number=12&status=active