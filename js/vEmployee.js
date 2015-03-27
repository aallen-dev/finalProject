
window.bw    || (window.bw    = {}) ,
bw.app       || (bw.app       = {}) ,
bw.app.views || (bw.app.views = {});
//////////////////////////
// employee views
bw.app.views.editEmployeesLeftPanel = React.createClass({

    _updateSearch:function(e) {

        var val = $(e.currentTarget).val().toLowerCase();
        
        // filter our results by the same level as the item we are editing
        var matched = _.filter(bw.users.cache , function(user , id , c) {
            return (new RegExp(val)).exec(user.name.toLowerCase());
        });
    
        this.props.filtered = val ? matched : null;
        this.forceUpdate();
    } ,
    _goNewEmployee:function() {
        React.render(
            React.createElement(bw.app.views.editEmployees , {user:{isNew:true,name:'',pin:'',email:''}}) ,
            $('.container')[0]
        );
    } ,
    _selectEmployee:function(e , reactid) {
        
        var user = JSON.parse($(e.currentTarget).attr('data'));

        React.render(
            React.createElement(bw.app.views.editEmployees , {user:user}) ,
            $('.container')[0]
        );
    } ,
//
    render:function() {
        
        var s = function(d){return JSON.stringify(d)};
        var self = this;

        var EmployeesList = (this.props.filtered || bw.users.cache).sort(function(a,b){
            return a.name.toLowerCase()>b.name.toLowerCase() ? 1 : -1 ;
        });

        return d('div.leftPane@controls', [
            d('div.grid' , [
                
                d('button.newEmployee@newEmployee' , {onClick:this._goNewEmployee} , 'newEmployee') ,
                
                d('input.searchEmployee[placeholder=search]@searchEmployee' , {onChange:this._updateSearch}),
                
                d('div.previewE.grid' , _.map(EmployeesList , function(user , index) {

                    return d('button.prev@user' + user.id , {data:s(user) , onClick:self._selectEmployee} , user.name);

                }))
            ])
        ])
    }
});
bw.app.views.editEmployees = React.createClass({
    
    _goBack:function() {
        React.render(
            React.createElement(bw.app.views.admin) ,
            $('.container')[0]
        );
    } ,
    _save:function() {

        var user  = this.props.user ,
            self  = this ,
            node  = function(s){return $(self.refs[s].getDOMNode())} ,
            name  = node('nameInput').val() ,
            email = node('emailInput').val() ,
            pin   = self.refs['pinInput']?node('pinInput').val():null;

        if (user.isNew){
            // node('custPIN').is(':checked')

            user.name = name;
            user.email = email;
            user.admin = node('adminInput').is(':checked');
            bw.users.add(user).then(function(d){
                console.log(JSON.stringify(d));
                self.forceUpdate();
            });
            this.props.user = null;
            return;
        }

        if (pin!==user.name)
            user.pin = pin;

        if (name!==user.name || pin!==user.name || email!==user.email) {
            user.name = name;
            user.email = email;
            bw.users.update(user);
        }
        this.forceUpdate();
    } ,
    _filterPIN:function(e) {
        var el = $(e.currentTarget);
        el.val(el.val().replace(/[^0-9]/g,''));
    } ,
    _toggleCustPIN:function() {
        var self  = this ,
            node  = function(s){return $(self.refs[s].getDOMNode())};

        this.props.PIN_text = node('custPIN').is(':checked') ? 'using custom pin' : 'pin generated automatically'
        this.forceUpdate()
    } ,
//
    render:function() {
        // debugger
        // if(this.props.user)
        // debugger
        var user = this.props.user;

        var PIN_text = this.props.PIN_text || 'pin generated on server'
        return d('div', [
            d('div.title@title' , [d('button.back@back' , {onClick:this._goBack} , 'back') , 'edit employees']),
            
            d(bw.app.views.editEmployeesLeftPanel) ,
            d('div.content.grid.grid-2-100' , ( user ? [

                d('div@name' , 'name'),
                d('input[defaultValue='+user.name+']@nameInput') ,
                d('div@email' , 'email') ,
                d('input[defaultValue='+user.email+']@emailInput') ,
                ( (user.isNew ? ($(this.refs.custPIN&&this.refs.custPIN.getDOMNode()).is(':checked')) : true) ?
                    [
                        d('div@pin' , 'pin') ,
                        d('input[type=password][defaultValue='+user.name+']@pinInput' , {onChange:this._filterPIN})
                    ]
                    : [d('div@empty01' , '') , d('div@empty02' , '')]
                ) ,
                d('div@isAdmin' , 'is admin') ,
                d('div@aa' , [d('input[type=checkbox][checked='+(user.admin ? 'checked' : '')+']@adminInput')]) ,
                
                ( user.isNew ? 
                    [
                        d('div@isCustomPIN' , PIN_text) ,
                        d('div@pp' , [d('input[type=checkbox][checked=]@custPIN' , {onClick:this._toggleCustPIN})]) ,
                        d('div@empty1' , '')
                    ]
                    : d('div@empty1' , '')
                ) ,

                d('div@empty2' , '') ,
                d('div@empty3' , '') ,
                d('button@submit' , {onClick:this._save} , 'save')

            ] : '' ))
        ])
    }
});
//
//////////////////////////












    //////////////////////////mistake?
        // employee views
        // bw.app.views.editEmployeesLeftPanel = React.createClass({

        //     _goBack:function() {
        //         React.render(
        //             React.createElement(bw.app.views.admin) ,
        //             $('.container')[0]
        //         );
        //     } ,
        //     _updateSearch:function(e) {

        //         var val = $(e.currentTarget).val().toLowerCase();
                
        //         // filter our results by the same level as the item we are editing
        //         var matched = _.filter(bw.users.cache , function(user , id , c) {
        //             return (new RegExp(val)).exec(user.name.toLowerCase());
        //         });
            
        //         this.props.filtered = val ? matched : null;
        //         this.forceUpdate();
        //     } ,
        //     _goNewEmployee:function() {
        //         React.render(
        //             React.createElement(bw.app.views.editEmployees , {user:{isNew:true,name:'',pin:'',email:''}}) ,
        //             $('.container')[0]
        //         );
        //     } ,
        //     _selectEmployee:function(e , reactid) {
                
        //         var user = JSON.parse($(e.currentTarget).attr('data'));

        //         React.render(
        //             React.createElement(bw.app.views.editEmployees , {user:user}) ,
        //             $('.container')[0]
        //         );
        //     } ,
        // //
        //     render:function() {
                
        //         var s = function(d){return JSON.stringify(d)};
        //         var self = this;

        //         var EmployeesList = (this.props.filtered || bw.users.cache).sort(function(a,b){
        //             return a.name.toLowerCase()>b.name.toLowerCase() ? 1 : -1 ;
        //         });

        //         return d('div.leftPane@controls', [
        //             d('div.grid' , [
                        
        //                 d('button.back@back'               , {onClick:this._goBack}        , 'back') ,
        //                 d('button.newEmployee@newEmployee' , {onClick:this._goNewEmployee} , 'newEmployee') ,
                        
        //                 d('input.searchEmployee[placeholder=search]@searchEmployee' , {onChange:this._updateSearch}),
                        
        //                 d('div.previewE.grid' , _.map(EmployeesList , function(user , index) {

        //                     return d('button.prev@user' + user.id , {data:s(user) , onClick:self._selectEmployee} , user.name);

        //                 }))
        //             ])
        //         ])
        //     }
        // });
        // bw.app.views.editEmployees = React.createClass({
            
        //     _save:function() {

        //         var user  = this.props.user ,
        //             self  = this ,
        //             node  = function(s){return $(self.refs[s].getDOMNode())} ,
        //             name  = node('nameInput').val() ,
        //             email = node('emailInput').val() ,
        //             pin   = self.refs['pinInput']?node('pinInput').val():null;

        //         if (user.isNew){
        //             // node('custPIN').is(':checked')

        //             user.name = name;
        //             user.email = email;
        //             user.admin = node('adminInput').is(':checked');
        //             bw.users.add(user).then(function(d){
        //                 console.log(JSON.stringify(d));
        //                 self.forceUpdate();
        //             });
        //             this.props.user = null;
        //             return;
        //         }

        //         if (pin!==user.name)
        //             user.pin = pin;

        //         if (name!==user.name || pin!==user.name || email!==user.email) {
        //             user.name = name;
        //             user.email = email;
        //             bw.users.update(user);
        //         }
        //         this.forceUpdate();
        //     } ,
        //     _filterPIN:function(e) {
        //         var el = $(e.currentTarget);
        //         el.val(el.val().replace(/[^0-9]/g,''));
        //     } ,
        //     _toggleCustPIN:function() {
        //         var self  = this ,
        //             node  = function(s){return $(self.refs[s].getDOMNode())};

        //         this.props.PIN_text = node('custPIN').is(':checked') ? 'using custom pin' : 'pin generated automatically'
        //         this.forceUpdate()
        //     } ,
        // //
        //     render:function() {
        //         // debugger
        //         // if(this.props.user)
        //         // debugger
        //         var user = this.props.user;

        //         var PIN_text = this.props.PIN_text || 'pin generated on server'
        //         return d('div', [
        //             d('div.title@title' , 'edit employees'),
                    
        //             d(bw.app.views.editEmployeesLeftPanel) ,
        //             d('div.content.grid.grid-2-100' , ( user ? [

        //                 d('div@name' , 'name'),
        //                 d('input[defaultValue='+user.name+']@nameInput') ,
        //                 d('div@email' , 'email') ,
        //                 d('input[defaultValue='+user.email+']@emailInput') ,
        //                 ( (user.isNew ? ($(this.refs.custPIN&&this.refs.custPIN.getDOMNode()).is(':checked')) : true) ?
        //                     [
        //                         d('div@pin' , 'pin') ,
        //                         d('input[type=password][defaultValue='+user.name+']@pinInput' , {onChange:this._filterPIN})
        //                     ]
        //                     : [d('div@empty01' , '') , d('div@empty02' , '')]
        //                 ) ,
        //                 d('div@isAdmin' , 'is admin') ,
        //                 d('div@aa' , [d('input[type=checkbox][checked='+(user.admin ? 'checked' : '')+']@adminInput')]) ,
                        
        //                 ( user.isNew ? 
        //                     [
        //                         d('div@isCustomPIN' , PIN_text) ,
        //                         d('div@pp' , [d('input[type=checkbox][checked=]@custPIN' , {onClick:this._toggleCustPIN})]) ,
        //                         d('div@empty1' , '')
        //                     ]
        //                     : d('div@empty1' , '')
        //                 ) ,

        //                 d('div@empty2' , '') ,
        //                 d('div@empty3' , '') ,
        //                 d('button@submit' , {onClick:this._save} , 'save')

        //             ] : '' ))
        //         ])
        //     }
        // });
        //
    //////////////////////////