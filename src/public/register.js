const register = async()=>{
    let name=document.getElementById('name');
    let email=document.getElementById('email');
    let password=document.getElementById('password');

    let response=await fetch('/api/sessions/register',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            name:name.value,
            email:email.value,
            password:password.value
        })
    });
    let data=await response.json();
    if(data.status=="success"){
        //redirecionar a login
        location.href="http://localhost:8080/login"
    }


    return data;
}