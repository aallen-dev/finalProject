


/******************

                Here be Dragons

        The menus were the first React components for me,
        so, I had some growing pains... 

        bw.app.views.editMenu has already undergone refactoring
        to improve on what I have learnned through the other
        components, but bw.app.views.editMenuLeftPanel still
        needs serious refactoring.

        When that is done, I'll remove this warning.

******************/



window.bw    || (window.bw    = {}) ,
bw.app       || (bw.app       = {}) ,
bw.app.views || (bw.app.views = {});
//////////////////////////
// menu views
bw.app.views.editMenuLeftPanel = React.createClass({
    
    componentWillReceiveProps:function() {
        
        // console.log('props')
        // var item = bw.menu.getBy('id',menuId)[0];
    },
    componentWillMount:function() {
        // var self = this;
        // var node = function(s){return $(self.refs[s].getDOMNode())}

        // node('back').on('click' , function() {


        // });
    } ,
    _goBack:function() {
        React.render(
            React.createElement(bw.app.views.admin) ,
            $('.container')[0]
        );
    } ,
    _updateTable:function() {
        var self = this;

        var item = bw.menu.getBy('id' , self.props.openGroup)[0];
        var tmpArr = item.items.split(',');
        var index = tmpArr.indexOf(self.props.edit.id.toString());
        tmpArr[index] = null;
        item.items = tmpArr.join(',');
        bw.menu.update(JSON.copy(item)).then(function() {

            React.render(
                React.createElement(bw.app.views.editMenu , {currentTier:item , openGroup:self.props.openGroup,editing:item.items.split(',')}) ,
                $('.container')[0]
            );
        })
    } ,
    // _deleteItem:function() { // maybe this shouldn't be here. a mod can be on many tables, this should be done somewhere else if at all
        // // delete from menu or just remove from this table??
        // var self = this;
        // if (!confirm('if you only need to remove this item from the current table you should use "remove" instead\n\npermenently remove this item?'))
        //     return
        // bw.menu.delete(this.props.edit.id).then(function(data) {
        //     self._updateTable();
        // })
    // } ,
    _removeItem:function() {
        $('.red').removeClass('red')
        this._updateTable()
    } ,
    _editSub:function() {
        // debugger
        var item = bw.menu.getBy('id' , this.props.openGroup)[0];

        bw.menu.editing.path||(bw.menu.editing.path=[]);
        bw.menu.editing.path.push(item.id);

        React.render(
            React.createElement(bw.app.views.editMenu , {currentTier:item , openGroup:this.props.edit.id,editing:this.props.edit.items.split(',')}) ,
            $('.container')[0]
        );
    } ,
    _goUp:function() {

        var item = bw.menu.getBy('id' , bw.menu.editing.path[bw.menu.editing.path.length-1])[0];
        bw.menu.editing.path.pop();

        React.render(
            React.createElement(bw.app.views.editMenu , {currentTier:item,openGroup:item.id,editing:item.items.split(',')}) ,
            $('.container')[0]
        );
    } ,
    _cancelItem:function(e) {

        this.props.button.html(this.props.edit.name||'').removeClass('red')
        this.props.edit = null
        this.forceUpdate()
    } ,
    _selectExisting:function(e , reactid) {

        var self = this;
        
        // using the preview of existing cats/itms/mods we have selected an existing menu_item for this position
        var menuId = /@mod.*$/.exec(reactid)[0].replace(/[^0-9]/g,'');
        var index = this.props.edit.index;
        var item = bw.menu.getBy('id' , this.props.openGroup)[0];
        var tmpArr = item.items.split(',');
        
        if (tmpArr.indexOf(menuId)>=0) {
            alert('this item already exists on this menu')
            return
        }

        this.props.edit = bw.menu.getBy('id' , menuId)[0]
        tmpArr[index] = menuId;
        item.items = tmpArr.join(',');
        bw.menu.update(JSON.copy(item)).then(function() {

            React.render(
                React.createElement(bw.app.views.editMenu , {currentTier:item}) ,
                $('.container')[0]
            );
        })
    } ,
    _clearPreview:function(e) {

        var input = $(e.currentTarget)
        var self = this;

        _.delay(function() {
            // a short delay to allow us to select preview buttons (also, check that we haven't re-entered to prevent buggy behaviour)
            if (!input.is(":focus")) {
                self.props.preview = null
                self.forceUpdate()
            }
        } , 500)
    } ,
    _updateButton:function(e) {

        var val = $(e.currentTarget).val()
        
        // filter our results by the same level as the item we are editing
        // debugger
        var level = Number(bw.menu.getBy('id' , this.props.openGroup)[0].level) + 1
        var matched = [((level==1&&'categories')||(level==2&&'menu items')||(level==3&&'modifiers')) + ' that match your input']
                        .concat(_.filter(bw.menu.getBy('level' , level) , function(item,id,c) {
                        
                            // debugger
                            return (new RegExp(val)).exec(item.name);
                        }));

        this.props.preview = val ? matched : null;

        
        this.props.button.html(val)
        this.forceUpdate()
    } ,
    _saveItem:function() {
        $('.red').removeClass('red')

        var self = this;
        var node = function(s){return $(self.refs[s].getDOMNode())};
        var index;
        var openGroup = bw.menu.getBy('id' , self.props.openGroup)[0]

        if (openGroup.level==0) { // 0 is top level, it holds categories
            this.props.edit.level = 1; // menu categories
        }

        if (openGroup.level==1) {
            this.props.edit.level = 2; // menu items
        }

        if (openGroup.level>=2) {
            this.props.edit.level = 3; // menu modifiers
        }

        this.props.edit.name =  node('nameInput').val()
        this.props.edit.price =  Number(node('priceInput').val()) * 100
        
        if (this.props.edit.id) {

            bw.menu.update(JSON.copy(this.props.edit)).then(function() {

                var item = bw.menu.getBy('id' , self.props.openGroup)[0]
                React.render(
                    React.createElement(bw.app.views.editMenu , {currentTier:item}) ,
                    $('.container')[0]
                );
            });
        }
        else{

            index = this.props.edit.index;
            delete this.props.edit.index
            bw.menu.add(JSON.copy(this.props.edit)).then(function(data) {
                //add the returned id to the index on the given table, save, and  redraw
                var item = bw.menu.getBy('id' , self.props.openGroup)[0]
                var tmpArr = item.items.split(',')

                tmpArr[index] = data.menu_item.id
                item.items = tmpArr.join(',')

                bw.menu.update(JSON.copy(item)).then(function() {

                    React.render(
                        React.createElement(bw.app.views.editMenu , {currentTier:item, openGroup:self.props.openGroup,editing:item.items.split(',')}) ,
                        $('.container')[0]
                    );
                })
            })
        }
    } ,
//
    render:function() {
        
        var self = this;
        var item = bw.menu.getBy('id' , this.props.openGroup)[0];
        console.log(item.level)
        if (!this.props.edit)
            return d('div.grid.leftPane@controls' , [
                d('button.back@back' , {onClick:this._goBack} , 'back') ,
                (item.level>0?d('button.up@up' , {onClick:this._goUp} , 'up'):'')
            ])
        
        // console.log(this.props.edit.name)
        // debugger
        
        return d('div.leftPane@controls' , [
        
            d('div.grid' , [
                d('button.back@back' , {onClick:this._goBack} , 'back') ,
                (item.level>0?d('button.up@up' , {onClick:this._goUp} , 'up'):'') ,
                d('div.formName' , ['name' , d('input[defaultValue='+this.props.edit.name+']@nameInput' , {onBlur:this._clearPreview , onChange:this._updateButton})]) ,
                d('div.preview' , (this.props.preview&&this.props.preview.length>1)?[d('div.previewCont' , _.map(this.props.preview , function(item , index) {
                    if (index == 0)
                        return d('div.info' , item);
                    return d('button.prev@mod' + item.id , {onClick:self._selectExisting} , item.name);
                }))]:'') ,
                d('div.formPrice' , ['price' , d('input[defaultValue='+this.props.edit.price/100+']@priceInput')]) ,
                d('div.formControls.grid.grid-2-100' , [
                    // d('button.formEditSUb' , {onClick:this._editSub} , 'edit sub') ,needs fixing
                    d('button.formRemove' , {onClick:this._removeItem} , 'remove') ,
                    // d('button.formDelete' , {onClick:this._deleteItem} , 'delete') ,
                    d('button.formCancel' , {onClick:this._cancelItem} , 'cancel') ,
                    d('button.formSave' , {onClick:this._saveItem} , 'save')
                ])
            ])

        ]);
    }
});
bw.app.views.editMenu = React.createClass({
    
    _moveItem:function(e,reactid) {
        var nextTier = JSON.parse($(e.currentTarget).attr('data'));
        // debugger
        if (/empty/.exec(reactid))
            return;

        var menuId = nextTier.id + '';
        var layout = this.props.currentTier.items.split(',');

        var width   = $(e.currentTarget).width() + 15 , // padding maybe??
            height  = $(e.currentTarget).height() ,
            clientX = this.props.xDist[this.props.xDist.length-2] ,
            clientY = this.props.yDist[this.props.yDist.length-2] ,
            offset  = -Math.round(clientX / width) + -Math.round(clientY / height) * 8 ,
            index   = layout.indexOf(menuId);
        
        // swap instead
        if (layout[index + offset]){alert('fix swapping')
            layout[index] = layout[index + offset];
        }
        else
            layout[index] = null;

        layout[index + offset] = menuId;
        
        this.props.currentTier.items = layout.join(',');
        bw.menu.update(JSON.copy(this.props.currentTier));

        this.forceUpdate();

    } ,
    _getStartPos:function(e,reactid) {
        
        this.props.yStart = e.clientY;
        this.props.xStart = e.clientX;
        
        this.props.xDist = [];
        this.props.yDist = [];
    } ,
    _dragging:function(e,reactid) {
        
        this.props.xDist.push(this.props.xStart - e.clientX);
        this.props.yDist.push(this.props.yStart - e.clientY);
    } ,
    _editItem:function(e,reactid) {
        var nextTier = JSON.parse($(e.currentTarget).attr('data'));
        $('.red').removeClass('red');
        
        this.props.buttonEditing && this.props.buttonEditing.html(this.props.modEditing.name || '');

        if (!nextTier.id){

            $(e.currentTarget).addClass('red')
            this.props.modEditing = {index:nextTier , name:'' , price:'' , items:''};
        }
        else
            this.props.modEditing = nextTier;

        this.props.buttonEditing = $(e.currentTarget);

        this.forceUpdate();
    } ,
    
    _editSub:function(e) {
        var nextTier = JSON.parse($(e.currentTarget).attr('data'));

        bw.menu.editing.path||(bw.menu.editing.path=[]);
        bw.menu.editing.path.push(this.props.currentTier.id);

        this.props.currentTier = nextTier;
        
        this.forceUpdate();
        
    } ,
    componentWillMount:function() {

        this.props.currentTier = bw.menu.getBy('name' , 'top')[0];
    },

    render:function(){
        var s = function(d){return JSON.stringify(d)};
        var self = this;
        
        var layout    = this.props.currentTier.items.split(',');
        var levelName = (this.props.currentTier.level == 0 ? 'menu groups' : ( this.props.currentTier.level == 1 ? 'group ': 'item ') + this.props.currentTier.name );
        // pad our array to the appropriate length
        while(layout.length<64)
            layout.push(null);

        return d('div' , [
            d('div.title@title' , levelName),
            d(bw.app.views.editMenuLeftPanel , {currentTier:this.props.currentTier , button:this.props.buttonEditing , openGroup:this.props.currentTier.id , edit:this.props.modEditing}) ,

            d('div.content.grid.grid-8-100' , _.map(layout,function(v , i) {

                var item = v ? bw.menu.getBy('id',v)[0] : '';
                
                return d('button[draggable=' + (v ? 'true' : 'false') + ']@' + (v ? 'mod' : 'empty') + i ,
                    {
                        data:s(item||i) ,
                        onDrag:self._dragging ,
                        onDragStart:self._getStartPos ,
                        onDragEnd:self._moveItem ,
                        onClick : self._editItem ,
                        onDoubleClick:self._editSub
                    } , item.name||'');
            }))
        ]);
    }
});

bw.app.views.editBreakdownLeftPanel = React.createClass({

    _goBack:function() {
        React.render(
            React.createElement(bw.app.views.admin) ,
            $('.container')[0]
        );
    } ,
    render:function() {
        return d('div.leftPane@controls', [
            d('div.grid' , [
                d('button.back@back' , {onClick:this._goBack} , 'back') ,
            ])
        ])
    }

});
bw.app.views.editBreakdown = React.createClass({

    render:function() {
        return d('div', [
            d('div.title@title' , 'edit menu'),
            
            d(bw.app.views.editBreakdownLeftPanel) ,

            d('div.content.grid.grid-2-100' , [
                // d('div@w' , 'left'),
                // d('div@e' , 'preview')
            ])
        ])
    }

});

//
//////////////////////////