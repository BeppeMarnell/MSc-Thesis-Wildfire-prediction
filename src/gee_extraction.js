function generateRandomInteger(max) {
    return Math.floor(Math.random() * (max - 6)) + 6;
}

// function to remove 1 year from the date string 
function remove_years(init_date, n_years){
    var to_split = init_date.split(',');
    to_split[0] = (parseInt(to_split[0]) - n_years).toString();
    return to_split.join("-");
}

function get_landcover_date(init_date){
  var to_split = init_date.split('-');
  to_split[1] = '01';
  to_split[2] = '01';
  return to_split.join("_");
}

function get_date(init_date, days){
  var array = [];
  
  var rnd_day_1 = init_date.toString();
  var rnd_day_2 = (init_date + days).toString();
  if(rnd_day_1.length == 1){
    rnd_day_1 = '0'+ rnd_day_1;
  }
  
  if(rnd_day_2.length == 1){
    rnd_day_2 = '0'+ rnd_day_2;
  }
  
  array.push(rnd_day_1);
  array.push(rnd_day_2);
  return array;
}

// select the geometry and images index - to chose ------------------------

// The geometry_type is the name of the geometry to import and to inspect
var geometry_type = geom_australia;
// Filename name
var region = 'australia';

var img_index_start = 600;
var img_index_end = 650;

// years - to chose
var years_to = [2018, 2019, 2020, 2021];
var year_idx = 3;

// date range (december = 1)
var month = '10';
var december = 0;

var rnd_num = generateRandomInteger(27);

var rnd_day_1 = get_date(rnd_num, 1)[0];
var rnd_day_2 = get_date(rnd_num, 1)[1];

var initial_date = (years_to[year_idx] - december).toString() + '-'+ month + '-' + rnd_day_1;
var final_date = (years_to[year_idx] - december).toString() + '-' + month + '-' + rnd_day_2;

print(initial_date + " " + final_date);

// dates for the ndvi
var rnd_day_ndvi_1 = get_date((rnd_num -1), 2)[0];
var rnd_day_ndvi_2 = get_date((rnd_num -1), 2)[1];

var initial_date_ndvi = (years_to[year_idx] - december).toString() + '-'+ month + '-' + rnd_day_ndvi_1;
var final_date_ndvi = (years_to[year_idx] - december).toString() + '-' + month + '-' + rnd_day_ndvi_2;

print(initial_date_ndvi + " " + final_date_ndvi);

// dates for the 5days
var rnd_day_5_1 = get_date((rnd_num -3), 4)[0];
var rnd_day_5_2 = get_date((rnd_num -3), 4)[1];

var initial_date_5 = (years_to[year_idx] - december).toString() + '-'+ month + '-' + rnd_day_5_1;
var final_date_5 = (years_to[year_idx] - december).toString() + '-' + month + '-' + rnd_day_5_2;

print(initial_date_5 + " " + final_date_5);


// years-month ranges
var final_year = years_to[year_idx] - december;
var initial_year = final_year - 10;
var initial_month = parseInt(month);
var final_month = initial_month;

// confidence of fire
var dataset_fire = ee.ImageCollection('MODIS/006/MOD14A1')
                  .filter(ee.Filter.date(initial_date, final_date)).select('MaxFRP');
                  

// history of fires in the year before
var history_fires = ee.ImageCollection('MODIS/006/MOD14A1')
                  .filter(ee.Filter.date(remove_years(final_date, 1), final_date)).select('MaxFRP');
                  
// elevation dataset
var dataset_elev = ee.Image('NASA/NASADEM_HGT/001'); 
// use  MODIS/006/MCD15A3H for better resolution
var elevation = dataset_elev.select('elevation');


// lai and fapar, filter 10 years in january
var dataset_lai = ee.ImageCollection('NOAA/CDR/AVHRR/LAI_FAPAR/V5')
.filter(ee.Filter.calendarRange(initial_year, final_year, 'year'))
.filter(ee.Filter.calendarRange(initial_month, final_month,'month'));
                  
var leafAreaIndex = dataset_lai.select('LAI');

// fpar, filter 10 years in january
var fapar = dataset_lai.select('FAPAR');


// Get the era 5 dataset
var era5 = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY")
                .filter(ee.Filter.date(initial_date, final_date));
                
var era5_hist = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY")
                .filter(ee.Filter.date(initial_date_5, final_date_5));

// LST
var lst = era5.select('temperature_2m').max();

// LST history
var lst_hist = ee.ImageCollection("JAXA/GCOM-C/L3/LAND/LST/V2")
                .filterDate(initial_date_5, final_date_5)
                .select("LST_AVE")
                .filter(ee.Filter.eq("SATELLITE_DIRECTION", "D"));

var lst_hist = lst_hist.mean().multiply(0.02);


// Surface soil temperature
var soil_temp = era5.select('soil_temperature_level_1');
// Surface soil temperature hist
var soil_temp_hist = era5_hist.select('soil_temperature_level_1');

// total precipitation
var tot_precip = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
                  .select('precipitation')
                  .filter(ee.Filter.date(initial_date, final_date));

// total precipitation
var tot_precip_hist = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
                  .select('precipitation')
                  .filter(ee.Filter.date(initial_date_5, final_date_5));

// surface pressure
var pressure = era5.select('surface_pressure')

// u and v compenent wind
var u_wind = era5.select('u_component_of_wind_10m')
var v_wind = era5.select('v_component_of_wind_10m')

//humidity
var humidity = era5.select('dewpoint_temperature_2m');
//humidity hist
var humidity_hist = era5_hist.select('dewpoint_temperature_2m');

// hourly lai
var hour_lai_high = era5.select('leaf_area_index_high_vegetation');
var hour_lai_low = era5.select('leaf_area_index_low_vegetation');

// daily NDVI
var daily_ndvi = ee.ImageCollection('MODIS/MOD09GA_006_NDVI')
                  .select('NDVI')
                  .filter(ee.Filter.date(initial_date_ndvi, final_date_ndvi));
                  
// daily evapotranspiration
var d8_evotranspo = ee.ImageCollection('MODIS/006/MOD16A2')
                  .select('ET')
                  .filter(ee.Filter.date(initial_date_5, final_date_5));

// Land cover to mask the burnable part of the map
var land_cover = ee.Image('MODIS/006/MCD12Q1/2020_01_01');//+ get_landcover_date(initial_date));
var land_cover = land_cover.select('LC_Type1');


// get the sampled points near the values of fire
var dataset_maxff = dataset_fire.mean().clip(geometry_type).toInt16();

var sampled = dataset_maxff.stratifiedSample({
  numPoints: 1,
  classBand: 'MaxFRP',
  region: geometry_type,
  projection: 'EPSG:4326',
  scale: 6000,
  seed: generateRandomInteger(200),
  geometries:true});
  
Map.addLayer(sampled);

// image 200km x 200 km and 200px x 200px

// transform points to a list of geometry
var accumulate = function(image, list) {
  var export_square = image.geometry().buffer(ee.Number(100000), 1).bounds();
  return ee.List(list).add(export_square);
}

var first = ee.List([]);
var cumulative = ee.List(sampled.iterate(accumulate, first));

print("n. squares");
print(cumulative.length());

var composite_imgs;

for (var i = 0; i < (img_index_end - img_index_start); i++) {
  
  var export_square = cumulative.get(i);
  
  // Map.addLayer(ee.Geometry(export_square));

  // ------ Prepare data for visualisation etc.
  
  // confidence fires
  var image_fire = dataset_fire.first().clip(export_square);
  
  // history of fires
  var image_hist_fire = history_fires.max().clip(export_square);
  
  // elevation
  var image_elevation = elevation.updateMask(elevation.gt(0)).clip(export_square);
  
  // lai
  var image_lai = leafAreaIndex.mean().clip(export_square); // take the maximum over the 10 years
  
  //fpar
  var image_fapar = fapar.mean().clip(export_square); // take the maximum over the 10 years
  
  // lst
  var image_lst = lst.clip(export_square);
  //lst hist
  var image_lst_hist = lst_hist.clip(export_square);
  
  // soil temperature 
  var image_soil_temp = soil_temp.mean().clip(export_square);
  // soil temperature hist
  var image_soil_temp_hist = soil_temp_hist.max().clip(export_square);
  
  // total precipitation
  var image_tot_precip = tot_precip.max().clip(export_square);
  // total precipitation hist
  var image_tot_precip_hist = tot_precip_hist.mean().clip(export_square);
  
  // surface pressure
  var image_pressure = pressure.min().clip(export_square);
  
  // u and v compenent wind
  var image_u_wind = u_wind.mean().clip(export_square);
  var image_v_wind = v_wind.mean().clip(export_square);
  
  // humidity 
  var image_humidity = humidity.mean().clip(export_square);
  // humidity hist
  var image_humidity_hist = humidity_hist.mean().clip(export_square);
  
  // hourly lai
  var image_hour_lai_high = hour_lai_high.min().clip(export_square);
  var image_hour_lai_low = hour_lai_low.min().clip(export_square);
  
  var image_daily_ndvi = daily_ndvi.mean().clip(export_square);
  
  // Evapotranspiration
  var image_8d_evotranspo = d8_evotranspo.max().clip(export_square);
  
  // Land cover to mask the burnable part of the map
  var image_land_cover = land_cover.clip(export_square);
  
  // compose in an image all the bands
  var final_image = ee.Image(image_fire)
                    .addBands(image_elevation)
                    .addBands(image_lai)
                    .addBands(image_fapar)
                    .addBands(image_lst)
                    .addBands(image_lst_hist)
                    .addBands(image_soil_temp)
                    .addBands(image_soil_temp_hist)
                    .addBands(image_tot_precip)
                    .addBands(image_tot_precip_hist)
                    .addBands(image_pressure)
                    .addBands(image_u_wind)
                    .addBands(image_v_wind)
                    .addBands(image_humidity)
                    .addBands(image_humidity_hist)
                    .addBands(image_hour_lai_high)
                    .addBands(image_hour_lai_low)
                    .addBands(image_daily_ndvi)
                    .addBands(image_8d_evotranspo)
                    .addBands(image_hist_fire)
                    .addBands(image_land_cover);
                    
  // print(final_image.bandNames());
  
  // Export the image, only one band
  Export.image.toDrive({
    image: final_image.toFloat(),
    description: region + '_' + (img_index_start + i).toString(),
    scale:1000,
    folder:'G_earth_exp',
    region: export_square,
    fileFormat: 'GeoTIFF',
    crs:'EPSG:4326'
  });
}
