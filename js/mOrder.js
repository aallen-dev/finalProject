//////////////////////////
//
window.bw || (window.bw = {}) ,
bw.orders || (bw.orders = {});

bw.orders = {
    cache : [] ,
    // $BASE_URL = https://evening-basin-4204.herokuapp.com/api/v1
    // All actions require a header with "Authorization" set to the user's authentication token.
    getAll:function() {
        // return this.fakeGetAll();
        // Show all chits
        // GET $BASE_URL/chits
        var p = $.Deferred();

        $.get('https://evening-basin-4204.herokuapp.com/api/v1/chits').then(function(results){
            p.resolve(results.chits)
        })
        return p
    } ,
    cashAll : function(){
        
        var p = $.Deferred()

        this.getAll().then(function(d){
            // console.log(d)
            // debugger
            bw.orders.cache = d;
            p.resolve();
        })
        return p;
    } ,
    add:function(ticket) {
        // return this.fakeAdd(ticket);
        // Create Chit
        // Send an array of arrays of menu item IDs to put on chit
        // POST $BASE_URL/chits
        // var testDat = { "chit": { "chit_items": { [1, 3, 5], [2, 5, 6], [1, 3, 6, 7] } } }
        return $.post('https://evening-basin-4204.herokuapp.com/api/v1/chits' , {"chit": {"chit_items": ticket }});
    } ,
    fakeGetAll:function() {alert('phony!!!!')
        var p = $.Deferred()
        bw.menu.getAll().then(function(d){
            // fake tables use level over 9000
            p.resolve(d.menu_items.filter(function(item){return item.level==9001}).map(function(data){
                var table = JSON.parse(  data.name.split('{{json}}')[1]  ).table
                table.id = data.id
                return table;
            }));
        });
        return p;
    } ,
    fakeAdd:function(ticket) {alert('phony!!!!')
        // ticket = [{mods:[1,2,3]},{mods:[4,5,6]}{mods:[7,8,9]}]
        return bw.menu.add({
            level:9001,
            name:'',
            table:{
                status: 'open',
                chit_items: ticket.map(function(item , i){

                    return {
                        id: i,
                        mods: item.mods,
                        active: true,
                        updated_by: 1,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                }) ,
                "owner": 1
                //daily_order_num: 1
            }
        })
    } ,
    fakeUpdate:function(ticket) {alert('phony!!!!')
        var chit = {
            level:9001,
            name:'' ,
            id:ticket.id,
            table:ticket
        }
        delete chit.table.id;
        return bw.menu.update(chit)
    } ,
    fakeDelete:function(id){alert('phony!!!!')

        return bw.menu.delete(id)
    } ,
    update:function(ticket) {alert()
        return this.fakeUpdate(ticket);
        // Update Chit
        // New items passed will actually create new rows, not delete previous items. Status can be updated
        // :id is the id of the chit
        // PUT $BASE_URL/chits/:id
        // { "chit": { "chit_items": { [1, 5] }, "status": "closed" } } }
        return $.ajax({
            url  : 'https://evening-basin-4204.herokuapp.com/api/v1/chits/'+ticket.id,
            type : 'PUT' ,
            data : {chit:{chit_items:ticket.items,status:ticket.status}}
        })
    } ,
    delete:function(id) {

        return this.fakeDelete(id)
    } ,
    getBy : function (filter , matches) {
        
        // var p = $.Deferred()
        // this.getAll().then(function(orders) {
            // p.resolve(
            return _.filter(bw.orders.cache , function(order,id,c) {
                return (new RegExp(matches)).test(order[filter] && order[filter]);
            })
                // );
        // })
        // return p;
    } ,
    fakeGet:function(id){

        return bw.menu.get(id)
    } ,
    get:function(id) {alert()
        // return this.fakeGet(id);
        return $.get('https://evening-basin-4204.herokuapp.com/api/v1/chits/'+id)
    }
}
//
//////////////////////////
//////////////////////////
// testing
// bw.orders.getAll().then(function(data) {
//     // console.clear()

//     console.log(_.map(data,function(d){return d.id}))
// });
// bw.orders.getBy('id','28').then(function(results) {
//     var chit = results[0];

// //     chit.status = 'closed'
// //     bw.orders.update(chit)
//     console.log(JSON.stringify(results));
// })
// bw.orders.delete(29)
// bw.orders.add([[1],[2,3,4],[3]])
//
//////////////////////////