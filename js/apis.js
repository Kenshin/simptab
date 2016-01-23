
define([ "jquery", "i18n", "setting", "vo", "date", "error" ], function( $, i18n, setting, vo, date, SimpError ) {

    "use strict";

    var deferred      = new $.Deferred(),
        SIMP_API_HOST = "http://simptab.qiniudn.com/";

    /*
    * Common
    */

    function createRandom( min, max ) {
      return Math.floor( Math.random() * ( max - min + 1 ) + min );
    }

    function failed( jqXHR, textStatus, errorThrown ) {
        deferred.reject( new SimpError( "apis", "Call remote api error.", { jqXHR: jqXHR, textStatus:textStatus, errorThrown:errorThrown } ));
    }

    var origins = {
            "today"          : function() { todayBing() },
            "bing.com"       : function() { randomBing() },
            "googleartproject.com"   : function() { googleart() },
            "desktoppr.co"   : function() { desktoppr() },
            "visualhunt.com" : function() { visualhunt() },
            "nasa.gov"       : function() { apod() },
            "favorite"       : function() { setTimeout( favorite, 2000 ); }
        },
        apis = ( function() {

            /*
            *
            * apis.GetOrigin() and apis.New() Pairs appear.
            * apis.GetOrigin() update vo `code` and `origin` property.
            * apis.New()       update vo other property.
            *
            */

            var options = {
                url      : "",
                type     : "GET",
                dataType : "json",
                timeout  : 2000,
                method   : "",
                origin   : "",
                code     : 0
            },
            failed_count = 0,
            BG_ORIGINS = [ "wallhaven.cc", "unsplash.com", "unsplash.it", "flickr.com", "googleartproject.com", "500px.com", "desktoppr.co", "visualhunt.com", "nasa.gov", "special", "favorite", "holiday", "bing.com", "today" ],
            MAX_NUM    = BG_ORIGINS.length - 2; // excude: "today"

            function APIS() {
                this.vo = {};
            }

            APIS.prototype.Random = function( min, max ) {
                return Math.floor( Math.random() * ( max - min + 1 ) + min );
            }

            APIS.prototype.GetOrigin = function() {
                var code    = this.Random( 0, MAX_NUM );

                // verify background every day
                // verify today is new day
                if ( !setting.IsRandom() || date.IsNewDay( date.Today(), true )) {
                    code = MAX_NUM + 1;
                }
                // verify today is holiday
                else if ( isHoliday() ) {
                    code = 11;
                }
                // change background every time
                else {
                    while ( setting.Verify( code ) == "false" ||
                            localStorage[ "simptab-prv-code" ] == code ||
                            code == 11 ||
                            ( localStorage[ "simptab-special-day-count" ] && localStorage[ "simptab-special-day-count" ].length === 5 && code == 9 )) {
                        code = this.Random( 0, MAX_NUM );
                    }
                    localStorage[ "simptab-prv-code" ] = code;
                }

                // add test code
                // code = 8;

                console.log( "switch code is ", code, BG_ORIGINS[code] );
                this.vo        = $.extend( {}, options );
                this.vo.code   = code;
                this.vo.origin = BG_ORIGINS[code];
                return { code: this.vo.code, origin: this.vo.origin };
            }

            APIS.prototype.New = function() {
                var obj = arguments && arguments.length > 0 && arguments[0],
                    me  = this;
                Object.keys( obj ).forEach( function( item ) { me.vo[item] = obj[item]; });
            }

            APIS.prototype.Remote = function( callBack ) {
                var me     = this,
                    random = ["nasa.gov", "today"].join(",").indexOf( this.vo.origin ) == -1 ? "?random=" + Math.round(+new Date()) : "";
                $.ajax({
                    type       : this.vo.type,
                    timeout    : this.vo.timeout,
                    url        : this.vo.url + random,
                    dataType   : this.vo.json
                }).then( callBack, function( jqXHR, textStatus, errorThrown ) {
                    console.error( "=== Remote background origin error ===", apis.vo, jqXHR, textStatus, errorThrown )
                    failed_count < 5 ? origins[ me.GetOrigin().origin ]() : deferred.reject( new SimpError( "apis", "Call remote api error.", { jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown, apis_vo : me.vo } ));
                    failed_count ++;
                });
            }

            APIS.prototype.VerifyObject = function( result ) {
                if ( result != undefined && !$.isEmptyObject( result )) {
                    return true;
                }
                else {
                    new SimpError( "apis.VerifyObject()", "Current data structure error.", { result : result, apis_vo : apis.vo } );
                    origins[ this.GetOrigin().origin ]();
                    return false;
                }
            }

            return new APIS;
    })();

    /*
    function initialize( code ) {

        switch ( code ) {
          case 0:
            wallhaven();
            break;
          case 1:
            unsplashCOM();
            break;
          case 2:
            unsplashIT();
            break;
          case 3:
            flickr();
            break;
          case 4:
            googleart();
            break;
          case 5:
            f00px();
            break;
          case 6:
            desktoppr();
            break;
          case 7:
            visualhunt();
            break;
          case 8:
            nasa();
            break;
          case 9:
            special();
            break;
          case 10:
            setTimeout( favorite, 2000 );
            break;
          case 11:
            holiday();
            break;
          case 12:
            randomBing();
            break;
          default:
            todayBing();
            break;
        }

        return deferred.promise();
    }
    */

    /*
    * Bing( today )
    */
    function todayBing() {
        console.log( "=== Bing.com today ===");
        var local = i18n.GetLocale() == "zh_CN" ? "cn." : "";
        apis.New({ url : "http://" + local + "bing.com/HPImageArchive.aspx?format=js&idx=0&n=1", method : "apis.todayBing()" });
        apis.Remote( function( result ) {
            if ( apis.VerifyObject( result )) {
                console.log("Bing.com today image is ", result, apis.vo )
                try {
                    var data = result.images[0],
                        url  = data.url,
                        hdurl= getHDurl( getTrueUrl( url )),
                        name = data.copyright,
                        info = getInfo( data.copyrightlink ),
                        enddate   = data.enddate,
                        shortname = "Bing.com Image-" + getShortName( info );
                    deferred.resolve( vo.Create( url, hdurl, name, info, enddate, shortname, "bing.com", apis.vo ));
                }
                catch ( error ) {
                    SimpError.Clone( new SimpError( "apis.todayBing()" , "Parse bing.com/HPImageArchive.aspx error.", apis.vo ), error );
                    origins[ apis.GetOrigin().origin ]();
                }
            }
        });
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
    function randomBing() {
        console.log( "=== Bing.com random ===");
        apis.New({ url : SIMP_API_HOST + "bing.gallery.json", method : "apis.randomBing()" });
        apis.Remote( function( result ) {
          if ( apis.VerifyObject( result )) {
            try {
              var images = result.imageIds,
                  random = apis.Random( 0, images.length );
              getRandomBing( images[random] );
            }
            catch( error ) {
              SimpError.Clone( new SimpError( "apis.randomBing()" , "Parse bing.gallery.json error.", apis.vo ), error );
              origins[ apis.GetOrigin().origin ]();
            }
        }
      });
    }

    function getRandomBing( id ) {
        apis.New({ url : "http://www.bing.com/gallery/home/imagedetails/" + id, method : "apis.getRandomBing()" });
        apis.Remote( function( result ) {
            if ( apis.VerifyObject( result )) {
              console.log("Bing.com random image is ", result, apis.vo )
              if ( result.wallpaper ) {
                var prefix = "http://az608707.vo.msecnd.net/files/";
                deferred.resolve( vo.Create( prefix + result.wpFullFilename, prefix + result.wpFullFilename, result.title, result.infoUrl, date.Now(), "Bing.com Image", apis.vo.origin, apis.vo ));
              }
              else {
                randomBing();
              }
          }
        });
    }

    /*
    * Wall Haven
    */
    function wallhaven() {

      console.log( "=== Wallhaven.cc call ===" );

      // wallhaven background ids
      var wallhaven_ids = [64346, 103929, 12852, 115399, 26623, 101496, 5527, 118585, 102569, 116915, 118993, 6352, 6873, 53356, 10017, 2042, 69737, 113377, 11706, 5168, 16270, 51579, 72375, 156241, 9832, 56481, 6693, 34887, 159465, 6413, 2986, 43537, 6361, 440, 396, 4389, 1784, 6072, 1769, 10694, 3507, 3335, 57239, 1148, 65146, 1045, 852, 7338, 154446, 102924, 354, 7115, 22629, 937, 1212, 26797, 4929, 6463, 26326, 1438, 64115, 395, 800, 1346, 6759, 799, 153883, 1942, 13072, 74098, 3866, 6448, 2987, 4914, 1874, 10568, 152693, 33560, 5269, 8463, 15403, 1926, 92, 124411, 2481, 12421, 110001, 51777, 18395, 4723, 7599, 809, 44628, 914, 819, 157024, 60284, 61, 2018, 5087, 6797, 9424, 391, 9349, 138624, 21821, 2540, 102549, 3065, 561, 1123, 4027, 4764, 22721, 4026, 725, 98217, 909, 28975, 1038, 22301, 7837, 6689, 33390, 1027, 7730, 1194, 367, 73294, 6990, 15899, 31275, 4126, 18392, 13468, 6465, 6416, 21068, 4869, 10524, 1107, 7686, 102435, 6066, 18337, 26481, 397, 33660, 6881, 2651, 1116, 6692, 51501, 60122, 4129, 11824, 19052, 11779, 3236, 4063, 5206, 15859, 29165, 100584, 7883, 5368, 12001, 13554, 2112, 1177, 14091, 50083, 102428, 67027, 70532, 598, 107498, 9680, 1190, 16426, 14, 32935, 21041, 143053, 4653, 6457, 6469, 14598, 22926, 5734, 1896, 12822, 52603, 12690, 7113, 12754, 17773, 110824, 16086, 8079, 73291, 164830, 5603, 11521, 33002, 18321, 118264, 141343, 3345, 5276, 30215, 56165, 6360, 26607, 24911, 31175, 93783, 7162, 849, 13973, 22998, 2897, 9906, 16687, 18709, 2197, 727, 56825, 13117, 105033, 151619, 5648, 21124, 390, 1180, 12781, 103248, 12821, 22469, 76442, 3020, 157, 13623, 81327, 2648, 17708, 99124, 28128, 10459, 2574, 3332, 19882, 2099, 19092, 106937, 146159, 14612, 536, 7843, 12427, 6876, 9035, 14190, 16970, 40859, 52526, 8196, 812, 99496, 3344, 4657, 13997, 24362, 108103, 851, 7505, 51126, 4862, 845, 10774, 5696, 13003, 27415, 45880, 149047, 12687, 102502, 28800, 6695, 8088, 13713, 4430, 107471, 8110, 33557, 1014, 7961, 13120, 18935, 31355, 10823, 4153, 6678, 6173, 7900, 13551, 82544, 16149, 2090, 13463, 15192, 30760, 5974, 51583, 69694, 154038, 165768, 13748, 28343, 32786, 60597, 19133, 9012, 16611, 101980, 560, 8440, 15708, 10695, 104618, 131692, 4804, 31274, 33408, 34761, 910, 2145, 13094, 53325, 59867, 107019, 159224, 8987, 11806, 1152, 3153, 38641, 102539, 13112, 126849, 3104, 13118, 29381, 51581, 40786, 154036, 232, 4901, 6875, 5536, 9709, 148270, 13739, 810, 2088, 11866, 9589, 10748, 22414, 34969, 67030, 2184, 4871, 4922, 7945, 22415, 28348, 31055, 38760, 56755, 65472, 99642, 157564, 20212, 7674, 29854, 16046, 148437, 56179, 29051, 7679, 2182, 29158, 26394, 52654, 43850, 28000, 28182, 32715, 32998, 4925, 5598, 12779, 16170, 52681, 115635, 105059, 34091, 55984, 73804, 70730, 76911, 141991, 156705, 21074, 6454, 21121, 45227, 102545, 17687, 69347, 47212, 25439, 3002, 70732, 154047, 142573, 93556, 3983, 5782, 9443, 24754, 25524, 19546, 21065, 88046, 115381, 139800, 155438, 119054, 140504, 106741, 34317, 509, 6351, 9437, 54764, 54416, 107497, 101507, 140670, 153983, 154633, 152771, 1185, 4944, 803, 808, 6706, 10825, 24686, 22306, 56482, 74395, 86566, 45389, 56792, 77363, 102498, 102537, 64132, 101426, 167125, 41060, 3513, 8599, 5742, 22302, 140, 19119, 28886, 29187, 35507, 36219, 50079, 63882, 72693, 76070, 133209, 153923, 81656, 52514, 6359, 6688, 28438, 1121, 72461, 92983, 9769, 1437, 3053, 5744, 12862, 11838, 28340, 33779, 72734, 132176, 20260, 34603, 1178, 4881, 4968, 3047, 9711, 9824, 10280, 18342, 56417, 68328, 87809, 118569, 131631, 30752, 93452, 156437, 138315, 159296, 353, 959, 3365, 12826, 13122, 6922, 9034, 4654, 5195, 10755, 19536, 43910, 92967, 154172, 10882, 2312, 6738, 8683, 3025, 13589, 13882, 14551, 11778, 16499, 10941, 11103, 26501, 45289, 53321, 68351, 101357, 5379, 8234, 57645, 79271, 51585, 468, 70371, 72182, 141518, 41151, 113423, 43075, 907, 919, 1305, 2000, 9708, 28643, 18315, 57798, 30927, 10758, 41289, 66434, 103247, 114383, 153848, 152410, 145410, 165672, 24421, 34273, 8580, 8073, 12755, 12870, 14054, 16238, 65470, 62851, 115616, 126567, 142633, 159412, 152536, 77583, 559, 101792, 3353, 14574, 18386, 32297, 6528, 9919, 10394, 35967, 94848, 102638, 120488, 139927, 137729, 73551, 166014, 33029, 4523, 9681, 9910, 21296, 21847, 20231, 2089, 2798, 12889, 13604, 11653, 18368, 25522, 28204, 33392, 102533, 128635, 159414, 152792, 143664, 24822, 10009, 40963, 60125, 13566, 26653, 31289, 27310, 27757, 32960, 1998, 569, 5072, 15194, 68340, 66762, 123787, 102541, 32744, 132151, 58663, 6867, 1944, 2322, 12848, 16597, 10481, 28794, 18365, 27013, 62470, 56478, 32808, 33154, 71642, 83685, 105813, 164744, 129914, 11206, 114989, 18601, 132284, 1937, 56480, 31172, 30201, 34968, 43349, 821, 883, 2448, 2936, 3371, 11803, 7405, 13138, 19270, 16043, 16187, 64345, 106949, 98577, 144247, 77653, 31166, 157694, 60209, 13758, 815, 2052, 2095, 13557, 13603, 16169, 7812, 6674, 8442, 8909, 9786, 35258, 35347, 33358, 51076, 72907, 68331, 71656, 70994, 90625, 62294, 60926, 99002, 92917, 101680, 140044, 164950, 165674, 148916, 10914, 137402, 4720, 21335, 1997, 13565, 11862, 12000, 15636, 15706, 31764, 29341, 33405, 36644, 40962, 44868, 52518, 50980, 49116, 66747, 69621, 72600, 84958, 80519, 107451, 124145, 157848, 154003, 152665, 73379, 33556, 43311, 45278, 56511, 49922, 58682, 65132, 6525, 8444, 10980, 11515, 26177, 25181, 29102, 4877, 15860, 22295, 78508, 76913, 75509, 106149, 107729, 157279, 154251, 5363, 10752, 51908, 546, 1641, 1918, 3027, 3868, 5085, 5799, 12855, 13579, 13745, 15169, 14159, 10392, 10397, 26200, 34753, 33370, 51447, 74172, 74401, 10587, 19628, 41157, 42713, 43843, 68377, 98158, 133270, 149051, 144582, 164523, 62569, 20233, 12778, 25520, 22805, 20289, 31779, 32789, 35252, 38011, 45890, 48616, 47199, 1205, 1743, 2001, 5086, 2796, 3028, 3155, 11808, 9704, 13556, 14307, 15261, 18328, 16738, 16055, 56145, 56486, 73226, 70746, 70373, 81325, 107447, 101494, 114911, 117218, 153801, 158971, 155972, 77728, 840, 59985, 31849, 19554, 283, 916, 1939, 1946, 3346, 14219, 19207, 16594, 31206, 27262, 5962, 12232, 5169, 34813, 36511, 33548, 34180, 54727, 51906, 74737, 72591, 75115, 43004, 58368, 80171, 98991, 101022, 140638, 132180, 156161, 156250, 153547, 52447, 7510, 3405, 10427, 6207, 22782, 22460, 2060, 1005, 12841, 12923, 13591, 10693, 26392, 27294, 24644, 28925, 35521, 33563, 40366, 56469, 63762, 59449, 90049, 101561, 114920, 142394, 72701, 69619, 52525, 70736, 58364, 11223, 1207, 43602, 51578, 60954, 7193, 12842, 13737, 8451, 9372, 10480, 29018, 29203, 29392, 975, 3247, 4411, 16091, 24018, 19502, 37441, 37612, 65238, 68333, 85825, 107515, 103227, 133250, 133527, 137726, 147489, 149050, 158772, 153986, 154035, 155970, 157654, 41529, 20179, 22411, 6468, 2012, 2315, 3318, 3356, 3534, 5155, 7430, 13923, 18310, 18346, 59989, 36254, 31348, 52673, 54092, 68372, 71041, 87517, 111740, 154303, 147048, 117921, 19535, 19821, 31185, 40939, 33415, 34038, 38225, 42447, 45352, 2013, 2284, 6755, 12008, 7448, 13520, 13811, 13842, 18455, 19129, 16601, 54694, 51431, 51582, 51671, 64371, 68443, 73947, 69561, 79786, 85930, 86053, 86250, 93558, 86419, 107500, 101146, 115370, 118994, 127298, 141003, 141508, 139041, 142602, 144026, 159284, 158034, 101019, 106918, 104657, 169618, 149216, 82436, 30884, 144920, 93, 1996, 3315, 12751, 12833, 15159, 15534, 19252, 16746, 32305, 29061, 9027, 11760, 12294, 12314, 25730, 26194, 26593, 22313, 35018, 55511, 51588, 53349, 54400, 49196, 72197, 88606, 44127, 47210, 65077, 78304, 98838, 107450, 104639, 105005, 140486, 154723, 158035, 80063, 8480, 161778, 67028, 113421, 117308, 59025, 5847, 4509, 4864, 4876, 3049, 3063, 811, 13084, 13731, 12271, 26188, 26633, 27218, 28502, 31168, 31682, 34489, 44596, 54735, 58597, 59665, 90099, 88587, 81839, 75793, 101287, 106686, 111628, 114564, 132179, 140564, 164951, 157709, 159293, 148777, 132174, 106112, 30886, 54700, 52196, 53733, 54363, 63756, 57716, 57785, 62885, 5654, 8588, 8886, 12361, 27295, 32977, 266, 4752, 16089, 18662, 22719, 35705, 36816, 34137, 34308, 34891, 68352, 87681, 87895, 88468, 83381, 85178, 107875, 101500, 115121, 120358, 141695, 139138, 138868, 138969, 149810, 154174, 164469, 26329, 2509, 143658, 78971, 30801, 363, 6451, 4912, 5357, 9126, 12797, 12999, 15652, 11686, 28009, 18322, 18663, 25219, 60013, 60741, 36329, 51365, 51428, 52596, 74386, 74519, 41006, 72450, 87137, 85953, 85078, 93355, 98470, 107453, 141773, 164679, 154043, 154125, 2461, 15164, 106234, 69844, 34309, 88837, 109308, 160730, 35876, 64654, 137025, 10448, 53683, 137330, 43627, 46695, 98634, 49454, 54275, 46621, 40635, 134557, 56896, 79456, 103141, 72602, 42314, 31355, 44877, 169035, 146158, 7567, 4126, 62487, 55747, 145376, 45870, 145434, 32029, 53359, 113188, 33452, 42446, 6660, 22366, 73035, 65094, 113323, 58400, 108968, 74850, 72880, 150661, 58020, 95750, 116733, 93502, 66422, 45882, 71318, 140643, 79456, 145922, 18670, 44339, 56858, 19894, 37043, 153141, 137133, 69279, 25375, 3289, 58164, 4715, 145282, 139874, 123729, 134055, 94168, 53802, 53703, 137319, 65361, 59901, 38750, 8587, 85843, 35124, 811, 45983, 96082, 124145, 51452, 148471, 160353, 25339, 162222, 43175, 99301, 8616, 51240, 108219, 117128, 62062, 162241, 139517, 113102, 40607, 52619, 46249, 147433, 147860, 6862, 8436, 9434, 136607, 140064, 36480, 58640, 24829, 115858, 86571, 147432, 71034, 131363, 130310, 15376, 21909, 76361, 65429, 107833, 54854, 117556, 60939, 9522, 103531, 92160, 44144, 3005, 161184, 161792, 98415, 865, 66210, 42683, 101366, 38429, 101725, 45096, 29095, 93, 36079, 23831, 79597, 137414, 47568, 135692, 124361, 140845, 164809, 46270, 59573, 167125, 69878, 45298, 163984, 120298, 60895, 104527, 44868, 109375, 138927, 48535, 163698, 157881, 142579, 98603, 33372, 95582, 27678, 30888, 45152, 147788, 42696, 19628, 132488, 116478, 24573, 151419, 165874, 59530, 9015, 38741, 3227, 152491, 134564, 162269, 52250, 52260, 44555, 95748, 81663, 72582, 97040, 8116, 44994, 120820, 34650, 53271, 56992, 41909, 84530, 134461, 135497, 2649, 11009, 101477, 59254, 99778, 84042, 47410, 103203, 100308, 116881, 53173, 47429, 43848, 160730, 73128, 93804, 137554, 33654, 90940, 149638, 73758, 164812, 56478, 168629, 45957, 129646, 137151, 138623, 155106, 150986, 48975, 8474, 45634, 38120, 45168, 45863, 17264, 116705, 168459, 59193, 60515, 110460, 123774, 164566, 133842, 98996, 152798, 120339, 124145, 162486, 56783, 35857, 139138, 52002, 127986, 107028, 99731, 46234, 164824, 10181, 65651, 54420, 47075, 14, 89585, 138225, 149335, 145943, 51165, 62125, 122568, 138558, 84815, 159562, 81646, 134425, 112512, 28921, 18863, 76670, 169015, 62963, 136328, 148762, 116637, 128829, 13926, 131759, 46394, 54426, 152927, 47110, 136591, 162638, 46066, 128005, 56844, 73188, 72796, 104345, 47553, 46128, 135779, 137190, 60299, 22953, 51989, 17265, 44535, 61135, 76133, 144828, 52017, 31466, 112336, 75216, 120316, 106465, 121018, 35330, 73122, 126988, 114324, 74792, 25232, 45014, 125647, 133932, 116978, 70093, 46111, 11863, 101938, 137532, 84846, 153742, 26068, 107977, 110086, 139075, 98601, 60190, 57254, 2912, 137331, 43026, 110463, 88215, 59307, 21918, 116583, 78991, 46261, 44723, 44923, 83550, 51070, 118598, 47711, 8452, 34876, 80993, 142673, 88864, 18934, 98391, 46124, 108004, 59014, 122508, 41654, 52196, 32825, 82740, 13998, 61806, 133045, 11222, 41319, 32626, 27696, 62304, 157848, 52990, 111656, 34430, 49203, 116475, 40635, 85129, 137497, 36496, 126309, 120329, 42796, 59257, 46359, 90159, 54758, 129507, 106025, 135690, 142702, 110206, 5370, 41961, 114050, 58029, 79276, 30346, 10149, 63815, 44214, 8055, 106036, 43903, 48904, 4756, 79101, 163872, 3053, 31811, 47732, 41383, 75727, 40700, 1438, 55855, 163368, 120947, 107881, 90229, 138071, 138635, 92972, 145888, 32569, 52102, 77445, 27466, 49384, 112962, 135301, 56898, 22609, 58529, 79043, 43283, 41121, 25357, 131673, 73701, 36255, 10545, 72700, 9014, 61650, 95745, 27126, 44463, 146896, 161163, 106257, 26336, 148696, 141682, 34176, 137616, 4725, 54310, 121399, 127885, 100509, 48451, 55779, 72375, 164102, 110160, 44514, 134692, 47407, 47573, 88595, 124200, 52531, 20177, 82649, 18133, 127754, 59602, 53268, 170541, 61660, 75572, 62394, 14751, 17765, 40317, 53820, 123414, 146033, 48090, 112378, 109750, 108803, 107154, 115637, 64046, 145894, 164733, 145068, 37550, 94620, 47707, 72588, 138627, 10709, 47677, 167173, 161988, 52054, 112932, 54096, 24019, 135141, 17794, 49809, 77183, 19885, 57899, 75115, 54053, 121092, 146916, 66401, 48429, 2931, 44968, 165685, 43307, 41028, 11161, 40275, 1003, 104059, 10413, 83771, 86992, 83781, 48389, 32548, 67038, 137005, 29847, 124417, 54768, 135245];
      try {
        var max    = wallhaven_ids.length - 1,
            random = createRandom( 0, max );

        var id     = wallhaven_ids[ random ],
            url    = "http://alpha.wallhaven.cc/wallpapers/full/wallhaven-" + id + ".jpg",
            result = vo.Create( url, url, "Wallhaven.cc Image", "#", date.Now(), "Wallhaven.cc Image", "wallhanve.cc" );

        console.log( "Wall haven random: " + random );
        console.log( "Wall haven pic id: " + id );

        deferred.resolve( result );
      }
      catch ( error ) {
        deferred.reject( SimpError.Clone( new SimpError( "apis.wallhaven()", null , "Parse wallhaven error, url is " + url ), error ));
      }
    }

    /*
    * Unsplash.COM
    */
    function unsplashCOM( errorBack, callBack ) {

      console.log( "=== Unsplash.com call ===" );

      var unsplash_ids = ["1AJuWRBOsy0", "xA81cF8HXf0", "jIdKrtJF8Uk", "gtVrejEGdmM", "GLBWw7i-7NE", "8VjYSSZDogU", "1eWaod96d3k", "pUtvoAi6uk0", "KSazKUB4T-Y", "dzMn3A8qOZQ", "3XtR6s91s2U", "d8IPvipdj1Y", "V1n5dm2nb_A", "yWfaTjg-FkY", "mXKXJI98aTE", "zUf0Qxlr1GU", "mblYxasm0nk", "-u-utDdi6m0", "dfZbts6B4yw", "88AA29AtE20", "R-wqegECgnk", "fkYugzeEDZo", "adK3Vu70DEQ", "dSM6qcdS7Hk", "fG2MyjWSi_M", "55xd_uiUYEE", "sSOYgATAEUo", "VEfYYt52aq0", "1T3ptCxXPoo", "EllEJmI6DQY", "J75SjdIvfoE", "vESAH7cwMzc", "b-YmNNAxcYE", "c2zW83d1XU4", "0qQ3x5yJcqw", "eIXu5GIA5DY", "ZXVk-NMWtgg", "ZTvEkHPacVw", "Z7BG_PJF7SE", "Eydo2lQNfgU", "hOsseR_14RI", "y3aP9oo9Pjc", "0h9LsnY13Hs", "XIiUlMLbRpU", "DR7l0jeVrZo", "-bH_SxERgTA", "yUjM1jV5obM", "kt_s46DVgJA", "Evb5GA0181k", "WUu5CX-u-L8", "XmqsrSq63q4", "EeEx8zpOESA", "AxtuAnUH30A", "UCmkmGxuWX4", "CF4c2GAker4", "oH9AuO20kbk", "8G5DLKTadEU", "l9V-_4Wgm-Y", "DQdDD3iwt2I", "Wr6oZkkDaMw", "SObei4GJ67w", "s9SastuAtOs", "FGvRZ-BeCKo", "BtHvSO18jyA", "xiO8ZW8j6kM", "BeIvjuz6k2k", "RvmFyFBHv-A", "4qt6g8Aabcw", "2ukwrvTOVws", "75nbwHfDsnY", "F3uyey6ours", "q_GGj9RnOVI", "CH4AVMDbr4Q", "gNd1IruMzbQ", "DsQmBlbywJ8", "ZpE2gobovro", "TsMXK2W9hV0", "9QfoZ57x0G8", "fRiS3MPfwh0", "MYFVFOS3JEE", "bp8Nw_Q11gI", "FHWgQiTZJ0s", "n1VrKpWm81c", "3sQ7xlbaqZw", "AsQs1AziQD4", "kKz0oym0XpQ", "ULr8dMN6yDY", "QeVXToj_JC8", "hnYMacpvKZY", "whqHBbiC7tY", "8RoewsKCZp8", "reN5mn8nEgw", "2Qm47LI0W1c", "FRU1rqqYErY", "5yOefHJEaGw", "TiDl4gF0GOw", "7vGOt_hKU14", "lN-Nji2woGQ", "tEpxdOOdq8k", "pTelAscogBg", "5rLNjdKZMsI", "MbzbYxspcGc", "VUcFGFC_uMI", "CrzLRM33Wes", "pb_lF8VWaPU", "N8Qlw1gi4rA", "sfXgg-7Df0A", "b5POxb2aL9o", "3GnUYcgNiwU", "EnaKGQNeC5w", "vD3L-rN_qNw", "l3UCID63AmI", "Pi1l-GWfz6Y", "AuL8-Yysf5w", "CND1MBxLA6M", "0WQOCx1g8hw", "UNGT3ZLVci8", "Bo-_-yiNWvA", "p4UeO3EUWaI", "btNWFn51wH8", "gQpZtcDtTNE", "L_2pv2k0bRY", "dxZfq6Xuz5c", "5ulmc8IHdLc", "SpVHcbuKi6E", "RokFUDqlTIo", "hzS9p8T44eI", "hL_kvhBmTUI", "d-oQ-JvPhR4", "NuRmPg9_i7E", "EKy2OTRPXdw", "02f3KC3zKPk", "b6CDvhSMa0s", "IHJ8K-xp868", "qEX3m9An2hc", "Htzv8TQYmcs", "JSmc0GmSV1o", "6b4TNvTrwOs", "lFyVK9ZfxI0", "xOUs1VJnIP0", "mzTACHAuqeQ", "aWf0vy3iJfk", "uLMxmuVuOsQ", "0NRherR9Xq8", "eHjlb1K_XTE", "iU25xH2wEDY", "YcGrIBKVwxU", "upr4AeekT44", "BZW67ux31KU", "gRHbsBbc2dU", "vGQ49l9I4EE", "N9oUbXuEYjA", "tz3gzTDhVhE", "NvArrqz2cmA", "L_Pvnw-t3ds", "T3xxtPi9Nig", "KHw4qjr3sfw", "ex3_p02EMho", "_hsVU_-QX5w", "4NStvdfceeA", "rnRN0Tzpb1U", "CWICo_oEuis", "7MGaw--_kwA", "zcWRhtwhkYw", "6vWD_xnzPuU", "HefnuyFh2Yg", "TXnkB50LDyQ", "KxWdfIgQTUE", "OI90CtimdoE", "tRQfEwP5P_0", "p0W9Q9gei4g", "l3rk6IPUBw0", "8zbyNpU0Cxw", "mHSjIU0lL7Y", "CRJofa41q3w", "tY1QwoLAJQ4", "1Fm_k4Ip7jM", "d62lX9dMmDY", "tH_Xnq_VFQM", "jA3o5qlmI20", "nPFnROT87Jg", "keXmxXyFhBk", "KAsjiTRuihk", "kOzME3YfXXI", "YQ3FpeQkNhA", "K7bXy6t76hg", "loYUuLdLcPY", "KQvFT4xc-gQ", "xV8uGe9gd6k", "KlkS0cpFjN0", "Slh0Tx1MRNA", "d3OaAYs30tc", "zfI-h2dsFg0", "wYlULD0mqOM", "OxTT6kZs_gU", "R4VdoYeJeOQ", "1n8G2GkeLLE", "o-34NPugMNo", "wzj86-5JVcM", "igZNMKIIkrU", "PW2A_X_aXn8", "U1bcWS822MM", "uYp6ez9rNL0", "WE7nMfgqG78", "YMVGhdhEgLY", "fQGWykCu0Cg", "3oz45HxQggw", "8V8qCIIo554", "9dUrE0YEcRg", "LsfaT2Uoikw", "3JZeW3rtg6E", "yPowDntYoSU", "poNsj-vya34", "FrhpTKBreiU", "ILO-z2bnjk0", "RthruPqSb2k", "uLDmm65P5ZY", "E3I9thV98kQ", "0tpSvZO1o_g", "KHDeVpytLuU", "Vk_Y-QeNBYM", "aDanGyjmk_4", "pc9rCLausWQ", "FZeiyMSWsn8", "b0Q81UExLes", "VTcWhMomXj8", "Pm0ragLTPqY", "A_Ck6iYhEWU", "RW7TrDwdqpk", "c6h9mwoeT4Y", "nS5lXMlY8Fw", "G9mObLK2_SQ", "St_q46vf6s0", "zDEy_rlUkt0", "E1Ii5QpMQnk", "0Sy4gfZ2RXU", "iOdOkX1yCMM", "g0OT8TogXng", "3Oa0b0TF8tg", "cynn7cTgOCU", "wU4YomwcBRY", "ka8xTk3KMw0", "ybLxw2zEdR8", "LmSqnyDnCys", "4vCJdtUz9lk", "CtA7F7BwT5o", "Jrq230_IxMQ", "AZW8IbilGLg", "S1VI9rYWcic", "cKXfU4zetTg", "P6BxykAOnUA", "vr7TrkO88sY", "oQATbDMmxs8", "tzzEaJqBrBY", "vYA26NaRUls", "ILz31HBGEak", "wvO5c8PC3C4", "OGCH5Y0TazQ", "3eIXF8DFpj4", "iJu4dDmkuuk", "rHbob_bEsSs", "OAVRFaEo8qE", "KBNJ6wb7afg", "fBwyKbLqXE8", "tBtuxtLvAZs", "BckPaTv1RZ8", "pgUbpDLJh3E", "mAXVJVL0fn8", "NaaiDPPlXwk", "L8zmeFh2cAc", "z9EktK0kOjo", "fX1_vECihxU", "_w-TB-ZTBg8", "Wq4n6XQy1WY", "AyA7E20jBfc", "uiYPlABvWBM", "kT0tsYZ2YE0", "trvELSvNZoY", "Iki_XCKZhZ0", "wVK0ypTn61Y", "UB7YmsJTEvE", "gIrvhDFuDn0", "R48wwQWMt5U", "tNDvFkxkBHo", "mxaZ98ZYuIs", "eks1LVT58YQ", "mCi5I1isjaA", "vzPNVhnI2lE", "b7NQpOi207o", "t026fufWMhc", "lOZiOalU72Q", "Y_wz_QfQI-g", "DEdM9Vs6s8w", "V4zTqi8ECAo", "t0vXLDIwzWU", "VNsGywdphUY", "ZPQE4XssoBc", "zS1kn5DQm1M", "Wvas_uTO8wQ", "m0l5J8Lqnzo", "7APp1f_1B_s", "uUVkzxDR1D0", "vGtbF7XrfBw", "SxxY9uDpdl0", "CfpLImY1bLs", "muFaKaGw0eE", "eyJdbBIk7lA", "fqmrAEiye1M", "3MYQiktXXWE", "O_2su9gk2iM", "H0KhQG_wIL8", "RP4CF5J7qsk", "R5gRnZC4iio", "Z5qD8T3wVvk", "-icmOdYWXuQ", "DKPoxMfWy6M", "7uNxRUJ_ps4", "9_f8nPHa0oE", "VrbWKfe4ZwM", "cuaxqIA_pk0", "24bzOuENxHc", "f689QxNIciw", "MfCoCQP9isg", "PdnseHuDFZU", "9xAvbCVi-Nk", "DQkKMtLXJMU", "HnwKKk5pG_o", "zM5oPxrxTqk", "6YXXCDTqTbk", "c0h_DAHBY1I", "lRcxYIz0Pc0", "CPT_-dj5AJU", "ivMcopgNpSk", "28ztKXfneYk", "cH5jDvYXwBo", "ISKDP90vvgU", "4ORkIHJWaf8", "ScEKf8u7y-c", "s_Sb3d12CuY", "ZMBYnaJVvzA", "Hz_9gPM24z4", "Q4GnBpL2Fis", "oefq_cJKFDM", "I2vGS2AmepY", "oUXw17VRdFM", "qpf2glK0bAA", "IaViN3YChtk", "kFxWDfj0pD8", "bBKVrH0vzB4", "VPnvh8vj7lc", "Tq4YjCa2BSc", "eeNTQstnqtE", "nuGsDCyJ698", "HXHdw07EeGU", "VhpDAKvVA-Q", "IHctIAJK7aw", "dg5KvcVv7tU", "B2KgTWnNBd4", "bA68bHUS9mA", "JN5bfjt82so", "3KvUOPVrrQU", "s2gBtAtX9XE", "T4wso6sVAaA", "tXYg4Zx7kSU", "7mh-czWZRsA", "_nXU1zvW0L0", "j1bpuXNvHhs", "Yvl081TVnvA", "k0SwnevO_wk", "mqyMjCTWJyQ", "VxtWBOQjGdI", "NjT4O7WYmwk", "lKYiVkSaFtw", "21E250I-QlQ", "9dIHG8pXuW8", "PIQCA1ReSgU", "U0De088vFiY", "M3mxw-vol0o", "Hx1vZR1Hwgk", "bIQiMWxX_WU", "YNDE1snEmAI", "f-BENlcHFrA", "cNvu9MGEMsc", "8qefz4-4Y_w", "1fyccRaS_u4", "mAjtqOUIu4g", "g6rEfKZY5VI", "nJxJokIWRhQ", "NMLstDcJLhs", "GUaVQ4sq9dU", "cYLEvnQSsHU", "cECGm77p2_I", "ARg-vJj6Tdg", "NyGlFaryqsM", "S01HL-KuvGw", "JV063WPzq-8", "rewyZqUwAqY", "USdqeGr6P5U", "uGtdjBMK28s", "bJBXvZ--uyc", "zWtxLpSHfxw", "SDsosT_RRPk", "7oqtXOc5p_g", "FkjsBSUCpT4", "ErJPS9udHgA", "5vjZfi0Jxjs", "fLo_3UX_XT0", "tzDMeyKUbOo", "JYE-sR2sReQ", "6-RhsUzKO6g", "LcEU_t6UCpU", "xabrCXIPghw", "qm3nnbaBl_4", "2PzG1FOGyro", "ZN4kAJEDx48", "yAbzN0llHI0", "RlYsCMbF6EI", "02zAwvNEBpY", "RA9wAB_fFPU", "_r0mZJ5QjXU", "i2KibvLYjqk", "wcHCzgo0_mQ", "oLU4_n6c2CY", "I51HSIo8k-4", "WGzSS14N70k", "3iG78fKMeAM", "IaylNkTlGR0", "GYt6khO6-xA", "Y8G4lvGbK5Q", "TZJuqnkI3uo", "xapxF7PcOzU", "PvyfCGpUXSQ", "_aKgzvKD5lo", "5kSVDnCVLDg", "MvjO-aMRwkE", "k5zv-Hv4Kpc", "gk2WvQYnxlY", "Bq3P98-J__E", "nBoPjadlesc", "YIN4xUBaqnk", "YcCTVdhPiw4", "GAo4pixjQpA", "yGVNt1Aqpp4", "6r8Tapojvrc", "5ZDSS9pLbgE", "WV6Fg2Tlbk0", "yh7oTM8tzBc", "cEpQp5Foev4", "Dpv4yCZKFG8", "UDa5FrOWgQ8", "aGmGLe_06OM", "PyT4RLY71Fs", "K2SXdKPEhcg", "fdvTTpkAKkY", "RfY1OQqlT3U", "LCPUm3qTExU", "Rcsa_Rg77Tc", "Iv_FGYnhtS0", "-YYSC6kwPF8", "I2NgqxwVWrY", "2_F8_vP-_Sg", "ht9aLtovtSo", "n9WPPWiPPJw", "a9nu_KeLdm8", "SSkotYxE6sA", "39f997mmLvQ", "OrgLz7cjFIc", "cfyTzECvjlU", "18IuER9udWc", "h_ovfsRi7pk", "Z1W0A7t3kMo", "G3yehBKxcMM", "ZmBnq7ui6mU", "fjW-P39wtx4", "gm3bxHin8VA", "Ub6-Ws5Q4-Y", "EvX8-J2ClMo", "Bu5C7TkHFGk", "DlCr9IujpJI", "59wBmsbP1lM", "3-GJbCcXbik", "Fop857s5Atg", "Cs4T2qo2dDA", "lfaS0_iAW1A", "Kdzvn6UxYkM", "oUhr-qMTJoc", "6B9jVfW2lwg", "5CpaOSMWLdQ", "-rYZO4_JPEU", "9CV6WrxxdrM", "rFBA42UFpLs", "HD59qn_9yA8", "RduE7aSO2SA", "Rfflri94rs8", "OiiThC8Wf68", "XKHMpi6Ait8", "qnU38GrMUgQ", "hs0poZXRgmQ", "9VGA2xozqmo", "OP2EQ5g-Zkw", "TMOeGZw9NY4", "GANqCr1BRTU", "L3FX2-RXkCI", "12rzbJhQ89E", "CIUzRY23gXo", "WpNe4QRrl14", "3rF6lSO-Vwc", "klXhDG8Roj4", "zSpc1dmmWPA", "xuN4ZvsiamU", "zxKjRBn1wuE", "ZpeCkOiiQUo", "GoKXJaQoLQs", "ZqzueD4rfuk", "3pagydwiHC4", "K7ngmPmTmvA", "7YUW7fvIYoQ", "-nBw28ei-OE", "RmRprMIyDzk", "ijzZru_5VUU", "xZiHAa09Jcs", "VaB66Fq7Lv0", "qzD_NMnkoZE", "V63oM8OPJSo", "c0I4ahyGIkA", "2-_AwYwwRC0", "08b4awIHtBA", "IiwYeihxC58", "EkI9kedvfjA", "kDj82KFbRvU", "UhxanFv4MCU", "mvqDXU6GP2U", "asZvnGnpL7Q", "r4V8xg21vek", "XYb4rJAHht4", "kvNSUkfuyNQ", "PDdG11W3khU", "d8bKbXRcOVo", "KGy1GFeKBu4", "XMcoTHgNcQA", "kmAAlcld6wA", "U9x5mG0pBiQ", "kRqA1yFZp1s", "OZH8dOjxueU", "-7IAOPhzesw", "F-9vOUnlgjI", "mdISHnn5mBo", "4f_fhoAn3bI", "-Iuvtg9nb3E", "gStIPsIgFmM", "MihdAxwamXA", "7dwwcdv7wc4", "aJafJ0sLo6o", "-6mZyblCys4", "BmeqsTLE75w", "608SA-ldxfE", "NGGpOyniTuY", "IY-gY1FK-bo", "uAyb-u59pyA", "5SGZCmLsN0U", "o85agQuK55E", "buF62ewDLcQ", "Bd3O4iECaL0", "GbZsvIIi4Xw", "k6Tfopbn7eI", "rNCnhO8XCeQ", "oY-u6JuPLCs", "WDX1rhPQqc4", "s24gQiVtlkM", "4OMeRsOlQJc", "OKbIo7PEeSs", "s_Om6jebXS0", "qHUJaInu0tU", "0CgENmF1eTQ", "gKQFV9WzK8w", "DtMHXOULa-Q", "14AOIsSRsPs", "mwdpNHqtA_I", "Op5JMbkOqi0", "GHJ2ABMkB4w", "uO622Nkg98k", "vngzm4P2BTs", "pUJPtMsg-ew", "UdgvzNom0Xs", "vHeXw6Nj_BM", "X9VBJd59X-c", "F7HGqkkMYAU", "sok0YssrV5g", "8-o4p16GzSc", "vvsdTa3If0s", "gLG3MQ6Qt7s", "KVgguKZ0TZQ", "1syDU6RAY04", "m2_wamNcmjs", "ItGkpXAr8gk", "KyB-Eo4xS_c", "lvXKQ200UYs", "3Gh-BnAavc8", "wFLnRKWdrcM", "6LRxoHEyHag", "BQuuDUjekF0", "x8xsbx4zfYs", "s8bALzS1siA", "E3r0U6XLdSU", "bYZYYhrytSM", "sz3AWACktLc", "0l1QuxkBDUw", "ni9mKm62QnA", "Jiyoj5B72iU", "GMLzEHguJWw", "zIzDTxh0hW4", "vmgeBtLPQx8", "rbANExeyApc", "LCJfxTmrJvw", "WNevBlZWCKA", "bVws6LF9UTU", "c9A0j0y5yaE", "-aC_6-A_1FE", "kGoHnMl01z0", "cZWZjymwI9o", "W5qJExlQTGI", "cNDGZ2sQ3Bo", "HcUg5qQZRxE", "TeX_yWATaBA", "q44sI_C5FtI", "WAmJkowRVtg", "8et2Jz4U0l8", "9xHjmfUa4p4", "85Cv18FAvEk", "Osd4ngHD4kM", "m2sXdEpKKzk", "B2mq60Ksrsg", "E9aetBe2w40", "Weq9ZCS8E_A", "hni1Her_WAA", "5cAujnlKCWo", "ofhHe0r8cZs", "WL8ePvjN75E", "8muUTAmcWU4", "eszfsXpsaT0", "CRJmGhahuXQ", "2MHwEybkOcw", "086_NQicef0", "R5Y3h_1gRUY", "c0J_nqrZwow", "whBc1jgTbgQ", "yqTxlQzxUGw", "_iVG4MsY2N0", "W5MhJ6cy1So", "T1-nZX0OPvI", "sGHnXezeo-Q", "vCKl84jpaZM", "tNtMIJBgIro", "U5Ga5VAzdVs", "YQePJRGlXig", "Yurq_FVgONg", "sZLocNzdybQ", "ln5drpv_ImI", "kBzK6o53BCc", "sH-Vzk7g4aE", "SVqeVMCk9PE", "qG4s3X000js", "1DPIP44atys", "hAobD5OjoHE", "FkNzeOnsA0g", "lCTfOwSi27E", "zLlAAoJuTUA", "zS17RYKwPL8", "JZwb0Rc2vMA", "Ni4NgA64TFQ", "N6q6wtJ_mkA", "7U4EZyDGyHw", "rw_KWqLkQ7I", "U98LIYBFVJk", "cFplR9ZGnAk", "HYA9Ak06qR8", "EGIfCNNatwk", "SDi1hBdoHe8", "VzVl8ihEpA4", "TIWirjDSYbY", "zc62DdR8JPU", "WGkh-wC3WDg", "BESi4uVxLQk", "RISlZXiSShA", "956I1peiMi4", "OQWymBdj0Go", "z8BkA7hQa3I", "M5xVtIv1Lo8", "HAF_U7WnIFM", "pCZq5tVnbwU", "kRpYCajakTU", "ll3Z_SlkRIs", "R86bzJSneuw", "6C6cEOBeE-E", "_6YXOv-l7AI", "Vlu7EPLXiNc", "ggJRxqOEaFY", "w9UQ02x-QsU", "DYEpCQUyPXQ", "cuhu-aAdzs0", "w2TI6HtBMQQ", "rFieA38aG_s", "AePWt_L3XAI", "ugo3jZ_qtKo", "xYcNwZ19rvE", "XfGs_D2qnQg", "a0K3V4rL-Pw", "J4wNtLfEnr0", "_fzDsMk_jJ0", "DcjfMsKrcNc", "Np6lb1eAXYs", "NLU117HCVuc", "WdBQHcIiSIw", "D8GFCYxyJj8", "lVtlz3JRV6o", "qwRpBFajXMk", "YjW8Qn85V6Y", "DHtijJOgHsc", "bSYRuzEaT5k", "JoRoy500nCc", "uu5PfAzu0s4", "wmB--NlJroI", "ecQDQb8lWDU", "cLwQssZtPQA", "Zigz7HdNS7I", "11H1SSVcIxc", "lAjPSof6X_o", "K5DxztpY1O8", "gVG5k5u1Cxw", "efruITOl8P0", "YuRNxCxgA5k", "dzzui_irHbg", "pNOepJdg2dk", "ySHZlKZkZMk", "4ZfyI1UfPFI", "EQhpvZWdr5s", "JcYQ67_TCmY", "xBYD4tt8ANo", "gaGHZPrgA-I", "EaPkmf6yQqc", "7DVMSbMnbSE", "W5a9Z0Egwx4", "_es6l-aPDA0", "AwDYdik-Q2o", "Edva6JFPeyU", "YN_JWPDYVoM", "fH9qvZCBO98", "JSv9uK-9ZUg", "kioB5vGYUSo", "tJ47IGBc1c8", "0C3kpEe6HMk", "WZ07wcxwuzQ", "F_IqJEZZGvo", "sJfGYTVhJvc", "GYozuXsPmCU", "OUqKu4l7A7A", "L8XvncvmsJ4", "iaGyZ78h_B0", "s6L0uQyprpE", "vtwTSKWCubk", "-USxtr0RpUA", "7lTAb59onvA", "fPfvv3u5PHY", "4LUncEfpUSY", "qKFxQ3X-YbI", "TFyi0QOx08c", "C_YtdGb1gi4", "xj3O_G75rQE", "WgFAstf_rHY", "9h4dQNyvwcA", "8z8lEG_N_q4", "9i89UjkJi34", "30P5g8E1pJM", "jCic71ZWQbs", "UfeENq6PD68", "d_qAeReozXY", "NLSi8Hsb1PA", "3euy4GJbu6s", "Ca6lJ_pUtFc", "4DQSL3wjd0M", "jWklQXHhJuo", "qjGz9PJg3sk", "tq6Ra0jDMi0", "uoSEDUu8F-I", "BuMVDXZTGn0", "30fTBWZv-2c", "xiRAOHPIL5s", "gp8BLyaTaA0", "OM7CvKnhjfs", "7r-z1UmWFAU", "rmn4lfCRaoM", "5Xs09ljJhlw", "VLOpw_F9iC8", "RaVcslj475Y", "PuGr85II3yc", "tsBDNuCJiLg", "XY1Kpz3Fdz0", "nD8tjxDL5Bs", "fbjSCmE5iDI", "nxCtO8W9JLo", "bztsHpNHkXA", "jVwb9LjxJ08", "Gbln2-GA0WM", "mwhklqGVzck", "gWFXgcH-LeU", "B_fEorIyKHM", "NwBZ94Leirc", "ZkUuHEQ_IUo", "2fW55mLSiSQ", "OU1Hwpmu_r8", "ibbEHYpWkkc", "ql-rS-AP_3E", "l24AbCJM1oI", "GnP5Kfg5ebU", "pTnwuSi22Pw", "e5SLMOjckxo", "qzj2SNRNqeY", "6pb1Ro7CyYo", "GbI0bzlg8Ik", "PMrshKSVPoQ", "4_U-Ot23sMU", "ATlZvy7pNVY", "ZvsBdtUGiGQ", "6gcc9Z4pgWY", "XPcsu_Da5qw", "F3sWR1REnJc", "iOUe2L7cTiQ", "6roxyet376g", "1XEON7CaTJ8", "2RMWPwYMZ84", "l6TVzMmINLE", "Fu_WwKclRjE", "JFkPNORSoyk", "WxQ3JmUmwwI", "1EuNWj6CAZk", "jxG54Kyo7WQ", "z_dgFPmIUko", "NWS30LJ0GoA", "5HuPzqn7oy8", "hrd2VPGFSwU", "iEUlg3-vtjQ", "czhIG-jAB8I", "af_6Ft435lg", "9Wcl4kMJxqE", "naQdcC4nVgA", "-m1duEoiJng", "rIjXKaqPmeE", "Ts0830UlVOM", "-regSZitt5o", "RCEIlageunE", "B1KFwtFFZl8", "hthK_pGbq60", "Bb4C0IwSoW4", "gQR4STZ24kM", "HzaT5l4Fzqc", "42PxXRf2b40", "C4ny6HRtBZI", "k8x8NwTLoFY", "u71jKM4N13o", "isapQyRUVog", "HRxkGGBn3eA", "VR0s3Yqm2RA", "BeD3vjQ8SI0", "cvEqpdbK-og", "VP25o26erko", "55QfOLiYqWQ", "nzBogfERXrw", "YG_Fxyqz9xg", "Hun_NmE5CIs", "1UBI28CEyaI", "dZc90gFlC4o", "BduDcrySLKM", "TK6QlDfxt5s", "7RIm0GqvvkM", "_qGq1Z2Bk6c", "uCzUOgM-H98", "3uuCyYRMAo0", "xVHr4B1WApk", "8XFcmzA4WO8", "e9czNu2XVV0", "7eCCzBqQSco", "XBpfH1CKWJ0", "v0_6jaOOjpk", "sJ3EKMvEofQ", "lgUiUeQpLHw", "Pk7xptcpPSA", "rlrV5RNpqDI", "vSioiSg4oQ4", "T_Sn8WCjRiA", "NqD_MHnYUik", "F4oxKxOlkTU", "WkCROXNuUco", "Kf-FKx50OMs", "wJYricpDGM0", "zgFJtVLFNFo", "cKyqdM-xias", "A-fX0NAZJLA", "Xe7za0JtTeM", "dBO39hZ9avA", "rzfwmlmx470", "nyMu5lY9S6w", "6Rf6EjvdiN4", "6qReaeNdjHc", "9vu8sY8fpnc", "dxgHqZZBt0E", "Gt0jj3vBazY", "8F8VmHFQ184", "QlnUpMED6Qs", "vHud2jlSI5c", "eq5O0oPSEZE", "Y1ByvAGQ5iE", "K3A2_j-STfk", "sOn6a2I--Hw", "X6u8aWhLR24", "Y-3ryjIQlgU", "VgMUzJ3gX2o", "irm6EmAwmLk", "hG9zYKB76pE", "om4PNJo-Oro", "4hBCxfrlpoM", "ZDNr5nuZABg", "KxqkBjfoTqM", "qF9MA4rBO78", "qANdy1dYvAU", "k-Fqo6-TEsY", "_884Swi4XSo", "Lj1S1_KD61k", "JWiMShWiF14", "guH91yuPaMk", "sVGH5ROWnl4", "9dI3g8owHiI", "zr8msYQhfRg", "rDLBArZUl1c", "eOLpJytrbsQ", "o6Y9E-DdG6w", "xSam7WAGOrg", "i-MPSUmPoWE", "8z2Q6XWLYa4", "9SyOKYrq-rE", "KtOid0FLjqU", "8OqWo-_8Rmk", "gEMnbCz0Aqw", "Ta0YDpINGZk", "QAZsV6GZo7g", "kID7b-OjsoU", "neHxvGWsJws", "q9OTm2g2Z6U", "WgGJjGN4_ck", "yPmZpuKJaq8", "_pp8REwqZpk", "U0_hlwXFLn0", "dViBC9l5Dhg", "K2b7UDed6uQ", "z7TVW2eYHB0", "wHKXzN_Ay2Q", "FkUgYHcBiQg", "6asyCyR0K1Q", "MZYLtqrAWBw", "CvE18K_jr6k", "-4YbaM07U44", "3dMmGSdj45g", "PA1oa5oULOM", "kLbRHD7jAjc", "HUOvKWXEdFY", "ZI0HOx0-gUI", "ckcZaPjmvZg", "CgoJrnzBNhQ", "vfUvLirsfw8", "oc_iu1AZRgM", "luPOnViYl7I", "IBEXUZBmlXg", "kkp4rQ-4NOQ", "Ex4XLUE_gSs", "J_HHQ_CptMQ", "2DNM5vMPte0", "LSF8WGtQmn8", "F3zYeRzxOsM", "Z_KQy0Qd3ag", "ZSI-wuA49T0", "W5zWvItbcf0", "PW0-vZD0wis", "OwoupJhC0p8", "S-U6ipzt4Lw", "yBXLjBteptw", "Ood1Ob1hGwE", "5nfcKAqCG1o", "NUMlxTPsznM", "yKPj4oi9m74", "4lMGhP1Oecs", "0G1r-Cg0zS8", "VMLGC5A3QTE", "y7tAgosfLHg", "Udu9NgiNFk8", "eK8-0OK5V3A", "OzX-ABTioVo", "fnxkPIs_5QA", "BuL9ga2Doa0", "1uSpahZY434", "RkxAeG0YdTI", "XHwTbPKn4mE", "rzOxBlhkziE", "8zqfyrmSSwU", "ewslNYDXmT8", "bZ30gBgTTb4", "sa9fbjDxEWs", "YpeBKo-iQjY", "zpvlH_gcnaY", "B5DvTpT59F4", "Hf1Wk-T4Lxo", "r3ZWnitp3zk", "3rWiYstiJRM", "Bi4szXGcCAM", "PO7CGnoDFUI", "XuhsDXmH4bA", "sqL5xItVgpg", "6WCzY2dbtxk", "mbfile7XE44", "vt-pyIdkvIU", "gpxmrWz_hjA", "GTCvP0C4aF8", "7uDRk7fnou8", "Iz3ep6k9teA", "JPf0qwXV2ts", "ZBD7Wh3SJEI", "6LpHENNvrms", "XZqI1Xu8QPk", "e0ah37y807k", "htAyoWqrXww", "mhQJs9041Ro", "OUxgzaOOiGk", "5xxH2Pz2Bdw", "DWnUGvN2xsw", "jYzKvmy0qwk", "kVeZoNqHDNk", "poPTI5BszZg", "Lr7n9IUBIiY", "ZMOJit6rI6M", "PcsNgTLkiS8", "GbcjU3tcUeQ", "0Btm-aknAe0", "Grvcl58MFCg", "WJbRCe4nB90", "ST12kKBZmM4", "66ZB0jTRmvU", "RL6hvfIdk-k", "KltGjY-LvpY", "Ng12EyF84Yw", "luQM0pvLj2o", "4k-U1Wp2d00", "IQqLPXdZFek", "4I6-DAdDC6A", "hsAUHYxJGDA", "e8e2kOfEzOo", "ZMZHcvIVgbg", "Jk3-Uhdwjcs", "VHlrCYpJGEY", "8u9Uiz_JjnM", "MSbqTMftCy0", "IQiDccmknoM", "PQ-_8LhCVOc", "vWj-NLIp6uo", "HRmSmr0D5Kw", "wDniQEtGp-I", "fF_LlvrlzrA", "AeWP3WH4Tdw", "oxVjCyH_ldQ", "au6ERMLAr0o", "xKRpkE93JGo", "qn90pryDxOk", "-8b50abrBGw", "NJBNEFxgq78", "50BObFaQfhM", "Zp-wTck-3Zw", "tcM8IEN3rF8", "TskKU_GT1mo", "3j-hlaaAavw", "wUSVGK5fHmA", "Y-L7zmFDQ78", "G1ebTFoqLlM", "p-vdIYB4mFY", "JkfNpgk8oNw", "2cyqlYWLfoE", "Y5ekEhh6rEU", "Mxtm1sWZZKo", "xulIYVIbYIc", "DaNxq1JLuAg", "1ak3Z7ZmtQA", "PewUcrT1yIw", "0BvYzpw0bg4", "6s0-kguNh_I", "IbsV7A0PGVQ", "aDUZbFgW3u4", "Xe-LZ-xiUSE", "GbcuPfhJaVQ", "rSUr3ympPNs", "aqW-xq6ft90", "Ey5iFrFzhx8", "H4lxINSxHEY", "NcWOe5wXvew", "haQ5cW9S6oo", "2USvYsEoaoM", "1dyD8_5BRwI", "CRUBL_FDUOI", "Pj7yh_GKc7I", "y7KWvgT7__g", "6bLLku7pqVg", "WbEnFR-hlVM", "cqdl_0gQY1M", "nwMkgx5hZo0", "GoDO5se-QFc", "yEabIHeu0Zg", "vVdfzPWBOUI", "O_wOFhmlXtY", "f9XsJwDQE04", "Of_6aj0gOyc", "LlJPXSF3GbE", "uWwN03Mg4Wg", "ICfoiW1d_90", "4vr9a_sdJ78", "jTeQavJjBDs", "9EwxGJdTJNo", "4IPe3tnBKK0", "SdSc4sWVMRU", "u3gES0SUsnI", "oOFrXiz8-0A", "sD--EGHBvqw", "ZO8FtEm3H30", "22hRe9Vf77U", "YoC_rDkSS1U", "dBWvUqBoOU8", "KpqijGSBWmw", "2Q8zDWkj0Yw", "gHtB1alGIWg", "j-PDxMrVyw4", "6WVpKJY3t2U", "e27-Nk6KdFs", "RU_tbBSuH_8", "QJoiy4XQp14", "rL6sOvctpo4", "-HkuuUSY1pE", "ARl1-MWhPOY", "0Tgk-wiuCU4", "Ors5a5bU_4w", "aV6q-6d0bPg", "ptW67z7Y4-s", "Maf7wdHCmvo", "GNhcE4VdFfk", "dThzccaa7ss", "6ka4w0Hnmd0", "ituaTXxbrPA", "sSnv3yzLUdw", "RMT25nAhLT4", "otycVjmqAtM", "bK7G66Q5How", "yIWzUWZvIgw", "4H9IuFBIpYM", "dtVDlZyLNVo", "P3ek4SMx_kc", "LrSY9fWFtl0", "DWWe3bhkj9k", "G4lCBsvvz8M", "Z5dKUnRJIiY", "5y9JwFRTsXo", "M0uDTaOUZmw", "yi81sF-TD_g", "jGKBncKGbrc", "inCiuLNuwdw", "JS-QXqSGVE8", "9JBO0HLm1Pc", "nIkuMWT4Imc", "NnHWPawumFU", "EOQWxAK9aNk", "QKSm-kXeWac", "-wtTTiovkWY", "BM0y9zmkA1M", "PCoTr9kKPKg", "SWiyd1T1sTk", "eIla0hzgJxU", "dble4ad0LFE", "Hz1WQbHcXag", "BqbhoYD1SZ0", "NHoD8zj2bDk", "DNcWAEC3AH8", "XSeEGaA6ycU", "JaXlk3fKSWk", "C1o3OSfvHc0", "AnsiT6Qic6E", "a2NRu2Wxa2o", "y6amoiq258Y", "QuEeGfsU6rM", "QYaL6sUF_sA", "E9hVNb7wOY8", "oBuIKudlPWY", "C_-DQF-x-N0", "21kpnYKdO3c", "TwapSj8yUkM", "ehDntmNgsR0", "iS-X-9GPiS0", "4fwRyKISwfk", "HbWir4fSg5U", "6dJDe6MoVxM", "mOcdke2ZQoE", "Tz2ffSTNaKA", "O_498v1-NBc", "QE2QOZqxdr4", "OT2H2YLZJKg", "hOkwJMMl5AA", "QtYMfcbdl8k", "WePxTF-kKks", "oECdZLdijBU", "E0ZKJxZYVkQ", "6QNZMuPFkNY", "Dc32MI0dwOo", "I7ZujO1CtEw", "jnBpU15Lfww", "QMe6wJsCrLA", "-coR_4tgtWA", "rHv6C-WTOls", "kl-dC3shTIw", "zWN6wfm-Yo8", "yNaGxHqjOuw", "ECp5_zkbi9A", "-Y-XzY0HhEM", "znzlxOfFbWs", "YilEpxqSr48", "Qh9Swf_8DyA", "OLIcAFggdZE", "loAgTdeDcIU", "7WLU8DKkGfQ", "CRTYASwDw80", "uSaF4ytmcR4", "dP_CayYV_2k", "z4XYhNk9EnA", "o14nNEbLa-s", "ryO9maYr4rY", "UIK0oPBaEq4", "s5K7oM0Uc20", "8VcxFe_FKa4", "AfYRI56whng", "eHtM8lZrU2A", "TYVVKXO7-S0", "O0XaLIX51PQ", "Fd9784c2F2Y", "aEfILJSHCHY", "QqerMOz6DnE", "VCVI5QUvFAY", "ofcnEEKO23M", "59t5omyjMEk", "RbSuUYKMzDM", "jjMILnIiN7o", "gofsUk6kmas", "GNbFKNYJtTs", "e5ed4N3YhIw", "8q2a7xNjY84", "fv4aJOCulfU", "RkxWgw02u0E", "1PHDS-PFtcM", "Qw3bDTSjVZc", "iWFRUyqpCbQ", "sJaenHSSFC0", "_VMOdjWWZQo", "31j9u-Z6JAQ", "01vFmYAOqQ0", "wIvTfS-e8Ls", "HrUbyeQvL_w", "zgDEDKO3C8o", "Dw0-lA3qvr4", "EuSngguD40I", "CrnALaUMSA4", "hF8nQraErwA", "id7EqKFWJBU", "dXdyFy6bXt8", "S3gNA0HQZo8", "UM3jT5w6hlY", "Z8l4vxWTEiY", "2S0c1k1NB8Q", "3Lct61hLt2s", "zzY3vPPXlXo", "y4v96Sy2ne4", "YD6lnmRLOtI", "8jNATlZXhgk", "98PsQQI_fuU", "tajjW9PxsFQ", "PIVVtxk342w", "SBXETTZe768", "NJNExJ4Kkyg", "6ij9-3d9Sc8", "fGZwklD-AEk", "JvVFrJV-R6I", "1KmVpeRhB2c", "6-XmguXtoVE", "HXdhWwZvm_o", "Te3V0r0fYIo", "G7X4J7h1fHI", "SfC7fScwU-A", "AzJVLTIdmqM", "P9G7dBP-7ZQ", "x5VGfwMNiUk", "F5pHgXhwSjo", "M7eapgUqKvg", "xJxAceolPZI", "N_Y88TWmGwA", "IcypwC_7QrU", "SbxO-MsVVZE", "a1uhrE1rTjs", "IA7nYNqfyc8", "7wQsXq_HKJo", "58zgsq3c63g", "gUidFWrdJJs", "Bdf-d5CaWFE", "o0RZkkL072U", "avJ9uz9Qhcw", "2p1HOcpi14U", "fdxtGbvDpIc", "qcofhYrqwb8", "OdUL-twynAg", "S1qSBlXnHlg", "xMScfzgJ7_c", "USUs1ulvXfk", "Ke96snCJ1m0", "Kc3meWFta9w", "nQILmS20m8o", "icZXsb-xSKs", "HSj7Verc0cE", "MAhxp823ExY", "UldEou9GdqI", "W9W4yJeMtVo", "ilkTnuMunP8", "Jit7W5Me_0c", "-tXkzUEuheU", "mwfotfq21LA", "zWKmSO7hNEQ", "uGSpk_ruIV4", "2uEzq11ZmlY", "aViOQZzikVs", "eeaB8t85xDU", "3it-PKSzl-0", "QRKchK5_B8Y", "fZlYLvSKkgE", "_6xC5v5fLpU", "B4op5oZ4x5Q", "GkKJ56oZ_30", "DROwSrK20nE", "V0q5QXjEPlo", "TnRGQGS7CLM", "491PQ04olSg", "LH9u2Us4T7A", "q6n8nIrDQHE", "n1fUGApCY0U", "4t5rCYpbXZY", "8tTTo4c0phk", "jqNjxA4bkRQ", "RRgJcY3b9GQ", "xeSLu3W3WQc", "NbaTh_gM0WI", "jinWKnH0m5A", "qj3PI0aDWks", "58dDAenTqU4", "rXIpzN8CEks", "y1IEnAYvMxY", "sTkEsLgNrM8", "pAzhTffP-Aw", "jpUalI4-lIw", "YbFrjg5m5ZY", "N-sxA8vEGDk", "Uszp5Gkg0AI", "xk6QxqsNsfQ", "tZKwLRO904E", "wOeBLz78vGw", "_j6rv413MyQ", "Azli_kcxRNE", "rrXk6BopdiI", "ZW7unsyfPGQ", "W-oqNwbmin0", "vbzO0QfElks", "4QOj4EpEM0U", "19tQv51x4-A", "QbekaGW_zMo", "gEnMyvCMcvE", "12dXKDujs40", "wkZjjrcl9oo", "w5KJCocKSag", "Evdzs-qe2E0", "AN2SypyyOnA", "aBVidOolyu8", "ozwiCDVCeiw", "tL9dekPndHM", "s60kNHJCAao", "BAPzw6CKBQY", "SwuvcKXp3eg", "0lHIMPhRtN8", "XiCZpdoX4lE", "2qLT_Rq-2tk", "eIbpWqaVNoc", "nXlUIwIaH84", "O_gjePb0sM8", "WLPTrpSMkk8", "txuZ6ATkPMk", "IcC2FkA7Fms", "pdUVFX8WglY", "29SqSdfvN_A", "p0RR_3Xc988", "CMOa3H1SXG0", "ID8033ovXOk", "AdfaEuotl_Q", "bygTaBey1Xk", "gapYVvUg1M8", "bS92UkQY8xI", "PgNiwCKYafw", "7R9JQJB9R2A", "wnShDP37vB4", "06hSFSLnAic", "oGcmgjTXhq4", "2pyYCQazX7A", "P6weXN4fxeY", "v8vJ9p5Kiws", "5QwBUWkOwrU", "5WSxRFauJmo", "eiqJBh7eHDU", "msS5CR97Tk0", "djWfjBv3jTc", "0bP5v79i7sU", "vOX1_FoSPzQ", "BYu8ITUWMfc", "OkAAx4mI2Hc", "3_SAu2QWYww", "rzyEWiyZd3c", "BMS5u3onifc", "9k9AGYjJny0", "lPufCHtdCLI", "71CjSSB83Wo", "uPdhiUpIf8Q", "nJMuLxTQydE", "W3x5gbLqoRQ", "U6u_A5z6mME", "8J3VgMfVhjo", "vT01Ptkjw1s", "BnLbSm7Pw0M", "dEepAJ_86dM", "UJO5IVFEMgk", "956Sy1HzNUU", "AaaN7BBZDuc", "eI2GTv3T1yo", "hQOHDAibf6A", "HVb87s_t1nw", "0D6TnyI7s8k", "GOjcDeFT63c", "4KgtxwMeLYw", "wl6YOda2S7I", "XYOOG4j9OUQ", "UyUvM0xcqMA", "zVUMwKMqpus", "le7lij5WMyI", "QvZ1LRFr3iY", "iBKQ9JVqrJw", "t--Oc97rSm8", "b-yEdfrvQ50", "3LOlnKre5XE", "an92Mth-ExE", "kVfjcpdX-vA", "WLUHO9A_xik", "Va2OylloQ5Y", "YpY--zR8BC0", "hIJJVnDZQOg", "oP8GderL2HI", "2hSZoevZbmU", "GLEGyKd6wds", "wodR2zj3Nvc", "UTT39aMPxwg", "EhqI7RRwHrE", "AwI4qsDCOls", "Bc_fvQNxmOc", "ZZ1XJrXR4Do", "k7BAB_hT-8I", "yypv2Tu-mxU", "AQpQ9icSaQI", "t6iwwTdK9kI", "wIh9AS55Agw", "IPFSwl-4IfA", "34mvN5nt1ls", "UpRoC4NCWPs", "USOu_Ob9rxo", "VPfIC7n8NNQ", "VGOiY1gZZYg", "_VTgctRg0tA", "5cu3izCES4Q", "y76F3TFw9KY", "BJwSnag_Zis", "wWFPl6iVAnk", "yBmDOkP4_HU", "wPVqVETFREE", "TcbdqPYvRB4", "5JT4gQ62o88", "cDQQl8VRGSs", "yAji2qxMc7c", "Ez5V2THOpDo", "MeP_uNYMHuk", "Oqm6Lygf3zk", "BHf9GUsZwBs", "E6FoD6vMjYY", "4aUstulNpps", "M5zLJWGKYoA", "KhBvZftFKrs", "-cMxF_DUQMQ", "U7qgSM7F40s", "FYzUGU5-9R4", "HeVd38MWnw4", "9oU9-PREN90", "h3n55aHqZoI", "TWehrrlPvBo", "oyrtK2hJqBY", "KJG6KBFPLDM", "DczselSGdko", "dMz_gb_cc0Y", "xj-7lILMRuE", "MGPsOiDpVqg", "4JPbGzpSnZs", "2k26mRosr2o", "8YuGb6rZ2no", "hz1kFTqjhx4", "sAYjHNsD0rI", "I3_2GW-c-yQ", "w7wA3YQgxUQ", "jYChcwbXqnI", "7qheceNIy7k", "dQHT2Q_Zg6U", "vU2QFQZngcw", "Akqzhyi-w2U", "xn4Lc-87_fM", "EUvC4cY-byI", "Tvf8MHuI22k", "_r19nfvS3wY", "VX-RORmtjdY", "CbyG54CmWXg", "wbkYwKstquI", "sFTbc-OviRc", "CetB-bTDBtY", "ywtbSuCSjhM", "Ay5BwGZUwx4", "gm8VX_av4yM", "HDhSLqszOMk", "N9yFjkDc0vA", "8jVnE80zSzY", "TULqBUELe9c", "cqlp1id1o6c", "V8yZ7Oa9fZE", "XWKNM4TsWAQ", "dSRhwPe6v9c", "1f1841P6fRU", "-Fn8jmOswx0", "Xs5cXHwLyEU", "wN1CH6Ferbg", "N5dWeS8p09k", "betmVWGYcLY", "kOqBCFsGTs8", "88XM5Al3AXg", "2TynMehlqIU", "AoSAOV2Vtro", "pV87YnElHow", "auMjWDfTFhI", "2mSzfaseWvg", "l2NqtAXknIU", "tUb9a0RB04k", "58Mkqady7lE", "jzY47T8vh-U", "DNXWtB33WWE", "GyALQFQ9cp4", "lqQlmcPt9Qg", "Bg2MAWL2yGQ", "PHLTuYtgz60", "vpVfGGT3XAc", "hrcRtexM7M0", "2u9aALMdPnI", "lTxKlwdrJTE", "h_bYfwwOjXk", "5tKtllqhx8U", "PLxJw-Z817I", "grg6-DNJuaU", "Slq6WuNVeAc", "r7tuuJ7DFPI", "PBPlDQd5SwQ", "IZdYasbZlNM", "s95DnBWUe-8", "N4H8D7zOQOo", "u7ldh_tgH3s", "Ok7BPF_XcN4", "GI8zYm4C-Zg", "e8La0hOfuz0", "ahn00K024Pc", "pvv6R6qPn7Y", "I3ml5Yrhs6c", "4mta-DkJUAg", "mEzz7-vDKcI", "acKSt3THWKA", "HyUriQjS9R0", "mnF75FoPBWY", "eT1ef3tPglU", "OeV7iGqJQt0", "ucYWe5mzTMU", "z6AeP0DCuyA", "OiZ8QoyMD8U", "ig9lRTGT0h8", "Hzk8y6hFJRk", "XMyPniM9LF0", "yM2HJiq7P6c", "nQtuv9JTzYs", "cVYLIzF6Gh0", "--uO_qVwJU0", "Eth1J7nTwTE", "5a5_ffZrD1o", "onWgKkwRRz8", "pyqFRb8w4Yk", "Vs7ZojmFm7U", "JXkCLZhhRJg", "qHblAFPy2uU", "oDnfkgrxL64", "TIrXot28Znc", "HNx4QLRgy2k", "LZpfKmX60ec", "EMgRlkN6uOM", "hpCHLFknc2s", "jCnarvEeOYI", "nUAwSLCdQyQ", "ikKvoe0IYGY", "4qZq7xlqpvM", "vCIoc-Wha1Q", "rXWduao8OfQ", "eWBseWsTEpA", "SsvM8xfI66g", "RdF3apSExR0", "26-lAP0XprM", "D90_p0ZinVA", "YLgTmdb7r1o", "zJnpPhF4HyY", "R5S4OQpG0lE", "Nk5rSNq13sM", "iLuGGnORZOo", "ZJ4yhJFIzaY", "FDkT3DpYBoI", "zeUM-uIEaew", "juHayWuaaoQ", "gb5VDzCIVbA", "dO0KS_QGnzY", "AX7f5e7DkWE", "lf25pgbeizo", "58MKf-UXjaA", "D4CM6abWxX4", "Eb-noaTwHiU", "H5k8PoC1BBc", "rm6Un7ktYBc", "gR_zHJqbtzo", "7OQ1epuOC18", "OUgLA2unwtg", "Knv9AaodRKc", "7e0ToeTuxu4", "NtrxaEdbMXU", "K715ldqJ5JI", "9Fong4i8CFk", "a7IVuJwYjp8", "23dcwcPYegU", "Xt8eBJ7LUIY", "Stzrs8510_M", "ulh0cnK0WCE", "EhUH4OVjsdc", "5rHeT4s5gYs", "C6mCCgMRlu0", "I1fTWLqeZpA", "MG8jaCF4YbA", "4QAi8luVsY8", "6clmbgF1EVs", "r4-iGjRv4TY", "YS4DumcEM-s", "_wzsuni4YPc", "xu4wP7AeG4g", "TX6v5GC4-K0", "5oFgnqfLjmk", "E0tSCDAoVvk", "fVbUcOkKw3Y", "cBjzvhZTkJc", "-5rA4DRrEXU"];
      try {
          var max    = unsplash_ids.length - 1,
              random = createRandom( 0, max );

          var id     = unsplash_ids[ random ],
              url    = "https://unsplash.com/photos/" + id + "/download",
              result = vo.Create( url, url, "Unsplash.com Image", "#", date.Now(), "Unsplash.com Image", "unsplash.com" );

          console.log( "Unsplash random: " + random );
          console.log( "Unsplash pic id: " + id );

          deferred.resolve( result );
      }
      catch ( error ) {
        deferred.reject( SimpError.Clone( new SimpError( "apis.unsplashCOM()", null , "Parse unsplash.com error, url is " + url ), error ));
      }
    }

    /*
    * Unsplash.IT
    */

    function unsplashIT() {

        console.log( "=== Unsplash.it call ===" );

        var UNSPLSH_NAME = "unsplash.it.max.json";

        $.getJSON( SIMP_API_HOST + UNSPLSH_NAME ).done(function( result ) {
          if ( result != undefined && !$.isEmptyObject( result )) {
            try {
              var max    = result.max,
                  random = createRandom( 0, max ),
                  url    = "https://unsplash.it/1920/1080/?image=" + random;
              deferred.resolve( vo.Create( url, url, "Unsplash.it Image", "#", date.Now(), "Unsplash.it Image", "unsplash.it" ) );
            }
            catch( error ) {
              deferred.reject( SimpError.Clone( new SimpError( "apis.unsplashIT()", null , "Parse unsplash.it error, url is " + url ), error ));
            }
          }
          else {
            deferred.reject( new SimpError( "apis.unsplashIT()", "Get Unsplash.it max num error.", result ));
          }
        }).fail( failed );
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

    function flickr() {

        console.log( "=== Flickr.com call ===");

        $.ajax({
            type       : "GET",
            timeout    : 2000,
            url        : SIMP_API_HOST + FLICKR_NAME + "?random=" + Math.round(+new Date()),
            dataType   : "json"})
            .then( getFlickrURL,     failed )
            .then( getFlickrPhotos,  failed )
            .then( getFlickrPhotoURL,failed );
    }

    function getFlickrURL( result ) {
        var def = $.Deferred();

        if ( result != undefined && !$.isEmptyObject( result )) {
            var max    = result.apis.length - 1,
                random = createRandom( 0, max ),
                api    = result.apis[ random ],
                method = api.method,
                key    = api.keys["key"],
                values = api.keys["val"];

            console.log( "api.method   = " + method );
            console.log( "api.keys.key = " + key );
            console.log( "api.keys.val = " + values );

            random = createRandom( 0, values.length - 1 );

            var flickr_url = getFlickAPI( method, key, values[random] );
            console.log( "flickr method url = " + flickr_url );

            return def.resolve( flickr_url );
        }
        else {
            deferred.reject( new SimpError( "apis.getFlickrURL()", "Get flickr.api.json error.", result ));
        }

        return def.promise();
    }

    function getFlickrPhotos( url ) {

        console.log( "get flickr photos", url );

        var def = $.Deferred();

        $.getJSON( url )
            .done(function( result ) {
                console.log(result);
                if ( result != undefined && !$.isEmptyObject( result ) && result.stat == "ok" ) {

                    var len    = result.photos.photo.length,
                        random = createRandom( 0, len - 1 ),
                        photo  = result.photos.photo[ random ];

                    return def.resolve( photo.id );
                }
                else {
                  deferred.reject( new SimpError( "apis.getFlickrPhotos()", "Get Flickr API error, url is " + url, result ));
                }
            })
            .fail( failed );

        return def.promise();
    }

    function getFlickrPhotoURL( photo_id ) {

        var url = getFlickAPI( FLICKR_PHOTO_API, "photo_id", photo_id ),
            def = $.Deferred();

        console.log( "flickr.photos.getSizes = " + url );

        $.getJSON( url)
            .done( function( result ) {
                if ( result != undefined && !$.isEmptyObject( result ) && result.stat == "ok" ) {
                  var source = "",
                      info   = "",
                      item   = {};
                  for( var idx = 0, len = result.sizes.size.length; idx < len; idx++ ) {
                    item = result.sizes.size[idx];
                    if ( item.width == "1600" ) {
                      source = item.source;
                      info   = item.url;
                      console.log( "source = " + source );
                      console.log( "info   = " + info );
                      deferred.resolve( vo.Create( source, source, "Flickr.com Image", info, date.Now(), "Flickr.com Image", "flickr.com" ));
                      break;
                    }
                  }

                  // when not found any background re-call again
                  if ( source == "" && info == "" ) {
                    console.error( "Not found any background, Re-call again.");
                    flickr();
                  }
                }
                else {
                  deferred.reject( new SimpError( "apis.getFlickrPhotoURL()", "Get Flickr API error, url is " + url, result ));
                }
            })
            .fail( failed );

        return def.promise();
    }

    /*
    * Google Art Project
    */
    function googleart() {

        console.log( "=== Googleartproject.com call ===");

        var GOOGLE_ART_NAME   = "google.art.project.json",
            GOOGLE_ART_SUFFIX = "=s1200-rw",
            GOOGLE_ART_PREFIX = "https://www.google.com/culturalinstitute/",
            url               = SIMP_API_HOST + GOOGLE_ART_NAME;

        apis.New({ url : url, method : "apis.googleart()", timeout: 2000 });
        apis.Remote( function( result ) {
            if( apis.VerifyObject( result )) {
                try {
                    var max    = result.length - 1,
                        random = apis.Random( 0, max ),
                        obj    = result[ random ],
                        hdurl  = obj.image + GOOGLE_ART_SUFFIX;
                    deferred.resolve( vo.Create( hdurl, hdurl, obj.title, GOOGLE_ART_PREFIX + obj.link, date.Now(), "GooglArtProject Image-" + obj.title, apis.vo.origin, apis.vo ));
                }
                catch( error ) {
                  SimpError.Clone( new SimpError( "apis.googleart()" , "Parse googleart.com error, url is " + url, apis.vo ), error );
                  origins[ apis.GetOrigin().origin ]();
                }
            }
        });
    }

    /*
    * 500 px
    */
    var PX_KEY  = "VM5xNIpewHeIv4BFDthn3hfympuzfPEZPADv6WK7",
        PX_API  = "500px.api.json",
        PX_URL  = "https://api.500px.com/v1",
        PX_HOME = "https://www.500px.com";

    function f00px() {
        console.log( "=== 500px.com call ===");
        get500pxURL().then( get500API, failed ).fail( failed );
    }

    function get500pxURL() {
        var def = $.Deferred();

        $.getJSON( SIMP_API_HOST + PX_API + "?random=" + Math.round(+new Date()) )
            .done( function( result ) {
                if ( result != undefined && !$.isEmptyObject( result )) {
                    var max    = result.apis.length - 1,
                        random = createRandom( 0, max ),
                        obj    = result.apis[ random ],
                        param  = ["?consumer_key=" + PX_KEY];

                        obj.args.map( function( item ) {
                            param.push( item.key + "=" + item.val );
                        });
                        def.resolve( PX_URL + obj.method + param.join("&") );
                }
                else {
                    deferred.reject( new SimpError( "apis.get500pxURL()", "Not found any item from " + SIMP_API_HOST + PX_API, result ));
                }
            })
            .fail( failed );

        return def.promise();
    }

    function get500API( url ) {
        var def = $.Deferred();

        $.getJSON( url ).then( function( result ) {
            if ( result != undefined && !$.isEmptyObject( result )) {
                var max    = result.photos.length - 1,
                    random = createRandom( 0, max ),
                    obj    = result.photos[ random ];

                    while ( obj.height < 1000 ) {
                        random = createRandom( 0, max );
                        obj    = result.photos[ random ];
                    }

                    deferred.resolve( vo.Create( obj.image_url, obj.image_url, obj.name, PX_HOME + obj.url, date.Now(), "500px.com Image-" + obj.name, "500px.com" ));
            }
            else {
                deferred.reject( new SimpError( "apis.get500API()", "Not found any item from " + url, result ));
            }
        }, failed );

        return def.promise();
    }

    /*
    * Desktoppr.co background
    */
    function desktoppr() {

        console.log( "=== Desktoppr.co call ===");

        var max    = 4586,
            url    = "https://api.desktoppr.co/1/wallpapers?page=" + apis.Random( 0, max );

        apis.New({ url : url, method : "apis.desktoppr()", timeout: 2000 * 4 });
        apis.Remote( function( result ) {
            if( apis.VerifyObject( result )) {
              if ( result.response && result.response.length > 0  ) {
                var response = result.response,
                    max      = response.length,
                    random   = apis.Random( 0, max ),
                    obj      = response[ random ];

                    while ( obj.height < 1000 ) {
                        random = apis.Random( 0, max );
                        obj    = response[ random ];
                    }
                    deferred.resolve( vo.Create( obj.image.url, obj.image.url, "Desktoppr.co Image", obj.url, date.Now(), "Desktoppr.co Image", apis.vo.origin, apis.vo ));
              }
              else {
                new SimpError( "apis.desktoppr()", "Not found any item from " + url, { result : result, apis_vo : apis.vo });
                origins[ apis.GetOrigin().origin ]();
              }
            }
        });
    }

    /*
    * Visual Hunt
    */
    function visualhunt() {

        console.log( "=== visualhunt.com call ===");

        var VISUALHUNT_NAME = "visualhunt.json",
            VISUALHUNT_HOST = "https://visualhunt.com";

        apis.New({ url : SIMP_API_HOST + VISUALHUNT_NAME, method : "apis.visualhunt()" });
        apis.Remote( function( result ) {
            if( apis.VerifyObject( result )) {
                try {
                  var max    = result.length,
                      random = apis.Random( 0, max ),
                      obj    = result[ random ],
                      url    = obj.url.replace( "http://", "https://" ); // 139-simptab-visualhunt-com-cross-origin-resource-sharing-policy-no-access-control-allow-origin
                  deferred.resolve( vo.Create( url, url, "Visualhunt.com Image", VISUALHUNT_HOST + obj.info, date.Now(), "Visualhunt.com Image", apis.vo.origin, apis.vo ));
                }
                catch( error ) {
                  SimpError.Clone( new SimpError( "apis.visualhunt()" , "Parse visualhunt.com error, url is " + obj.url, apis.vo ), error );
                  origins[ apis.GetOrigin().origin ]();
                }
            }
        });
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

    function apod() {

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

      apis.New({ url : url, method : "apis.apod()", timeout : 2000 * 5 });
      apis.Remote( function( result ) {
          if( apis.VerifyObject( result )) {
              try {
                var name = result.title,
                    url  = result.hdurl;
                deferred.resolve( vo.Create( url, url, "NASA.gov APOD Image - " + name, "#", date.Now(), "NASA.gov APOD Image", apis.vo.origin, apis.vo ));
              }
              catch ( error ) {
                SimpError.Clone( new SimpError( "apis.apod()" , "Parse nasa apod api error, url is " + url, apis.vo ), error );
                origins[ apis.GetOrigin().origin ]();
              }
          }
      });
    }

    /*
    * Favorite background
    */
    function favorite() {

        console.log( "=== Favorite background call ===");

        try {
            var arr = JSON.parse( localStorage[ "simptab-favorites" ] || "[]" );
            if ( !Array.isArray( arr ) || arr.length == 0 ) {
                new SimpError( "apis.favorite()", "Local storge 'simptab-favorites' not exist.", apis.vo );
                origins[ apis.GetOrigin().origin ]();
                return;
            }

            var max    = arr.length - 1;
            var random = apis.Random( 0, max );
            var obj    = JSON.parse( arr[ random ] );
            var result = JSON.parse( obj.result );

            apis.New({ url : result.hdurl, method : "apis.favorite()", dataType : "filesystem" })

            console.log( "Get favorite background is ", JSON.parse( obj.result ) );

            // verify favorite data structure
            if ( !vo.Verify()) {
                new SimpError( "apis.favorite()", "Current favorite data structure error.", { result : result, apis_vo : apis.vo } );
                origins[ apis.GetOrigin().origin ]();
            }
            else {
                vo.new = result;
                deferred.resolve( result );
            }
        }
        catch( error ) {
            SimpError.Clone( new SimpError( "apis.favorite()", "Get favorite backgrond error.", apis.vo ), error );
            origins[ apis.GetOrigin().origin ]();
        }
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

    function holiday() {
        special( "holiday" );
    }

    /*
    * Special day/Holiday background
    */
     function special() {

        console.log( "=== Special day/Holiday background call ===");

        var SPECIAL_URL = "special.day.json",
            def         = $.Deferred(),
            type        = arguments.length > 0 ? arguments[0] : "special";

        $.getJSON( SIMP_API_HOST + SPECIAL_URL + "?random=" + Math.round(+new Date()) )
        .done( function( result ) {
            if ( result && !$.isEmptyObject( result )) {

                try {
                    var obj = result[type],
                        key, max, random, special_day, data, hdurl;

                    if ( type == "special" ) {
                        key         = obj.now.length > 0 ? "now" : "old";
                        max         = obj[key].length - 1;
                        random      = createRandom( 0, max );
                        special_day = obj[key][random];
                        data        = special_day.day;
                        max         = data.hdurl.length - 1;
                        random      = createRandom( 0, max );
                        hdurl       = SIMP_API_HOST + data.key + "/" + data.hdurl[random] + ".jpg";

                        !localStorage["simptab-special-day-count"] ? localStorage["simptab-special-day-count"] = 1 : localStorage["simptab-special-day-count"] += 1;
                    }
                    else {
                        key         = date.Today();
                        data        = obj[key];
                        if ( !data ) {
                            deferred.reject( new SimpError( "apis.holiday()", "Current holiday is " + key +  ", but not any data frome " + SIMP_API_HOST + SPECIAL_URL, result ));
                            return;
                        }
                        max         = data.hdurl.length - 1;
                        random      = createRandom( 0, max );
                        hdurl       = SIMP_API_HOST + type + "/" + data.hdurl[random] + ".jpg";
                    }
                    deferred.resolve( vo.Create( hdurl, hdurl, data.name, data.info, date.Now(), data.name, type ));
                }
                catch( error ) {
                    deferred.reject( SimpError.Clone( new SimpError( "apis.special()", null , "Get special backgrond error." ), error ));
                }
            }
            else {
                deferred.reject( new SimpError( "apis.special()", "Not found any special day/Holiday background from " + SIMP_API_HOST + SPECIAL_URL, result ));
            }
        })
        .fail( failed );

        return def.promise();
    }

    return {
      Init: function () {
          origins[ apis.GetOrigin().origin ]();
          return deferred.promise();
      }
    };
});
