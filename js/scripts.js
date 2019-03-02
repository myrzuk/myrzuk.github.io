var lpApp = angular.module('lpApp', []);

lpApp.controller('lpPriceCtrl', function ($scope, $http) {

	$http.get('price.json').then(function (response) {
		$scope.prices = response.data;
		$scope.calc();
		$scope.sortGet();
	}, function (response) {
		$scope.requestStatus = response.status;
		$scope.requestStatusText = response.statusText;
	});

	$scope.sortSet = function (propertyName) {
		if ($scope.sortBy == propertyName) {
			$scope.sortRev = !$scope.sortRev;
		}
		$scope.sortBy = propertyName;
		localStorage.sortBy = $scope.sortBy;
		localStorage.sortRev = $scope.sortRev;
	}

	$scope.sortGet = function () {
		if (localStorage.sortBy && localStorage.sortRev) {
			$scope.sortBy = localStorage.sortBy;
			$scope.sortRev = (localStorage.sortRev == 'true');
		} else {
			$scope.sortBy = 'name';
			$scope.sortRev = false;
		}
	}

	$scope.calc = function () {
		$scope.prices.forEach(function (price) {
			price.price2 = price.price * (1 - price.discount);
		});
	}

});





(function ($) {
    $(document).ready(function () {
        
        var lpReady = false;
        
        function lpGoToActive() {
            var lpPath = window.location.pathname.replace('/', ''),
                lpTrgt;
            
            if (lpPath != '') {
                 lpTrgt = $('#' + lpPath);
                
                if (lpTrgt.length > 0) {
                    $('body, html').scrollTop(lpTrgt.offset().top - 44);
                }
            }
        }
        lpGoToActive();
        
        $(window).on('load',  lpGoToActive);

        /*Панель навигации*/

        function lpHeader() {
            if ($(window).scrollTop() == 0) {
                $('header').addClass('top');
            } else {
                $('header.top').removeClass('top');
            }
        }

        lpHeader();
        $(window).on('scroll', lpHeader);


        /* Плавный скролл*/

        var lpNav = $('header ul');

        lpNav.find('li a').on('click', function (e) {

            var linkTrgt = $($(this).attr('href'));

            if (linkTrgt.length > 0) {
                var dataOffset = 40;
                e.preventDefault();
                if (linkTrgt.attr('data-offset')) {
                    dataOffset = parseInt(linkTrgt.attr('data-offset'));
                }
                var offset = linkTrgt.offset().top;
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: offset - dataOffset
                }, 750);
            }

        });


        /*Активный пункт меню*/


        function lpSetNavActive() {

            var curItem = '';
            $('section').each(function () {
                if ($(window).scrollTop() > $(this).offset().top - 200) {
                    curItem = $(this).attr('id');
                }
            });

            if (lpNav.find('li.active a').attr('href') != '#' + curItem ||
                lpNav.find('li.active').length == 0) {
                lpNav.find('li.active').removeClass('active');

                lpNav.find('li a[href="#' + curItem + '"]').parent().addClass('active');

                if (lpReady) {
                    history.pushState({
                        curItemName: 'curItem'
                    }, curItem, '/' + curItem);
                }

            }
            
            setTimeout(function(){
                lpReady = true;
            }, 500);

        }

        lpSetNavActive();
        $(window).on('scroll load', lpSetNavActive);


        /*Слайдер*/
        $(".lp-slider1").owlCarousel({ //1
            items: 1, //Количество слайдов
            nav: true, //Включает стрелки
            navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
            responsive: {
                0: {
                    items: 1,
                    loop: false

                },
                800: {
                    items: 2,
                    loop: false
                },
                1200: {
                    items: 1,
                    loop: false
                },

            }


        });

        $('#services button').on('click', function () {
            $(".lp-slider1").trigger('to.owl.carousel', $(this).index());


        });

        var owl = $('.owl-carousel');

        owl.on('initialized.owl.carousel', function () {
            console.log('Слайд установлен');
        });

        $(".lp-slider2").owlCarousel({
            dotsEach: true,
            items: 1,
            nav: true,
            navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
            responsive: {
                0: {
                    items: 1,
                    nav: false
                },
                740: {
                    items: 2
                },
                1200: {
                    items: 4
                }
            }

        }).on('translated.owl.carousel', function () {
            console.log('Слайд переключен')
        }).on('resize.owl.carousel', function () {
            console.log('Слайд изменил размер');
        });

        $('button.slide').on('click', function () {
            var slide = parseInt($('input.slide').val()) || 1;
            owl.trigger('to.owl.carousel', slide - 1);
        });



        /* Табулятор */

        $('.lp-tabs').each(function () {

            var tabs = $(this),
                tabsTitlesNames = [];

            tabs.find('div[data-tab-title]').each(function () {
                tabsTitlesNames.push($(this).attr('data-tab-title'));
            }).addClass('lp-tab');

            tabs.wrapInner('<div class="lp-tabs-content"></div>');

            tabs.prepend('<div class="lp-tabs-titles"><ul></ul></div>');






            tabs.append('<div class="lp-tabs-footer">Активная вкладка' + 1 + '/' + tabsTitlesNames.length + '</div>');



            var tabsTitles = tabs.find('.lp-tabs-titles'),
                tabsContent = tabs.find('.lp-tabs-content'),
                tabsFooter = tabs.find('.lp-tabs-footer'),
                tabsContentTabs = tabsContent.find('.lp-tab');

            tabsTitlesNames.forEach(function (value) {
                tabsTitles.find('ul').append('<li>' + value + '</li>');
            });

            var tabsTitlesItems = tabsTitles.find('li');

            tabsTitlesItems.eq(0).addClass('active');

            tabsContentTabs.eq(0).addClass('active').show();

            //Устанавливает высоту

            tabsContent.height(tabsContent.find('.active').outerHeight());

            // Переходы между табами


            tabsTitlesItems.on('mouseenter', function () {

                if (!tabs.hasClass('changing')) {

                    tabs.addClass('changing');

                    tabsTitlesItems.removeClass('active');
                    $(this).addClass('active');

                    var curTab = tabsContent.find('.active'),
                        nextTab = tabsContentTabs.eq($(this).index());

                    var curHeight = curTab.outerHeight();

                    nextTab.show();

                    var nextHeight = nextTab.outerHeight();

                    nextTab.hide();

                    if (curHeight < nextHeight) {

                        tabsContent.animate({
                            height: nextHeight
                        }, 500);
                    }

                    curTab.fadeOut(500, function () {

                        if (curHeight > nextHeight) {

                            tabsContent.animate({
                                height: nextHeight
                            }, 500);
                        }

                        nextTab.fadeIn(500, function () {
                            curTab.removeClass('active');
                            nextTab.addClass('active');
                            tabs.removeClass('changing');
                        });

                    });
                }

                var el = document.getElementsByClassName('lp-tabs-footer')[0];
                el.innerHTML = 'Активная вкладка ' + ($(this).index() + 1) + '/' + tabsTitlesNames.length;


            });

            $(window).on('resize', function () {
                tabsContent.height(tabsContent.find('.active').outerHeight());
            });



        });



        /* Всплывающие окна */
        $('.lp-mfp-inline').magnificPopup({
            type: 'inline'
        });

        $('.lp-mfp-ajax').magnificPopup({
            type: 'ajax'
        });

        $('.lp-mfp-iframe').magnificPopup({
            type: 'iframe'
        });

        $('.lp-gallery').each(function () {
            $(this).magnificPopup({
                delegate: 'a',
                type: 'image',
                gallery: {
                    enabled: true
                }
            });

        });
        $('button.item').magnificPopup({
            items: [{
                src: 'page1.html',
                type: 'ajax'
            }, {
                src: 'https://www.youtube.com/watch?v=7HKoqNJtMTQ',
                type: 'iframe'
            }, {
                src: '/img/slideshow/slide2.jpg',
                type: 'image'
            }],
            gallery: {
                enabled: true
            }

        });


        $('.lp-mfp-inline.ctm').click(function () {
            var elem = $('#lp-srv5 h2').text($(this).text());

        });


        /* Обратная связь */

        $('#lp-fb1').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: '.lp-fb1-link',
            fbColor: '#7952b3'
        });

        $('#lp-fb2').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: false,
            fbColor: '#7952b3'
        });

        $('#lp-fb3').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: '.lp-fb3-link',
            fbColor: '#7952b3'
        });

        $('#lp-fb4').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: '.lp-fb4-link',
            fbColor: '#7952b3'
        });





        $('.lp-fb1-link').click(function () {
            var text = $(this).attr('data-wi-fb-info') + ' - Заказать конслуьтацию',
                rel = $('#lp-fb1 h2').text(text);




        });



        /* Карта */

        $.fn.lpMapInit = function () {


            var lpMapOptions = {
                center: [53.906522, 27.510232],
                zoom: 16,
                controls: ['fullscreenControl', 'zoomControl']
            }

            if (window.innerWidth < 768) {
                lpMapOptions.behaviors = ['multiTouch']
            } else {
                lpMapOptions.behaviors = ['drag']
            }

            var lpMap = new ymaps.Map('lp-map', lpMapOptions);
            var lpPlacemark = new ymaps.Placemark(lpMapOptions.center, {
                hintContent: 'Ит Академия',
                balloonContentHeader: 'Ит Академия',
                balloonContentBody: 'учебные курсы',
                balloonContentFooter: 'пер.4-й загородный 56а'
            });

            lpMap.geoObjects.add(lpPlacemark);
        }









        // find - ищем
        //1      //loop: true,         // слайды идут по куругу
        //margin: 10,         //отступы между слайдами
        //mouseDrag: true,    // запрещает(разрешает) перетаскивать слайды мышко
        //stagePadding: 50





    });
})(jQuery);
