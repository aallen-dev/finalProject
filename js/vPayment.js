
window.bw    || (window.bw    = {}) ,
bw.app       || (bw.app       = {}) ,
bw.app.views || (bw.app.views = {});


bw.app.views.paymentLeftPanel = React.createClass({

    _goBack:function() {
        React.render(
            React.createElement(bw.app.views.main) ,
            $('.container')[0]
        );
    } ,
    _closeCredit:function() {
        this.props.credit = true;
        React.render(
            React.createElement(bw.app.views.payment , this.props) ,
            $('.container')[0]
        );
    } ,
    _closeCash:function() {
        bw.orders.update({id:this.props.order.id , status:'closed'}).then(function(chit) {
            bw.history.back();
        });
    } ,
    render:function() {
        return d('div.leftPane@controls', [
            d('div.grid' , [
                d('button.back@back' , {onClick:this._goBack} , 'back') ,
                d('div@t' , 'select payment type') ,
                d('button@cash' , {onClick:this._closeCash} , 'cash') ,
                d('button@credit' , {onClick:this._closeCredit} , 'credit')
            ])
            // d('div.grid@payType' , [])
        ])
    }

});
bw.app.views.payment = React.createClass({
    
    _filterNumbers:function(e) {
        var el = $(e.currentTarget);
        el.val(el.val().replace(/[^0-9]/g,''));
    },
    _chargeit:function(e) {
        
        // bw.runIt({number:'4242424242424242' , cvc:'222' , mm:'2' , yyyy:'2020'})
        // try{
        bw.runIt({
            number : $(this.refs.creditCardNumber.getDOMNode()).val() ,
            yyyy   : $(this.refs.expires.getDOMNode()).val().split('/')[1] ,
            cvc    : $(this.refs.CVC.getDOMNode()).val() ,
            mm     : $(this.refs.expires.getDOMNode()).val().split('/')[0]
        });
        bw.orders.update({id:this.props.order.id , status:'closed'}).then(function(chit) {
            bw.history.back();
        });
        // }
    },
    _filterDate:function(e) {
        var el = $(e.currentTarget);
        if(!el.val().match(/^(1[0-2]|0[1-9]|\d)\/([2-9]\d[1-9]\d|[1-9]\d)$/g))
            el.val('invalid date');
    } ,
    render:function() {
        // debugger
        return d('div', [
            d('div.title@title' , 'close order'),
            
            d(bw.app.views.paymentLeftPanel , this.props) ,

            d('div.content.grid.grid-2-100' , [
                
                d('div.previewOrder.grid.grid-2-100' , this.props.order.chit_items.map(function(item , i){
                    // debugger
                    // console.log(item)
                    return [
                        d('div.itemDesc@n'+i , item.mods.map(function(mod,i) {
                            
                            return mod.name;
                        
                        }).join('/')) ,
                        d('div.itemPrice@p'+i , item.mods.map(function(mod,i) {
                        
                            return mod.price/100;
                        
                        }).sum()+'')
                    ]
                })) ,
                (this.props.credit ?
                    d('div.grid@e' , [
                        
                        d('input[defaultValue=credit card number]@creditCardNumber' , {onChange:this._filterNumbers}) ,
                        d('input[defaultValue=CVC]@CVC' , {onChange:this._filterNumbers}) ,
                        d('input[defaultValue=expires mm/yyyy]@expires' , {onBlur:this._filterDate}) ,
                        d('button@chargeIt' , {onClick:this._chargeit} , 'charge it') 

                    ])
                :   'nope'
                )
            ])
        ])
    }

});









