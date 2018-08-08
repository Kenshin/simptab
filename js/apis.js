
define([ "jquery", "i18n", "setting", "vo", "date", "error", "cdns" ], function( $, i18n, setting, vo, date, SimpError, cdns ) {

    "use strict";

    var deferred      = new $.Deferred(),
        SIMP_API_HOST = "http://simptab.qiniudn.com/",
        apis          = (function( $, IsNewDay, Today, isHoliday, IsRandom, Verify ) {

            /*
            *
            * apis.New() and apis.Update() must be both pairs appear.
            * apis.New()    set vo `code` and `origin` property.
            * apis.Update() set vo other property.
            *
            * dataType: json, xml( only nasa ), localStorage( upload  ), image( "wallhaven.cc", "unsplash.com", "unsplash.it" )
            */

            var options = {
                version  : 1,
                url      : "",
                type     : "GET",
                dataType : "json",
                timeout  : 2000,
                method   : "",
                origin   : "",
                code     : 0
            };

            function APIS() {
                this.vo     = {};
                this.failed = 0;
            }

            APIS.prototype.Stack       = {};
            APIS.prototype.ORIGINS     = [ "wallhaven.cc", "unsplash.com", "unsplash.it", "flickr.com", "googleart.com", "500px.com", "desktoppr.co", "visualhunt.com", "nasa.gov", "special", "favorite", "holiday", "bing.com", "today" ],
            APIS.prototype.ORIGINS_MAX = APIS.prototype.ORIGINS.length - 2; // excude: "today"

            APIS.prototype.Random = function( min, max ) {
                return Math.floor( Math.random() * ( max - min + 1 ) + min );
            }

            APIS.prototype.New = function() {
                var code   = this.Random( 0, this.ORIGINS_MAX );
                this.defer = new $.Deferred();

                // verify background every day
                // verify today is new day
                if ( IsNewDay( Today(), true ) || !IsRandom() ) {
                    code = this.ORIGINS_MAX + 1;
                }
                // verify today is holiday
                else if ( isHoliday() ) {
                    code = 11;
                }
                // change background every time
                else {
                    while ( Verify( code ) == "false" ||
                            localStorage[ "simptab-prv-code" ] == code ||
                            code == 11) {
                        code = this.Random( 0, this.ORIGINS_MAX );
                    }
                    localStorage[ "simptab-prv-code" ] = code;
                }

                // add test code
                // code = 9;

                console.log( "=== Current background origin is: ", code, this.ORIGINS[code] );
                this.vo        = $.extend( {}, options );
                this.vo.code   = code;
                this.vo.origin = this.ORIGINS[code];
                return { code: this.vo.code, origin: this.vo.origin };
            }

            APIS.prototype.Update = function() {
                var obj = arguments && arguments.length > 0 && arguments[0],
                    me  = this;
                Object.keys( obj ).forEach( function( item ) { me.vo[item] = obj[item]; });
            }

            APIS.prototype.Remote = function( callBack ) {
                var me     = this,
                    random = arguments && arguments.length == 1 ? "?random=" + Math.round(+new Date()) : "";
                $.ajax({
                    type       : this.vo.type,
                    timeout    : this.vo.timeout,
                    url        : this.vo.url + random,
                    dataType   : this.vo.dataType
                }).then( function( result ) {
                    me.VerifyObject( result ) && callBack( result );
                } , function( jqXHR, textStatus, errorThrown ) {
                    me.defer.reject( new SimpError( "apis:Remote()", "Call remote api error.", { jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown, apis_vo : me.vo }));
                });
            }

            APIS.prototype.VerifyObject = function( result ) {
                if ( typeof result != "undefined" && !$.isEmptyObject( result )) {
                    return true;
                }
                else {
                    this.defer.reject( new SimpError( "apis.VerifyObject()", "Current data structure error.", { result : result, apis_vo : apis.vo }));
                    return false;
                }
            }

            return new APIS;
    })( jQuery, date.IsNewDay, date.Today, isHoliday, setting.IsRandom, setting.Verify );

    /*
    * Bing( today )
    */
    apis.Stack[ apis.ORIGINS[13] ] = function() {
        console.log( "=== Bing.com today ===");
        var local = i18n.GetLocale() == "zh_CN" ? "cn." : "";
        apis.Update({ url : "https://" + local + "bing.com/HPImageArchive.aspx?format=js&idx=0&n=1", method : "apis.todayBing()" });
        apis.Remote( function( result ) {
            try {
                var data = result.images[0],
                    url  = data.url,
                    hdurl= getHDurl( getTrueUrl( url )),
                    name = data.copyright,
                    info = getInfo( data.copyrightlink ),
                    enddate   = data.enddate,
                    shortname = "Bing.com Image-" + getShortName( info );
                apis.defer.resolve( url, hdurl, name, info, enddate, shortname, apis.vo.origin, apis.vo );
            }
            catch ( error ) {
                apis.defer( new SimpError( apis.vo.method, "Parse bing.com/HPImageArchive.aspx error.", apis.vo ), error );
            }
        }, false );
        return apis.defer.promise();
    }

    function getHDurl( url ) {
        return url.replace( "1366x768", "1920x1080" );
    }

    function getTrueUrl( url ) {
        if ( url.indexOf( "/" ) == 0 ) {
            return "http://www.bing.com" + url;
        }
        return url;
    }

    function getInfo( url ) {
        var reg = /http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/;
        if( !reg.test( url )) {
            return "#";
        }

        return url.replace( "&mkt=zh-cn", "" ).replace( "&form=hpcapt", "" ).replace( "www.bing.com", "www.bing.com/knows" );
    }

    function getShortName( shortname ) {

        shortname = shortname.replace( "www.bing.com/knows", "" )
                             .replace( "http://", "" )
                             .replace( "https://", "" )
                             .replace( "/search?q=", "" );
        shortname = shortname.split( "+" )[0];
        shortname = shortname.split( "&" )[0];

        return decodeURIComponent( shortname );
    }

    /*
    * Bing( random )
    */
    apis.Stack[ apis.ORIGINS[12] ] = function() {
        console.log( "=== Bing.com random ===");
        apis.Update({ url : SIMP_API_HOST + "bing.gallery.json", method : "apis.randomBing()", timeout: 2000 * 3 });
        apis.Remote( function( result ) {
            try {
              var images = result.imageIds,
                  random = apis.Random( 0, images.length );
              getRandomBing( images[random] );
            }
            catch( error ) {
              apis.defer.reject( new SimpError( apis.vo.method, "Parse bing.gallery.json error.", apis.vo ), error );
            }
      });
      return apis.defer.promise();
    }

    function getRandomBing( id ) {
        apis.Update({ url : "http://www.bing.com/gallery/home/imagedetails/" + id, method : "apis.getRandomBing()" });
        apis.Remote( function( result ) {
          if ( result.wallpaper ) {
            var prefix = "http://az608707.vo.msecnd.net/files/";
            apis.defer.resolve( prefix + result.wpFullFilename, prefix + result.wpFullFilename, result.title, result.infoUrl, date.Now(), "Bing.com Image", apis.vo.origin, apis.vo );
          }
          else {
            apis.Stack[ apis.vo.origin ]();
          }
        });
    }

    /*
    * Wall Haven
    */
    apis.Stack[ apis.ORIGINS[0] ] = function() {

      console.log( "=== Wallhaven.cc call ===" );

      // wallhaven background ids
      var wallhaven_ids = [64346, 103929, 12852, 115399, 26623, 101496, 5527, 118585, 102569, 116915, 118993, 6352, 6873, 53356, 10017, 2042, 69737, 113377, 11706, 5168, 16270, 51579, 72375, 156241, 9832, 56481, 6693, 34887, 159465, 6413, 2986, 43537, 6361, 440, 396, 4389, 1784, 6072, 1769, 10694, 3507, 3335, 57239, 1148, 65146, 1045, 852, 7338, 154446, 102924, 354, 7115, 22629, 937, 1212, 26797, 4929, 6463, 26326, 1438, 64115, 395, 800, 1346, 6759, 799, 153883, 1942, 13072, 74098, 3866, 6448, 2987, 4914, 1874, 10568, 152693, 33560, 5269, 8463, 15403, 1926, 92, 124411, 2481, 12421, 110001, 51777, 18395, 4723, 7599, 809, 44628, 914, 819, 157024, 60284, 61, 2018, 5087, 6797, 9424, 391, 9349, 138624, 21821, 2540, 102549, 3065, 561, 1123, 4027, 4764, 22721, 4026, 725, 98217, 909, 28975, 1038, 22301, 7837, 6689, 33390, 1027, 7730, 1194, 367, 73294, 6990, 15899, 31275, 4126, 18392, 13468, 6465, 6416, 21068, 4869, 10524, 1107, 7686, 102435, 6066, 18337, 26481, 397, 33660, 6881, 2651, 1116, 6692, 51501, 60122, 4129, 11824, 19052, 11779, 3236, 4063, 5206, 15859, 29165, 100584, 7883, 5368, 12001, 13554, 2112, 1177, 14091, 50083, 102428, 67027, 70532, 598, 107498, 9680, 1190, 16426, 14, 32935, 21041, 143053, 4653, 6457, 6469, 14598, 22926, 5734, 1896, 12822, 52603, 12690, 7113, 12754, 17773, 110824, 16086, 8079, 73291, 164830, 5603, 11521, 33002, 18321, 118264, 141343, 3345, 5276, 30215, 56165, 6360, 26607, 24911, 31175, 93783, 7162, 849, 13973, 22998, 2897, 9906, 16687, 18709, 2197, 727, 56825, 13117, 105033, 151619, 5648, 21124, 390, 1180, 12781, 103248, 12821, 22469, 76442, 3020, 157, 13623, 81327, 2648, 17708, 99124, 28128, 10459, 2574, 3332, 19882, 2099, 19092, 106937, 146159, 14612, 536, 7843, 12427, 6876, 9035, 14190, 16970, 40859, 52526, 8196, 812, 99496, 3344, 4657, 13997, 24362, 108103, 851, 7505, 51126, 4862, 845, 10774, 5696, 13003, 27415, 45880, 149047, 12687, 102502, 28800, 6695, 8088, 13713, 4430, 107471, 8110, 33557, 1014, 7961, 13120, 18935, 31355, 10823, 4153, 6678, 6173, 7900, 13551, 82544, 16149, 2090, 13463, 15192, 30760, 5974, 51583, 69694, 154038, 165768, 13748, 28343, 32786, 60597, 19133, 9012, 16611, 101980, 560, 8440, 15708, 10695, 104618, 131692, 4804, 31274, 33408, 34761, 910, 2145, 13094, 53325, 59867, 107019, 159224, 8987, 11806, 1152, 3153, 38641, 102539, 13112, 126849, 3104, 13118, 29381, 51581, 40786, 154036, 232, 4901, 6875, 5536, 9709, 148270, 13739, 810, 2088, 11866, 9589, 10748, 22414, 34969, 67030, 2184, 4871, 4922, 7945, 22415, 28348, 31055, 38760, 56755, 65472, 99642, 157564, 20212, 7674, 29854, 16046, 148437, 56179, 29051, 7679, 2182, 29158, 26394, 52654, 43850, 28000, 28182, 32715, 32998, 4925, 5598, 12779, 16170, 52681, 115635, 105059, 34091, 55984, 73804, 70730, 76911, 141991, 156705, 21074, 6454, 21121, 45227, 102545, 17687, 69347, 47212, 25439, 3002, 70732, 154047, 142573, 93556, 3983, 5782, 9443, 24754, 25524, 19546, 21065, 88046, 115381, 139800, 155438, 119054, 140504, 106741, 34317, 509, 6351, 9437, 54764, 54416, 107497, 101507, 140670, 153983, 154633, 152771, 1185, 4944, 803, 808, 6706, 10825, 24686, 22306, 56482, 74395, 86566, 45389, 56792, 77363, 102498, 102537, 64132, 101426, 167125, 41060, 3513, 8599, 5742, 22302, 140, 19119, 28886, 29187, 35507, 36219, 50079, 63882, 72693, 76070, 133209, 153923, 81656, 52514, 6359, 6688, 28438, 1121, 72461, 92983, 9769, 1437, 3053, 5744, 12862, 11838, 28340, 33779, 72734, 132176, 20260, 34603, 1178, 4881, 4968, 3047, 9711, 9824, 10280, 18342, 56417, 68328, 87809, 118569, 131631, 30752, 93452, 156437, 138315, 159296, 353, 959, 3365, 12826, 13122, 6922, 9034, 4654, 5195, 10755, 19536, 43910, 92967, 154172, 10882, 2312, 6738, 8683, 3025, 13589, 13882, 14551, 11778, 16499, 10941, 11103, 26501, 45289, 53321, 68351, 101357, 5379, 8234, 57645, 79271, 51585, 468, 70371, 72182, 141518, 41151, 113423, 43075, 907, 919, 1305, 2000, 9708, 28643, 18315, 57798, 30927, 10758, 41289, 66434, 103247, 114383, 153848, 152410, 145410, 165672, 24421, 34273, 8580, 8073, 12755, 12870, 14054, 16238, 65470, 62851, 115616, 126567, 142633, 159412, 152536, 77583, 559, 101792, 3353, 14574, 18386, 32297, 6528, 9919, 10394, 35967, 94848, 102638, 120488, 139927, 137729, 73551, 166014, 33029, 4523, 9681, 9910, 21296, 21847, 20231, 2089, 2798, 12889, 13604, 11653, 18368, 25522, 28204, 33392, 102533, 128635, 159414, 152792, 143664, 24822, 10009, 40963, 60125, 13566, 26653, 31289, 27310, 27757, 32960, 1998, 569, 5072, 15194, 68340, 66762, 123787, 102541, 32744, 132151, 58663, 6867, 1944, 2322, 12848, 16597, 10481, 28794, 18365, 27013, 62470, 56478, 32808, 33154, 71642, 83685, 105813, 164744, 129914, 11206, 114989, 18601, 132284, 1937, 56480, 31172, 30201, 34968, 43349, 821, 883, 2448, 2936, 3371, 11803, 7405, 13138, 19270, 16043, 16187, 64345, 106949, 98577, 144247, 77653, 31166, 157694, 60209, 13758, 815, 2052, 2095, 13557, 13603, 16169, 7812, 6674, 8442, 8909, 9786, 35258, 35347, 33358, 51076, 72907, 68331, 71656, 70994, 90625, 62294, 60926, 99002, 92917, 101680, 140044, 164950, 165674, 148916, 10914, 137402, 4720, 21335, 1997, 13565, 11862, 12000, 15636, 15706, 31764, 29341, 33405, 36644, 40962, 44868, 52518, 50980, 49116, 66747, 69621, 72600, 84958, 80519, 107451, 124145, 157848, 154003, 152665, 73379, 33556, 43311, 45278, 56511, 49922, 58682, 65132, 6525, 8444, 10980, 11515, 26177, 25181, 29102, 4877, 15860, 22295, 78508, 76913, 75509, 106149, 107729, 157279, 154251, 5363, 10752, 51908, 546, 1641, 1918, 3027, 3868, 5085, 5799, 12855, 13579, 13745, 15169, 14159, 10392, 10397, 26200, 34753, 33370, 51447, 74172, 74401, 10587, 19628, 41157, 42713, 43843, 68377, 98158, 133270, 149051, 144582, 164523, 62569, 20233, 12778, 25520, 22805, 20289, 31779, 32789, 35252, 38011, 45890, 48616, 47199, 1205, 1743, 2001, 5086, 2796, 3028, 3155, 11808, 9704, 13556, 14307, 15261, 18328, 16738, 16055, 56145, 56486, 73226, 70746, 70373, 81325, 107447, 101494, 114911, 117218, 153801, 158971, 155972, 77728, 840, 59985, 31849, 19554, 283, 916, 1939, 1946, 3346, 14219, 19207, 16594, 31206, 27262, 5962, 12232, 5169, 34813, 36511, 33548, 34180, 54727, 51906, 74737, 72591, 75115, 43004, 58368, 80171, 98991, 101022, 140638, 132180, 156161, 156250, 153547, 52447, 7510, 3405, 10427, 6207, 22782, 22460, 2060, 1005, 12841, 12923, 13591, 10693, 26392, 27294, 24644, 28925, 35521, 33563, 40366, 56469, 63762, 59449, 90049, 101561, 114920, 142394, 72701, 69619, 52525, 70736, 58364, 11223, 1207, 43602, 51578, 60954, 7193, 12842, 13737, 8451, 9372, 10480, 29018, 29203, 29392, 975, 3247, 4411, 16091, 24018, 19502, 37441, 37612, 65238, 68333, 85825, 107515, 103227, 133250, 133527, 137726, 147489, 149050, 158772, 153986, 154035, 155970, 157654, 41529, 20179, 22411, 6468, 2012, 2315, 3318, 3356, 3534, 5155, 7430, 13923, 18310, 18346, 59989, 36254, 31348, 52673, 54092, 68372, 71041, 87517, 111740, 154303, 147048, 117921, 19535, 19821, 31185, 40939, 33415, 34038, 38225, 42447, 45352, 2013, 2284, 6755, 12008, 7448, 13520, 13811, 13842, 18455, 19129, 16601, 54694, 51431, 51582, 51671, 64371, 68443, 73947, 69561, 79786, 85930, 86053, 86250, 93558, 86419, 107500, 101146, 115370, 118994, 127298, 141003, 141508, 139041, 142602, 144026, 159284, 158034, 101019, 106918, 104657, 169618, 149216, 82436, 30884, 144920, 93, 1996, 3315, 12751, 12833, 15159, 15534, 19252, 16746, 32305, 29061, 9027, 11760, 12294, 12314, 25730, 26194, 26593, 22313, 35018, 55511, 51588, 53349, 54400, 49196, 72197, 88606, 44127, 47210, 65077, 78304, 98838, 107450, 104639, 105005, 140486, 154723, 158035, 80063, 8480, 161778, 67028, 113421, 117308, 59025, 5847, 4509, 4864, 4876, 3049, 3063, 811, 13084, 13731, 12271, 26188, 26633, 27218, 28502, 31168, 31682, 34489, 44596, 54735, 58597, 59665, 90099, 88587, 81839, 75793, 101287, 106686, 111628, 114564, 132179, 140564, 164951, 157709, 159293, 148777, 132174, 106112, 30886, 54700, 52196, 53733, 54363, 63756, 57716, 57785, 62885, 5654, 8588, 8886, 12361, 27295, 32977, 266, 4752, 16089, 18662, 22719, 35705, 36816, 34137, 34308, 34891, 68352, 87681, 87895, 88468, 83381, 85178, 107875, 101500, 115121, 120358, 141695, 139138, 138868, 138969, 149810, 154174, 164469, 26329, 2509, 143658, 78971, 30801, 363, 6451, 4912, 5357, 9126, 12797, 12999, 15652, 11686, 28009, 18322, 18663, 25219, 60013, 60741, 36329, 51365, 51428, 52596, 74386, 74519, 41006, 72450, 87137, 85953, 85078, 93355, 98470, 107453, 141773, 164679, 154043, 154125, 2461, 15164, 106234, 69844, 34309, 88837, 109308, 160730, 35876, 64654, 137025, 10448, 53683, 137330, 43627, 46695, 98634, 49454, 54275, 46621, 40635, 134557, 56896, 79456, 103141, 72602, 42314, 31355, 44877, 169035, 146158, 7567, 4126, 62487, 55747, 145376, 45870, 145434, 32029, 53359, 113188, 33452, 42446, 6660, 22366, 73035, 65094, 113323, 58400, 108968, 74850, 72880, 150661, 58020, 95750, 116733, 93502, 66422, 45882, 71318, 140643, 79456, 145922, 18670, 44339, 56858, 19894, 37043, 153141, 137133, 69279, 25375, 3289, 58164, 4715, 145282, 139874, 123729, 134055, 94168, 53802, 53703, 137319, 65361, 59901, 38750, 8587, 85843, 35124, 811, 45983, 96082, 124145, 51452, 148471, 160353, 25339, 162222, 43175, 99301, 8616, 51240, 108219, 117128, 62062, 162241, 139517, 113102, 40607, 52619, 46249, 147433, 147860, 6862, 8436, 9434, 136607, 140064, 36480, 58640, 24829, 115858, 86571, 147432, 71034, 131363, 130310, 15376, 21909, 76361, 65429, 107833, 54854, 117556, 60939, 9522, 103531, 92160, 44144, 3005, 161184, 161792, 98415, 865, 66210, 42683, 101366, 38429, 101725, 45096, 29095, 93, 36079, 23831, 79597, 137414, 47568, 135692, 124361, 140845, 164809, 46270, 59573, 167125, 69878, 45298, 163984, 120298, 60895, 104527, 44868, 109375, 138927, 48535, 163698, 157881, 142579, 98603, 33372, 95582, 27678, 30888, 45152, 147788, 42696, 19628, 132488, 116478, 24573, 151419, 165874, 59530, 9015, 38741, 3227, 152491, 134564, 162269, 52250, 52260, 44555, 95748, 81663, 72582, 97040, 8116, 44994, 120820, 34650, 53271, 56992, 41909, 84530, 134461, 135497, 2649, 11009, 101477, 59254, 99778, 84042, 47410, 103203, 100308, 116881, 53173, 47429, 43848, 160730, 73128, 93804, 137554, 33654, 90940, 149638, 73758, 164812, 56478, 168629, 45957, 129646, 137151, 138623, 155106, 150986, 48975, 8474, 45634, 38120, 45168, 45863, 17264, 116705, 168459, 59193, 60515, 110460, 123774, 164566, 133842, 98996, 152798, 120339, 124145, 162486, 56783, 35857, 139138, 52002, 127986, 107028, 99731, 46234, 164824, 10181, 65651, 54420, 47075, 14, 89585, 138225, 149335, 145943, 51165, 62125, 122568, 138558, 84815, 159562, 81646, 134425, 112512, 28921, 18863, 76670, 169015, 62963, 136328, 148762, 116637, 128829, 13926, 131759, 46394, 54426, 152927, 47110, 136591, 162638, 46066, 128005, 56844, 73188, 72796, 104345, 47553, 46128, 135779, 137190, 60299, 22953, 51989, 17265, 44535, 61135, 76133, 144828, 52017, 31466, 112336, 75216, 120316, 106465, 121018, 35330, 73122, 126988, 114324, 74792, 25232, 45014, 125647, 133932, 116978, 70093, 46111, 11863, 101938, 137532, 84846, 153742, 26068, 107977, 110086, 139075, 98601, 60190, 57254, 2912, 137331, 43026, 110463, 88215, 59307, 21918, 116583, 78991, 46261, 44723, 44923, 83550, 51070, 118598, 47711, 8452, 34876, 80993, 142673, 88864, 18934, 98391, 46124, 108004, 59014, 122508, 41654, 52196, 32825, 82740, 13998, 61806, 133045, 11222, 41319, 32626, 27696, 62304, 157848, 52990, 111656, 34430, 49203, 116475, 40635, 85129, 137497, 36496, 126309, 120329, 42796, 59257, 46359, 90159, 54758, 129507, 106025, 135690, 142702, 110206, 5370, 41961, 114050, 58029, 79276, 30346, 10149, 63815, 44214, 8055, 106036, 43903, 48904, 4756, 79101, 163872, 3053, 31811, 47732, 41383, 75727, 40700, 1438, 55855, 163368, 120947, 107881, 90229, 138071, 138635, 92972, 145888, 32569, 52102, 77445, 27466, 49384, 112962, 135301, 56898, 22609, 58529, 79043, 43283, 41121, 25357, 131673, 73701, 36255, 10545, 72700, 9014, 61650, 95745, 27126, 44463, 146896, 161163, 106257, 26336, 148696, 141682, 34176, 137616, 4725, 54310, 121399, 127885, 100509, 48451, 55779, 72375, 164102, 110160, 44514, 134692, 47407, 47573, 88595, 124200, 52531, 20177, 82649, 18133, 127754, 59602, 53268, 170541, 61660, 75572, 62394, 14751, 17765, 40317, 53820, 123414, 146033, 48090, 112378, 109750, 108803, 107154, 115637, 64046, 145894, 164733, 145068, 37550, 94620, 47707, 72588, 138627, 10709, 47677, 167173, 161988, 52054, 112932, 54096, 24019, 135141, 17794, 49809, 77183, 19885, 57899, 75115, 54053, 121092, 146916, 66401, 48429, 2931, 44968, 165685, 43307, 41028, 11161, 40275, 1003, 104059, 10413, 83771, 86992, 83781, 48389, 32548, 67038, 137005, 29847, 124417, 54768, 135245];
      try {
        var max    = wallhaven_ids.length - 1,
            id     = wallhaven_ids[ apis.Random( 0, max ) ],
            url    = "http://alpha.wallhaven.cc/wallpapers/full/wallhaven-" + id + ".jpg";
        apis.Update({ url : url, method: "apis.wallhaven()", dataType : "image" });
        apis.defer.resolve( url, url, "Wallhaven.cc Image", "#", date.Now(), "Wallhaven.cc Image", apis.vo.origin, apis.vo );
      }
      catch ( error ) {
        apis.defer.reject( new SimpError( apis.vo.origin, "Parse wallhaven error, url is " + url, apis.vo ), error );
      }
      return apis.defer.promise();
    }

    /*
    * Unsplash.COM
    */
    apis.Stack[ apis.ORIGINS[1] ] = function() {

      console.log( "=== Unsplash.com call ===" );

      var unsplash_ids = [ "collection/2463312" ];
      try {
          var max    = unsplash_ids.length - 1,
              id     = unsplash_ids[ apis.Random( 0, max ) ],
              url    = "https://source.unsplash.com/" + id + "/2560×1600";
          apis.Update({ url : url, method: "apis.unsplashCOM()", dataType : "image" });
          apis.defer.resolve( url, url, "Unsplash.com Image", "#", date.Now(), "Unsplash.com Image", apis.vo.origin, apis.vo );
      }
      catch ( error ) {
        apis.defer.reject( new SimpError( apis.vo.method , "Parse unsplash.com error, url is " + url, apis.vo ), error );
      }
      return apis.defer.promise();
    }

    /*
    * Unsplash.IT
    */
    apis.Stack[ apis.ORIGINS[2] ] = function() {

        console.log( "=== Unsplash.it call ===" );

        try {
          var max    = 939,
              url    = "https://unsplash.it/1920/1080/?image=" + apis.Random( 0, max );
          apis.Update({ url : url, method: "apis.unsplashIT()", dataType : "image" });
          apis.defer.resolve( url, url, "Unsplash.it Image", "#", date.Now(), "Unsplash.it Image", apis.vo.origin, apis.vo );
        }
        catch( error ) {
          apis.defer.reject( new SimpError( apis.vo.origin , "Parse unsplash.it error, url is " + url, apis.vo ), error );
        }
        return apis.defer.promise();
    }

    /*
    * Flickr.com
    * e.g. https://api.flickr.com/services/rest/?method=[method name]&api_key=[api key]&[key]=[value]&format=json
    */
    var FLICKR_NAME       = "flickr.api.json",
        FLICKR_API_KEY    = "5feac8799f0102a4c93542f7cc82f5e1",
        FLICKR_HOST       = "https://api.flickr.com/services/rest/",
        FLICKR_PHOTO_API  = "flickr.photos.getSizes";

    function getFlickAPI( method, key, value ) {
        return FLICKR_HOST + "?method=" + method + "&api_key=" + FLICKR_API_KEY + "&" + key + "=" + value + "&format=json&jsoncallback=?";
    }

    apis.Stack[ apis.ORIGINS[3] ]  = function() {

        console.log( "=== Flickr.com call ===");

        apis.Update({ url : SIMP_API_HOST + FLICKR_NAME, method : "apis.flickr()" });
        apis.Remote( function( result ) {
            getFlickrURL( result ).then( getFlickrPhotos ).then( getFlickrPhotoURL );
        });
        return apis.defer.promise();
    }

    function getFlickrURL( result ) {

        console.log( "=== Flickr.com::getFlickrURL() call ===");

        var def = $.Deferred();
        try {
            var max    = result.apis.length - 1,
                random = apis.Random( 0, max ),
                api    = result.apis[ random ],
                method = api.method,
                key    = api.keys["key"],
                values = api.keys["val"];
            random     = apis.Random( 0, values.length - 1 );
            def.resolve( getFlickAPI( method, key, values[random] ));
        }
        catch ( error ) {
            apis.defer.reject( new SimpError( "apis.getFlickrURL()" , "Parse flickr.com error, url is " + apis.vo.url, apis.vo ), error );
        }
        return def.promise();
    }

    function getFlickrPhotos( url ) {

        console.log( "=== Flickr.com::getFlickrPhotos() call ===");

        var def = $.Deferred();
        apis.Update({ url : url, method : "apis.flickr()::getFlickrPhotos()", timeout: 2000 * 5 });
        apis.Remote( function( result ) {
            try {
                var len    = result.photos.photo.length,
                    random = apis.Random( 0, len - 1 ),
                    photo  = result.photos.photo[ random ];
                def.resolve( photo.id );
            }
            catch ( error ) {
                apis.defer.reject( new SimpError( "apis.getFlickrPhotos()" , "Parse flickr.com error, url is " + url, apis.vo ), error );
            }
        }, false );
        return def.promise();
    }

    function getFlickrPhotoURL( photo_id ) {

        console.log( "=== Flickr.com::getFlickrPhotoURL() call ===");

        var def = $.Deferred(),
            url = getFlickAPI( FLICKR_PHOTO_API, "photo_id", photo_id );

        apis.Update({ url : url, method : "apis.flickr()::getFlickrPhotoURL()", timeout: 2000 * 5 });
        apis.Remote( function( result ) {
          try {
              var hdurl = "",
                  info  = "",
                  item  = {};
              for( var idx = 0, len = result.sizes.size.length; idx < len; idx++ ) {
                item = result.sizes.size[idx];
                if ( item.width == "1600" ) {
                  hdurl = item.source;
                  info   = item.url;
                  apis.defer.resolve( hdurl, hdurl, "Flickr.com Image", info, date.Now(), "Flickr.com Image", apis.vo.origin, apis.vo );
                  break;
                }
              }
              if ( hdurl == "" && info == "" ) {
                new SimpError( apis.vo.method , "Parse flickr.com error, url is " + url, apis.vo );
                apis.Stack[ apis.ORIGINS[3] ]();
              }
          }
          catch ( error ) {
            apis.defer.reject( new SimpError( apis.vo.method , "Parse flickr.com error, url is " + url, apis.vo ), error );
          }
        }, false );
        return def.promise();
    }

    /*
    * Google Art Project
    */
    apis.Stack[ apis.ORIGINS[4] ] = function() {

        console.log( "=== googleart.com call ===");

        var GOOGLE_ART_NAME   = "google.art.project.json",
            GOOGLE_ART_SUFFIX = "=s1200-rw",
            GOOGLE_ART_PREFIX = "https://www.google.com/culturalinstitute/",
            url               = SIMP_API_HOST + GOOGLE_ART_NAME;

        apis.Update({ url : url, method : "apis.googleart()", timeout : 2000 * 2 });
        apis.Remote( function( result ) {
            try {
                var max    = result.length - 1,
                    random = apis.Random( 0, max ),
                    obj    = result[ random ],
                    hdurl  = obj.image + GOOGLE_ART_SUFFIX;
                apis.defer.resolve( hdurl, hdurl, obj.title, GOOGLE_ART_PREFIX + obj.link, date.Now(), "GooglArtProject Image-" + obj.title, apis.vo.origin, apis.vo );
            }
            catch( error ) {
              apis.defer.reject( new SimpError( apis.vo.method , "Parse googleart.com error, url is " + url, apis.vo ), error );
            }
        });
        return apis.defer.promise();
    }

    /*
    * 500 px
    */
    var PX_KEY  = "VM5xNIpewHeIv4BFDthn3hfympuzfPEZPADv6WK7",
        PX_API  = "500px.api.json",
        PX_URL  = "https://api.500px.com/v1",
        PX_HOME = "https://www.500px.com";

    apis.Stack[ apis.ORIGINS[5] ] = function() {
        console.log( "=== 500px.com call ===");
        get500pxURL().then( get500API );
        return apis.defer.promise();
    }

    function get500pxURL() {
        var def = $.Deferred();

        apis.Update({ url : SIMP_API_HOST + PX_API, method : "apis.get500pxURL()", timeout : 2000 * 5 });
        apis.Remote( function( result ) {
            try {
                var max    = result.apis.length - 1,
                    random = apis.Random( 0, max ),
                    obj    = result.apis[ random ],
                    param  = ["?consumer_key=" + PX_KEY];

                obj.args.map( function( item ) {
                    param.push( item.key + "=" + item.val );
                });
                def.resolve( PX_URL + obj.method + param.join("&") );
            }
            catch ( error ) {
              apis.defer.reject( new SimpError( apis.vo.method , "Parse 500px.com error, url is " + SIMP_API_HOST + PX_API, apis.vo ), error );
            }
        });
        return def.promise();
    }

    function get500API( url ) {
        var def = $.Deferred();

        apis.Update({ url : url, method : "apis.get500API()", timeout : 2000 * 5 });
        apis.Remote( function( result ) {
            try {
                var max    = result.photos.length - 1,
                    random = apis.Random( 0, max ),
                    obj    = result.photos[ random ];

                while ( obj.height < 1000 ) {
                    random = apis.Random( 0, max );
                    obj    = result.photos[ random ];
                }
                apis.defer.resolve( obj.image_url, obj.image_url, obj.name, PX_HOME + obj.url, date.Now(), "500px.com Image-" + obj.name, apis.vo.origin, apis.vo );
            }
            catch ( error ) {
              apis.defer.reject( new SimpError( apis.vo.method , "Parse 500px.com error, url is " + url, apis.vo ), error );
            }
        });
    }

    /*
    * Desktoppr.co background
    */
    apis.Stack[ apis.ORIGINS[6] ] = function() {

        console.log( "=== Desktoppr.co call ===");

        var max    = 4586,
            url    = "https://api.desktoppr.co/1/wallpapers?page=" + apis.Random( 0, max );

        apis.Update({ url : url, method : "apis.desktoppr()", timeout: 2000 * 4 });
        apis.Remote( function( result ) {
            try {
              var response = result.response,
                  max      = response.length,
                  random   = apis.Random( 0, max ),
                  obj      = response[ random ];

                  while ( obj.height < 1000 ) {
                      random = apis.Random( 0, max );
                      obj    = response[ random ];
                  }
                  apis.defer.resolve( obj.image.url, obj.image.url, "Desktoppr.co Image", obj.url, date.Now(), "Desktoppr.co Image", apis.vo.origin, apis.vo );
            }
            catch ( error ) {
                apis.defer.reject( new SimpError( apis.vo.method , "Parse Desktoppr.co error, url is " + url, apis.vo ), error );
            }
        });
        return apis.defer.promise();
    }

    /*
    * Visual Hunt
    */
    apis.Stack[ apis.ORIGINS[7] ] = function() {

        console.log( "=== visualhunt.com call ===");

        var VISUALHUNT_NAME = "visualhunt.json",
            VISUALHUNT_HOST = "https://visualhunt.com";

        apis.Update({ url : SIMP_API_HOST + VISUALHUNT_NAME, method : "apis.visualhunt()" });
        apis.Remote( function( result ) {
            try {
              var max    = result.length,
                  random = apis.Random( 0, max ),
                  obj    = result[ random ],
                  url    = obj.url.replace( "http://", "https://" ); // 139-simptab-visualhunt-com-cross-origin-resource-sharing-policy-no-access-control-allow-origin
              apis.defer.resolve( url, url, "Visualhunt.com Image", VISUALHUNT_HOST + obj.info, date.Now(), "Visualhunt.com Image", apis.vo.origin, apis.vo );
            }
            catch( error ) {
              apis.defer.reject( new SimpError( apis.vo.method , "Parse visualhunt.com error, url is " + apis.vo.url, apis.vo ), error );
            }
        });
        return apis.defer.promise();
    }

    /*
    function nasa() {

      console.log( "=== nasa.gov call ===");

      var rss = "http://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss";
      $.ajax({
            type       : "GET",
            timeout    : 2000*10,
            url        : rss,
            dataType   : "xml" })
        .then( function ( result ) {
          if ( result && !$.isEmptyObject( result )) {
            try {
              var items  = $( result ).find( "item" ),
                  max    = items.length,
                  random = createRandom( 0, max ),
                  $item  = $( items[random] ),
                  url    = $item.find( "enclosure" ).attr( "url" ),
                  name   = $item.find( "title" ).text(),
                  info   = $item.find( "link" ).text();
              deferred.resolve( vo.Create( url, url, "NASA.gov Image - " + name, info, date.Now(), "NASA.gov Image", "nasa.gov" ) );
            }
            catch ( error ) {
              deferred.reject( SimpError.Clone( new SimpError( "apis.nasa()", null , "Parse lg_image_of_the_day.rss error." ), error ));
            }
          }
          else {
            deferred.reject( new SimpError( "apis.nasa()", "nasa rss parse error.", result ));
          }
        }, failed );
    }
    */

    apis.Stack[ apis.ORIGINS[8] ] = function() {

      console.log( "=== nasa.gov call ===");

      var API_KEY = "ZwPdNTaFcYqj7XIRnyKt18fUZ1vJJXsSjJtairMq",
          API     = "https://api.nasa.gov/planetary/apod?hd=True&api_key=" + API_KEY,
          url     = ( function( url ) {
            var years = [2012, 2013, 2014, 2015],
                year  = years[ apis.Random( 0, years.length - 1 )],
                month = apis.Random( 1, 12 ),
                day   = apis.Random( 1, 31 );
                month = month < 9 ? "0" + "" + month : month;
                day   = day   < 9 ? "0" + "" + day   : day;
            return  url + "&date=" + year + "-" + month + "-" + day;
      })( API );

      apis.Update({ url : url, method : "apis.apod()", timeout : 2000 * 5 });
      apis.Remote( function( result ) {
          try {
            var name = result.title,
                url  = result.hdurl;
            apis.defer.resolve( url, url, "NASA.gov APOD Image - " + name, "#", date.Now(), "NASA.gov APOD Image", apis.vo.origin, apis.vo );
          }
          catch ( error ) {
            apis.defer.reject( new SimpError( apis.vo.method , "Parse nasa apod api error, url is " + url, apis.vo ), error );
          }
      }, false );
      return apis.defer.promise();
    }

    /*
    * Favorite background
    */
    apis.Stack[ apis.ORIGINS[10] ] = function() {

        console.log( "=== Favorite background call ===");

        try {
            var arr = JSON.parse( localStorage[ "simptab-favorites" ] || "[]" );
            if ( !Array.isArray( arr ) || arr.length == 0 ) {
                apis.defer.reject( new SimpError( "favorite", "Local storge 'simptab-favorites' not exist.", apis.vo ));
                return apis.defer.promise();
            }

            var max    = arr.length - 1,
                random = apis.Random( 0, max ),
                obj    = JSON.parse( arr[ random ] ),
                result = JSON.parse( obj.result );
            console.log( "Get favorite background is ", JSON.parse( obj.result ) );
            // verify favorite data structure
            if ( !vo.Verify.call( result ))  {
                apis.defer.reject( new SimpError( "favorite", "Current 'simptab-favorites' vo structure error.", { result : result, apis_vo : apis.vo }));
            }
            else {
                setTimeout( function(){ apis.defer.resolve( result.url, result.url, result.name, result.info, result.enddate, result.shortname, result.type, result.apis_vo, result.favorite ); }, 1000 );
            }
        }
        catch( error ) {
            apis.defer.reject( new SimpError( "favorite", "Current 'simptab-favorites' data structure error.", apis.vo ), error );
        }
        return apis.defer.promise();
    }

    /*
    * Holiday background
    */
    function isHoliday() {
        var HOLIDAY_LIST_1 = [20151207, 20151222, 20160106, 20160120, 20160201, 20160204, 20160207, 20160208, 20160219, 20160222, 20160305, 20160320, 20160404, 20160419, 20160505, 20160520, 20160605, 20160621, 20160707, 20160722, 20160807, 20160823, 20160907, 20160922, 20161008, 20161023, 20161107, 20161122, 20161207, 20161221, 20170105, 20170120];
        var HOLIDAY_LIST_2 = [20151224, 20151225];
        var arr         = HOLIDAY_LIST_1.concat( HOLIDAY_LIST_2 ),
            new_holiday = date.Today(),
            old_holiday = localStorage["simptab-holiday"];

        if ( arr.filter(function(item){return item == new_holiday;}).length > 0 && old_holiday != new_holiday ) {
            localStorage["simptab-holiday"] = new_holiday;
            return true;
        }
        else {
            return false;
        }
    }

    /*
    * Holiday background
    */
    apis.Stack[ apis.ORIGINS[11] ] = function() {
        apis.Stack[ apis.ORIGINS[9] ]( "holiday" ); // call special( "holiday" );
        return apis.defer.promise();
    }

    /*
    * Special day/Holiday background
    */
     apis.Stack[ apis.ORIGINS[9] ] = function() {

        console.log( "=== Special day/Holiday background call ===");

          var SPECIAL_URL = "special.day.json",
              def         = $.Deferred(),
              type        = arguments.length > 0 ? arguments[0] : "special";

          apis.Update({ url : SIMP_API_HOST + SPECIAL_URL, method : "apis.special()" });
          apis.Remote( function( result ) {
            try {
                var obj = result[type],
                    key, max, random, special_day, data, hdurl;

                if ( type == "special" ) {
                    key         = obj.now.length > 0 ? "now" : "old";
                    max         = obj[key].length - 1;
                    random      = apis.Random( 0, max );
                    special_day = obj[key][random];
                    data        = special_day.day;
                    max         = data.hdurl.length - 1;
                    random      = apis.Random( 0, max );
                    hdurl       = SIMP_API_HOST + data.key + "/" + data.hdurl[random] + ".jpg";
                }
                else {
                    key         = date.Today();
                    data        = obj[key];
                    if ( !data ) {
                        apis.defer.reject( new SimpError( apis.vo.origin, "Current holiday is " + key +  ", but not any data from " + SIMP_API_HOST + SPECIAL_URL, result ));
                        return apis.defer.promise();
                    }
                    max         = data.hdurl.length - 1;
                    random      = apis.Random( 0, max );
                    hdurl       = SIMP_API_HOST + type + "/" + data.hdurl[random] + ".jpg";
                }
                apis.Update({ origin : type });
                apis.defer.resolve( hdurl, hdurl, data.name, data.info, date.Now(), data.name, type, apis.vo );
            }
            catch( error ) {
                apis.defer.reject( new SimpError( apis.vo.origin, "Get special backgrond error.", apis.vo ), error );
            }
          });
          return apis.defer.promise();
    }

    function init() {
        apis.Stack[ apis.New().origin ]()
        .done( function() {
            var url = arguments && arguments[0];
            // when change background mode is 'day', not invoke vo.isDislike( url )
            if ( !setting.IsRandom() || vo.isDislike( url )) {
                vo.Create.apply( vo, arguments );
                vo.new.hdurl = cdns.New( vo.new.hdurl, vo.new.type );
                deferred.resolve( vo.new );
            }
            else {
                new SimpError( apis.vo.origin, "Current background url is dislike url =" + url, apis.vo );
                init();
            }
        })
        .fail( function( result, error ) {
            SimpError.Clone( result, (!error ? result : error));
            if ( apis.vo.origin == "today" ) apis.failed = apis.ORIGINS_MAX;
            apis.failed < apis.ORIGINS_MAX - 5 ? init() : deferred.reject( result, error );
            apis.failed++;
        });
        return deferred.promise();
    }

    return {
      Init: init
    };
});
