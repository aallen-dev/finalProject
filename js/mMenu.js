window.bw || (window.bw = {}) ,
bw.menu   || (bw.menu   = {});

bw.menu = {
    cache   : [] ,
    editing : [] ,
    getAll : function() {
        // $BASE_URL = https://evening-basin-4204.herokuapp.com/api/v1
        // Show all menu items
        // GET $BASE_URL/menu_items
        return $.get('https://evening-basin-4204.herokuapp.com/api/v1/menu_items')
    } ,
    cashAll : function(){
        
        var p = $.Deferred()

        this.getAll().then(function(d){
            console.log(d)
            // fake tables use level over 9000
            bw.menu.cache = d.menu_items.filter(function(item){return item.level<9000}).map(function(item) {

                // until the db is updated I need to hack the name to store additional data for each record :(
                // this /should/ be harmless once the db is updated and just do nothing...

                var data = item.name.split('{{json}}')[1]
                
                if (data) {
                    data = JSON.parse(data);

                    _.forEach(data , function(val , key){
                        item[key] = val;
                    })
                }

                item.name = item.name.split('{{json}}')[0]
                
                return item;
            });
            p.resolve();
        })
        return p;
    } ,
    sortBy : function (key) {
        var x = {}

        _.map(bw.menu.cache , function(item) {

            if (!x[item[key]])
                x[item[key]] = [];

            x[item[key]].push(item)

        })
        return x;
    } ,
    getBy : function (filter , matches) {
        
        // var x = $.Deferred()
        return _.filter(bw.menu.cache , function(item,id,c) {

            // debugger
            return item[filter] && item[filter] == matches
        })
    } ,
    add:function(item) {
        // Create Menu Item
        // Enter price in cents
        // Parent id is the parent, set to 0 for highest level
        // POST $BASE_URL/menu_items
        // { "menu_item": { "level": "1", "name": "Fajita", "price": "1000", "parent_id": "0"} }
        // var testDat = { "menu_item": { "level": "1", "name": "Fajita2", "price": "1000", "parent_id": "0"} };
        var tmp;
        var copy = JSON.copy(item);
        _.forEach(item , function(val , key , obj){

            if (key=='level'||key=='price'||key=='name'||key=='id'||key=='items'||key=='template'||key=='sub_level')
                return
            if (!tmp)
                tmp = {};
            tmp[key] = val;
            delete obj[key]
        })
        if (tmp)
            item.name = item.name.split('{{json}}')[0]+'{{json}}'+JSON.stringify(tmp)
        var p = $.Deferred()
        // debugger
        $.post('https://evening-basin-4204.herokuapp.com/api/v1/menu_items' , {menu_item:item}).then(function(d){
            // console.log(d.menu_item.id)
            copy.id = d.menu_item.id;
            bw.menu.cache.push(copy);
            p.resolve(d);
        });
        
        return p;
    } ,
    update : function(item) {
        // Update Menu Item
        // Same parameter format as Create Menu Item
        // :id is the id of the menu item
        // PATCH $BASE_URL/menu_items/:id

        // rejigger data
        // the db only understands certain fields right now, so we need to remove any custom fields and append them to the name field as a json object
    
        var copy = JSON.copy(item);
        var tmp;// = {}

        ////
        // bit of validation, remove any trailing empty indices
        if (item && item.items) {

            if (typeof item.items == 'string')
                item.items = item.items.replace(/,{1,}.$/ , '');
            else
                while(!item.items[item.items.length-1])
                    item.items.pop();
         // debugger       
        }
        //
        ////

        // adhoc dynamic field insertion (for use when i cant get ahold of db guy)
        _.forEach(item , function(val , key , obj){

            if (key=='level'||key=='price'||key=='name'||key=='id'||key=='items'||key=='template'||key=='sub_level')
                return
            if (!tmp)
                tmp = {};
            tmp[key] = val;
            delete obj[key]
        })
        if (tmp)
            item.name = item.name.split('{{json}}')[0]+'{{json}}'+JSON.stringify(tmp)
        
        var p = $.Deferred()
        $.ajax({
            url  : 'https://evening-basin-4204.herokuapp.com/api/v1/menu_items/'+item.id,
            type : 'PUT' ,
            data : {menu_item:item}
        }).then(function(data) {
            bw.menu.cache.forEach(function(item , index , arr) {
                if (item.id==copy.id)
                    arr[index] = copy;
            });
            p.resolve(data);
        });
        return p;
    },
    delete : function(id) {
        // Delete a menu item
        // DELETE $BASE_URL/menu_items/:id
        var p = $.Deferred()
        $.ajax({
            url: 'https://evening-basin-4204.herokuapp.com/api/v1/menu_items/'+id,
            type: 'DELETE'
        }).then(function(data) {
            bw.menu.cache.forEach(function(item , index , arr) {
                if (item.id==id)
                    arr.splice(index , 1)
            });
            p.resolve(data);
        });
        return p;
    },
    get : function(id) {
        // Show One Menu Item
        // GET $BASE_URL/menu_items/:id
        return $.get('https://evening-basin-4204.herokuapp.com/api/v1/menu_items/'+id);
    }
}

//
//////////////////////////
// //////////////////////////
// // testing
//     // 

//     // $.ajaxSetup({
//     //     headers: {'PIN'  : '75425'} // temp admin pass
//     // });
//     // bw.menu.getAll().then(function(data){
//     //     data.menu_items.sort(function(a,b){
//     //         // console.log(a.id,b.id)
//     //         return a.id-b.id
//     //     })
//     //     console.log(JSON.stringify(data))
//     // })
    
//     // bw.menu.get({id:7}).then(function(data) {
//     //     data.menu_item.name = 'item 7'
//     //     bw.menu.update({data:data , id:7}).then(function() {
//     //         bw.menu.get({id:7}).then(function(d2) {
//     //             console.log(d2)
//     //         })
//     //     })
//     // })
//     // bw.menu.cashAll().then(function() {
//     //     // debugger
//     //     var item = bw.menu.getBy('id','1')[0];

//     //     item.name = 'top';
//     //     // item.level = 0;
//     //     item.items = "14,,40,,9,,15,,,6,,21,,42,,,62,,63,,64,,,,,,,,,,,,,,66,,,,,,,,,65,,,,,,,,,,,,,,,,,,,,,,26"
//     //     // delete item.moreInfozz// = 'zzstuff'

//     //     bw.menu.update(item).then(function() {
//     //         bw.menu.get({id:1}).then(function(d2) {
//     //             console.log(d2)
//     //         })
//     //     })
//     // })
//     // bw.menu.cashAll().then(function() {
//     //     // debugger
//     //     var item = bw.menu.getBy('id','27')[0];

//     //     // item.name = 'sirloin';
//     //     item.level = 3;
//     //     // item.items = ',,2,,,,,,,,,,3,,,,,,,,,,,,,'
//     //     // delete item.moreInfozz// = 'zzstuff'

//     //     bw.menu.update(item).then(function() {
//     //         bw.menu.get({id:27}).then(function(d2) {
//     //             console.log(d2)
//     //         })
//     //     })
//     // })
//     // $.ajax({
//     //     url: 'https://evening-basin-4204.herokuapp.com/api/v1/menu_items/11',
//     //     type: 'DELETE'
//     //     // success: function(result) {
//     //     //     // Do something with the result
//     //     // }
//     // })
//     // bw.menu.delete(32)
//     // bw.menu.delete(31)
//     var dat={"menu_items":[{"id":1,"level":2,"name":"test2","price":1E3,"sub_level":null,"items":"","template":""},{"id":2,"level":0,"name":"top","price":1E3,"sub_level":null,"items":"7,,3,,4,,8,,,11,,9,,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,10","template":""},{"id":3,"level":1,"name":"burgers","price":1E3,"sub_level":null,"items":",,,,,,,,,,20,,,,,,,22,,19","template":""},{"id":4,"level":1,"name":"samiches","price":0,"sub_level":null,"items":",,,,,,,,,,,,,,,,,,17,16,21","template":""},{"id":5,
// "level":1,"name":"red","price":3,"sub_level":null,"items":"","template":""},{"id":6,"level":1,"name":"food num num","price":0,"sub_level":null,"items":"","template":""},{"id":7,"level":1,"name":"steaks","price":1E3,"sub_level":null,"items":",,,,,,,,,,,,,,,,,,15,18","template":""},{"id":8,"level":1,"name":"veggies","price":2,"sub_level":null,"items":"","template":""},{"id":9,"level":1,"name":"beans","price":0,"sub_level":null,"items":"","template":""},{"id":10,"level":1,"name":"help, i'm trapped in a menu",
// "price":666,"sub_level":null,"items":"","template":""},{"id":11,"level":1,"name":"some item","price":0,"sub_level":null,"items":"","template":""},{"id":12,"level":1,"name":"c","price":0,"sub_level":null,"items":"","template":""},{"id":13,"level":1,"name":"a","price":0,"sub_level":null,"items":"","template":""},{"id":14,"level":1,"name":"b","price":0,"sub_level":null,"items":"","template":""},{"id":15,"level":2,"name":"sirloin","price":0,"sub_level":null,"items":"","template":""},{"id":16,"level":2,
// "name":"rueben","price":1E3,"sub_level":null,"items":",,,,,,,,,,26,25,23","template":""},{"id":17,"level":2,"name":"turkey","price":1E3,"sub_level":null,"items":",,,,,,,,,,26,25,23","template":""},{"id":18,"level":2,"name":"t-bone","price":0,"sub_level":null,"items":"","template":""},{"id":19,"level":2,"name":"big mac","price":0,"sub_level":null,"items":"","template":""},{"id":20,"level":2,"name":"whopper","price":500,"sub_level":null,"items":",,,,,,,,,,,,,,,,,,24","template":""},{"id":21,"level":2,
// "name":"ham & swiss","price":1E3,"sub_level":null,"items":",,,,,,,,,,26,25,23","template":""},{"id":22,"level":2,"name":"guac burger","price":0,"sub_level":null,"items":"","template":""},{"id":23,"level":3,"name":"sour dough","price":0,"sub_level":null,"items":"","template":""},{"id":24,"level":3,"name":"tomatoes","price":0,"sub_level":null,"items":"","template":""},{"id":25,"level":3,"name":"rye","price":0,"sub_level":null,"items":",,,,,,,,,,,,,,,,,,27","template":""},{"id":26,"level":3,"name":"wheat",
// "price":0,"sub_level":null,"items":"","template":""},{"id":27,"level":3,"name":"toasted","price":0,"sub_level":null,"items":",,,,,,,,,,,,,,,,,,28","template":""},{"id":28,"level":3,"name":"no crust","price":0,"sub_level":null,"items":"","template":null}]};
    

//     // // debugger
//     dat.menu_items.forEach(function(item , i){
//         // delete item.id
//         // delete item.parent_id

//     //     var data = item.name.split('{{json}}')[1]
        
//     //     if (data) {
//     //         data = JSON.parse(data);

//     //         _.forEach(data , function(val , key){
//     //             item[key] = val;
//     //         })
//     //     }

//     //     item.name = item.name.split('{{json}}')[0]
//     //     // debugger
//     //     _.delay(function(){
//             bw.menu.update(item)
//     //             .then(function(data){

//     //                 // bw.menu.getAll().then(function(data){
//     //                     console.log('pass')
//     //                     console.log(data)
//     //                 // })

//     //             })
//     //     } , 5000 * i)
//     })
//     //
//     //
// //////////////////////////
