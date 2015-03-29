window.onload = app;

// runs when the DOM is loaded
function app(){
    "use strict";

    // uncomment the following line to cache CSS/JS files loaded by loader in localStorage
    // NOTE: you may need to turn this off while developing
    // loader.textInjection = true;

    // load some scripts (uses promises :D)
    loader.load(
        //css
        {url: "./dist/style.css"},
        //js
        {url: "./bower_components/jquery/dist/jquery.min.js"},
        {url: "./bower_components/lodash/lodash.min.js"},

        // when using just Backbone, use this line
        {url: "./bower_components/backbone/backbone.js"},
        // when using Parse, comment out the above line and uncomment the line below
        // {url: "./bower_components/parse-js-sdk/lib/parse.min.js"},

        // when using React (and the plugin JSnoX), uncomment the following two lines
        {url: "./bower_components/react/react.min.js"},
        {url: "./bower_components/jsnox/jsnox.js"},

        {url: "./js/jquery.swipe.min.js"},
        {url: "./js/highcharts.js"},
        {url:'./js/canvg.js'} ,
        {url:'./js/exporting.js'} ,
        {url:'./js/rgbcolor.js'} ,
        {url:'./js/pdf.js'} ,

        {url: "./js/mMenu.js"},
        {url: "./js/mOrder.js"},
        {url: "./js/mUsers.js"},
        {url: "./js/mUser.js"},

        {url: "./js/vOrdering.js"},
        {url: "./js/vEmployee.js"},
        {url: "./js/vMenu.js"},
        {url: "./js/vNavigation.js"},
        {url: "./js/vPayment.js"},
        {url: "./js/vCharts.js"},


        // other stuff
        // {url: "./bower_components/pace/pace.min.js"},
        // {url: "./js/interact.js"},
        // {url: "./node_modules/stripe/lib/stripe.js"},
        {url: "./js/TemplateView.js"}
    ).then(function(){
        // if turning on JSnoX, uncommment the following line
        window.d = jsnox(React);
        // if turning on React, uncomment the following line
        React.initializeTouchEvents(true);
        // target elements with the "draggable" class
        // interact('.draggable')
        //     .draggable({
        //         // enable inertial throwing
        //         inertia: true,
        //         // keep the element within the area of it's parent
        //         restrict: {
        //             restriction: "parent",
        //             endOnly: true,
        //             elementRect: {
        //                 top: 0,
        //                 left: 0,
        //                 bottom: 1,
        //                 right: 1
        //             }
        //         },

        //         // call this function on every dragmove event
        //         onmove: function(event) {
        //             var target = event.target,
        //                 // keep the dragged position in the data-x/data-y attributes
        //                 x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        //                 y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        //             // translate the element
        //             target.style.webkitTransform =
        //                 target.style.transform =
        //                 'translate(' + x + 'px, ' + y + 'px)';

        //             // update the posiion attributes
        //             target.setAttribute('data-x', x);
        //             target.setAttribute('data-y', y);
        //         },
        //         // call this function on every dragend event
        //         onend: function(event) {
        //             var textEl = event.target.querySelector('p');

        //             textEl && (textEl.textContent =
        //                 'moved a distance of ' + (Math.sqrt(event.dx * event.dx +
        //                     event.dy * event.dy) | 0) + 'px');
        //         }
        // });

        //////////////////////////
        //////////////////////////
        // stripe
        Stripe.setPublishableKey('pk_test_g90DsSKkAInswLioY58keUEh');
        $('#payment-form').html([
            '<input id="ccNUM" type="text" size="20" data-stripe="number"/>',
            '<input id="ccCVC" type="text" size="4" data-stripe="cvc"/>',
            '<input id="ccEXPM"type="text" size="2" data-stripe="exp-month"/>',
            '<input id="ccEXPY"type="text" size="4" data-stripe="exp-year"/>',
            '<button type="submit">Submit Payment</button>'
        ].join(''));
        window.bw || (window.bw = {});
        bw.runIt = function(options) {
            $('#ccNUM').val(options.number) ,
            $('#ccCVC').val(options.cvc) ,
            $('#ccEXPM').val(options.mm) ,
            $('#ccEXPY').val(options.yyyy);
            $('#payment-form').submit(function(event) {
                    
                Stripe.card.createToken($(this), function stripeResponseHandler(status, response) {
                    var token = response.id;
                    // debugger
                    $.post('https://evening-basin-4204.herokuapp.com/api/v1/charges', {
                        stripeToken: token
                    }).then(function(d) {
                        // // reset
                        $('#ccNUM').val('') ,
                        $('#ccCVC').val('') ,
                        $('#ccEXPM').val('') ,
                        $('#ccEXPY').val('');
                        console.log('trans complete')
                    });

                });

                // Prevent the form from submitting with the default action
                event.preventDefault();
                return false;
            }).submit();
        };
        // bw.runIt({number:'4242424242424242' , cvc:'222' , mm:'2' , yyyy:'2020'})
        //////////////////////////
        //////////////////////////

        document.querySelector("html").style.opacity = 1;
        // start app?
        JSON.copy || (JSON.copy = function(d){return JSON.parse(JSON.stringify(d));});

        Array.prototype.sum = function(len){
            len = (len||2)
            var total = 0;
            for (var i = 0 , ii = this.length ; i<ii ; ++i) {
                if(isNaN(this[i]))
                    this[i] = 0;
                total += parseInt((Number(this[i]) * 10000)+.01)
            }
            
            return Number((total/10000).toFixed(len));
        }
        //////////////////////////
        //
 
        $.ajaxSetup({
            headers: {'PIN'  : '95675'} // temp admin pass
        }); 

        React.render(
            React.createElement(bw.app.views.login) ,
            $('.container')[0]
        );
        //
        //////////////////////////

        // bw.menu.cashAll().then(function() {
            // console.log(bw.menu.cache)
            // var top = bw.menu.getBy('name' , 'top')[0]
            // top.items = _.map(bw.menu.getBy('level' , '1') , function(item){return item.id}).join(',')
            // console.log(top)
            // bw.menu.update(top)
            // console.clear()
            // bw.menu.cache.forEach(function(item){
            //     item.items = '';
            //     bw.menu.update(item);
            // })
            // debugger
            // React.render(
            //     React.createElement(bw.app.views.newOrder) ,
            //     $('.container')[0]
            // );

            // React.render(
            //     React.createElement(bw.app.views.newOrder) ,
            //     $('.container')[0]
            // );
            // React.render(
            //     React.createElement(bw.app.views.currentOrders) ,
            //     $('.container')[0]
            // );
        // });
        bw.users.cashAll().then(function() {

            // React.render(
            //     React.createElement(bw.app.views.editEmployees) ,
            //     $('.container')[0]
            // );
        });

        (new (Backbone.Router.extend({
            initialize:function(){
               Backbone.history.start() 
            },     
            routes : {
                'login' : 'login' ,
                'main'  : 'main' ,
                'admin' : 'admin',
                'editMenu' : 'editMenu'
                // '*default' : 'login'
            } ,
            login:function(){
                bw.user.logout()
                React.render(
                    React.createElement(bw.app.views.login) ,
                    $('.container')[0]
                );
            } ,
            main:function(){
                
                if (!bw.user.current){
                    window.location.hash = '';
                    return;
                }

                React.render(
                    React.createElement(bw.app.views.main) ,
                    $('.container')[0]
                );
            } ,
            admin:function(){
                
                if (!bw.user.current){
                    window.location.hash = '';
                    return;
                }
                
                React.render(
                    React.createElement(bw.app.views.admin) ,
                    $('.container')[0]
                );

            },
            editMenu:function(){
                bw.menu.cashAll().then(function() {

                    $.ajaxSetup({
                        headers: {'PIN'  : '95675'} // temp admin pass
                    });
                    React.render(
                        React.createElement(bw.app.views.editMenu) ,
                        $('.container')[0]
                    );
                });
            } ,

        })))
        // if(('ontouchstart' in window ? 'touchend' : 'click'))
        //     $("<style type='text/css'> button , input , textarea {-webkit-appearance: none;-webkit-border-radius: 0;}.back{ display:none} </style>").appendTo("head");

        $(document.body).on( "swiperight", function( event ){window.getSelection().removeAllRanges(); console.log('swipe');bw.history.back()})
    })

}









    // view template

        // bw.app.views.{name}LeftPanel = React.createClass({

        //     _goBack:function() {
        //         React.render(
        //             React.createElement(bw.app.views.main) ,
        //             $('.container')[0]
        //         );
        //     } ,
        //     render:function() {
        //         return d('div.leftPane@controls', [
        //             d('div.grid' , [
        //                 d('button.back@back' , {onClick:this._goBack} , 'back') ,
        //             ])
        //         ])
        //     }

        // });
        // bw.app.views.{name} = React.createClass({

        //     render:function() {
        //         return d('div', [
        //             d('div.title@title' , 'new order'),
                    
        //             d(bw.app.views.{name}LeftPanel) ,

        //             d('div.content.grid.grid-2-100' , [
        //                 d('div@w' , 'left'),
        //                 d('div@e' , 'preview')
        //             ])
        //         ])
        //     }

        // });


