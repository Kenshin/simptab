
define([ "jquery", "i18n", "setting", "vo", "date", "error", "cdns" ], function( $, i18n, setting, vo, date, SimpError, cdns ) {

    "use strict";

    var deferred      = new $.Deferred(),
        SIMP_API_HOST = "http://simptab.qiniudn.com/",
        apis          = (function( $, IsNewDay, Today, isHoliday, IsRandom, Verify, Only ) {

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
            APIS.prototype.ORIGINS_MAX = APIS.prototype.ORIGINS.length;

            APIS.prototype.Random = function( min, max ) {
                return Math.floor( Math.random() * ( max - min + 1 ) + min );
            }

            APIS.prototype.New = function() {
                var code   = this.Random( 0, this.ORIGINS_MAX );
                this.defer = new $.Deferred();

                // verify background every day && is today is new day
                // Verify( 13 ) == true && background every time && today is new day
                if ( ( IsNewDay( Today(), true ) && !IsRandom() ) || 
                     ( Verify( 13 ) == "true" && IsNewDay( Today(), true ) && IsRandom() ) ) {
                    code = 13;
                }
                // verify today is holiday
                else if ( isHoliday() ) {
                    code = 11;
                }
                // change background every time
                else {
                    while ( Verify( code ) == "false"  ||
                            //localStorage[ "simptab-prv-code" ] == code ||
                            code == 11 || code == 5 || code == 8 || code == 13 ) {
                        code = this.Random( 0, this.ORIGINS_MAX );
                    }
                    localStorage[ "simptab-prv-code" ] = code;
                }
                code == this.ORIGINS_MAX && ( code = Only() );

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
                    timeout    : 0, // this.vo.timeout
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
    })( jQuery, date.IsNewDay, date.Today, isHoliday, setting.IsRandom, setting.Verify, setting.Only );

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
        var bing_ids = ["ParkRangerIsmael_ZH-CN8783805449","ChildrenPlaying_ZH-CN9664693753","T19Krishna_ZH-CN12651112147","FairSeason_ZH-CN8821036782","SuperBlueBloodMoon_ZH-CN11881086623","LetchworthSP_ZH-CN14963443838","HomerWatercolor_ZH-CN11392693224","FlamingoCousins_ZH-CN12160048336","MoriBuilding_ZH-CN5143587469","VaranasiCandles_ZH-CN12521748769","CometMoth_ZH-CN8038549923","Apollo15Composite_ZH-CN11514263746","ComicFans_ZH-CN10352835982","MandelaMonument_ZH-CN8903823453","StinkBugSmiley_ZH-CN7410309995","UrbanLight_ZH-CN6248743710","BeachSoccerBoys_ZH-CN12914801215","BlueShark_ZH-CN12265881842","PuffinWales_ZH-CN12110916089","GordesLavender_ZH-CN8649239515","zhenghe_ZH-CN9628081460","FremontPeak_ZH-CN8041302763","Gauchos_ZH-CN9437338004","Flamenco_ZH-CN12275634178","Peloton_ZH-CN7472605035","KissingPandas_ZH-CN8379279685","Pygmy3Toed_ZH-CN10141370191","ButtermereLake_ZH-CN8185859566","TurtleIndianOcean_ZH-CN9256087399","EtaAquarids_ZH-CN10323549621","HONKONG_ZH-CN11971924406","MeteorCrater_ZH-CN10237243221","AuroraPhotographer_ZH-CN11480495787","CompositeBeach_ZH-CN9646269492","ConcreteDinosaurs_ZH-CN9038296644","MorondavaBaobab_ZH-CN11131924506","MODIS_ZH-CN14242381223","ReichenauSommer_ZH-CN10985992170","Europa_ZH-CN11806353149","DogWork_ZH-CN10032511594","lotus_ZH-CN12081917194","WorldRefugeeDay_ZH-CN5421237644","CypressPygmyOwl_ZH-CN12382299143","DUAN_ZH-CN9451316695","OstrichDad_ZH-CN8968242630","SpainSurfer_ZH-CN12759707713","TinyLadybird_ZH-CN14023054484","HenningsvaerFootball_ZH-CN7899320816","DandelionXray_ZH-CN10220788253","Kiasma_ZH-CN13083124808","GBRBday_ZH-CN12318325409","PenaNationalPalace_ZH-CN12058841312","YarnBombing_ZH-CN9558012661","WorldOceanDay_ZH-CN7537097723","WhalePod_ZH-CN9101375608","FlyinDrivein_ZH-CN11097970692","AuburnBalloons_ZH-CN8649124966","PJ_ZH-CN10859560585","Liverpool_ZH-CN12418492140","R2R2R_ZH-CN11140090151","happychildday_ZH-CN9412524114","MooseLakeGrass_ZH-CN12424437234","AerialPantanal_ZH-CN7580811600","KhumbuTents_ZH-CN4978109685","AsiaticElephant_ZH-CN12232084520","TSSSF_ZH-CN12002715124","SallyRideEarthKAM_ZH-CN12897817240","WineDay_ZH-CN9852912150","BklynBrdge_ZH-CN13871214699","TurtleTears_ZH-CN7370985713","StormyCrater_ZH-CN7380963684","NamibFace_ZH-CN6782882876","Love_ZH-CN11474763511","SpringtimeinGiverny_ZH-CN8223989854","FalcoPeregrinus_ZH-CN12522703608","FishingWarehouses_ZH-CN12358243818","OakTreeMaize_ZH-CN10523296117","BushHyrax_ZH-CN9145408965","DolomitesBikeRace_ZH-CN10922620742","ManateeMom_ZH-CN9943350192","MontezumaSnowGeese_ZH-CN9467663976","HollowRock_ZH-CN11829527473","Kolonihavehus_ZH-CN6388656996","LongtailedWidowbird_ZH-CN7843068065","LulworthCoveDorset_ZH-CN6277179800","Knuthojdsmossen_ZH-CN11774377222","NOTricentennial_ZH-CN8971649459","Mariachis_ZH-CN12661065263","PKUCHINA_ZH-CN12651058425","Nazars_ZH-CN13550755131","EuropeanBarracuda_ZH-CN13968323163","SONC_ZH-CN9822965309","MaryLouWilliams_ZH-CN11937645356","RubyBeach_ZH-CN9208446641","GreatGhost_ZH-CN8881294926","YosemiteFog_ZH-CN8174427528","ClaretCup_ZH-CN12198280078","WindCaveBison_ZH-CN9135908894","SatelliteGlades_ZH-CN11389308210","HNPVisitors_ZH-CN13484945239","TreeHugger_ZH-CN10397384095","GrandPrismatic_ZH-CN10343735220","Grainrain_ZH-CN12722742960","TopDam_ZH-CN15313174603","WoodPartridge_ZH-CN11771370571","ChildrenHarpa_ZH-CN9564284589","MozambiqueSandbar_ZH-CN12673484802","PaintedForest_ZH-CN5613568462","DuskyDolphin_ZH-CN13328200928","VikingHouse_ZH-CN11841532410","SydneyClimbers_ZH-CN10946375168","ZhangjiajieLandscape_ZH-CN13434455714","ElephantSibs_ZH-CN13499373865","LenaDelta_ZH-CN9073097502","ResplendentQuetzal_ZH-CN10928079621","RiversMeet_ZH-CN12983242988","WalkingEmperor_ZH-CN12991365878","QingmingpeakingKite_ZH-CN11010837191","CardonCactus_ZH-CN11100360493","UmbriaCastelluccio_ZH-CN9645718473","SevenMagicMountains_ZH-CN9207394593","MarshmallowPeeps_ZH-CN7218406167","NationalSpring_ZH-CN12829622213","SplitVestibule_ZH-CN14312716793","HawaMahal_ZH-CN7259847753","HawaMahal_ZH-CN7126476273","NCGSLShorelands_ZH-CN10992961198","DragonflyMacro_ZH-CN9950962027","BrokenObelisk_ZH-CN11618156016","Poortersloge_ZH-CN11453345050","ToucanetEcuador_ZH-CN11298988903","PeruCanyonClouds_ZH-CN10405307621","WorldWaterDay_ZH-CN11747740536","Sunbird1_ZH-CN12058461588","TulipsEquinox_ZH-CN11213785857","DragonBridge_ZH-CN12321283639","XmasTreeRoad_ZH-CN11556502034","RossErrilly_ZH-CN11204408260","WolongPanda_ZH-CN10957042976","PaperboyoOctopus_ZH-CN9384087611","ToroidalBubble_ZH-CN10711997835","PulauWayagIslands_ZH-CN11954777980","Sanderlings_ZH-CN9697685009","OlomoucClock_ZH-CN14494749598","JohnstonCanyon_ZH-CN13093779174","DCCB_ZH-CN12497477745","FearlessGirl_ZH-CN8770808173","NovaScotiaIce_ZH-CN11765767656","Landsat7Bahamas_ZH-CN8824105008","SeattlePublicLibrary_ZH-CN9936150641","AustralianBaobab_ZH-CN9394891464","MountainCougar_ZH-CN11605954810","LanternFestial_ZH-CN13235289391","NewOldBridge_ZH-CN10652745389","ChurchillPB_ZH-CN11463903457","CactiIslaPescado_ZH-CN11317505000","WoolBaySeadragon_ZH-CN13348117046","PinnaclesHoodoos_ZH-CN11336386074","SwissFoxSnow_ZH-CN12291440880","CORiverDelta_ZH-CN9758155357","RomanTheatre_ZH-CN9417897135","InnerdalsvatnaVideo_ZH-CN11002526366","AyuttayaBuddha_ZH-CN8897274980","KoriBustard_ZH-CN9730794842","GHOwl_ZH-CN8350803282","OrangutanBaby_ZH-CN9942512858","WriteCouplets_ZH-CN11009087353","HongKongFireworks_ZH-CN13422096721","AgricultureHeart_ZH-CN12475262667","PreservationHallStage_ZH-CN8992559975","YungbulakangPalace_ZH-CN6941923546","TeRewaRewa_ZH-CN9356115127","BonifacioCorsica_ZH-CN12276076394","WhiteTiger_ZH-CN12326957209","SaltMountains_ZH-CN12959138910","KelpiesFalkirk_ZH-CN8885510040","CumberlandIsland_ZH-CN9225392774","StormySeas_ZH-CN9261044607","MonkeyGolden1_ZH-CN12125769581","UrbinoRooftops_ZH-CN9076169426","AustrianAlpineMarmots_ZH-CN10896836289","StubenamAlberg_ZH-CN9268418169","TartumaaEstonia_ZH-CN13968964399","GraniteDells_ZH-CN10095346278","VF5NASA_ZH-CN11291360478","KuhmoLapland_ZH-CN10084268975","BluePlankton_ZH-CN9721339029","EasternGrey_ZH-CN11969577596","SamiLavvu_ZH-CN10571430992","Fontainhas_ZH-CN10506085919","LMNP_ZH-CN10091686732","BirdseyeGGB_ZH-CN13809191544","ScotlandSquirrel_ZH-CN8943093073","TadamiTrain_ZH-CN13495442975","OldTownPrague_ZH-CN9399088386","BlueMushroom_ZH-CN10091152411","BarHarborCave_ZH-CN8055769470","LionFish_ZH-CN6318723202","HighlandCattle_ZH-CN6977858757","OrkneyIslands_ZH-CN7226700281","EnglemannSpruceForest_ZH-CN11994077642","TreasuryCandles_ZH-CN9281308713","BowSnow_ZH-CN10193462171","SamburuNests_ZH-CN11974788746","GreatFountainGeyer_ZH-CN11320043560","CloudForest_ZH-CN9578926154","StelvioPass_ZH-CN13895715460","PWSeaOtterPup_ZH-CN12769031922","PrudhoeOx_ZH-CN9011398773","ChoKyungChulStars_ZH-CN7777339561","SaunaDolomites_ZH-CN9230743969","TartanWeaving_ZH-CN8652723934","RosehipRobin_ZH-CN10943133314","NordketteNYE_ZH-CN12614598789","UKThamesBarrier_ZH-CN7996034899","PineZion_ZH-CN13789067332","HawaiiGST_ZH-CN13537794612","CPNYSnow_ZH-CN13335620157","GlisGlis_ZH-CN12580308968","LaplandAurora_ZH-CN13018939166","NorthPole_ZH-CN14730815128","SFSantaCon_ZH-CN11213292356","Wintersolstice1222_ZH-CN10807868228","SolsticeSquirrel_ZH-CN6551849968","PowysCounty_ZH-CN11115693548","ReindeerLichen_ZH-CN9944307835","Snowflake_ZH-CN7496591838","MGRBerlin_ZH-CN6734108494","TamarackCones_ZH-CN11326400685","SeychellesCCSS_ZH-CN9574865698","PlutoNorthPole_ZH-CN12213356975","Freudenberg_ZH-CN10942614197","Gnomes_ZH-CN14028221582","Jangothang_ZH-CN12592369551","SiberianJay_ZH-CN8167378429","FlightFest_ZH-CN9045713592","SibeliusMonument_ZH-CN8903164725","Snow_ZH-CN11178898651","MatusevichGlacier_ZH-CN13151914775","AberystwythSeafront_ZH-CN9542789062","Motherboard_ZH-CN12819254349","SchwetzingenAerial_ZH-CN11628382780","PotashPonds_ZH-CN13213047688","SpiralSpain_ZH-CN12059815472","Piraputanga_ZH-CN13303102627","LAUnionStation_ZH-CN8034711319","RiceLights_ZH-CN7549259687","BFBadger_ZH-CN8490916760","RRCNCA_ZH-CN8115353106","RhoneRiverDusk_ZH-CN7956980058","KatenaLuminarium_ZH-CN12074286571","TurkeyTail_ZH-CN10425367061","Forest20171122_ZH-CN11904842708","PupsPlayGalapagos_ZH-CN8090325795","ChildrenofEarth_ZH-CN11097669458","HeadwatersWilderness_ZH-CN9412867444","GranParadisoNP_ZH-CN10766803040","RoyalAlcazars_ZH-CN12033879324","CorongBeachDrone_ZH-CN12754210743","OlivesTunisia_ZH-CN11038020957","RosendaleTrestle_ZH-CN11277827091","PlanetariumBibliotheca_ZH-CN12150844356","SecretaryHunt_ZH-CN11125428449","LeuchtturmWarnemuende_ZH-CN8673593712","MudstoneBadlands_ZH-CN9863836503","HeronIslandShark_ZH-CN12565902939","PointArenaLH_ZH-CN12332642727","CRGFerns_ZH-CN13613783251","BudaCastle_ZH-CN8740088800","FoucaultPendulum_ZH-CN9807228543","PrusikPeak_ZH-CN10980657640","TaProhm_ZH-CN9310499614","ShanwangpingKarst_ZH-CN5360258756","Uummannaq_ZH-CN11265049839","HauntedGallery_ZH-CN7884856477","InspirationPoint_ZH-CN7836594587","KyrgyzstanCat_ZH-CN10422392512","Cotoneaster_ZH-CN13904488642","KemeriBog_ZH-CN10588444178","HallstattAustria_ZH-CN10534000934","TahquamenonFalls_ZH-CN9860471458","CatBaBoats_ZH-CN10815977512","Forest_ZH-CN16430313748","AmalfiCathedral_ZH-CN9007250446","HawaiiWave_ZH-CN13164844408","LaGrandeNomade_ZH-CN10098798714","GreatSaltLake_ZH-CN12553220159","Consuegra_ZH-CN10542201464","ElkValleyVideo_ZH-CN7645555683","ElandAntelope_ZH-CN15342367318","DerwentDam_ZH-CN8389406299","ScreechOwl_ZH-CN8838787484","CoastalBeech_ZH-CN8739604309","LittleAuks_ZH-CN9796184036","Rapadalen_ZH-CN11779950174","SoyuzReturn_ZH-CN9848773206","OrionNebula_ZH-CN10007648454","Mapleleaf_ZH-CN9491310356","VallesMarineris_ZH-CN10598461085","SweetChestnut_ZH-CN10220364928","SXSWTelescope_ZH-CN10124722940","Mooncake_ZH-CN10274798301","TimiderteKasbah_ZH-CN11865163382","RioGrandeCottonwood_ZH-CN10631006696","RedFlag_ZH-CN7582013591","SitanaPonticeriana_ZH-CN9845735476","MtIbukiyama_ZH-CN6882861958","KonikHorses_ZH-CN11260575341","LakePukaki_ZH-CN9412206565","TurpanDepression_ZH-CN12295576336","PrecipiceLake_ZH-CN10138285567","ErfurtOktoberfest_ZH-CN11152792740","Shanghai_ZH-CN10665657954","DollySods_ZH-CN10617200330","CorricellaMarina_ZH-CN11169480773","RotenbergVineyards_ZH-CN11483766655","Sparrowhawk_ZH-CN9288842659","AlgaeRocks_ZH-CN13979237458","GordesVillage_ZH-CN12231173457","CameronFalls_ZH-CN10061329609","ThamesEstuaryNASA_ZH-CN14893662770","CityPalace_ZH-CN7843237957","BandiagaraDogon_ZH-CN12463052433","CastlePointLH_ZH-CN13074557115","LanseMeadows_ZH-CN10703907742","PuntaEspinosa_ZH-CN12752702761","PoenariCastle_ZH-CN7423028629","PeabodyLibrary_ZH-CN9475175779","CrailHarbour_ZH-CN7775604832","SneffelsRange_ZH-CN9303969066","DosOjos_ZH-CN11530226887","FoehrAerial_ZH-CN10362288995","SWFC_ZH-CN9558503653","WestAU_ZH-CN11443537627","StorkCliffs_ZH-CN11006532238","ChamonixClouds_ZH-CN7700889231","GoldenTrevally_ZH-CN8976794546","OregonPainted_ZH-CN8553728911","BotallackCornwall_ZH-CN11396172846","BasongcuoNP_ZH-CN9819436811","BatEaredFox_ZH-CN12456670113","GustavAntiquities_ZH-CN9624291648","TubeAnemone_ZH-CN8077113499","AtchafalayaBasin_ZH-CN11978071492","MausoleumLovcen_ZH-CN11630158336","JantarJaipur_ZH-CN12917938653","YellowNPFirehole_ZH-CN14661526309","KingPhoto_ZH-CN13184031948","ChulillaSpain_ZH-CN10170248808","GoldenHorn_ZH-CN14570526834","AvalancheCreek_ZH-CN10917017134","QuakingAspens_ZH-CN11296287476","Hozoviotissa_ZH-CN13142561850","Kitesurfing_ZH-CN11259743343","LoxodontaAfricana_ZH-CN10434704249","CavernduPontdArc_ZH-CN9994344414","Huacachina_ZH-CN10037610442","HydricHammock_ZH-CN7896164965","AlaskaLynx_ZH-CN8211406639","HulunbuirPrairie_ZH-CN11677344846","AlesundNorway_ZH-CN9988504070","CaanaTemple_ZH-CN9714949581","BodieLighthouse_ZH-CN9415388071","LavenderProvence_ZH-CN9151247848","WhipCoral_ZH-CN10285480118","Nyala_ZH-CN13349334824","Mellieha_ZH-CN10970369201","MineralCliffs_ZH-CN11986913181","WaSqPk_ZH-CN9988391968","TempleStreet_ZH-CN7471755280","HuangshanClouds_ZH-CN11669699321","WilsonPeakWindow_ZH-CN10363033426","ReinebringenRidge_ZH-CN9518224182","RainbowLorikeets_ZH-CN10796666125","LosMonegros_ZH-CN14671427222","Econlockhatchee_ZH-CN10577234655","EborFallsVideo_ZH-CN9972229251","GlastonburyMoon_ZH-CN10251307154","Aldabra_ZH-CN8230193511","GeladaSimien_ZH-CN8344110980","CrescentCityConnection_ZH-CN10387208145","FelgueirasLighthouse_ZH-CN11182385822","ColorfulSalt_ZH-CN13586718897","TuileriesGardenWheel_ZH-CN12655332871","LagazuoiRefuge_ZH-CN12532053341","GhostCrab_ZH-CN13597716827","MartapuraMarket_ZH-CN9502204987","DerbyshireSheep_ZH-CN8057416029","Umbrellas_ZH-CN8739718706","CharcoAzul_ZH-CN9886873901","Umbrella_ZH-CN8238029705","SnailsKissing_ZH-CN7861942488","RestArea_ZH-CN13518721881","SonnenblumeHummel_ZH-CN13806822042","LongTailedBushtits_ZH-CN9781684264","ConeyIslandAerial_ZH-CN8660420119","SunwaptaFalls_ZH-CN10005625957","EuropeanFlamingo_ZH-CN10494194429","NorddorfPath_ZH-CN10408895135","JoshuaTrees_ZH-CN10998673288","CallanishSS_ZH-CN12559903397","MadagascarLemurs_ZH-CN7754035615","SanLorenzo_ZH-CN7625061136","HawaiiSwim_ZH-CN7233619332","MooneyFalls_ZH-CN11568488094","AKFox_ZH-CN8586782340","ChobeChick_ZH-CN9997116812","PlayaRoja_ZH-CN11120265765","AeoniumLeaf_ZH-CN7490448951","TurDad_ZH-CN11748481038","ThufaHill_ZH-CN8809655435","FireDragonfly_ZH-CN9623816108","TOAD_ZH-CN7336795473","WolfeCreekCrater_ZH-CN10953577427","NiemeyerCenter_ZH-CN8964518609","DinosaurPP_ZH-CN14544073422","MagnificentGBR_ZH-CN10789151183","LibraryofCelsus_ZH-CN11719117244","BalmhornRegion_ZH-CN7523037492","OceanCurrents_ZH-CN13704695457","Prayercard_ZH-CN13472871640","EtretatSunrise_ZH-CN10891175350","KaprunDam_ZH-CN9638804777","BluestripedFangblenny_ZH-CN10868881606","TexasBluebonnets_ZH-CN10361963785","PonteSantAngelo_ZH-CN15413822788","Playing_ZH-CN12541345417","MtTamVideo_ZH-CN10798436683","Zongzi_ZH-CN11342763382","WaldkauzDE_ZH-CN10024135858","MataderoBridge_ZH-CN9215461155","BromoJava_ZH-CN13278140077","Fiddleheads_ZH-CN14463697077","PyramidsOfMeroe_ZH-CN10667861825","BB1883_ZH-CN14845255336","Dipper_ZH-CN11205462091","LakePowellStorm_ZH-CN6822865622","zhejiangUniversity_ZH-CN11734938352","TorontoSkyline_ZH-CN9919114051","BMXTunnel_ZH-CN11405649743","Palaon_ZH-CN11145059144","SpermophilusArmatus_ZH-CN11634149121","PorthminsterBeach_ZH-CN10275083647","IncenseFactory_ZH-CN12321813125","CheetahMom_ZH-CN9990146737","DeltaJunction_ZH-CN9901755694","VernalFall_ZH-CN10631212377","SpringGoat_ZH-CN7669482496","WardCharcoalOvens_ZH-CN15946806125","WoodDucks_ZH-CN11650397660","TaihangMountains_ZH-CN6309298791","HenequenCactus_ZH-CN11794616839","MorskieOko_ZH-CN8809175725","Mythicalwildanimal_ZH-CN10176872488","SSAtlantis_ZH-CN10429588926","NavagioBeach_ZH-CN8854639142","QueensParkGlasshouse_ZH-CN11893975642","NHMElephants_ZH-CN9810396474","SouthMoravian_ZH-CN13384331455","SoundSuits_ZH-CN11561095548","SproutVideo_ZH-CN11890393462","SaronicGulf_ZH-CN8379891695","CivitadiBagnoregio_ZH-CN12942138675","AfricaWeaverbirds_ZH-CN9479498858","AlbertaTeepee_ZH-CN11572775476","MirrorBeach_ZH-CN12835554220","ZoomOut_ZH-CN4471982075","SolarFarm_ZH-CN4853771923","Farmers_ZH-CN10322126112","WallaceHut_ZH-CN12470084939","GlacierBay_ZH-CN14440689690","EuropeanRabbitGreeting_ZH-CN10625718769","GroundNest_ZH-CN8953105132","GrayWolf_ZH-CN9733727662","TitanicBelfast_ZH-CN7528306628","MVAU_ZH-CN9430011383","SpacewalkSelfie_ZH-CN10118363891","WindmillLighthouse_ZH-CN12870536851","ArcticFoxSibs_ZH-CN7417451993","TulipFestival_ZH-CN8467334837","KalsoyIsland_ZH-CN11586790825","PhrayaNakhonCave_ZH-CN10743752151","FreshSalt_ZH-CN12818759319","JulianAlps_ZH-CN11764181030","QingMingHuangShan_ZH-CN12993895964","DivingGondola_ZH-CN12331702472","LavaTubeIce_ZH-CN12266785340","MeerkatAmuck_ZH-CN5734433814","EarthArt_ZH-CN7715783871","CMLSCNP_ZH-CN12089840072","BellasArtes_ZH-CN9573521567","CommonRosefinch_ZH-CN10986839201","Hveravellir_ZH-CN12673758963","WildfireSapling_ZH-CN10766255059","SpainSpring_ZH-CN9613370360","NoronhaTwoBrothers_ZH-CN10642407566","LamarStorm_ZH-CN10021643995","GuizhouWaterfall_ZH-CN10955906714","DrizzlyBear_ZH-CN8074606058","TingSakura_ZH-CN14945610051","MatunuskaGlacier_ZH-CN11670641539","RiverofLife_ZH-CN8454523790","FiveFingersStrand_ZH-CN9284198785","MousaBroch_ZH-CN11732543982","SutroBaths_ZH-CN10530101768","EnhancedPinus_ZH-CN11908142325","HoliMunich_ZH-CN12353152381","PlungeDiving_ZH-CN11143756334","BlanchardSprings_ZH-CN10814394195","Dongdaemun_ZH-CN10736487148","SvalbardSatellite_ZH-CN11710008487","SuffragetteMuralNZ_ZH-CN11170622518","WatchtowerSky_ZH-CN8532519791","SteepSheep_ZH-CN8716398488","ButterflyWorld_ZH-CN11273971874","Aoraki_ZH-CN7776353328","SpringbokHerd_ZH-CN11603112082","Shiprock_ZH-CN11237156651","SommeBay_ZH-CN11043403486","BrassBandTrumpet_ZH-CN8703910231","RiverOtters_ZH-CN9287285757","GriffithPark_ZH-CN9871772537","Hoatzin_ZH-CN6642664963","ShengshanIsland_ZH-CN14229927013","ViennaOperaBall_ZH-CN10790748867","VenetianFortifications_ZH-CN11140565989","MartianCrater_ZH-CN9867068013","YorkshireWinter_ZH-CN9258658675","Vieste_ZH-CN7832914637","TorronsuoSwamp_ZH-CN8711557344","PutoranaPlateau_ZH-CN11394761356","TwilightEpiphany_ZH-CN11612238738","ElephantsWalking_ZH-CN8959341729","JavaSparrow_ZH-CN10576911084","HallwylfjelletSunset_ZH-CN9300910376","PalaudelaMusica_ZH-CN12110358984","LanternSale_ZH-CN13256517653","BoardmanOR_ZH-CN10440697273","LophophorusImpejanus_ZH-CN10675050048","ItapuaLighthouse_ZH-CN10867280946","UtahLakeSunrise_ZH-CN7904195051","TowerofLight_ZH-CN11745498179","VolunteerPoint_ZH-CN7941283677","PadleyGorge_ZH-CN7693050245","Shimaenaga_ZH-CN14747993510","ScottishSquirrel_ZH-CN11794261635","GBRISS_ZH-CN10195808313","FlameTowers_ZH-CN10904980589","SpringCouplet_ZH-CN16366435588","DoorGods_ZH-CN12360444323","ChineseGoldenPheasant_ZH-CN12693021758","Chopstics_ZH-CN11978203109","DovrefjellMuskox_ZH-CN14069563613","VillersAbbey_ZH-CN10373383330","LuciolaCruciata_ZH-CN9063767400","MontBlancVideo_ZH-CN9230432404","PfeifferBeach_ZH-CN13868196659","GentooPenguinVideo_ZH-CN9979103072","IceSculptures_ZH-CN12032666081","MinervaTerrace_ZH-CN10705203937","MountOTemanu_ZH-CN10516512008","LasMedulasFrost_ZH-CN10300016604","BehindTheFalls_ZH-CN6370841810","GreatCourt_ZH-CN11131065922","KongdeRi_ZH-CN11743396085","MacaquesWulingyuan_ZH-CN8705472129","TempleOfValadier_ZH-CN13184904528","NASAEgypt_ZH-CN10985844646","EifelNPBelgium_ZH-CN12131884508","RossFountain_ZH-CN11490955168","TrakaiIslandCastle_ZH-CN14067567252","CalevCoyote_ZH-CN8657167059","RoyalBarge_ZH-CN8556739705","MacawFlight_ZH-CN10427294606","LakeWakapitu_ZH-CN11335950566","CarWash_ZH-CN12705750866","CabinetClimber_ZH-CN8091149480","HongKongEye_ZH-CN12285832688","WinterOwls_ZH-CN11633542284","ZellerHorn_ZH-CN7123868469","AthabascaCanyon_ZH-CN11032342866","GrusJaponensis_ZH-CN8553179454","ColorfulTromso_ZH-CN9894938772","SouthamptonCommon_ZH-CN8102690225","SnowGlobeVideo_ZH-CN8461656803","BelarusDeer_ZH-CN10349578779","TheDomeEdinburgh_ZH-CN11993142817","ManhattanBeach_ZH-CN10916747728","AncientpeopleSkating_ZH-CN10472124556","SaguaroLights_ZH-CN11691459871","ElmiraTreeFarm_ZH-CN8716369223","CandyCaneSeaStar_ZH-CN8947157877","Farolitos_ZH-CN12055626406","SwitzerlandSunset_ZH-CN8198492507","VelikoTarnovo_ZH-CN11165433151","MicoDeNoche_ZH-CN10514469675","CircularBarn_ZH-CN10350401093","KazakhstanNasa_ZH-CN9791985430","WarmiaPoland_ZH-CN13324541925","CliffPalaceLuminara_ZH-CN10279459718","JungfrauClimbers_ZH-CN11867441596","RoundWalkway_ZH-CN10197024907","AidlingerHoehe_ZH-CN11764360351","HuangShanS_ZH-CN13503227356","Semiconductor_ZH-CN9271532081","Quinoa_ZH-CN9445647519","RedGrouseScotland_ZH-CN11977270993","ResurrectionBay_ZH-CN10718475653","CiervaCove_ZH-CN10404920946","CattleEgrets_ZH-CN8513428115","GrizzlyPeakSFVideo_ZH-CN11282703590","LondonRadiometers_ZH-CN12114654989","VictoriaTower_ZH-CN13097406171","ThailandWaterfall_ZH-CN7044305410","RissaTridactyla_ZH-CN9552683179","BlackchurchRock_ZH-CN9991716795","CalbucoVolcano_ZH-CN7246641564","KuanmiaoNoodles_ZH-CN11859888841","TurdaSalt_ZH-CN8549125738","WallPaintingChildren_ZH-CN7327764062","VirginRiver_ZH-CN13069045342","IlluminatedMushrooms_ZH-CN10061659106","BeaujolaisNouveau_ZH-CN8322497216","MountScott_ZH-CN8412403132","HeronSilhouette_ZH-CN7435340158","Hungerburgbahn_ZH-CN12632091555","FlindersGranite_ZH-CN10776618323","IgelHerbst_ZH-CN7813320285","SingleCrane_ZH-CN11987665683","PingganVillage_ZH-CN10035092925","ArcticHenge_ZH-CN8197982391","NottulnHerbst_ZH-CN9638949027","IcyWaterfull_ZH-CN13699207169","UnionStationToronto_ZH-CN10376164284","ApurimacRiverBridge_ZH-CN13064248684","GoldenHouten_ZH-CN8874322377","CanoCristales_ZH-CN12281532336","JamnikSlovenia_ZH-CN12254942310","SkullMural_ZH-CN10342183481","Halloween2016_ZH-CN7682362704","RedMaple_ZH-CN13551827423","NightLeopard_ZH-CN12938329877","FlyingFox_ZH-CN11177580940","TransylvaniaMist_ZH-CN11749467591","GreaterKudu_ZH-CN8868031087","Eyjafjallajokull_ZH-CN7486636209","KingRiver_ZH-CN12008036815","RanwuLake_ZH-CN12859816630","MountTarawera_ZH-CN9325208378","MuseumClouds_ZH-CN12976052707","YorklynCoveredBridge_ZH-CN9725813153","HalongBayVideo_ZH-CN9374479696","TheForadada_ZH-CN8007497690","GreaterFlamingos_ZH-CN13656214069","VaranasiBoat_ZH-CN8290748524","LacsdesCheserys_ZH-CN10032851647","MosierCherryOrchards_ZH-CN5969284234","WaddenSeaIsland_ZH-CN11536663361","MadeiraTrails_ZH-CN11087101725","YellowFrontedWoodpecker_ZH-CN12671581596","JamesWebbSpaceTelescope_ZH-CN12268483856","SiberiaFoliage_ZH-CN9019501731","LightsBerlin_ZH-CN8584269528","ScotlandHarbourSeal_ZH-CN14004018027","HongKongVideo_ZH-CN8807831395","PenguinSchool_ZH-CN12747614562","NASABahamas_ZH-CN9199428580","CliffDwelling_ZH-CN11875663989","LastNightProms_ZH-CN6602411502","YongdingFloor_ZH-CN13975440516","RakotzBridge_ZH-CN9323170058","WhooperSwans_ZH-CN14237745323","MontVentoux_ZH-CN13938704019","FentonLake_ZH-CN12244750610","ConcertHallReykjavik_ZH-CN9594278223","WickerVillage_ZH-CN7840880999","BrownHares_ZH-CN6625339934","GreatSandDunes_ZH-CN9339214708","HarvestedRice_ZH-CN13176366387","CheshireAutumn_ZH-CN9485229632","LadakhIndia_ZH-CN9406594317","Castelmezzano_ZH-CN12653760581","SofiaBulgaria_ZH-CN11033924029","OktoberfestRide_ZH-CN11055319166","WebbChapelParkPavilion_ZH-CN11684993453","MoonCakeMold_ZH-CN11119629461","UmpquaLichen_ZH-CN10130045538","Meteora_ZH-CN6763889417","RedSeaWhip_ZH-CN9478576547","LakeSuperior_ZH-CN8092503607","YonneRiver_ZH-CN12864189829","ScotsPine_ZH-CN12887650002","Stadsbiblioteket_ZH-CN6055045711","Dongjiang_ZH-CN10434068279","PhnomKulenNP_ZH-CN10975081651","UrbanPainters_ZH-CN8992212566","PortageValley_ZH-CN9734172700","MoscowSkyline_ZH-CN10266976296","SnowdoniaAlgae_ZH-CN15321911268","SalteeGannets_ZH-CN12304087974","BonifacioCliffs_ZH-CN10939302737","CircularIncaTerraces_ZH-CN12305945804","BurchellsZebra_ZH-CN15870118056","TreeRiverNunavut_ZH-CN10909820346","TuscanSheep_ZH-CN8090211315","Markthal_ZH-CN11336253538","PinnaclesNP_ZH-CN9665317661","TempleofJupiter_ZH-CN12720734647","Tibetlandform_ZH-CN11243492345","NazcaLines_ZH-CN10481196093","SugarLoafTramVideo_ZH-CN8730080670","LasTeresitasBeach_ZH-CN13683812698","KingFisherPhoto_ZH-CN11985479914","DryTortugas_ZH-CN9392694652","HatsuhinodeOarai_ZH-CN9858647947","MariaLenkDive_ZH-CN10833846465","BilberryLynx_ZH-CN9292650644","KerichoTea_ZH-CN7126476900","MahoBayPalms_ZH-CN10739743006","AddoElephants_ZH-CN13744097225","ChicagoHarborLH_ZH-CN9974330969","LouisianaPurchaseExposition_ZH-CN11859050927","WhiteSwan_ZH-CN12970644283","MarSaba_ZH-CN12470933866","Shaiqiu_ZH-CN11319335057","SachsischeSchweiz_ZH-CN10640382929","MaracanaFireworks_ZH-CN9834580695","WildGardens_ZH-CN12707941302","SunsetDartmoor_ZH-CN8298298012","HarbinOperaHouse_ZH-CN10126072780","GFLions_ZH-CN10964337001","KohPanyi_ZH-CN12194565147","CoraciasGarrulus_ZH-CN8070892801","RoyaleNP_ZH-CN7784462387","Castelluccio_ZH-CN13949453635","Coot_ZH-CN9795916145","TowerBridgeVideo_ZH-CN9340207782","BadlandsHeadlights_ZH-CN11986873693","ZanzibarRedColobus_ZH-CN11792109900","BluePondJapan_ZH-CN9068810300","Bittermelon_ZH-CN13629728807","HubeiSinkhole_ZH-CN8831229647","BloodMoonVideo_ZH-CN9099765312","NeonMuseum_ZH-CN8131993872","DiamondHead_ZH-CN8551687099","MuizenbergSA_ZH-CN9407386955","ValleyofYzer_ZH-CN8001552912","KenaiFjordsHumpback_ZH-CN10219728807","WatchmanPeak_ZH-CN11491247109","BangkokNightMarket_ZH-CN11275629598","CathedralCove_ZH-CN11007944088","ISSLondon_ZH-CN10573587286","MochoPuma_ZH-CN14722409029","OsterseenAerial_ZH-CN9999822646","HurricaneRidgeTiger_ZH-CN11087235010","TerracesSunrise_ZH-CN11993554223","ReichstagDome_ZH-CN9358724121","QuaiBranlyMuseum_ZH-CN10941225231","KientzheimVineyards_ZH-CN9908740039","SchonbrunnPalace_ZH-CN11907034371","BathurstBay_ZH-CN15704350271","DiaDosNamorados_ZH-CN10966266512","DwarfFlyingSquirrel_ZH-CN11085553814","KansasCropCircles_ZH-CN9416992875","ChajnantorPlateau_ZH-CN12301284682","CallunaVulgaris_ZH-CN11090416298","Ankarokaroka_ZH-CN11142232223","TakachihoGorge_ZH-CN10050763703","MesquiteFlatDunes_ZH-CN7882451661","MateraItaly_ZH-CN9251776262","Kobbvatnet_ZH-CN9386702650","SunTunnels_ZH-CN6830170234","SAGiraffe_ZH-CN9361468907","MarmosetDad_ZH-CN13409579692","CarolineAtoll_ZH-CN13285093461","CanyonlandsNP_ZH-CN12598047863","PerceRock_ZH-CN12739516630","OrienteStation_ZH-CN8775637045","BomboHeadland_ZH-CN9339065341","DulangIsland_ZH-CN7669462147","MtDurmitorIceCave_ZH-CN11432825802","MehrangarhFort_ZH-CN10601634968","BlackCanyonOTGunnison_ZH-CN9471134282","DragonboatRace_ZH-CN12096105830","AntarcticaWhaleTale_ZH-CN8744692760","HobaMeteorite_ZH-CN11830101057","PointeduHoc_ZH-CN11859984732","MuseumLudwig_ZH-CN10409675972","MacrocystisPyrifera_ZH-CN11161093267","YellowstoneForest_ZH-CN8610351993","CornwallCoast_ZH-CN6959932566","PupilsPerforming_ZH-CN12566659717","ToSuaOceanTrench_ZH-CN12994567053","HalligNorderoog_ZH-CN12356376064","MarrakechSilk_ZH-CN10945402567","DesertViewWatchtower_ZH-CN12476715071","NamibDesertOcean_ZH-CN6699617236","SkunkKit_ZH-CN10809503929","ShastaVideo_ZH-CN10595902413","ShanghaiElevatedWalkway_ZH-CN8623422930","CanaryIslandsTurtle_ZH-CN8309161098","Burano_ZH-CN11357493539","CongareeNP_ZH-CN12532251019","Paraglider_ZH-CN9008416506","TidalArt_ZH-CN8635017737","BiosphereMuseum_ZH-CN5219749260","IceCaveOR_ZH-CN10851720546","PuttyBeach_ZH-CN8972640560","RockyMtFox_ZH-CN11501547462","RainierMilkyWay_ZH-CN9404321904","ParkOfTheMonsters_ZH-CN8843541081","ThailandLavender_ZH-CN13975486252","DolwyddelanCastle_ZH-CN8710802797","HMSThistlegorm_ZH-CN12781430511","WildRedApricots_ZH-CN9525359187","SealionMom_ZH-CN13692181116","GatesArcticNP_ZH-CN8641390082","CapeWhiteEye_ZH-CN7432014343","RedDragonfly_ZH-CN11611766831","YouthDay_ZH-CN9864768020","Roraima_ZH-CN12309996403","RadioChamber_ZH-CN7811618623","RicePaddyVideo_ZH-CN9222976985","GuadalupeCloudsNP_ZH-CN11100498951","RoudseaWood_ZH-CN12889083521","PalmitasMural_ZH-CN10215774743","Kestrel_ZH-CN10242518763","Plumeria_ZH-CN10955138144","Taghit_ZH-CN10846599174","LongTailedGlossy_ZH-CN13193173719","VolcanoesNP_ZH-CN11778388181","BlackSea_ZH-CN9772885358","TorontoJoggers_ZH-CN13754389918","BigHornSheep_ZH-CN6358178150","SichuanTerracefield_ZH-CN10274952912","MontyPSwallow_ZH-CN8057492718","MilkyWayLadakh_ZH-CN7734727282","ShenandoahNP_ZH-CN9981989975","CabodeGata_ZH-CN12858688851","GareSaintLazare_ZH-CN6611772290","SingingRingingTree_ZH-CN12497946624","UgabRiver_ZH-CN9917952183","ZaraSpringCave_ZH-CN7466385031","CoffeeSprouts_ZH-CN11927552809","FriendshipSquare_ZH-CN8820626148","OldLibrary_ZH-CN12553861473","BaliTemple_ZH-CN9081088148","HistoricOlympics_ZH-CN7402465348","Selenite_ZH-CN9667731332","YunqiPagoda_ZH-CN8617576614","CaCO3_ZH-CN8070420833","BaconCreek_ZH-CN8128739634","PuffinRock_ZH-CN8849180279","WhitePocket_ZH-CN12539562230","WestBow_ZH-CN11767628474","MesseHall_ZH-CN8032841463","DallolEthiopia_ZH-CN11253814939","RabbitIsland_ZH-CN10320047201","Gaztelugatxe_ZH-CN11078922437","UnderwaterWalrus_ZH-CN9352535771","FoxRiverWisc_ZH-CN7674188307","GermanyHoli_ZH-CN11395323110","DyjandiFalls_ZH-CN11254212344","VernalEquinoxOrchid_ZH-CN10226406786","CrocusTL_ZH-CN8515008680","FishParkCorsica_ZH-CN11289010888","FrogTadpole_ZH-CN10186824604","NLIReadingRoom_ZH-CN13259592233","AzureWindow_ZH-CN8863680074","AzoresPortugal_ZH-CN12684313303","GlobeSculpture_ZH-CN14987283809","GreatBearRainforest_ZH-CN9137026528","TokamichiBeechForest_ZH-CN9795569723","PineWarbler_ZH-CN8925328026","DragonHeadsRaising_ZH-CN9424180768","MangroveRoots_ZH-CN10720576635","IzmirFaceWall_ZH-CN8661261728","CapeSebastian_ZH-CN9469145123","FireEscapes_ZH-CN9251582421","LaurelMoss_ZH-CN9578543974","WinthropBalloon_ZH-CN12962779974","SaffrondropBonnet_ZH-CN11415710429","BerneseAlps_ZH-CN9347506837","WildBoarPiglet_ZH-CN10962495442","HenkelGecko_ZH-CN11306915158","ThingvellirCrater_ZH-CN10532060195","CubsPlaying_ZH-CN10631979300","LaPedrera_ZH-CN9374830496","IcelandAurora_ZH-CN6140649446","Snowboard_ZH-CN12050607515","MountHuaSnow_ZH-CN10489400024","JinliStreetView_ZH-CN10751235981","GlowWorms_ZH-CN10708592012","WhiteNightMelb_ZH-CN9705829579","AdelaideFrog_ZH-CN11037278287","Pluto_ZH-CN12044921779","GGBView_ZH-CN13606118254","BetAmanuel_ZH-CN7364286844","Eistobel_ZH-CN9499709851","CourtingCranes_ZH-CN10152658125","BledSnow_ZH-CN8899741731","TallGrass_ZH-CN12379752699","SalzachRiverVideo_ZH-CN10853485740","HeartHoleDivers_ZH-CN12875142412","SquirrelBowl_ZH-CN6988757053","SnubNosedMonkey_ZH-CN11146495688","TraditionalBanners_ZH-CN8428576502","PiandiGembro_ZH-CN12053478103","PondHockey_ZH-CN10274758143","WillersleyCastle_ZH-CN9891472014","BangkokVideo_ZH-CN8369071701","UpsideDown_ZH-CN11824550636","FarmSnowVillage_ZH-CN11121852629","H3Interstate_ZH-CN8375763508","HammockCypress_ZH-CN10587366950","AxiaVillage_ZH-CN10956625064","CityLightsSpace_ZH-CN12579190694","LeafTailGecko_ZH-CN11190252441","AyersRock_ZH-CN10361596489","FjordPano_ZH-CN9603983993","CapeWAPenguin_ZH-CN7483510577","DiospyrosKaki_ZH-CN11250217537","SeychellesTidalChannels_ZH-CN15832108727","ThreeToeSloth_ZH-CN14314092916","FiveColoredPool_ZH-CN12673763949","KakhetiaGeorgia_ZH-CN9615415406","LlynIdwal_ZH-CN8763664463","WhitefishSnow_ZH-CN10459486257","DubaiSpices_ZH-CN10807257049","PlitviceSnow_ZH-CN8139427353","MuybridgeVideo_ZH-CN9279995684","RainbowPanorama_ZH-CN8107993326","BundlesWool_ZH-CN8345676262","PolandWinter_ZH-CN11003553401","UnderwaterRays_ZH-CN13402231897","RockyFog_ZH-CN9992953522","StoatWinter_ZH-CN8766454928","WaterCisterns_ZH-CN12987144428","HSMountainMist_ZH-CN9530091055","RWBlackbird_ZH-CN7920273020","RedLakeBolivia_ZH-CN12956356143","TutankhamunMask_ZH-CN11157835683","GapstowBridge_ZH-CN9569411106","PolarBearPlunge_ZH-CN11777095530","SalzburgFireworks_ZH-CN12027615955","HarzerSchmalspurbahnen_ZH-CN14210913008","MLCubs_ZH-CN10166297846","KyotoBamboo_ZH-CN7740124234","MercantourNight_ZH-CN7018234063","Knaresborough_ZH-CN11690958280","OuluReindeers_ZH-CN7661208993","JuneauXmas_ZH-CN13726790431","SnowySquirrel_ZH-CN13973676590","SichuanEmeishan_ZH-CN12735175923","BCVanDusenLights_ZH-CN8651218193","BraunschweigXmasMarket_ZH-CN10208061180","JasperTrees_ZH-CN10000830186","ZionvilleXmasTrees_ZH-CN7637280983","HudsonBayPolars_ZH-CN10500767857","SalzburgOldTown_ZH-CN8279522266","NorrisGeyserBasin_ZH-CN10944194381","CorfeCastle_ZH-CN10618481964","LotusLeaf_ZH-CN9424974136","CemoroLawangCrater_ZH-CN10441912392","Echidna_ZH-CN9102258970","PalmTreePantanal_ZH-CN12515523449","GoatIslandLighthouse_ZH-CN9812058165","GalapagosSealion_ZH-CN11031087950","MourningDoves_ZH-CN10786728372","NamibiaQuiverTree_ZH-CN8681522145","GeladaBaboons_ZH-CN11015062372","IngolfshofdiBlackSand_ZH-CN9362134214","OverlandPark_ZH-CN7518447869","BearGlacierLake_ZH-CN11648553737","KenrokuenGarden_ZH-CN11375106351","Modica_ZH-CN12563546966","SedonaOakCreek_ZH-CN11123305278","AlnwickCastle_ZH-CN12461054008","BlastFurnace_ZH-CN11344808376","PyreneanChamois_ZH-CN9159125804","MarineIguana_ZH-CN11562089597","LoyKrathong_ZH-CN8181441727","LifeDebut_ZH-CN8528357751","WutaiShan_ZH-CN11539784721","LakeSuperiorPP_ZH-CN12396304275","Archie_ZH-CN11903785706","BlackGrouse_ZH-CN10911461650","XinjiangLake_ZH-CN10121291088","OverReykjavik_ZH-CN9040255350","SunriseEiffel1_ZH-CN10117205035","SunriseEiffel1_ZH-CN9889799616","EpupaFalls_ZH-CN11219086568","LoopRock_ZH-CN12808378419","Janitzio_ZH-CN11702944992","WhiteBluffsWilderness_ZH-CN12542600933","SleafordBayStars_ZH-CN9878647892","ChinatownSingapore_ZH-CN11137645109","CatumboLightning_ZH-CN12441529580","IceRimmedTrees_ZH-CN14952513018","CrownPoint_ZH-CN7204481454","YellowAnemoneVideo_ZH-CN12378170981","IlulissatGlacier_ZH-CN10597824948","HuntingOwl_ZH-CN9589423574","MaroonBellsVideo_ZH-CN9667920788","Cyclops_ZH-CN12843334634","DeadMariachiBand_ZH-CN9181476140","Halloween_ZH-CN8830370571","MarshallPointLighthouse_ZH-CN15642651331","SunbloodMountain_ZH-CN12668256443","StagUK_ZH-CN10312994291","NYCSubway_ZH-CN10474619955","LiRiverGuilinVideo_ZH-CN9077481188","CarresqueiraPortugal_ZH-CN7381172635","WeepingWillow_ZH-CN10750590093","ChartresCathedral_ZH-CN10406632878","LofotenVideo_ZH-CN13780841105","ChigmitMountains_ZH-CN13222302926","CrestedPigeon_ZH-CN11090922142","SparkArt_ZH-CN12333295162","TetonAspenGolden_ZH-CN12183994252","FlatironBuilding_ZH-CN11152945423","GemsbokFight_ZH-CN10139164269","RapaRiverDelta_ZH-CN8466426193","TarsierVideo_ZH-CN11339065267","ChaniaCrete_ZH-CN13602044123","SegoCanyon_ZH-CN14995529596","CayeuxSurMer_ZH-CN11595450139","IsabelaIsland_ZH-CN10657686554","MossDroplets_ZH-CN9959053333","WuyuanMorningMist_ZH-CN12161689041","NapoRiverMoth_ZH-CN9190128397","ElephantTrunkHill_ZH-CN12777217952","PretzfeldRegenbogen_ZH-CN8298443827","CarinaNebula_ZH-CN11667585319","NYFallFoliage_ZH-CN9571426311","ColorfulFacade_ZH-CN9611439569","FireworksHuangLongxi_ZH-CN9710089628","HooverBday_ZH-CN9980812747","RoverSelfie_ZH-CN6914958241","MaunaKea_ZH-CN11895121205","StoneBridgeMoonrise_ZH-CN9003736777","BlackwaterFalls_ZH-CN10824353954","JapaneseFlyingSquirrel_ZH-CN13057615880","JaswantThada_ZH-CN12492852271","XinjiangAltaiMountains_ZH-CN12714378532","Hobbiton_ZH-CN11259204468","IxtapaJellyfish_ZH-CN9411866711","LakeMyvat_ZH-CN9633085054","BratwurstPolka_ZH-CN13791851201","Charoite_ZH-CN12214915707","SegoviaVideo_ZH-CN11936776081","CapReefMilky_ZH-CN15296973338","BirchTreesChina_ZH-CN9148200557","BlackNapedMonarch_ZH-CN13391768581","GreySeals_ZH-CN10078575122","UnaLagoon_ZH-CN11291682527","GorgesOfTarn_ZH-CN10940261268","HangSonDoong_ZH-CN6876052785","CoalTitVideo_ZH-CN7865623960","LeafcutterAnts_ZH-CN13590580459","BrooklynHeights_ZH-CN9036840807","NaturalBridgesStateBeach_ZH-CN12512693578","GreetingtotheSun_ZH-CN13553844047","FloreanaIslandSeaLion_ZH-CN12024860324","CanadianSnails_ZH-CN13917940387","StrokkurGeyserVideo_ZH-CN13059478273","SchoolBusLot_ZH-CN10293629077","MetropolParasol_ZH-CN11625084990","NileCrocodile_ZH-CN7817329386","NorthwoodsLilypads_ZH-CN8659668688","PolderLandscape_ZH-CN10061002974","GeckoRain_ZH-CN13742891184","CapeGannetDiving_ZH-CN12111568546","YellowstoneVisitors_ZH-CN9644719403","HongKongLightning_ZH-CN9224052399","ChinaAutumnLandscape_ZH-CN10360093291","SpectacledBear_ZH-CN11178016976","LongPineKey_ZH-CN12443126642","BirdsChinaGuilin_ZH-CN10157832447","BushPlane_ZH-CN7578511023","Mulbekh_ZH-CN12249299597","UBeinBridge_ZH-CN5687781877","AlNeversinkPit_ZH-CN10271991250","BristleHaircaps_ZH-CN6150105771","WarwickLongBay_ZH-CN11550416934","NehruTrophy_ZH-CN9210231821","WorldElephantDay_ZH-CN12477118128","ShastaStars_ZH-CN8155999354","AntelopeCanyonVideo_ZH-CN11344057043","SingaporeFifty_ZH-CN10442478872","ChinaAutumnMuseum_ZH-CN14314118259","CenoteSamula_ZH-CN12486464241","VolcanoRoadCR_ZH-CN10650264098","NorwayShipwreck_ZH-CN12855473591","GatesheadMillenniumBridge_ZH-CN10038150975","AmericanBison_ZH-CN8189996626","SiestaSudo_ZH-CN10626890998","AdriaticBeach_ZH-CN13639992389","Waterlicht_ZH-CN9576556525","FlorenceView_ZH-CN14082192121","LazyPandaVideo_ZH-CN9568980460","FukuokaTower_ZH-CN10994498941","ScotlandHighlandsBagpiper_ZH-CN11637888366","LewaAcacia_ZH-CN12653988469","LavenderValensole_ZH-CN8864890140","MoonDayMontage_ZH-CN6916444536","BlackSkimmers_ZH-CN9011109118","BeachZhujiajian_ZH-CN13178814760","WhaleSounds_ZH-CN8137323585","BrusselsGrandPalace_ZH-CN10670005342","LagosPortugal_ZH-CN6806519428","SSGreatBritainBow_ZH-CN9327485796","PolandFarm_ZH-CN8996996551","LakeOHara_ZH-CN9510476578","TigerAndTurtle_ZH-CN8939038110","OuroPretoTheater_ZH-CN7454349982","ParisBlueHour_ZH-CN11022409858","SchoolsOut_ZH-CN12792955240","MoussaCastle_ZH-CN10376714610","RockDrawingsAust_ZH-CN10750434878","BahamasMangroves_ZH-CN12069597534","NewZealandWaterfall_ZH-CN9348197344","SabiSandsLion_ZH-CN10069294749","SunsetShandong_ZH-CN12848817102","StiltFishing_ZH-CN11682977919","GoldenTemple_ZH-CN9175921164","SpiderRock_ZH-CN11137142079","LochInchardRainbow_ZH-CN12494451233","YalaNPPeafowl_ZH-CN7079851094","NumaFalls_ZH-CN12843492728","BretignollesBeach_ZH-CN11740592449","Eibsee_ZH-CN8283277931","Torcross_ZH-CN9439774994","MtKenyaNPLobelia_ZH-CN8533155597","KakkuRuins_ZH-CN11270063690","SacramentoWildlifeRefugeGeese_ZH-CN7092330832","CapodOrlando_ZH-CN11935566727","AdjderOasis_ZH-CN13140335145","WaterliliesYuanmingyuan_ZH-CN10533925188","GiraffeDad_ZH-CN10813223094","DragonBoatArt_ZH-CN8202885570","TunnelofLove_ZH-CN13399999419","Gerenuk_ZH-CN11282442291","OlympicIliad_ZH-CN11239591679","PainshillParkGrotto_ZH-CN11107435187","AlgaeAerial_ZH-CN12058812432","LobsterBaskets_ZH-CN11657857425","CedarBreaksNationalMonument_ZH-CN9963316796","MacarelletaBeach_ZH-CN7253608548","ColorfulCoral_ZH-CN9675265935","Madeira_ZH-CN12448190736","BarnOwlSloMo_ZH-CN10624508535","PlanktonBloom_ZH-CN9864450155","VillandryCastleGardens_ZH-CN11165123265","DenaliSummit_ZH-CN10402637092","WorldEnvironmentDay_ZH-CN11111220832","KilaueaVideo_ZH-CN11129290586","PerugiaFarmland_ZH-CN7979341640","CozumelIslandCoati_ZH-CN9434758361","BoyPettingFish_ZH-CN10875004601","ALMA_ZH-CN8941423090","MusiaraMarshImpalas_ZH-CN11126453267","SonDoongCave_ZH-CN12773932209","PalaisDuPharo_ZH-CN6551548558","FudanAni_ZH-CN13023015076","LivingRootBridge_ZH-CN11654794860","BoscastleHarbour_ZH-CN11554881502","Sossusvlei_ZH-CN4810146255","WienESC_ZH-CN12726202236","CraterLakeRainbow_ZH-CN10499946200","ColoradoRiverVideo123_ZH-CN8625849029","LeSuquetCannes_ZH-CN11144907325","EmperorPenguinSnowstorm_ZH-CN13809319276","LionRockHongKong_ZH-CN9495964374","BlackWolfHowling_ZH-CN11252800269","MenhirMonuments_ZH-CN10563944528","TwoBirdsPerching_ZH-CN9738679795","BlacktailPrairieDogs_ZH-CN12370088466","BirdsSpringtime_ZH-CN10896984323","MarinaBaySingapore_ZH-CN8820214384","HouseBoats_ZH-CN9470383719","CanisLupus_ZH-CN11650243872","SnowGooseMigration_ZH-CN6893121806","PoValleyPoplars_ZH-CN13835327700","SwaminarayanAkshardham_ZH-CN11337122694","WaterlilyPond_ZH-CN11638696115","DadesValley_ZH-CN9829262089","KokneseCastle_ZH-CN11038977891","LostCity_ZH-CN6934414153","RedTulips_ZH-CN12305501679","AzureLakeWithTrees_ZH-CN8506065959","ErethizonDorsatum_ZH-CN15617483967","HamburgFountains_ZH-CN8568444551","DevetakiCave_ZH-CN13229318639","KelpGoose_ZH-CN11521792782","LihuBridge_ZH-CN13125700510","WhiteRhinos_ZH-CN9341942207","RosesMosque_ZH-CN8169265472","JapaneseRobin_ZH-CN8983153090","HohRainForest_ZH-CN11359548132","Husafell_ZH-CN9632204692","RiceHarveStation_ZH-CN10510113047","TulfesTyrol_ZH-CN11110819205","PearLake_ZH-CN8058573080","GreatCrestedGrebes_ZH-CN10010301297","UchisarCastle_ZH-CN10268966547","luminatedCarColorfulLights_ZH-CN8885194597","PhysalisAlkekengi_ZH-CN7736362616","BentsSask_ZH-CN12561671211","MTPygmyOwl_ZH-CN10908654673","YoungLambsFrolicking_ZH-CN7661065447","NorthernLights_ZH-CN8340546325","GivernyGardenSpring_ZH-CN10810313305","DolomitesCloudsVideo_ZH-CN7491385176","JoshuaSnow_ZH-CN9151029740","CliffsofMoher_ZH-CN10158535412","Mononoke_ZH-CN12525088823","PetrifiedForestNP_ZH-CN10820635777","NightViewWuTown_ZH-CN9812523916","LechAustria_ZH-CN7190263094","FortBourtange_ZH-CN9788197909","ManateeDay_ZH-CN10394521613","NebraskaSuperCell_ZH-CN11286079811","MontSaintMichelAbbey_ZH-CN10267045783","MovingWalkway_ZH-CN9842297711","ElevatedViewOfCasinos_ZH-CN9956621119","TheLuxorHotel_ZH-CN12121725266","FlamingoCasinoNeon_ZH-CN12390102945","ExcaliburHotel_ZH-CN8912983643","TheVenetianHotel_ZH-CN14615646540","ViewAcrossLasVegas_ZH-CN13501737392","CinderCones_ZH-CN12230475386","GordonDam_ZH-CN12987422647","UrsusMaritimus_ZH-CN9497747141","PoplarTreesTaklimakan_ZH-CN11233609800","BasecampTrek_ZH-CN7467994958","CotentinDonkeys_ZH-CN9706158091","Sunderbans_ZH-CN9810785009","WomenTraditionalClothing_ZH-CN8028580591","VombatusUrsinus_ZH-CN11125087727","DragonFlyBeijing_ZH-CN8555054089","MidAutumnFestivalHongKong_ZH-CN9020398465","MusulmokBeach_ZH-CN12849119858","BetulaVerrucosa_ZH-CN9596215235","HoluhraunVolcano_ZH-CN10866460287","SouthernElephantSeal_ZH-CN11868940461","YokoteKamakura_ZH-CN11459129782","SpottedLakeCanada_ZH-CN12374082037","StKildaBay_ZH-CN12275183653","SellinPier_ZH-CN9832633239","RNPFogVideo_ZH-CN8941485556","PaperFansRedLanterns_ZH-CN9355904288","NinthEmperorGodTemple_ZH-CN13109315006","ChineseDecorationTiger_ZH-CN13118003712","NewYearPinwheels_ZH-CN12259065748","NewYearOrnaments_ZH-CN10726465661","DadaochengFireworks_ZH-CN10749562397","SummerVacation_ZH-CN10164213926","InsideRhoneGlacier_ZH-CN10709433723","BodleianLibrary_ZH-CN13371852606","HeartNebula_ZH-CN7750020667","HotAndCold_ZH-CN8140560654","WestfriedhofSubwayStation_ZH-CN10273363763","FireholeRiver_ZH-CN12199074227","ChinesePiggyBuns_ZH-CN7725991230","BlackButte_ZH-CN7659716324","MtBakerTrees_ZH-CN12655126733","DutchAntilles_ZH-CN12528903491","BohemianWaxwings_ZH-CN11501414267","PaddleboardersSlovenia_ZH-CN11231072565","PlumInSpring_ZH-CN9207860878","ChillonCastle_ZH-CN12540822639","SnowyStoat_ZH-CN10848714314","AntelopeSlotCanyon_ZH-CN9038727836","CapeTownWaves_ZH-CN10612900805","BemarahaNP_ZH-CN15857677041","SciurusVulgaris_ZH-CN10631314638","BangkokShipYard_ZH-CN11456342876","HohenschwangauWinter_ZH-CN7108162427","RedKangaroosJumping_ZH-CN6710136121","SanDiegoSunset_ZH-CN13195116293","ChicagoBean_ZH-CN10779246540","LasVegasTwilight_ZH-CN10451880259","SanFranciscoMorning_ZH-CN9979820959","NewYorkCity_ZH-CN13225692409","AmusementPark_ZH-CN10443231502","TropicalUderReef_ZH-CN14483750715","WaitomoCaves_ZH-CN7904140760","BanffElk_ZH-CN14276567719","LyonColorfulLights_ZH-CN8877479835","PenguinWalkingAlone_ZH-CN12209119797","TombstoneTerritorialPark_ZH-CN12759683869","BurgEltz_ZH-CN8662794646","VeronaDusk_ZH-CN8191043232","BrockenWetterStation_ZH-CN12471526243","LaCazeCastle_ZH-CN9575179265","LutraLutra_ZH-CN11427420271","BryceCanyonPanorama_ZH-CN8081623280","CorfeSunrise_ZH-CN12529509702","JapaneseMacaque_ZH-CN8147642594","HarbinIceCastle_ZH-CN8715717168","TreefrogsBalloonVine_ZH-CN10226754580","EvergladesTrees_ZH-CN13844523364","PiscataquaRiver_ZH-CN4164763935","CelebrationChina_ZH-CN7168524423","TaipeiCityscape_ZH-CN12531823656","ElkIslandNP_ZH-CN15350868873","BayerischerLynx_ZH-CN9752806083","MountainAndSea_ZH-CN12887306931","ChampsXmas_ZH-CN8025318769","PragueMarket_ZH-CN12503960278","ToyTrain_ZH-CN9629156973","CapilanoXmasLights_ZH-CN12176203756","TemeculaValleyLights_ZH-CN9638093081","BlueJaySnow_ZH-CN9039497953","Frontenac_ZH-CN9450162755","AzoresWhale_ZH-CN10828171785","ShanghaiRoadways_ZH-CN8330089646","NatchezTrace_ZH-CN14042069463","RouenFrance_ZH-CN10933801247","CariamaCristata_ZH-CN13245095230","SFBSalt_ZH-CN10649316700","HanoiVietnam_ZH-CN14680778388","YampaRiver_ZH-CN12304667122","PennanAberdeenshire_ZH-CN9836786421","GermanyBeechTrees_ZH-CN14827122175","AlligatorReefLighthouse_ZH-CN10684561747","EcuadorCattle_ZH-CN8394790254","KampaIsland_ZH-CN8170586598","BlackneckedCrane_ZH-CN8328751220","SingaporeNight_ZH-CN8331245425","OkavangoDelta_ZH-CN11230535181","SnowyCP_ZH-CN12129624487","SuwanneeRiverDelta_ZH-CN9954832439","MonteCervino_ZH-CN9740925888","ChristmasMarketNurnberg_ZH-CN10280165047","ScottishWildcat_ZH-CN12125323940","SiberianChipmunk_ZH-CN13340331117","LongLakeTurkey_ZH-CN9811130507","YeniCamiMosque_ZH-CN6333253723","ColoradoFall_ZH-CN14146510427","VeniceDetail_ZH-CN10443957028","ChinaBeijingAirport_ZH-CN10153044045","AlgaeLake_ZH-CN12787958360","CranesWalking_ZH-CN14321053350","ZebrasGreeting_ZH-CN13686970208","Beaujolais_ZH-CN10416113533","LimestoneApostlesAU_ZH-CN7569812570","EasternQingTombs_ZH-CN7556515077","BambooRaft_ZH-CN10607610759","CaliforniaQuail_ZH-CN12632602281","colorpencil_ZH-CN9502877477","MtnGoatColorado_ZH-CN10210582312","LemurBabies_ZH-CN10673242689","ZhongshanUniversitiy_ZH-CN11607240006","BlacktailedPrairie_ZH-CN9963130094","ChileMarbleCaves_ZH-CN10047248389","BerlinWall_ZH-CN13913064474","ArachovaGreece_ZH-CN13015397518","BlueTitFrost_ZH-CN13664641037","TigersNest_ZH-CN7626346561","ThreeGorgesYangtze_ZH-CN7676176792","DreamlandSping_ZH-CN10452336509","M57_ZH-CN10766328768","PotatoCodGrouper_ZH-CN7629610021","GrizzlyPeak_ZH-CN10461951049","GhostStory_ZH-CN9765017181","RingNeckedPheasant_ZH-CN8777869596","SulawesiIsland_ZH-CN9241862623","GreenlandIceSheet_ZH-CN10378033952","NZfarmlands_ZH-CN12366031108","Zeitumstellung_ZH-CN10059059875","EmperorTamarin_ZH-CN13215359644","ChinaAutumnScene_ZH-CN13660301260","XinjiangKanasLake_ZH-CN6553114815","ZionAutumnVideo_ZH-CN7745941779","ChinaNationalLibrary_ZH-CN10218678115","LaughingFox_ZH-CN10379687290","YingdeXifengbridge_ZH-CN12380588102","FlocksOnBrae_ZH-CN9218718002","Perranporth_ZH-CN11622822015","HarvestMouse_ZH-CN10425457200","NorthMale_EN-US8782628354","DubaiPano_ZH-CN5592413438","CapeSardaoStorks_ZH-CN9639172701","DryIsland_ZH-CN5390918018","LassenVolcanicNP_ZH-CN11026670208","MatsumotCastle_ZH-CN11072283762","AlexanderplatzTower_ZH-CN11044436203","RedRockCanyon_ZH-CN13340323074","DallasDivideVideo_ZH-CN10709398015","PaleokariaBridge_ZH-CN8678579692","CathedralPeak_ZH-CN11326936084","KingPenguinChicks_ZH-CN8323830359","SpaceSombrero_ZH-CN12921242905","HamburgTrainStation_ZH-CN7605451611","CloseupChrysanthemums_ZH-CN8124616705","ChinaNationalDay_ZH-CN13097722741","SheepFlock_ZH-CN4946512179","HohenzollernCastle_ZH-CN10675775260","FloriadeCanberra_ZH-CN11240866211","TreeFrogs_ZH-CN13276767636","ShenzhenGuangdong_ZH-CN12256609322","TsinghuaArche_ZH-CN7826742772","LanternFestival_ZH-CN11167953822","AutumnTrees_ZH-CN10373611719","OrcasKenaiFjords_ZH-CN9348391973","PeaceCamp_ZH-CN11336027451","OktoberfestFerrisWheel_ZH-CN8389630141","ColorfulMacaws_ZH-CN11617615350","LandscapeLiRiver_ZH-CN12335671856","GlenanIslands_ZH-CN10285400684","YoungGuanaco_ZH-CN13371344080","TikalGuatemala_ZH-CN11146845949","ArmyDump_ZH-CN10072999010","PalaisRoyal_ZH-CN12268827053","Canyonlands50_ZH-CN10873765854","Fanjingshan_ZH-CN11691452911","ChanganAvenue_ZH-CN10454331015","RioTinto_ZH-CN12159342846","MooncakeTea_ZH-CN12499152035","BlacknoseSheep_ZH-CN13277920573","ArcticIce_ZH-CN13042890759","LeopardMoremiReserve_ZH-CN9379750847","RockyMountainNP_ZH-CN8864493145","WildernessAct50_ZH-CN9688402882","FishingXiaodongRiver_ZH-CN10867917762","SutjezkaNP_ZH-CN10008358917","HanaleiTaro_ZH-CN9644686871","PandaClimbingTree_ZH-CN8494142204","FloatingMarket_ZH-CN9326364399","PowellPano_ZH-CN11170060213","ChipmunkEating_ZH-CN9048014718","LanternsColorful_ZH-CN9942660596","LupineAndPoppies_ZH-CN9713825660","LangebaanLagoon_ZH-CN10098049919","BeijingYuanmingyuan_ZH-CN11124844795","KohKoodThailandSunset_ZH-CN12334760874","BuckGrass_ZH-CN8117561411","MaldiveAerial_ZH-CN7496334057","PorcupineMom_ZH-CN9357186729","TianchiScenery_ZH-CN9945301190","DaintreeNP_ZH-CN9005339324","AgraFort_ZH-CN11442888947","LilyPadBirdVideo_ZH-CN9361961789","GhostTownBannock_ZH-CN7633622473","JapanHitachinaka_ZH-CN9012830558","YuanyangCounty_ZH-CN11790376897","Muskmelon_ZH-CN11328796765","SloveniaPredjamaCastle_ZH-CN12737328400","LionsManeJellyfish_ZH-CN11160021565","BeijingJingshan_ZH-CN10687837473","LaplandFoxPups_ZH-CN12054924194","MajorcaFogVideo_ZH-CN8222341700","JinshanlingGreatWall_ZH-CN12393635099","LizardLeaf_ZH-CN8529694424","ImpalaANDRedbilledOxpeckers_ZH-CN5560604375","PolarBearsPlayFighting_ZH-CN7702244885","BowlingBallBeach_ZH-CN10336278541","ColorfulTerraces_ZH-CN10556760298","PamukkaleVideo_ZH-CN10858530440","SwimmingTiger_ZH-CN11319597773","WWIMemorial_ZH-CN6530683974","BathingBoxes_ZH-CN9485163304","KatmaiNP_ZH-CN11270824113","BrugesCanals_ZH-CN6702494603","MeerkatCousins_ZH-CN7847404014","GreenLotusLeaves_ZH-CN10494847019","TolbachikVolcano_ZH-CN8980703058","Sicily_ZH-CN8696908608","MoonLinne_ZH-CN10739714348","MoringLuoping_ZH-CN11044517804","CascadePools_ZH-CN9799513195","FlowerFarming_ZH-CN13410297461","AizhaiBridge_ZH-CN8287574880","LakeMagadiFlamingos_ZH-CN7660574344","ThreeGorges_ZH-CN8904385313","RioNightVideo_ZH-CN9508462441","AlfredNicholasGardens_ZH-CN12097591675","NewMexicoRadioTelescopes_ZH-CN7924716399","WestDam_ZH-CN9755100417","InnerMongolia_ZH-CN13125035861","TicinoMogno_ZH-CN9505258816","GinkgoLeaves_ZH-CN7941169701","NASARio_ZH-CN10100657040","TourRidersVideo_ZH-CN10900924756","Tischfussball_ZH-CN7142044792","PandaBamboo_ZH-CN10127098989","LaPazBolivia_ZH-CN8523737258","BroughtonArchipelago_ZH-CN11565890681","NorwegianFjords_ZH-CN9906772291","DesertRain_ZH-CN9726300922","OldOrchardBeach_ZH-CN10792326639","DongBaSymbols_ZH-CN10223363633","BilbaoGuggenheim_ZH-CN11232447099","SeaOfFlowersOne_ZH-CN12376266806","HumorHay_ZH-CN10799118744","ArkansasGeese_ZH-CN11140946197","SwitzerlandAlpsCows_ZH-CN11620301538","SolarFlare_ZH-CN11975944478","ChineseNoodle_ZH-CN11807277442","AdeliePenguins_ZH-CN12988735293","TheelorsuWaterfallThailand_ZH-CN10414155391","QingdaoNightScenery_ZH-CN12266199615","ToledoSpain_ZH-CN9430759995","PantheraLeo_ZH-CN8361237484","EelTrapChina_ZH-CN10190576268","SteamedWontons_ZH-CN13119756297","SoccerBallsOnField_ZH-CN10362238233","CourtshipDisplay_ZH-CN9191340239","SquamishPaddlers_ZH-CN7563089900","BrasstownBaldMountain_ZH-CN12933782362","PortHedlandLightning_ZH-CN9990965301","HeliamphoraPulchella_ZH-CN11720435874","WorkingFarmer_ZH-CN9182210796","QinDynastyGuards_ZH-CN10307863043","BommieReef_ZH-CN8821183107","NASAGlobe_ZH-CN11578103279","ZongziAndLeaves_ZH-CN12124736903","ChildrenInTheRain_ZH-CN11505605446","ZalophusCalifornianus_ZH-CN10378012689","CuteRedBeansRabbits_ZH-CN6891622578","HalongPano_ZH-CN9477309749","PrintingPressLetters_ZH-CN12936137920","Murinsel_ZH-CN6671210728","VanEarth_ZH-CN9684531894","MountainSunset_ZH-CN6369748777","TwoAlpaca_ZH-CN13637402815","KingPenguinAndAntarcticSeal_ZH-CN9407874973","SealPupAndMother_ZH-CN9609234410","OpiumPoppy_ZH-CN8625759628","KingfishersTaipei_ZH-CN13235647615","HerzliyaIsrael_ZH-CN12724786713","LittleHouses_ZH-CN12886049832","TheChineseGarden_ZH-CN11411927931","ChineseTraditionalDimSum_ZH-CN10921357536","Axolotl_ZH-CN8951393850","SunMoonLakeSunset_ZH-CN11260369835","BohemianSwitzerlandNP_ZH-CN8678850225","AustraliaPrincesPier_ZH-CN8181447277","MooseMom_ZH-CN7738709197","PolarBearMotherAndCub_ZH-CN11914695077","GroundhogAdultAndYoung_ZH-CN14715420540","TiltArc_ZH-CN7288127520","MingunPahtodawgyi_ZH-CN12810928512","OryxHerd_ZH-CN11008688164","PaloCorona_ZH-CN13768428597","CelebesCrestedMacaque_ZH-CN8133973553","ColorfulChineseFans_ZH-CN8565449125","BerlinSkyline_ZH-CN11234812524","FlowersColorado_ZH-CN11364638316","CloudyChicago_ZH-CN8007255655","CityscapeHongKong_ZH-CN11566614572","GreenIguana_ZH-CN8493250850","PortlandWillamette_ZH-CN11341090877","ConventodeSanGabriel_ZH-CN11663121226","ThePotalaPalace_ZH-CN12887689840","BernardSpitPolarBear_ZH-CN12665899602","ColoredLanterns_ZH-CN13328090610","SmoggyBeijing_ZH-CN10224762152","ZakimBunkerHillBridge_ZH-CN11873176704","EasterDuckling_ZH-CN8892965359","SecondBeach_ZH-CN13419183916","GruppodelSella_ZH-CN15369631914","BaulhagallaaIsland_ZH-CN11089214414","JacksonvilleBridge_ZH-CN10511265905","GuilinNP_ZH-CN9853503156","SeaOfFlowers_ZH-CN12020791970","BangkokGrandPalace_ZH-CN10544997807","DayGecko_ZH-CN8643046461","BlydeRiverCanyon_ZH-CN10728092467","SiblingCougars_ZH-CN11022440468","NanpuBridge_ZH-CN13404504779","StuttgartStadtbibliothek_ZH-CN8752067833","CastorCanadensis_ZH-CN11925076264","StPatricksWell_ZH-CN10809354559","ChineseLushan_ZH-CN13023176674","StBeatusCaves_ZH-CN12189773319","RainbowOverArea_ZH-CN8668441827","ScotlandFalkirkWheel_ZH-CN7830242558","EurasianWrenOpera_ZH-CN8371773619","MaltaCoast_ZH-CN6974260336","HoodedMerganser_ZH-CN11266325337","BanonProvence_ZH-CN11707348579","BadalingGreatWall_ZH-CN8953349136","CancunPano_ZH-CN5697138969","OrphanBabies_ZH-CN11125858807","AmauFerns_ZH-CN12037112009","EarthStrongholds_ZH-CN10396925597","WindMap_ZH-CN9036610001","Dettifoss_ZH-CN7997622167","SpringFlowers_ZH-CN12146467355","SheepKingPenguin_ZH-CN12005585545","BonsaiRock_ZH-CN9748300671","FoggyPicchu_ZH-CN7580376921","CausewayCoast_ZH-CN10105929852","ShortEaredOwl_ZH-CN10401030673","MECoast_ZH-CN10928933565","PiDay_ZH-CN11432175931","AntarcticSound_ZH-CN12181730683","MoerakiBouldersNZ_ZH-CN8926909483","OvisDalli_ZH-CN11173017297","TorontoCityHall_ZH-CN12042569563","MunnarIndia_ZH-CN7122393912","Flashmob_ZH-CN10098310189","SecretaryBird_ZH-CN10304326057","EasternBluebirds_ZH-CN12146223169","MontedaRochaDam_ZH-CN8975168542","MardiGrasBeads_ZH-CN12310691283","EmergencySwap_ZH-CN7058789247","VenezuelaAngelFalls_ZH-CN11953429333","IcebergSky_ZH-CN9023749021","TraditionalLanternAndPlum_ZH-CN9369063300","GodOfFortune_ZH-CN10292991899","HomemadeDumplings_ZH-CN9997311484","ChamoisPyrenees_ZH-CN11034364275","Longshen_ZH-CN14378250068","CocaColaBeatbox_ZH-CN11128470904","SturtStonyRoo_ZH-CN11793434643","IceLakeSwitzerland_ZH-CN12242330542","KastellorizoIsland_ZH-CN11437900305","ChineseTempleEvening_ZH-CN12163780910","AuroraYellowknife_ZH-CN10171197028","OrangeHills_ZH-CN10484688910","SnowCoveredMonkey_ZH-CN12328059470","LangwieserBridge_ZH-CN9016625949","HawaiiTerns_ZH-CN10880770201","GreatLangdale_ZH-CN11977607242","GermanyIcyCreek_ZH-CN9732244175","LotusCloseup_ZH-CN9944808330","SoftDandelionsFlower_ZH-CN10034210733","LiliesRain_ZH-CN13851208466","GriswoldSunflower_ZH-CN11988970292","SaturniidMoth_ZH-CN10994191597","StMsMt_ZH-CN13259497626","KirunaIceHotel_ZH-CN10447396891","FortWorthWaterGardens_ZH-CN6868557986","DRSunset_ZH-CN11297510173","YellowThroatedMarten_ZH-CN13208260859","Xiaohan_ZH-CN10092878314","HassanIIMosque_ZH-CN5635331779","YellowstoneNPBuffalo_ZH-CN8795221926","XitangAtNight_ZH-CN11113120998","StLawrenceHarpSeal_ZH-CN7809993664","HorsetailFalls_ZH-CN11282945536","BotswanaWildDogs_ZH-CN8842794637","RimedLarchForest_ZH-CN9958136964","FreshTracks_ZH-CN13096937879","RedKangarooFlindersRanges_ZH-CN6761707050","CaucasusMountains_ZH-CN13903723970","ZhouYangLiJianrou_ZH-CN10480058661","HongZhang_ZH-CN8256337897","TianyuHan_ZH-CN8095317153","OleasterFruit_ZH-CN13883902438","LakeHallstrattStars_ZH-CN11063234596","RinpungDzong_ZH-CN8197139479","CommonRedpoll_ZH-CN6194112134","WetAcorns_ZH-CN10420918829","StarHorseshoeWorm_ZH-CN10853421500","RiceDumpling_ZH-CN9562951306","YellowBelliedMarmot_ZH-CN12260782758","IcelandIceberg_ZH-CN9478251333","AutumnScenery_ZH-CN13757549507","PennyLaneGate_ZH-CN7605484462","StockportHerons_ZH-CN13214220780","IcebergSkatingPalace_ZH-CN7954715312","IceSnowWorldHarbin_ZH-CN8262810950","SeaClouds_ZH-CN10205973729","TheNationalStadium_ZH-CN11094613140","ChineseLuckOrnament_ZH-CN8196463860","ChinesePaperCut_ZH-CN9728802425","SleepyPanda_ZH-CN14456639448","MacauColourfulFireworks_ZH-CN10900121492","BowBridge_ZH-CN11384360896","EurasianRed_ZH-CN11954213173","TobagoCays_ZH-CN8757395666","AmurLeopard_ZH-CN11981556299","ParisChristmasTreesLineStreet_ZH-CN9649387372","WawelCastle_ZH-CN14545388424","XmasArboretum_ZH-CN8880627646","WindMillLights_ZH-CN10720233846","RadioCityMusicHall_ZH-CN10745267005","RedFoxCanada_ZH-CN10928776977","DyedSilkPieceHanging_ZH-CN8207662295","LongTailedWidow_ZH-CN10945255466","MauritiusLagoon_ZH-CN8348791349","KenaiSnow_ZH-CN10944389662","NorwayReindeer_ZH-CN10127540833","WinterFoliage_ZH-CN11425960734","GreatWallSnow_ZH-CN8207646649","GreatWallSnow_ZH-CN7118731809","MatrixBirds_ZH-CN8805664583","StNicholasSouvenirsMyra_ZH-CN12680892121","EdinburghCastle_ZH-CN9816444093","DrinkingRedFox_ZH-CN10678689054","ChurchReflectionHarbin_ZH-CN12929462647","Lechwe_ZH-CN10609496588","WinterSwan_ZH-CN12370757511","WooleenStation_ZH-CN13259652949","EnhydraLutris_ZH-CN8683183610","RockefellerCenter_ZH-CN11270499263","SnowHillPenguins_ZH-CN11287849747","MapleCanopyAutumn_ZH-CN13266966870","SleepyPanda_ZH-CN14456639448","MacauColourfulFireworks_ZH-CN10900121492","BowBridge_ZH-CN11384360896","EurasianRed_ZH-CN11954213173","TobagoCays_ZH-CN8757395666","AmurLeopard_ZH-CN11981556299","ParisChristmasTreesLineStreet_ZH-CN9649387372","WawelCastle_ZH-CN14545388424","XmasArboretum_ZH-CN8880627646","WindMillLights_ZH-CN10720233846","RadioCityMusicHall_ZH-CN10745267005","RedFoxCanada_ZH-CN10928776977","DyedSilkPieceHanging_ZH-CN8207662295","LongTailedWidow_ZH-CN10945255466","MauritiusLagoon_ZH-CN8348791349","KenaiSnow_ZH-CN10944389662","NorwayReindeer_ZH-CN10127540833","WinterFoliage_ZH-CN11425960734","GreatWallSnow_ZH-CN8207646649","GreatWallSnow_ZH-CN7118731809","MatrixBirds_ZH-CN8805664583","StNicholasSouvenirsMyra_ZH-CN12680892121","EdinburghCastle_ZH-CN9816444093","DrinkingRedFox_ZH-CN10678689054","ChurchReflectionHarbin_ZH-CN12929462647","Lechwe_ZH-CN10609496588","WinterSwan_ZH-CN12370757511","WooleenStation_ZH-CN13259652949","EnhydraLutris_ZH-CN8683183610","RockefellerCenter_ZH-CN11270499263","SnowHillPenguins_ZH-CN11287849747","MapleCanopyAutumn_ZH-CN13266966870"];

        try {
            var dtd    = $.Deferred(),
                max    = bing_ids.length - 1,
                id     = bing_ids[ apis.Random( 0, max ) ],
                url    = "http://cdn.nanxiongnandi.com/bing/" + id + "_1366x768.jpg";
            apis.Update({ url : url, method: "apis.randomBing()", timeout: 2000 * 3 });
            dtd.resolve( url, url, "Bing.com Image", "#", date.Now(), "Bing.com Image", apis.vo.origin, apis.vo );
        }
        catch ( error ) {
            dtd.reject( new SimpError( apis.vo.method, "Parse bing.com image error.", apis.vo ), error );
        }
      return dtd;
    }

    /*
    * Wall Haven
    */
    apis.Stack[ apis.ORIGINS[0] ] = function() {

      console.log( "=== Wallhaven.cc call ===" );

      // wallhaven background ids
      var wallhaven_ids = [64346, 103929, 12852, 115399, 26623, 101496, 5527, 118585, 102569, 116915, 118993, 6352, 6873, 53356, 10017, 2042, 69737, 113377, 11706, 5168, 16270, 51579, 72375, 156241, 9832, 56481, 6693, 34887, 159465, 6413, 2986, 43537, 6361, 440, 396, 4389, 1784, 6072, 1769, 10694, 3507, 3335, 57239, 1148, 65146, 1045, 852, 7338, 154446, 102924, 354, 7115, 22629, 937, 1212, 26797, 4929, 6463, 26326, 1438, 64115, 395, 800, 1346, 6759, 799, 153883, 1942, 13072, 74098, 3866, 6448, 2987, 4914, 1874, 10568, 152693, 33560, 5269, 8463, 15403, 1926, 92, 124411, 2481, 12421, 110001, 51777, 18395, 4723, 7599, 809, 44628, 914, 819, 157024, 60284, 61, 2018, 5087, 6797, 9424, 391, 9349, 138624, 21821, 2540, 102549, 3065, 561, 1123, 4027, 4764, 22721, 4026, 725, 98217, 909, 28975, 1038, 22301, 7837, 6689, 33390, 1027, 7730, 1194, 367, 73294, 6990, 15899, 31275, 4126, 18392, 13468, 6465, 6416, 21068, 4869, 10524, 1107, 7686, 102435, 6066, 18337, 26481, 397, 33660, 6881, 2651, 1116, 6692, 51501, 60122, 4129, 11824, 19052, 11779, 3236, 4063, 5206, 15859, 29165, 100584, 7883, 5368, 12001, 13554, 2112, 1177, 14091, 50083, 102428, 67027, 70532, 598, 107498, 9680, 1190, 16426, 14, 32935, 21041, 143053, 4653, 6457, 6469, 14598, 22926, 5734, 1896, 12822, 52603, 12690, 7113, 12754, 17773, 110824, 16086, 8079, 73291, 164830, 5603, 11521, 33002, 18321, 118264, 141343, 3345, 5276, 30215, 56165, 6360, 26607, 24911, 31175, 93783, 7162, 849, 13973, 22998, 2897, 9906, 16687, 18709, 2197, 727, 56825, 13117, 105033, 151619, 5648, 21124, 390, 1180, 12781, 103248, 12821, 22469, 76442, 3020, 157, 13623, 81327, 2648, 17708, 99124, 28128, 10459, 2574, 3332, 19882, 2099, 19092, 106937, 146159, 14612, 536, 7843, 12427, 6876, 9035, 14190, 16970, 40859, 52526, 8196, 812, 99496, 3344, 4657, 13997, 24362, 108103, 851, 7505, 51126, 4862, 845, 10774, 5696, 13003, 27415, 45880, 149047, 12687, 102502, 28800, 6695, 8088, 13713, 4430, 107471, 8110, 33557, 1014, 7961, 13120, 18935, 31355, 10823, 4153, 6678, 6173, 7900, 13551, 82544, 16149, 2090, 13463, 15192, 30760, 5974, 51583, 69694, 154038, 165768, 13748, 28343, 32786, 60597, 19133, 9012, 16611, 101980, 560, 8440, 15708, 10695, 104618, 131692, 4804, 31274, 33408, 34761, 910, 2145, 13094, 53325, 59867, 107019, 159224, 8987, 11806, 1152, 3153, 38641, 102539, 13112, 126849, 3104, 13118, 29381, 51581, 40786, 154036, 232, 4901, 6875, 5536, 9709, 148270, 13739, 810, 2088, 11866, 9589, 10748, 22414, 34969, 67030, 2184, 4871, 4922, 7945, 22415, 28348, 31055, 38760, 56755, 65472, 99642, 157564, 20212, 7674, 29854, 16046, 148437, 56179, 29051, 7679, 2182, 29158, 26394, 52654, 43850, 28000, 28182, 32715, 32998, 4925, 5598, 12779, 16170, 52681, 115635, 105059, 34091, 55984, 73804, 70730, 76911, 141991, 156705, 21074, 6454, 21121, 45227, 102545, 17687, 69347, 47212, 25439, 3002, 70732, 154047, 142573, 93556, 3983, 5782, 9443, 24754, 25524, 19546, 21065, 88046, 115381, 139800, 155438, 119054, 140504, 106741, 34317, 509, 6351, 9437, 54764, 54416, 107497, 101507, 140670, 153983, 154633, 152771, 1185, 4944, 803, 808, 6706, 10825, 24686, 22306, 56482, 74395, 86566, 45389, 56792, 77363, 102498, 102537, 64132, 101426, 167125, 41060, 3513, 8599, 5742, 22302, 140, 19119, 28886, 29187, 35507, 36219, 50079, 63882, 72693, 76070, 133209, 153923, 81656, 52514, 6359, 6688, 28438, 1121, 72461, 92983, 9769, 1437, 3053, 5744, 12862, 11838, 28340, 33779, 72734, 132176, 20260, 34603, 1178, 4881, 4968, 3047, 9711, 9824, 10280, 18342, 56417, 68328, 87809, 118569, 131631, 30752, 93452, 156437, 138315, 159296, 353, 959, 3365, 12826, 13122, 6922, 9034, 4654, 5195, 10755, 19536, 43910, 92967, 154172, 10882, 2312, 6738, 8683, 3025, 13589, 13882, 14551, 11778, 16499, 10941, 11103, 26501, 45289, 53321, 68351, 101357, 5379, 8234, 57645, 79271, 51585, 468, 70371, 72182, 141518, 41151, 113423, 43075, 907, 919, 1305, 2000, 9708, 28643, 18315, 57798, 30927, 10758, 41289, 66434, 103247, 114383, 153848, 152410, 145410, 165672, 24421, 34273, 8580, 8073, 12755, 12870, 14054, 16238, 65470, 62851, 115616, 126567, 142633, 159412, 152536, 77583, 559, 101792, 3353, 14574, 18386, 32297, 6528, 9919, 10394, 35967, 94848, 102638, 120488, 139927, 137729, 73551, 166014, 33029, 4523, 9681, 9910, 21296, 21847, 20231, 2089, 2798, 12889, 13604, 11653, 18368, 25522, 28204, 33392, 102533, 128635, 159414, 152792, 143664, 24822, 10009, 40963, 60125, 13566, 26653, 31289, 27310, 27757, 32960, 1998, 569, 5072, 15194, 68340, 66762, 123787, 102541, 32744, 132151, 58663, 6867, 1944, 2322, 12848, 16597, 10481, 28794, 18365, 27013, 62470, 56478, 32808, 33154, 71642, 83685, 105813, 164744, 129914, 11206, 114989, 18601, 132284, 1937, 56480, 31172, 30201, 34968, 43349, 821, 883, 2448, 2936, 3371, 11803, 7405, 13138, 19270, 16043, 16187, 64345, 106949, 98577, 144247, 77653, 31166, 157694, 60209, 13758, 815, 2052, 2095, 13557, 13603, 16169, 7812, 6674, 8442, 8909, 9786, 35258, 35347, 33358, 51076, 72907, 68331, 71656, 70994, 90625, 62294, 60926, 99002, 92917, 101680, 140044, 164950, 165674, 148916, 10914, 137402, 4720, 21335, 1997, 13565, 11862, 12000, 15636, 15706, 31764, 29341, 33405, 36644, 40962, 44868, 52518, 50980, 49116, 66747, 69621, 72600, 84958, 80519, 107451, 124145, 157848, 154003, 152665, 73379, 33556, 43311, 45278, 56511, 49922, 58682, 65132, 6525, 8444, 10980, 11515, 26177, 25181, 29102, 4877, 15860, 22295, 78508, 76913, 75509, 106149, 107729, 157279, 154251, 5363, 10752, 51908, 546, 1641, 1918, 3027, 3868, 5085, 5799, 12855, 13579, 13745, 15169, 14159, 10392, 10397, 26200, 34753, 33370, 51447, 74172, 74401, 10587, 19628, 41157, 42713, 43843, 68377, 98158, 133270, 149051, 144582, 164523, 62569, 20233, 12778, 25520, 22805, 20289, 31779, 32789, 35252, 38011, 45890, 48616, 47199, 1205, 1743, 2001, 5086, 2796, 3028, 3155, 11808, 9704, 13556, 14307, 15261, 18328, 16738, 16055, 56145, 56486, 73226, 70746, 70373, 81325, 107447, 101494, 114911, 117218, 153801, 158971, 155972, 77728, 840, 59985, 31849, 19554, 283, 916, 1939, 1946, 3346, 14219, 19207, 16594, 31206, 27262, 5962, 12232, 5169, 34813, 36511, 33548, 34180, 54727, 51906, 74737, 72591, 75115, 43004, 58368, 80171, 98991, 101022, 140638, 132180, 156161, 156250, 153547, 52447, 7510, 3405, 10427, 6207, 22782, 22460, 2060, 1005, 12841, 12923, 13591, 10693, 26392, 27294, 24644, 28925, 35521, 33563, 40366, 56469, 63762, 59449, 90049, 101561, 114920, 142394, 72701, 69619, 52525, 70736, 58364, 11223, 1207, 43602, 51578, 60954, 7193, 12842, 13737, 8451, 9372, 10480, 29018, 29203, 29392, 975, 3247, 4411, 16091, 24018, 19502, 37441, 37612, 65238, 68333, 85825, 107515, 103227, 133250, 133527, 137726, 147489, 149050, 158772, 153986, 154035, 155970, 157654, 41529, 20179, 22411, 6468, 2012, 2315, 3318, 3356, 3534, 5155, 7430, 13923, 18310, 18346, 59989, 36254, 31348, 52673, 54092, 68372, 71041, 87517, 111740, 154303, 147048, 117921, 19535, 19821, 31185, 40939, 33415, 34038, 38225, 42447, 45352, 2013, 2284, 6755, 12008, 7448, 13520, 13811, 13842, 18455, 19129, 16601, 54694, 51431, 51582, 51671, 64371, 68443, 73947, 69561, 79786, 85930, 86053, 86250, 93558, 86419, 107500, 101146, 115370, 118994, 127298, 141003, 141508, 139041, 142602, 144026, 159284, 158034, 101019, 106918, 104657, 169618, 149216, 82436, 30884, 144920, 93, 1996, 3315, 12751, 12833, 15159, 15534, 19252, 16746, 32305, 29061, 9027, 11760, 12294, 12314, 25730, 26194, 26593, 22313, 35018, 55511, 51588, 53349, 54400, 49196, 72197, 88606, 44127, 47210, 65077, 78304, 98838, 107450, 104639, 105005, 140486, 154723, 158035, 80063, 8480, 161778, 67028, 113421, 117308, 59025, 5847, 4509, 4864, 4876, 3049, 3063, 811, 13084, 13731, 12271, 26188, 26633, 27218, 28502, 31168, 31682, 34489, 44596, 54735, 58597, 59665, 90099, 88587, 81839, 75793, 101287, 106686, 111628, 114564, 132179, 140564, 164951, 157709, 159293, 148777, 132174, 106112, 30886, 54700, 52196, 53733, 54363, 63756, 57716, 57785, 62885, 5654, 8588, 8886, 12361, 27295, 32977, 266, 4752, 16089, 18662, 22719, 35705, 36816, 34137, 34308, 34891, 68352, 87681, 87895, 88468, 83381, 85178, 107875, 101500, 115121, 120358, 141695, 139138, 138868, 138969, 149810, 154174, 164469, 26329, 2509, 143658, 78971, 30801, 363, 6451, 4912, 5357, 9126, 12797, 12999, 15652, 11686, 28009, 18322, 18663, 25219, 60013, 60741, 36329, 51365, 51428, 52596, 74386, 74519, 41006, 72450, 87137, 85953, 85078, 93355, 98470, 107453, 141773, 164679, 154043, 154125, 2461, 15164, 106234, 69844, 34309, 88837, 109308, 160730, 35876, 64654, 137025, 10448, 53683, 137330, 43627, 46695, 98634, 49454, 54275, 46621, 40635, 134557, 56896, 79456, 103141, 72602, 42314, 31355, 44877, 169035, 146158, 7567, 4126, 62487, 55747, 145376, 45870, 145434, 32029, 53359, 113188, 33452, 42446, 6660, 22366, 73035, 65094, 113323, 58400, 108968, 74850, 72880, 150661, 58020, 95750, 116733, 93502, 66422, 45882, 71318, 140643, 79456, 145922, 18670, 44339, 56858, 19894, 37043, 153141, 137133, 69279, 25375, 3289, 58164, 4715, 145282, 139874, 123729, 134055, 94168, 53802, 53703, 137319, 65361, 59901, 38750, 8587, 85843, 35124, 811, 45983, 96082, 124145, 51452, 148471, 160353, 25339, 162222, 43175, 99301, 8616, 51240, 108219, 117128, 62062, 162241, 139517, 113102, 40607, 52619, 46249, 147433, 147860, 6862, 8436, 9434, 136607, 140064, 36480, 58640, 24829, 115858, 86571, 147432, 71034, 131363, 130310, 15376, 21909, 76361, 65429, 107833, 54854, 117556, 60939, 9522, 103531, 92160, 44144, 3005, 161184, 161792, 98415, 865, 66210, 42683, 101366, 38429, 101725, 45096, 29095, 93, 36079, 23831, 79597, 137414, 47568, 135692, 124361, 140845, 164809, 46270, 59573, 167125, 69878, 45298, 163984, 120298, 60895, 104527, 44868, 109375, 138927, 48535, 163698, 157881, 142579, 98603, 33372, 95582, 27678, 30888, 45152, 147788, 42696, 19628, 132488, 116478, 24573, 151419, 165874, 59530, 9015, 38741, 3227, 152491, 134564, 162269, 52250, 52260, 44555, 95748, 81663, 72582, 97040, 8116, 44994, 120820, 34650, 53271, 56992, 41909, 84530, 134461, 135497, 2649, 11009, 101477, 59254, 99778, 84042, 47410, 103203, 100308, 116881, 53173, 47429, 43848, 160730, 73128, 93804, 137554, 33654, 90940, 149638, 73758, 164812, 56478, 168629, 45957, 129646, 137151, 138623, 155106, 150986, 48975, 8474, 45634, 38120, 45168, 45863, 17264, 116705, 168459, 59193, 60515, 110460, 123774, 164566, 133842, 98996, 152798, 120339, 124145, 162486, 56783, 35857, 139138, 52002, 127986, 107028, 99731, 46234, 164824, 10181, 65651, 54420, 47075, 14, 89585, 138225, 149335, 145943, 51165, 62125, 122568, 138558, 84815, 159562, 81646, 134425, 112512, 28921, 18863, 76670, 169015, 62963, 136328, 148762, 116637, 128829, 13926, 131759, 46394, 54426, 152927, 47110, 136591, 162638, 46066, 128005, 56844, 73188, 72796, 104345, 47553, 46128, 135779, 137190, 60299, 22953, 51989, 17265, 44535, 61135, 76133, 144828, 52017, 31466, 112336, 75216, 120316, 106465, 121018, 35330, 73122, 126988, 114324, 74792, 25232, 45014, 125647, 133932, 116978, 70093, 46111, 11863, 101938, 137532, 84846, 153742, 26068, 107977, 110086, 139075, 98601, 60190, 57254, 2912, 137331, 43026, 110463, 88215, 59307, 21918, 116583, 78991, 46261, 44723, 44923, 83550, 51070, 118598, 47711, 8452, 34876, 80993, 142673, 88864, 18934, 98391, 46124, 108004, 59014, 122508, 41654, 52196, 32825, 82740, 13998, 61806, 133045, 11222, 41319, 32626, 27696, 62304, 157848, 52990, 111656, 34430, 49203, 116475, 40635, 85129, 137497, 36496, 126309, 120329, 42796, 59257, 46359, 90159, 54758, 129507, 106025, 135690, 142702, 110206, 5370, 41961, 114050, 58029, 79276, 30346, 10149, 63815, 44214, 8055, 106036, 43903, 48904, 4756, 79101, 163872, 3053, 31811, 47732, 41383, 75727, 40700, 1438, 55855, 163368, 120947, 107881, 90229, 138071, 138635, 92972, 145888, 32569, 52102, 77445, 27466, 49384, 112962, 135301, 56898, 22609, 58529, 79043, 43283, 41121, 25357, 131673, 73701, 36255, 10545, 72700, 9014, 61650, 95745, 27126, 44463, 146896, 161163, 106257, 26336, 148696, 141682, 34176, 137616, 4725, 54310, 121399, 127885, 100509, 48451, 55779, 72375, 164102, 110160, 44514, 134692, 47407, 47573, 88595, 124200, 52531, 20177, 82649, 18133, 127754, 59602, 53268, 170541, 61660, 75572, 62394, 14751, 17765, 40317, 53820, 123414, 146033, 48090, 112378, 109750, 108803, 107154, 115637, 64046, 145894, 164733, 145068, 37550, 94620, 47707, 72588, 138627, 10709, 47677, 167173, 161988, 52054, 112932, 54096, 24019, 135141, 17794, 49809, 77183, 19885, 57899, 75115, 54053, 121092, 146916, 66401, 48429, 2931, 44968, 165685, 43307, 41028, 11161, 40275, 1003, 104059, 10413, 83771, 86992, 83781, 48389, 32548, 67038, 137005, 29847, 124417, 54768, 135245];
      try {
        var dtd    = $.Deferred(),
            max    = wallhaven_ids.length - 1,
            id     = wallhaven_ids[ apis.Random( 0, max ) ],
            url    = "http://alpha.wallhaven.cc/wallpapers/full/wallhaven-" + id + ".jpg";
        apis.Update({ url : url, method: "apis.wallhaven()", dataType : "image" });
        dtd.resolve( url, url, "Wallhaven.cc Image", "#", date.Now(), "Wallhaven.cc Image", apis.vo.origin, apis.vo );
      }
      catch ( error ) {
        dtd.reject( new SimpError( apis.vo.origin, "Parse wallhaven error, url is " + url, apis.vo ), error );
      }
      return dtd;
    }

    /*
    * Unsplash.COM
    */
    apis.Stack[ apis.ORIGINS[1] ] = function() {

      console.log( "=== Unsplash.com call ===" );

      var unsplash_ids = [ "collection/2463312", "collection/614656", "collection/1111575", "collection/1717137", "collection/445266", "collection/610876", "collection/1457745", "collection/782142", "collection/1136512", "collection/869152", "collection/782123", "collection/595970", "collection/641379", "collection/488182", "collection/142376" ];
      try {
          var dtd    = $.Deferred(),
              max    = unsplash_ids.length - 1,
              id     = unsplash_ids[ apis.Random( 0, max ) ],
              url    = "https://source.unsplash.com/" + id + "/2560×1600";
          apis.Update({ url : url, method: "apis.unsplashCOM()", dataType : "image" });
          dtd.resolve( url, url, "Unsplash.com Image", "#", date.Now(), "Unsplash.com Image", apis.vo.origin, apis.vo );
      }
      catch ( error ) {
        dtd.reject( new SimpError( apis.vo.method , "Parse unsplash.com error, url is " + url, apis.vo ), error );
      }
      return dtd;
    }

    /*
    * Unsplash.IT
    */
    apis.Stack[ apis.ORIGINS[2] ] = function() {

        console.log( "=== Unsplash.it call ===" );

        try {
          var url    = "https://picsum.photos/1920/1080/?random";
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

        var GOOGLE_ART_NAME   = "google.art.v2.project.json",
            GOOGLE_ART_SUFFIX = "=s1920-rw",
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

          var SPECIAL_URL = "special.day.v2.json",
              dtd         = $.Deferred(),
              type        = arguments.length > 0 ? arguments[0] : "special";

          apis.Update({ url : SIMP_API_HOST + SPECIAL_URL, method : "apis.special()" });
          apis.Remote( function( result ) {
            try {
                var obj = result[type],
                    key, max, random, special_day, data, hdurl;

                if ( type == "special" ) {
                    var arr = result.collections;
                    max     = arr.length - 1;
                    random  = apis.Random( 0, max );
                    data    = arr[ random ];
                    hdurl   = data.url;
                    type    = i18n.GetLang( "controlbar_special" );
                    data.name == "" && ( data.name = data.origin );
                } else {
                    key         = date.Today();
                    data        = obj[key];
                    if ( !data ) {
                        dtd.reject( new SimpError( apis.vo.origin, "Current holiday is " + key + ", but not any data from " + SIMP_API_HOST + SPECIAL_URL, result ));
                        return dtd.promise();
                    }
                    max         = data.hdurl.length - 1;
                    random      = apis.Random( 0, max );
                    hdurl       = SIMP_API_HOST + type + "/" + data.hdurl[random] + ".jpg";
                }
                apis.Update({ origin : type });
                dtd.resolve( hdurl, hdurl, data.name, data.info, date.Now(), data.name, type, apis.vo );
            }
            catch( error ) {
                dtd.reject( new SimpError( apis.vo.origin, "Get special backgrond error.", apis.vo ), error );
            }
          });
          //return apis.defer.promise();
          return dtd;
    }

    function init() {
        var dtd = $.Deferred();
        apis.Stack[ apis.New().origin ]()
        .done( function() {
            console.log("222222222222")
            var url = arguments && arguments[0];
            // when change background mode is 'day', not invoke vo.isDislike( url )
            if ( !setting.IsRandom() || vo.isDislike( url )) {
                vo.Create.apply( vo, arguments );
                vo.new.hdurl = cdns.New( vo.new.hdurl, vo.new.type );
                vo.new.favorite != -1 && ( vo.new.hdurl = "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/favorites/" + vo.new.favorite + ".jpg" );
                dtd.resolve( vo.new );
            }
            else {
                new SimpError( apis.vo.origin, "Current background url is dislike url =" + url, apis.vo );
                init();
            }
        })
        .fail( function( result, error ) {
            SimpError.Clone( result, (!error ? result : error));
            if ( apis.vo.origin == "today" ) apis.failed = apis.ORIGINS_MAX;
            apis.failed < apis.ORIGINS_MAX - 5 ? init() : dtd.reject( result, error );
            apis.failed++;
        });
        return dtd;
    }

    return {
      Init: init
    };
});
