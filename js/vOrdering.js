
window.bw    || (window.bw    = {}) ,
bw.app       || (bw.app       = {}) ,
bw.app.views || (bw.app.views = {});

//////////////////////////
// ordering views
bw.app.views.newOrderLeftPanel = React.createClass({
    
    _componentDidUpdate:function(){
        $('.delete').addClass('hidden')
    } ,
    componentWillUnmount : function() {
        this.props.chit = [];
        this.props.chitRaw = null;
    },
    _delete:function(e) {
        
        var data = JSON.parse($(e.currentTarget).attr('data'));
        var index = data[1];
        this.props.chit.splice(index,1);//data[0];

        var dt={path : [] ,chitRaw:this.chitRaw , chit : this.props.chit , currentTier : bw.menu.getBy('name' , 'top')[0]}

      React.render(
            React.createElement(bw.app.views.newOrder , dt) ,
            $('.container')[0]
        );

        // console.log(myIndex)
    } ,
    _showDelete:function(e) {

        var data = JSON.parse($(e.currentTarget).attr('data'));
        var chit = data[0];
        var index = data[1];

        if (this.props.chitRaw && this.props.chitRaw.chit_items[index]){
            // this exists on the permenant ticket, cannot delete, but with mngr permissions you can void...
            // for now, we do not concern ourselves with void.
            return
        }

        // var myIndex = $(e.currentTarget).attr('data')
        // debugger
        $('.delete').addClass('hidden')
        $('*').on('click' , function(){
            $('.delete').addClass('hidden')
        })
        $(this.refs['delete'+index].getDOMNode()).removeClass('hidden')
    } ,
    render:function() {
        // console.log(JSON.stringify(this.props.chit))
        console.log('render')
        var s = function(d){return JSON.stringify(d)}

        var self = this;
        var chit = this.props.chit;
        // debugger
        return d('div.leftPane@controls', [
            d('div.grid' , [
                                
                ( chit.length ? 
                    
                    d('div.previewOrder.grid.grid-2-100' , chit.map(function(item , i){
                        // debugger
                        return  [
                            d('div.itemDesc@'+i , { data: s([item , i]) , onTouchStart: self._showDelete } , _.pluck(item , 'name').map(function(name) {
                                return name
                            }).join('/')),
                            d('div.itemPrice@p'+i , [_.pluck(item , 'price').map(function(price) {
                                return price/100
                            }).sum()+'' , d('div.hidden.delete@delete'+i , { data: s([item , i]) , onTouchStart: self._delete } , 'x')])
                        ]
                    }))
                    : d('div')
                )
            ])
        ])
    }
});
bw.app.views.newOrder = React.createClass({

    componentWillUnmount : function() {
        this.props.chit = [];
        this.props.chitRaw = null;
    },
    componentWillMount:function(){
        
        this.props.currentTier = bw.menu.getBy('name' , 'top')[0];
        // debugger
        if(!this.props.chit)
            this.props.chit = [];

        this.props.path = [];
    },
    _goBack:function() {
        // bw.history.back();return;
        React.render(
            React.createElement(bw.app.views.main) ,
            $('.container')[0]
        );
    } ,
    _nextTier : function(e) {//_.throttle(
        var nextTier = JSON.parse($(e.currentTarget).attr('data'));
        
        // empty button was clicked
        if (!nextTier)
            return;

        var currentTier = this.props.currentTier//bw.menu.getBy('id' , this.props.currentTier)[0];
        
        // so long as we are not on the groups level,
        if (currentTier.level>0)
            this.props.path.push(nextTier);
        
        // console.log('layout' , _.compact(nextTier.items).length)
        // if the next tier has no more sub levels, we won't be going any deeper
        if (_.compact(nextTier.items).length!==0)
            this.props.currentTier = nextTier;
        else {
            
            // console.log('add the item to temp chit')

            if(currentTier.level>0)
                this.props.chit.push(JSON.copy(this.props.path));
            else
                return;

            //reset these when starting over at next item
            this.props.path = [];
            this.props.currentTier = bw.menu.getBy('name' , 'top')[0];
        }

        this.forceUpdate();
    },// , 2000) ,
    // throttled: ,
    _handleClick:function(e) {

        var data = $(e.currentTarget).attr('data');
        var self = this;
        if (!data)
            return;
        var payView = function(chit) {
            // debugger;
            if (data == 'pay'){
                bw.history.add('payment');
                React.render(
                    React.createElement(bw.app.views.payment , {order:chit }) ,
                    $('.container')[0]
                );
            }
        }
        if (data == 'done' || data == 'pay') {
            
            if (this.props.chit.length > 0) {
                
                // track the new items and 
                if (this.props.chitRaw){
                   var tmp =  _.filter(this.props.chit , function(item , i) {

                        if (!self.props.chitRaw.chit_items[i])       //.mods = item;
                            return item;
                    });
                    // debugger
                    // bw.orders.update({id:1 , items:[[1,2,3]] , status:'closed'})
                    // debugger
                     // console.log*()
                    if (tmp.length)
                        bw.orders.update({
                            id:this.props.chitRaw.id ,
                            items:_.map(tmp , function(item){return _.pluck(item , 'id')}) || null ,
                        }).then(payView);
                    else payView(this.props.chitRaw)
                }
                else
                    bw.orders.add(_.map(this.props.chit , function(item){return _.pluck(item , 'id')}))
                    .then(payView);
               }
            
            bw.history.back();

        }
            // console.log(JSON.stringify());
        if (data == 'cancel')
            bw.history.back();
        

    } ,
    render:function() {
        // try{
        var self      = this ,
            s         = function(d){return JSON.stringify(d)} ,
            item      = this.props.currentTier,//bw.menu.getBy('id' , this.props.currentTier)[0] ,
            levelName = (item.level == 0 ? 'menu groups' : ( item.level == 1 ? 'group ': 'item ') + item.name ) ,
            layout    = item.items.split(',');
        // }catch(e){debugger}
        console.log('render')
        // pad our layout array to the appropriate length
        while(layout.length<48)
            layout.push(null);
        // debugger
        return d('div', [
                
            d('div.title@title' , [d('button.back@back' , {onTouchStart:this._goBack} , 'back') , 'new order']),
            
            d(bw.app.views.newOrderLeftPanel , {chitRaw:this.props.chitRaw , chit:this.props.chit}) ,

            d('div.content.grid.grid-8-100' , _.map(layout,function(v,i) {
                
                var item = v?bw.menu.getBy('id',v)[0]:'';
                
                return d('button@'+(v?'mod'+v:'empty'+i) , {
                    data:s(item) , 
                    onTouchStart : self._nextTier 
                  //  onTouchStart : self._nextTier
                } , v ? item.name : '');
            })),
            d('div.grid.grid-3-100.bottom' , _.map(['cancel',,'done',,,'pay'] , function(v , i) {
                var ref = (v?v.replace(/ /g,''):i)
                return d('button.'+ref+'@'+ref , {data:v , onTouchStart:self._handleClick} , v || '');
            })) ,
        ])
    }
});

bw.app.views.currentOrdersLeftPanel = React.createClass({

    _showSort:function(e , reactid) {
        var data = JSON.parse($(e.currentTarget).attr('data'));
        // console.clear()
        // console.log({displayOrders:bw.orders.getBy('status' , data.sort )})
        React.render(
            React.createElement(bw.app.views.currentOrders , {displayOrders:bw.orders.getBy('status' , data.sort )}) ,
            $('.container')[0]
        );
        
        // .then(function(results) {
        //     React.render(
        //         React.createElement(bw.app.views.currentOrders , {displayOrders:results}) ,
        //         $('.container')[0]
        //     );
        // })
    } ,
    render:function() {
        
        var s = function(d){return JSON.stringify(d)};
        
        return d('div.leftPane@controls', [
            d('div.grid' , [

                d('div.formControls.grid.grid-2-100' , [
                    d('button.formShowOpen@open'       , {data:s({sort:'open'})    , onTouchStart:this._showSort} , 'open orders') ,
                    d('button.formShowClosed@closed'   , {data:s({sort:'closed'})  , onTouchStart:this._showSort} , 'closed orders') ,
                    d('button.formShowDeleted@deleted' , {data:s({sort:'deleted'}) , onTouchStart:this._showSort} , 'deleted orders') ,
                    d('button.formShowOther@all'       , {data:s({sort:'.'})       , onTouchStart:this._showSort} , 'all orders')
                ])
            ])
        ])
    }
});
bw.app.views.currentOrders = React.createClass({

    _goBack:function() {
        // bw.history.back();return;
        React.render(
            React.createElement(bw.app.views.main) ,
            $('.container')[0]
        );
    } ,
    componentWillMount:function(){
        var self = this;
        // console.log(self.props.displayOrders||'not found')
        self.props.displayOrders = bw.orders.getBy('status' , 'open');//debugger
        self.forceUpdate();
        // console.log(self.props.displayOrders)
        // .then(function(results) {
        //     self.props.displayOrders = results;
        //     self.forceUpdate();
        // });

    },
    _showPreview:function(e,reactid) {
        // var self = this;
        var data = JSON.parse($(e.currentTarget).attr('data'));
        // debugger
        this.props.displayPreview = data;
        // debugger
        this.forceUpdate();

    },
    _openOrder:function() {
        
        if (this.props.displayPreview.status == 'closed')
            return
        bw.history.path.pop()
        bw.history.path.push('newOrder')
        React.render(
            React.createElement(bw.app.views.newOrder , {path : [] , chitRaw : this.props.displayPreview , chit : _.pluck(this.props.displayPreview.chit_items , 'mods')}) ,
            $('.container')[0]
        );
    } ,
    render:function() {
        var self    = this;
        var s       = function(d){return JSON.stringify(d)};
        var results = this.props.displayOrders;
        var preview = this.props.displayPreview;
        // debugger
        return d('div', [
            d('div.title@title' , [d('button.back@back' , {onTouchStart:this._goBack} , 'back') , 'orders']),
            
            d(bw.app.views.currentOrdersLeftPanel) ,

            d('div.content.grid.grid-2-100' , [
                ( results ?
                    
                    d('div.grid.orderList' , _.map(results.sort(function(a,b){return a.id>b.id?1:-1}) , function(order , i) {
                        return d('button.'+order.status+'@' + i , {data:s(order),onTouchStart:self._showPreview} , 'order #'+order.id)
                    }) )
                    
                    : 'orders'
                ) ,
                ( preview ?
                    [
                        d('div.previewOrder.grid.grid-2-100' , preview.chit_items.map(function(item,i) {
                            
                            return [
                                d('div.itemDesc@n'+i , item.mods.map(function(mod,i) {
                                    
                                    return mod.name;
                                
                                }).join('/')) ,
                                d('div.itemPrice@p'+i , item.mods.map(function(mod,i) {
                                
                                    return mod.price/100;
                                
                                }).sum()+'')
                            ]

                        }) ) ,
                        d('div',''),
                        (preview.status=='open'?d('button.openOrder@openOrder' , {onTouchStart:this._openOrder} , 'open'):'')
                    ]
                    : 'preview'
                )
            ])
        ])
    }
});
//
//////////////////////////