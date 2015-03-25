
//////////////////////////
//
window.bw || (window.bw = {}) ,
bw.user   || (bw.user   = {});
bw.user = {

    login:function(pin){
        // $BASE_URL = https://evening-basin-4204.herokuapp.com/api/v1/sessions


        // Log in user
        // POST $BASE_URL
        // Will return a user object with an authentication_token. Pass this token to other requests.

        return $.ajax({
            url:'https://evening-basin-4204.herokuapp.com/api/v1/sessions' ,
            type : 'POST' ,
            data:{pin:pin} ,
            success:function(){
                console.log('pass')
                $.ajaxSetup({
                    headers: {'PIN'  : pin}
                });
            } ,
            error:function(){
                console.log('fail')
            }
        });
    } ,
    logout:function(){

        // Log out user
        $.ajaxSetup({
            headers: {'PIN'  : ''}
        });
    }
};
//
//////////////////////////
//////////////////////////
//testing
//

// bw.user.login('75425').then(function() {// temp admin pass

//     bw.users.getAll().then(function(data) {

//         console.log(data)
//         debugger
//         bw.users.get({id:2}).then(function(response) {

//             response.user.name = 'jo blo';//'1234'
//             debugger
//             bw.users.update({data:response , id:2}).then(function() {

//                 bw.users.getAll().then(function(data){

//                     console.log(data)

//                 });
//             });
//         })
//         // bw.user.logout()

        
//     })

// })

// $.ajax({
//     url  : 'https://evening-basin-4204.herokuapp.com/api/v1/sessions',
//     type : 'POST' ,
//     // headers: {'x-PIN'  : '75425'}// temp admin pass
//     data : {'PIN':'75425'}
// });
//
//
//////////////////////////