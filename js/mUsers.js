
//////////////////////////
//
window.bw || (window.bw = {}) ,
bw.users  || (bw.users  = {});

bw.users = {
    cache : [] ,
    // $BASE_URL = https://evening-basin-4204.herokuapp.com/api/v1
    getAll : function() {
        // Show all users
        // GET $BASE_URL/users
        return $.get('https://evening-basin-4204.herokuapp.com/api/v1/users')
    } ,

    cashAll : function(){
        
        var p = $.Deferred()

        this.getAll().then(function(d){
            console.log(d)
            // debugger
            bw.users.cache = d.users;
            p.resolve();
        })
        return p;
    } ,
    add : function(user) {
        // Create User
        // POST $BASE_URL/users
        // { "user": { "name": "Jon Snow", "email": "jon@snow.com", "password": ""blah", "password_confirmation": "blah", "employee": "true", "admin": "false" } }
        // debugger
        var p = $.Deferred();
        $.post('https://evening-basin-4204.herokuapp.com/api/v1/users' , {user:user}).then(function(data) {
            bw.users.cache.push(user)
            p.resolve(data);
        });
        return p;
    } ,
    update : function(user) {
        // Update User
        // Same parameter format as Create User
        // :id is the id of the User
        // PUT $BASE_URL/users/:id
        var p = $.Deferred();
        return $.ajax({
            url  : 'https://evening-basin-4204.herokuapp.com/api/v1/users/'+user.id,
            type : 'PUT' ,
            data : {user:user}
        }).then(function(data) {
            bw.users.cache.forEach(function(u , index , arr) {
                if (u.id==user.id)
                    arr[index] = user;
            });
            p.resolve(data);
        });
        return p;
    } ,
    get : function(id) {

        // Show One User
        // GET $BASE_URL/user/:id
        return $.get('https://evening-basin-4204.herokuapp.com/api/v1/users/'+id)
    } ,
    delete : function(id) {

        // Delete a user
        // DELETE $BASE_URL/users/:id
        return $.ajax({
            url: 'https://evening-basin-4204.herokuapp.com/api/v1/users/'+id,
            type: 'DELETE'
        });
    } 
}
//
//////////////////////////
//////////////////////////
// testing
// 

// $.ajaxSetup({
//     headers: {'PIN'  : ''}
// });

// bw.users.getAll().then(function(data){

//     console.log(data)

// })
// bw.users.add({
//     "user": {
//         "name"      : "John Snow",
//         "email"     : "jon@snow.com",
//         "password"  : "1234",
//         "employee"  : "true",
//         "admin"     : "false" ,
//         "password_confirmation" : "1234"
//     }
// }).then(function(data){

//     console.log(data)

// })
// bw.users.get({id:10}).then(function(data) {
//     console.log(data)
// })
// bw.users.get({id:8}).then(function(data) {
//     data.user.name = 'guy smith'
//     bw.users.update({data:data , id:8}).then(function() {

//         bw.users.getAll().then(function(data){

//             console.log(data)

//         });
//     });
// });

// bw.users.delete(4).then(function() {

//     bw.users.getAll().then(function(data){

//         console.log(data)

//     });
// });

//
//
//////////////////////////
