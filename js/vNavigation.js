
window.bw    || (window.bw    = {}) ,
bw.app       || (bw.app       = {}) ,
bw.app.views || (bw.app.views = {});

bw.history = {
    path:['login'] ,
    back:function(){
        if(this.path.length>1)
            this.path.pop();
        this.path = _.uniq(this.path);

        window.location.hash = this.path[this.path.length-1];
    } ,
    add:function(module){
        this.path.push(module)
        window.location.hash = module;
    }
}

bw.app.views.admin = React.createClass({
    
    componentDidMount:function() {

        var self = this;
        var node = function(s){return $(self.refs[s].getDOMNode())}

        node('menu').on('touchstart' , function(){
            console.log('edit menu') 
            bw.history.add('editMenu');
            bw.menu.editing = [];
            React.render(
                React.createElement(bw.app.views.editMenu) ,
                $('.container')[0]
            );
        });
        node('employees').on('touchstart' , function(){
            console.log('edit employees') 
            bw.history.add('editEmpoloyees');
            React.render(
                React.createElement(bw.app.views.editEmployees) ,
                $('.container')[0]
            );
        });
        _.forEach([node('editcategories') , node('edititems') , node('editmodifiers')] , function(node) {
            node.on('touchstart' , function(){

                React.render(
                    React.createElement(bw.app.views.editBreakdown ) ,
                    $('.container')[0]
                );

            })
        });

        node('salesbycategories').on('touchstart' , function(){
            console.log('sales by categories') 
            bw.history.add('salesByCategories');
            React.render(
                React.createElement(bw.app.views.salesByCategories) ,
                $('.container')[0]
            );
        });
        node('alcoholsales').on('touchstart' , function(){
            console.log('alcohol sales') 
            bw.history.add('alcoholSales');
            React.render(
                React.createElement(bw.app.views.alcoholSales) ,
                $('.container')[0]
            );
        });
    } ,
    _goBack:function() {
        React.render(
            React.createElement(bw.app.views.main) ,
            $('.container')[0]
        );
    } ,
    render:function() {
        
        return d('div',[
            d('div.grid.grid-4-100' , _.map([,,'sales by categories','alcohol sales',,'employees',,,,,'menu',,,'edit categories','edit items','edit modifiers',],function(v,i) {
                var ref = (v?v.replace(/ /g,''):i)
                return d('button.'+ref+'@'+ref , v||'');
            })),
            d('button.back@back' , {onTouchStart:this._goBack} , 'back')
        ]);

    }
});
bw.app.views.main = React.createClass({

    componentDidMount:function() {
        
        var self = this;
        var node = function(s){return $(self.refs[s].getDOMNode())}

        node('neworder').on('touchstart' , function() {
           console.log('new order') 
            bw.history.add('newOrder');
            React.render(
                React.createElement(bw.app.views.newOrder) ,
                $('.container')[0]
            );
        });
        node('orders').on('touchstart' , function() {
            console.log('order') 
            
            // for the demo, we are caching this at login to be more snappy.
            // the orders might be /slightly/ out of date, but it won't be
            // /nearly/ as noticable as a slow connection...
            // bw.orders.cashAll().then(function() {
                bw.history.add('orders');
                
                React.render(
                    React.createElement(bw.app.views.currentOrders) ,
                    $('.container')[0]
                ); 
            // });
        });
        node('admin').on('touchstart' , function() {
            console.log('admin') 
            bw.history.add('admin');
           
            React.render(
                React.createElement(bw.app.views.admin) ,
                $('.container')[0]
            ); 
        });

    } ,
    _goBack:function() {
        React.render(
            React.createElement(bw.app.views.login) ,
            $('.container')[0]
        );
    } ,

    render:function() {
        
        return d('div',[
            d('div.grid.grid-4-100' , _.map([,,,,,'new order','orders',,,,,,,,'admin',,],function(v,i){
                            var ref = (v?v.replace(/ /g,''):i)
                            return d('button.'+ref+'@'+ref , v||'');
                        })),
            d('button.back@back' , {onTouchStart:this._goBack} , 'back')
        ])

    }
});
bw.app.views.login = React.createClass({
    
    componentDidMount:function() {

        var self = this;
        var node = function(s){return $(self.refs[s].getDOMNode())}
        var input = this.refs.val.getDOMNode()
        $(input).focus();

        node('reset').on('touchstart' , function() {
            input.value = '';
        });
        $('.keyPad').on('touchstart' , function(){
            input.value += this.innerText;
        });

        node('submit').on('touchstart' , function() {
            
            bw.user.login(input.value).then(function(me) {
                console.log(me)
                
                bw.menu.cache = {};
                bw.menu.cashAll();
                bw.users.cashAll();
                bw.orders.cashAll();
                
                // React.render(
                //     React.createElement(bw.app.views.main) ,
                //     $('.container')[0]
                // );
                bw.history.add('main');
            })
            input.value = '';

        })
        $('.val').on('focus load' , function(){
            // debugger
            this.blur()
        }).blur()
    },
    render:function(){

        return d('div.login.centerit' , [
            d('div.grid.grid-3-100' , [

                d('button.keyPad@7' , '7') ,
                d('button.keyPad@8' , '8') ,
                d('button.keyPad@9' , '9') ,
                d('button.keyPad@4' , '4') ,
                d('button.keyPad@5' , '5') ,
                d('button.keyPad@6' , '6') ,
                d('button.keyPad@1' , '1') ,
                d('button.keyPad@2' , '2') ,
                d('button.keyPad@3' , '3') ,
                d('button@reset' , 'clr') ,
                d('button.keyPad@0' , '0') ,
                d('button@submit'  , 'go') ,
                
            ]),
            d('input.val[type=password][placeholder=pin][value=95675]@val')
        ])

    }
});